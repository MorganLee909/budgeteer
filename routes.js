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
    app.get("/categories/:id", session, home.removeCategory);

    //INCOME
    app.post("/income", session, home.createIncome);
    app.delete("/income/:account/:income", session, home.deleteIncome);

    //BILLS
    app.post("/bills", session, home.createBill);
    app.delete("/bills/:account/:bill", session, home.deleteBill);

    //ALLOWANCES
    app.post("/allowances", session, home.createAllowance);
    app.delete("/allowances/:account/:allowance", session, home.deleteAllowance);

    //TRANSACTIONS
    app.post("/transactions", session, home.createTransaction);
    app.put("/transactions", session, home.updateTransaction);
    app.post("/transactions/get", session, home.getTransactions);
    app.delete("/transactions/:account/:transaction", session, home.deleteTransaction);

    //OTHER
    app.post("/transactions/transfer", session, home.transfer);
}