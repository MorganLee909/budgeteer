const home = require("./controllers/home.js");

const session = require("./middleware.js").verifySession;

module.exports = function(app){
    app.get("/", home.render);
    app.get("/session", session, home.checkSession);
    app.post("/login", home.login);
    app.get("/logout", home.logout);
    app.post("/register", home.register);
    app.post("/account/create", session, home.createAccount);
    app.post("/category/create", session, home.createCategory);
    app.delete("/category/:account/:category", session, home.removeCategory);
    app.post("/transaction/create", session, home.createTransaction);
    app.post("/transactions", session, home.getTransactions);
}