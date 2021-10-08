const Transaction = require("./transaction.js");
const {Income, Bill, Allowance} = require("./category.js");

class Account{
    constructor(id, name, balance, categories){
        this.id = id;
        this.name = name;
        this._balance = balance;
        this.categories = [];
        this._transactions = [];

        let from = new Date();
        from.setDate(1);
        from.setHours(0, 0, 0, 0);

        let to = new Date();
        to.setDate(1);
        to.setMonth(to.getMonth() + 1);
        to.setHours(0, 0, 0, 0);

        let data = {
            account: this.id,
            from: from,
            to: to
        };

        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        fetch("/transactions/get", {
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
                            response[i].tags,
                            response[i].amount,
                            response[i].location,
                            response[i].date,
                            response[i].note,
                            this
                        ));
                    }

                    this._transactions.sort((a, b)=>(a.date > b.date) ? -1 : 1);
                    document.getElementById("accountTitle").innerText = `${this.name} account`;
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            })
            .finally(()=>{
                loader.style.display = "none";
            });

        for(let i = 0; i < categories.length; i++){
            this.addCategory(categories[i]);
        }
    }

    //balance
    get balance(){
        return parseFloat((this._balance / 100).toFixed(2));
    }

    set balance(value){
        this._balance = value;
    }

    addCategory(category){
        switch(category[i].kind){
            case "Income":
                this.categories.push(new Income(
                    categories[i]._id,
                    categories[i].name,
                    categories[i].amount,
                    categories[i].removed
                ));
                break;
            case "Bill":
                this.categories.push(new Bill(
                    categories[i]._id,
                    categories[i].name,
                    categories[i].amount,
                    categories[i].removed
                ));
                break;
            case "Allowance":
                this.categories.push(new Allowance(
                    categories[i]._id,
                    categories[i].name,
                    categories[i].amount,
                    categories[i].removed,
                    categories[i].isPercent,
                    this
                ));
                break;
        }
    }

    getCategory(id){
        return this.categories.find(c => c.id === id);
    }

    removeCategory(id){
        let category = this.categories.find(c => c.id === id);
        
        category.removed = true;
    }

    getTotalIncome(){
        let income = 0;

        for(let i = 0; i < this.categories.length; i++){
            if(this.categories[i].kind === "Income") income += this._income[i].amount;
        }

        return income;
    }

    bills(){
        return this.categories.filter(c => c.kind === "Bill");
    }

    getTotalBills(){
        let bills = 0;

        for(let i = 0; i < this.categories.length; i++){
            if(this.categories[i].kind === "Bill") bills += this.categories[i].amount;
        }

        return bills;
    }

    allowances(){
        return this.categories.filter(c => c.kind === "Allowance");
    }

    getTotalAllowances(){
        let allowances = 0;

        for(let i = 0; i < this.categories.length; i++){
            if(this.categories.kind === "Allowance") allowances += this.categories[i].amount;
        }

        return allowances;
    }

    //transactions
    get transactions(){
        return this._transactions;
    }

    getTransactions(category){
        if(category === undefined) return [];
        let transactions = [];
        
        for(let i = 0; i < this._transactions.length; i++){
            let cat = this._transactions[i]._category;

            if(cat === undefined) continue;
            if(cat.name === category) transactions.push(this._transactions[i]);
        }

        return transactions;
    }

    addTransaction(transaction){
        let newTransaction = new Transaction(
            transaction._id,
            transaction.category,
            transaction.tags,
            transaction.amount,
            transaction.location,
            transaction.date,
            transaction.note,
            this
        );

        this._transactions.push(newTransaction);
        this._balance += transaction.amount;

        this._transactions.sort((a, b) => (a.date > b.date) ? -1 : 1);
        return newTransaction;
    }

    removeTransaction(transaction){
        let index = this._transactions.indexOf(transaction);
        this._transactions.splice(index, 1);

        this._balance -= parseInt(transaction.amount * 100);

        if(transaction._category === undefined) return;
        transaction._category.removeTransaction(transaction._amount);
    }

    //general functions
    getDiscretionary(){
        return this.getTotalIncome() - this.getTotalBills() - this.getTotalAllowances();
    }
}

module.exports = Account;