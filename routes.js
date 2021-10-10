const home = require("./controllers/home.js");

const session = require("./middleware.js").verifySession;

module.exports = function(app){
    //USER MANAGEMENT
    app.get("/", home.render);
    app.get("/session", session, home.checkSession);
    app.post("/login", home.login);
    app.get("/logout", home.logout);
    app.post("/register", home.register);

    //ACCOUNTS
    app.post("/account/create", session, home.createAccount);
    app.post("/accounts/balance", session, home.updateBalance);

    //Categories
    app.post("/categories/new", session, home.createCategory);
    app.get("/categories/:account/remove/:category", session, home.toggleCategory);
    app.post("/categories/update", session, home.updateCategory);

    //TRANSACTIONS
    app.post("/transactions", session, home.createTransaction);
    app.put("/transactions", session, home.updateTransaction);
    app.post("/transactions/get", session, home.getTransactions);
    app.delete("/transactions/:account/:transaction", session, home.deleteTransaction);

    //OTHER
    app.post("/transactions/transfer", session, home.transfer);
}