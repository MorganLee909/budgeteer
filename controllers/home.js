const User = require("../models/user.js");
const Transaction = require("../models/transaction.js");
const Account = require("../models/account.js").Account;
const Category = require("../models/category.js");

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

        res.locals.user.populate("accounts.income").populate("accounts.bills").populate("accounts.allowances").execPopulate()
            .then(()=>{
                return res.json({
                    email: res.locals.user.email,
                    accounts: res.locals.user.accounts
                });
            })
            .catch((err)=>{
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
            balance: req.body.balance,
            income: [],
            bills: [],
            allowances: []
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
    POST: create a new income source
    req.body = {
        account: String(id of account),
        name: String,
        amount: Number
    }
    response = Object (income)
    */
    createIncome: function(req, res){
        let account = res.locals.user.accounts.id(req.body.account);

        let income = new Category({
            name: req.body.name,
            amount: req.body.amount,
            kind: "Income"
        });

        account.income.push(income);

        Promise.all([res.locals.user.save(), income.save()])
            .then(()=>{
                return res.json(income);
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO CREATE NEW INCOME");
            });
    },

    /*
    DELETE: remove an income source from an account
    req.params.account = String (account id)
    req.params.income = String (id of income)
    response = {}
    */
    deleteIncome: function(req, res){
        let income = res.locals.user.accounts.id(req.params.account).income;
        for(let i = 0; i < income.length; i++){
            if(income.toString() === req.params.income){
                income.splice(i, 1);
                break;
            }
        }

        
        res.locals.user.save()
            .then(()=>{
                return res.json({});
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO DELETE INCOME");
            });
    },

    /*
    POST: create a new bill
    req.body = {
        account: String(id of account),
        name: String,
        amount: Number
    }
    response = Object (bill)
    */
    createBill: function(req, res){
        let account = res.locals.user.accounts.id(req.body.account);

        let bill = new Category({
            name: req.body.name,
            amount: req.body.amount,
            kind: "Bill"
        });

        account.bills.push(bill);

        Promise.all([res.locals.user.save(), bill.save()])
            .then(()=>{
                return res.json(bill);
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO CREATE NEW INCOME");
            });
    },

    /*
    DELETE: remove a bill from an account
    req.params.account = String (account id)
    req.params.bill = String (id of bill)
    response = {}
    */
    deleteBill: function(req, res){
        let bills = res.locals.user.accounts.id(req.params.account).bills;
        for(let i = 0; i < bills.length; i++){
            if(bills[i].toString() === req.params.bill){
                bills.splice(i, 1);
                break;
            }
        }

        res.locals.user.save()
            .then(()=>{
                return res.json({});
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO DELETE INCOME");
            });
    },

    /*
    POST: create a new allowance
    req.body = {
        account: String(id of account),
        name: String,
        amount: Number,
        isPercent: Boolean
    }
    response = Object (allowance)
    */
    createAllowance: function(req, res){
        let account = res.locals.user.accounts.id(req.body.account);

        let allowance = new Category({
            name: req.body.name,
            amount: req.body.amount,
            isPercent: req.body.isPercent,
            kind: "Allowance"
        });

        account.allowances.push(allowance);

        Promise.all([res.locals.user.save(), allowance.save()])
            .then(()=>{
                return res.json(allowance);
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO CREATE NEW BILL");
            });
    },

    /*
    DELETE: remove an allowance from an account
    req.params.account = String (account id)
    req.params.allowance = String (id of allowance)
    response = {}
    */
    deleteAllowance: function(req, res){
        let allowances = res.locals.user.accounts.id(req.params.account).allowances;

        for(let i = 0; i < allowances.length; i++){
            if(allowances[i].toString() === req.params.allowance){
                allowances.splice(i, 1);
                break;
            }
        }

        res.locals.user.save()
            .then(()=>{
                return res.json({});
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO DELETE ALLOWANCE");
            });
    },

    /*
    POST: create a new transaction
    req.body = {
        account: String (id of account),
        category: String (optional id),
        labels: [String] (optional)
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
        if(req.body.labels !== undefined) newTransaction.labels = req.body.labels;

        account.balance += newTransaction.amount;

        Promise.all([newTransaction.save(), res.locals.user.save()])
            .then((response)=>{
                return res.json(response[0]);
            })
            .catch((err)=>{
                if(err instanceof ValidationError) return res.json(err.errors[Object.keys(err.errors)[0]].properties.message);
                return res.json("ERROR: UNABLE TO CREATE TRANSACTION");
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
                console.log(transactions);
                return res.json(transactions);
            })
            .catch((err)=>{
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
        fromLabels: [String] (optional)
        to: String (id of account),
        toLabels: [String] (optional)
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

        if(req.body.fromLabels !== undefined) fromTransaction.labels = req.body.fromLabels;
        if(req.body.toLabels !== undefined) toTransaction.labels = req.body.toLabels;

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