const User = require("../models/user.js");
const Transaction = require("../models/transaction.js");

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
    }
}