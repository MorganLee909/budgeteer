const Account = require("./account.js");

class User{
    constructor(accounts){
        this._accounts = [];
        this._currentAccount = 0;

        for(let i = 0; i < accounts.length; i++){
            this._accounts.push(new Account(
                accounts[i].name,
                accounts[i].balance,
                accounts[i].categories
            ));
        }
    }
}

module.exports = User;