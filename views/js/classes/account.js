const home = require("../home.js");

class Account{
    constructor(id, name, balance, categories){
        this._id = id;
        this._name = name;
        this._balance = balance;
        this._categories = categories;
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    getIncome(){
        let income = [];

        for(let i = 0; i < this._categories.length; i++){
            if(this._categories[i].group === "income"){
                income.push(this._categories[i]);
            }
        }

        return income;
    }

    addCategory(category){
        this._categories.push(category);
        
        switch(category.group){
            case "income":
                home.populateIncome();
                break;
        }
    }
}

module.exports = Account;