const Category = require("./category.js");
const Transaction = require("./transaction.js");

const home = require("../home.js");

class Account{
    constructor(id, name, balance, categories){
        this._id = id;
        this._name = name;
        this._balance = balance;
        this._categories = [];
        this._transactions = [];

        for(let i = 0; i < categories.length; i++){
            this._categories.push(new Category(
                this,
                categories[i]._id,
                categories[i].name,
                categories[i].group,
                categories[i].amount,
                categories[i].isPercent
            ));
        }

        //TODO: fetch transactions
    }

    //id
    get id(){
        return this._id;
    }

    //name
    get name(){
        return this._name;
    }

    //categories

    get categories(){
        return this._categories;
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

    getTotalIncome(){
        let income = 0; 

        for(let i = 0; i < this._categories.length; i++){
            if(this._categories[i].group === "income"){
                income += this._categories[i].amount;
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

    getAllowances(){
        let allowances = [];

        for(let i = 0; i < this._categories.length; i++){
            if(this._categories[i].group === "allowance"){
                allowances.push(this._categories[i]);
            }
        }

        return allowances;
    }

    addCategory(category){
        this._categories.push(new Category(
            this,
            category._id,
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
                break;
            case "allowance":
                home.populateAllowances();
                break;
        }
    }

    //transactions
    get transactions(){
        return this._transactions;
    }

    addTransaction(transaction){
        this._transactions.push(new Transaction(
            transaction._id,
            this,
            transaction.category,
            transaction.amount,
            transaction.location,
            transaction.date,
            transaction.note
        ));

        this._transactions.sort((a, b) => (a.date > b.date) ? 1 : -1);
        home.populateTransactions();
    }
}

module.exports = Account;