const Category = require("./category.js");

const home = require("../home.js");

class Account{
    constructor(id, name, balance, categories){
        this._id = id;
        this._name = name;
        this._balance = balance;
        this._categories = [];

        for(let i = 0; i < categories.length; i++){
            this._categories.push(new Category(
                categories[i].name,
                categories[i].group,
                categories[i].amount,
                categories[i].isPercent
            ));
        }
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

    getBills(){
        let bills = [];

        for(let i = 0; i < this._categories.length; i++){
            if(this._categories[i].group === "bill"){
                bills.push(this._categories[i]);
            }
        }

        return bills;
    }

    addCategory(category){
        this._categories.push(new Category(
            category.name,
            category.group,
            category.amount,
            category.isPercent
        ));
        
        switch(category.group){
            case "income":
                home.populateIncome();
                break;
            case "bill":
                home.populateBills();
        }
    }
}

module.exports = Account;