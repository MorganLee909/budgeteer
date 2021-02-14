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
    POST: register a new user
    req.body = {
        email: String
        password: String,
        confirmPassword: String
    }
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
                user.session = undefined;
                user.password = undefined;
                
                return res.json(user);
            })
            .catch((err)=>{
                console.log(err);
                if(typeof(err) === "string"){
                    return res.json(err);
                }
                return res.json("ERROR: UNABLE TO CREATE NEW USER");
            })
    }
}