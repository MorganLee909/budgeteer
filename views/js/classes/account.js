const Transaction = require("./transaction.js");
const {Income, Bill, Allowance, Category} = require("./category.js");

class Account{
    constructor(id, name, balance, categories){
        this.id = id;
        this.name = name;
        this._balance = balance;
        this.categories = [];
        this.transactions = [];
            
        document.getElementById("accountTitle").innerText = `${this.name} account`;
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
        switch(category.kind){
            case "Income":
                this.categories.push(new Income(
                    category._id,
                    category.name,
                    category.amount,
                    category.removed
                ));
                break;
            case "Bill":
                this.categories.push(new Bill(
                    category._id,
                    category.name,
                    category.amount,
                    category.removed
                ));
                break;
            case "Allowance":
                this.categories.push(new Allowance(
                    category._id,
                    category.name,
                    category.amount,
                    category.removed,
                    category.isPercent,
                    this
                ));
                break;
            default:
                this.categories.push(new Category(
                    category._id,
                    category.name,
                    category.amount,
                    category.removed
                ));
        }
    }

    getCategory(id){
        return this.categories.find(c => c.id === id);
    }

    removeCategory(id){
        let category = this.categories.find(c => c.id === id);
        
        category.removed = true;
    }

    updateCategory(newCategory){
        let category = this.getCategory(newCategory._id);

        category.name = newCategory.name;
        if(category.isPaid){
            category.oldAmount = newCategory.amount;
            controller.createBanner("Already paid. New amount will display next month.", "success");
        }else{
            category.amount = newCategory.amount;
        }

        if(category.constructor.name === "Allowance") category.isPercent = newCategory.isPercent;
    }

    income(){
        return this.categories.filter(c => c.constructor.name === "Income");
    }

    getTotalIncome(){
        let income = 0;

        for(let i = 0; i < this.categories.length; i++){
            if(
                this.categories[i].constructor.name === "Income" &&
                this.categories[i].removed === false
            ) income += this.categories[i].amount;
        }

        return income;
    }

    bills(){
        return this.categories.filter(c => c.constructor.name === "Bill");
    }

    getTotalBills(){
        let bills = 0;

        for(let i = 0; i < this.categories.length; i++){
            if(
                this.categories[i].constructor.name === "Bill" &&
                this.categories[i].removed === false
            ) bills += this.categories[i].amount;
        }

        return bills;
    }

    allowances(){
        return this.categories.filter(c => c.constructor.name === "Allowance");
    }

    getTotalAllowances(){
        let allowances = 0;

        for(let i = 0; i < this.categories.length; i++){
            if(
                this.categories[i].constructor.name === "Allowance" &&
                this.categories[i].removed === false
            ) allowances += this.categories[i].amount;
        }

        return allowances;
    }

    /*
    Options:
        from: Date
        to: Date
        categories: [Category id]
        location: String
        tags: [String]
    */
    getTransactions(options){
        let transactions = [];
        for(let i = 0; i < this.transactions.length; i++){
            if(this.transactions[i].date <= options.to){
                if(this.transactions[i].date < options.from) break;

                transactions.push(this.transactions[i]);
            }
        }
        
        if(options.categories){
            for(let i = 0; i < transactions.length; i++){
                if(!options.categories.includes(transactions[i].category.id)){
                    transactions.splice(i, 1);
                    i--;
                }
            }
        }

        if(options.location){
            for(let i = 0; i < transactions.length; i++){
                if(!transactions[i].location.includes(options.location)){
                    transactions.splice(i, 1);
                    i--;
                }
            }
        }

        if(options.tags){
            for(let i = 0; i < transactions.length; i++){
                let tagged = false;
                for(let j = 0; j < transactions[i].tags.length; j++){
                    for(let k = 0; k < options.tags.length; k++){
                        if(transactions[i].tags[j].includes(options.tags[k])){
                            tagged = true;
                            break;
                        }
                    }
                    if(tagged) break;
                }

                if(!tagged){
                    transactions.splice(i, 1);
                    i--;
                }
            }
        }

        return transactions;
    }

    addTransaction(transaction, isNew = true){
        let newTransaction = new Transaction(
            transaction._id,
            transaction.category,
            transaction.tags,
            transaction.amount,
            transaction.location,
            transaction.date,
            transaction.note,
        );

        newTransaction.date.setMinutes(newTransaction.date.getMinutes() + newTransaction.date.getTimezoneOffset());

        this.transactions.push(newTransaction);
        if(isNew) this._balance += transaction.amount;

        this.transactions.sort((a, b) => (a.date > b.date) ? -1 : 1);
        return newTransaction;
    }

    removeTransaction(transaction){
        let index = this.transactions.indexOf(transaction);
        this.transactions.splice(index, 1);

        this._balance -= parseInt(transaction.amount * 100);

        transaction.category.removeTransaction(transaction._amount);
    }

    //general functions
    getDiscretionary(){
        return this.getTotalIncome() - this.getTotalBills() - this.getTotalAllowances();
    }
}

module.exports = Account;