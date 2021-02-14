const User = require("../models/user.js");
const Transaction = require("../models/transaction.js");

module.exports = {
    render: function(req, res){
        res.render("./index.ejs");
    }
}