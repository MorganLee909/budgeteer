const home = require("./controllers/home.js");

const session = require("./middleware.js").verifySession;

module.exports = function(app){
    app.get("/", home.render);
}