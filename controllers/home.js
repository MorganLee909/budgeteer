const User = require("../models/user.js");
const Transaction = require("../models/transaction.js");

const sessionId = require("../sessionId.js");

const bcrypt = require("bcryptjs");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
    render: function(req, res){
        res.render("./index.ejs");
    },

    /*
    GET: check if a user is in session
    response = Vendor || null
    */
    checkSession: function(req, res){
        return res.json(res.locals.user);
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
                if(user === null){
                    throw "USER WITH THIS EMAIL DOESN'T EXIST";
                }

                bcrypt.compare(req.body.password, user.password, (err, response)=>{
                    if(response === false){
                        throw "INCORRECT PASSWORD";
                    }

                    req.session.user = user.session.sessionId;

                    user.password = undefined;
                    user.session = undefined;

                    return res.json(user);
                });
            })
            .catch((err)=>{
                if(typeof(err) === "string"){
                    return res.json(err);
                }
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
        if(req.body.password !== req.body.confirmPassword){
            return res.json("PASSWORDS DO NOT MATCH");
        }

        let email = req.body.email.toLowerCase();

        User.findOne({email: email})
            .then((user)=>{
                if(user !== null){
                    throw "USER WITH THIS EMAIL ADDRESS ALREADY EXISTS";
                }

                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(req.body.password, salt);

                let newDate = new Date();
                newDate.setDate(newDate.getDate() + 90);

                let newUser = new User({
                    email: email,
                    password: hash,
                    accounts: [],
                    session: {
                        sessionId: sessionId(),
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
                if(typeof(err) === "string"){
                    return res.json(err);
                }
                return res.json("ERROR: UNABLE TO CREATE NEW USER");
            })
    },

    /*
    POST: create a new account for a user
    req.body = {
        name: String
    }
    response = Object (created account)
    */
    createAccount: function(req, res){
        if(res.locals.user === null){
            return res.json("YOU DO NOT HAVE PERMISSION TO DO THAT");
        }

        res.locals.user.accounts.push({
            name: req.body.name,
            balance: 0,
            categories: [{
                name: "discretionary",
                group: "discretionary",
            }]
        });

        res.locals.user.save()
            .then((user)=>{
                let account = {};
                for(let i = 0; i < user.accounts.length; i++){
                    if(user.accounts[i].name === req.body.name){
                        account = user.accounts[i];
                        break;
                    }
                }
                return res.json(account);
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO CREATE ACCOUNT");
            });
    },

    /*
    POST: create a new category for an account
    req.body = {
        name: String,
        group: String,
        amount: Number,
        isPercent: Boolean,
        account: String (id of account)
    }
    */
    createCategory: function(req, res){
        if(res.locals.user === null){
            return res.json("YOU DO NOT HAVE PERMISSION TO DO THAT");
        }

        let account = null;
        for(let i = 0; i < res.locals.user.accounts.length; i++){
            if(res.locals.user.accounts[i]._id.toString() === req.body.account){
                account = res.locals.user.accounts[i];
                break;
            }
        }

        if(res.locals.user === null || account === null){
            return res.json("YOU DO NOT HAVE PERMISSION TO DO THAT");
        }

        account.categories.push({
            name: req.body.name,
            group: req.body.group,
            amount: req.body.amount,
            isPercent: req.body.isPercent
        });

        res.locals.user.save()
            .then((user)=>{
                for(let i = 0; i < user.accounts.length; i++){
                    if(user.accounts[i]._id.toString() === req.body.account){
                        for(let j = 0; j < user.accounts[i].categories.length; j++){
                            if(user.accounts[i].categories[j].name === req.body.name){
                                return res.json(user.accounts[i].categories[j]);
                            }
                        }
                    }
                }
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO UPDATE DATA");
            });
    },

    /*
    POST: create a new transaction
    req.body = {
        account: String (id of account),
        category: String,
        amount: Number,
        location: String,
        date: Date,
        note: String
    }
    response = Transaction
    */
    createTransaction: function(req, res){
        if(res.locals.user === null){
            return res.json("YOU DO NOT HAVE PERMISSION TO DO THAT");
        }

        let account = null;
        for(let i = 0; i < res.locals.user.accounts.length; i++){
            if(res.locals.user.accounts[i]._id.toString() === req.body.account){
                account = res.locals.user.accounts[i];
                break;
            }
        }

        if(account === null){
            return res.json("YOU DO NOT HAVE PERMISSION TO DO THAT");
        }

        let category = {};
        for(let i = 0; i < account.categories.length; i++){
            if(account.categories[i]._id.toString() === req.body.category){
                category = account.categories[i]._id;
                break;
            }
        }

        let newTransaction = new Transaction({
            account: req.body.account,
            category: category,
            amount: req.body.amount,
            location: req.body.location,
            date: req.body.date,
            note: req.body.note
        });

        account.balance += newTransaction.amount;

        Promise.all([newTransaction.save(), res.locals.user.save()])
            .then((response)=>{
                return res.json(response[0]);
            })
            .catch((err)=>{
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
        if(res.locals.user === null){
            return res.json("YOU DO NOT HAVE PERMISSION TO DO THAT");
        }

        let account = null;
        for(let i = 0; i < res.locals.user.accounts.length; i++){
            if(res.locals.user.accounts[i]._id.toString() === req.body.account){
                account = res.locals.user.accounts[i];
                break;
            }
        }

        if(account === null){
            return res.json("YOU DO NOT HAVE PERMISSION TO DO THAT");
        }

        let from = new Date(req.body.from);
        let to = new Date(req.body.to);

        Transaction.aggregate([
            {$match: {
                account: ObjectId(req.body.account),
                date: {$gte: from, $lt: to}
            }},
            {$sort: {
                date: -1,
                category: 1
            }}
        ])
            .then((transactions)=>{
                return res.json(transactions);
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO RETRIEVE DATA");
            });
    }
}