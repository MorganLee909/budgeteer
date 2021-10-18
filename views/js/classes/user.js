const Account = require("./account.js");

const home = require("../pages/home.js");

class User{
    constructor(accounts){
        this._accounts = [];
        this._currentAccount = 0;

        for(let i = 0; i < accounts.length; i++){
            this._accounts.push(new Account(
                accounts[i]._id,
                accounts[i].name,
                accounts[i].balance,
                accounts[i].categories
            ));
        }
    }

    get accounts(){
        return this._accounts;
    }

    get currentAccount(){
        return this._currentAccount;
    }

    addAccount(account){
        this._accounts.push(new Account(
            account._id,
            account.name,
            account.balance,
            account.categories
        ));

        this._currentAccount = this._accounts.length - 1;
        home.all();
    }

    getAccount(){
        return this._accounts[this._currentAccount];
    }

    setAccount(index){
        this._currentAccount = index;
        home.all();
    }

    updateAll(){
        home.all();
    }
}

module.exports = User;