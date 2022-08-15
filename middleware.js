const User = require("./models/user.js");

module.exports = {
    verifySession: function(req, res, next){
        if(req.session.user === undefined) return res.json("enter");

        User.findOne({"session.sessionId": req.session.user})
            .then((user)=>{
                if(user === null) throw "login";

                if(user.session.expiration < new Date()){
                    req.session.user = undefined;
                    throw "expiry";
                }

                res.locals.user = user;
                return next();
            })
            .catch((err)=>{
                switch(err){
                    case "login": return res.json("Unauthorized access");
                    case "expiry": 
                        req.session.user = undefined;
                        return res.json("enter");
                    default:
                        console.error(err);
                        return res.json("ERROR: unable to retrieve user session");
                }
            });
    }
}