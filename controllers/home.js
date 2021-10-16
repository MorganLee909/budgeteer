const User = require("../models/user.js");
const Transaction = require("../models/transaction.js");
const Account = require("../models/account.js").Account;
const {Income, Bill, Allowance} = require("../models/category.js");

const helper = require("./helper.js");

const bcrypt = require("bcryptjs");
const ObjectId = require("mongoose").Types.ObjectId;
const ValidationError = require("mongoose").Error.ValidationError;

module.exports = {
    render: function(req, res){
        res.render("./index.ejs");
    },

    /*
    GET: check if a user is in session
    response = Vendor || null
    */
    checkSession: function(req, res){
        if(res.locals.user === null) return res.json(res.locals.user);

        res.locals.user.populate("accounts.categories")
            .then(()=>{
                return res.json({
                    email: res.locals.user.email,
                    accounts: res.locals.user.accounts
                });
            })
            .catch((err)=>{
                console.error(err);
                return res.json("ERROR: UNABLE TO RETRIEVE YOU DATA");
            });
    },

    /*
    POST: log in a user
    req.body = {
        email: String,
        password: String
    }
    response = User
    */
    login: function(req, res){
        let email = req.body.email.toLowerCase();

        User.findOne({email: email})
            .populate("accounts.categories")
            .then((user)=>{
                if(user === null) throw "USER WITH THIS EMAIL DOESN'T EXIST";

                bcrypt.compare(req.body.password, user.password, (err, response)=>{
                    if(response === false) throw "INCORRECT PASSWORD";

                    req.session.user = user.session.sessionId;

                    user.password = undefined;
                    user.session = undefined;

                    return res.json(user);
                });
            })
            .catch((err)=>{
                console.error(err);
                if(typeof(err) === "string") return res.json(err);
                return res.json("ERROR: LOGIN FAILED");
            });
    },

    /*
    GET: log out the current user
    redirects to "/"
    */
    logout: function(req, res){
        req.session.user = undefined;
        return res.redirect("/");
    },

    /*
    POST: register a new user
    req.body = {
        email: String
        password: String,
        confirmPassword: String
    }
    response = User
    */
    register: function(req, res){
        if(req.body.password !== req.body.confirmPassword) return res.json("PASSWORDS DO NOT MATCH");

        let email = req.body.email.toLowerCase();

        User.findOne({email: email})
            .then((user)=>{
                if(user !== null) throw "USER WITH THIS EMAIL ADDRESS ALREADY EXISTS";

                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(req.body.password, salt);

                let newDate = new Date();
                newDate.setDate(newDate.getDate() + 90);

                let newUser = new User({
                    email: email,
                    password: hash,
                    accounts: [],
                    session: {
                        sessionId: helper.generateId(25),
                        expiration: newDate
                    }
                });

                return newUser.save();
            })
            .then((user)=>{
                req.session.user = user.session.sessionId;

                user.session = undefined;
                user.password = undefined;
                
                return res.json(user);
            })
            .catch((err)=>{
                if(typeof(err) === "string") return res.json(err);
                return res.json("ERROR: UNABLE TO CREATE NEW USER");
            });
    },

    /*
    POST: create a new account for a user
    req.body = {
        name: String,
        balance: Number
    }
    response = Object (created account)
    */
    createAccount: function(req, res){
        let account = new Account({
            name: req.body.name,
            balance: req.body.balance
        });

        res.locals.user.accounts.push(account);

        res.locals.user.save()
            .then((user)=>{
                return res.json(account);
            })
            .catch((err)=>{
                if(err instanceof ValidationError) return res.json(err.errors[Object.keys(err.errors)[0]].properties.message);
                return res.json("ERROR: UNABLE TO CREATE ACCOUNT");
            });
    },

    /*
    POST: update the balance of an account
    req.body = {
        account: String (id)
        balance: Number
    }
    response = {
        balance: Number
    }
    */
    updateBalance: function(req, res){
        let account = res.locals.user.accounts.id(req.body.account);

        account.balance = req.body.balance;

        res.locals.user.save()
            .then((response)=>{
                return res.json({balance: account.balance});
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO UPDATE BALANCE");
            })
    },

    /*
    POST: create a new Category
    req.body = {
        account: String (Account id)
        name: String
        amount: Number
        kind: String (Income, Bill, Allowance)
        isPercent: Boolean
    }
    response: Category
    */
    createCategory: function(req, res){
        let category = {
            name: req.body.name,
            amount: req.body.amount,
            removed: false
        };

        switch(req.body.kind){
            case "Income":
                category = new Income(category);
                break;
            case "Bill":
                category = new Bill(category);
                break;
            case "Allowance":
                category = new Allowance(category);
                category.isPercent = req.body.isPercent;
                break;
        }

        res.locals.user.accounts.id(req.body.account).categories.push(category);

        res.locals.user.save()
            .then((user)=>{
                return res.json(category);
            })
            .catch((err)=>{
                console.error(err);
                return res.json("ERROR: unable to create new category");
            });
    },

    /*
    GET: toggle removed status of a category
    req.params.account = Account id
    req.params.category = Category id
    response: Category
    */
    toggleCategory: function(req, res){
        let category = res.locals.user.accounts.id(req.params.account).categories.id(req.params.category);
        category.removed = (category.removed === true) ? false : true;
        
        res.locals.user.save()
            .then((user)=>{
                return res.json(category);
            })
            .catch((err)=>{
                console.error(err);
                return res.json("ERROR: unable to update category");
            });
    },

    /*
    POST: update a category
    req.body = {
        account: String (Account id)
        category: String (Category id)
        name: String,
        amount: Number
        isPercent: Boolean
    }
    response = Allowance
    */
    updateCategory: function(req, res){
        let category = res.locals.user.accounts.id(req.body.account).categories.id(req.body.category);

        category.name = req.body.name;
        if(isPercent){
            category.percent = req.body.amount;
        }else{
            category.amount = req.body.amount;
        }

        res.locals.user.save()
            .then((user)=>{
                return res.json(category);
            })
            .catch((err)=>{
                return res.json("ERROR: unable to update the category");
            });
    },

    /*
    POST: create a new transaction
    req.body = {
        account: String (id of account),
        category: String (optional id),
        tags: [String] (optional)
        amount: Number,
        location: String,
        date: Date,
        note: String
    }
    response = Transaction
    */
    createTransaction: function(req, res){
        let account = res.locals.user.accounts.id(req.body.account);

        let newTransaction = new Transaction({
            account: req.body.account,
            amount: req.body.amount,
            location: req.body.location,
            date: req.body.date,
            note: req.body.note
        });

        if(req.body.category !== undefined) newTransaction.category = req.body.category;
        if(req.body.tags !== undefined) newTransaction.tags = req.body.tags;

        account.balance += newTransaction.amount;

        Promise.all([newTransaction.save(), res.locals.user.save()])
            .then((response)=>{
                return res.json(response[0]);
            })
            .catch((err)=>{
                console.error(err);
                if(err instanceof ValidationError) return res.json(err.errors[Object.keys(err.errors)[0]].properties.message);
                return res.json("ERROR: UNABLE TO CREATE TRANSACTION");
            });
    },

    /*
    PUT: update a transaction
    req.body = {
        transaction: String (id)
        tags: [String]
        amount: Number
        location: String,
        date: Date,
        note: String
    }
    */
    updateTransaction: function(req, res){
        Transaction.findOne({_id: req.body.transaction})
            .then((transaction)=>{
                transaction.tags = req.body.tags;
                transaction.amount = req.body.amount;
                transaction.location = req.body.location;
                transaction.date = new Date(req.body.date);
                transaction.note = req.body.note;

                return transaction.save();
            })
            .then((transaction)=>{
                return res.json(transaction);
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO UPDATE THE TRANSACTION");
            });
    },

    /*
    POST: get transactions from a specific account for this month
    req.body = {
        account: String,
        from: Date,
        to: Date
    }
    response = [Transaction]
    */
    getTransactions: function(req, res){
        let from = new Date(req.body.from);
        let to = new Date(req.body.to);

        Transaction.aggregate([
            {$match: {
                account: ObjectId(req.body.account),
                date: {$gte: from, $lt: to}
            }}
        ])
            .then((transactions)=>{
                return res.json(transactions);
            })
            .catch((err)=>{
                console.error(err);
                return res.json("ERROR: UNABLE TO RETRIEVE DATA");
            });
    },

    /*
    DELETE: remove a transaction
    req.params.account = id of account
    req.params.transaction = id of transaction to delete
    */
    deleteTransaction: function(req, res){
        let account = res.locals.user.accounts.id(req.params.account);

        Transaction.findOne({_id: req.params.transaction})
            .then((transaction)=>{
                account.balance -= transaction.amount;

                return Promise.all([Transaction.deleteOne({_id: req.params.transaction}), res.locals.user.save()]);
            })
            .then((response)=>{
                return res.json({});
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO DELETE TRANSACTION");
            });
    },

    /*
    POST: transfer money between accounts
    req.body = {
        from: String (id of account),
        fromTags: [String] (optional)
        to: String (id of account),
        toTags: [String] (optional)
        date: String,
        amount: Number,
        note: String
    }
    response = [Transaction (from account), Transaction (to account)]
    */
    transfer: function(req, res){
        let fromAccount = res.locals.user.accounts.id(req.body.from);
        let toAccount = res.locals.user.accounts.id(req.body.to);

        let fromTransaction = new Transaction({
            account: fromAccount._id,
            amount: -req.body.amount,
            location: toAccount.name,
            date: new Date(req.body.date),
            note: req.body.note
        });

        let toTransaction = new Transaction({
            account: toAccount._id,
            amount: req.body.amount,
            location: fromAccount.name,
            date: new Date(req.body.date),
            note: req.body.note
        });

        if(req.body.fromTags !== undefined) fromTransaction.tags = req.body.fromTags;
        if(req.body.toTags !== undefined) toTransaction.tags = req.body.toTags;

        fromAccount.balance -= req.body.amount;
        toAccount.balance += req.body.amount;

        Promise.all([fromTransaction.save(), toTransaction.save(), res.locals.user.save()])
            .then((response)=>{
                return res.json([response[0], response[1]]);
            })
            .catch((err)=>{
                if(err instanceof ValidationError) return res.json(err.errors[Object.keys(err.errors)[0]].properties.message);
                return res.json("ERROR: UNABLE TO UPDATE DATA");
            });
    }
}