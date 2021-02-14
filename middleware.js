const User = require("./models/user.js");

module.exports = {
    verifySession: function(req, res, next){
        if(req.session.user === undefined){
            res.locals.user = null;
            return next();
        }

        let newId = ()=>{
            let result = "";
            let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for(let i = 0; i < 25; i++){
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            
            return result;
        }

        User.findOne({"session.sessionId": req.session.user})
            .then((user)=>{
                if(user === null){
                    res.locals.user = null;
                    return next();
                }

                if(user.session.expiration > new Date()){
                    user.session.sessionId = newId();
                    let newDate = new Date();
                    newDate.setDate(newDate.getDate() + 90);
                    user.session.expiration = newDate;
                    res.locals.user = null;
                    return next();
                }

                res.locals.user = user;
                return next();
            })
            .catch((err)=>{
                return res.json("ERROR: UNABLE TO VALIDATE USER");
            });
    }
}