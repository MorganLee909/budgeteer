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

        let from = new Date();
        from.setDate(1);
        from.setHours(0, 0, 0, 0);

        let to = new Date();
        to.setDate(1);
        to.setMonth(to.getMonth() + 1);
        to.setHours(0, 0, 0, 0);

        let data = {
            account: this._id,
            from: from,
            to: to
        };

        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        fetch("/transactions", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response) =>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                }else{
                    for(let i = 0; i < response.length; i++){
                        this._transactions.push(new Transaction(
                            response[i]._id,
                            response[i].category,
                            response[i].amount,
                            response[i].location,
                            response[i].date,
                            response[i].note
                        ));
                    }

                    home.populateTransactions();
                    home.populateAllowances();
                    home.populateStats();
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            })
            .finally(()=>{
                loader.style.display = "none";
            });
    }

    //id
    get id(){
        return this._id;
    }

    //name
    get name(){
        return this._name;
    }

    //balance
    get balance(){
        return parseFloat((this._balance / 100).toFixed(2));
    }

    //categories
    get categories(){
        return this._categories;
    }

    getCategoryGroup(name){
        for(let i = 0; i < this._categories.length; i++){
            if(this._categories[i].name === name){
                return this._categories[i].group;
            }
        }
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

    getTotalBills(){
        let bills = 0;

        for(let i = 0; i < this._categories.length; i++){
            if(this._categories[i].group === "bill"){
                bills += this.categories[i].amount;
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

    getTotalAllowances(){
        let allowances = 0;

        for(let i = 0; i < this._categories.length; i++){
            if(this._categories[i].group === "allowance"){
                allowances += this.categories[i].amount;
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

        home.populateStats();
    }

    removeCategory(category){
        for(let i = 0; i < this._categories.length; i++){
            if(category === this._categories[i]){
                this._categories.splice(i, 1);
            }
        }

        switch(category.group){
            case "income": home.populateIncome(); break;
            case "bill": home.populateBills(); break;
            case "allowance": home.populateAllowances(); break;
        }

        home.populateStats();
    }

    //transactions
    get transactions(){
        return this._transactions;
    }

    addTransaction(transaction){
        let newTransaction = new Transaction(
            transaction._id,
            transaction.category,
            transaction.amount,
            transaction.location,
            transaction.date,
            transaction.note
        );

        this._transactions.push(newTransaction);
        this._balance += transaction.amount;

        if(this.getCategoryGroup(transaction.category) === "allowance"){
            home.populateAllowances();
        }

        this._transactions.sort((a, b) => (a.date > b.date) ? -1 : 1);
        home.populateTransactions();
        home.populateStats();
    }

    removeTransaction(transaction){
        let index = this._transactions.indexOf(transaction);
        this._transactions.splice(index, 1);

        this._balance -= parseInt(transaction.amount * 100);

        home.populateTransactions();
        home.populateStats();
    }

    //general functions
    getDiscretionary(){
        return this.getTotalIncome() - this.getTotalBills() - this.getTotalAllowances();
    }

    getAllowanceSpent(category){
        let spent = 0;
        for(let i = 0; i < this._transactions.length; i++){
            if(this._transactions[i].category === category){
                spent += this._transactions[i].amount;
            }
        }

        return -spent;
    }
}

module.exports = Account;