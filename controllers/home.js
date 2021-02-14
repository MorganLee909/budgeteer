const User = require("../models/user.js");

const sessionId = require("../sessionId.js");

const bcrypt = require("bcryptjs");

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

        let newAccount = {
            name: req.body.name,
            balance: 0,
            categories: []
        };

        res.locals.user.accounts.push(newAccount);

        res.locals.user.save()
            .then((user)=>{
                return res.json(newAccount);
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO CREATE ACCOUNT");
            });
    },

    /*
    POST: create a new income category
    req.body = {
        name: String
        amount: Number
        account: String (id of account)
    }
    response = Object (newly created category)
    */
    createIncome: function(req, res){
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

        let newCategory = {
            name: req.body.name,
            group: "income",
            amount: req.body.amount
        }

        account.categories.push(newCategory);

        res.locals.user.save()
            .then((user)=>{
                return res.json(newCategory);
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO CREATE INCOME");
            });
    }
}