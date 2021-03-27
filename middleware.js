const User = require("./models/user.js");

const helper = require("./controllers/helper.js");

module.exports = {
    verifySession: function(req, res, next){
        if(req.session.user === undefined) return res.redirect("/");

        User.findOne({"session.sessionId": req.session.user})
            .then((user)=>{
                if(user === null) throw "login";

                if(user.session.expiration < new Date()){
                    user.session.sessionId = helper.generateId();
                    let newDate = new Date();
                    newDate.setDate(newDate.getDate() + 90);
                    user.session.expiration = newDate;
                    res.locals.user = null;
                    throw "login";
                }

                res.locals.user = user;
                return next();
            })
            .catch((err)=>{
                if(err === "login") return res.redirect("/");
                return res.json("ERROR: UNABLE TO VALIDATE USER");
            });
    }
}