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

    addAccount(account){
        this._accounts.push(new Account(
            account.name,
            account.balance,
            account.categories
        ));

        this._currentAccount = this._accounts.length;
        //Update home page
    }

    getAccount(){
        return this._accounts[this._currentAccount];
    }
}

module.exports = User;