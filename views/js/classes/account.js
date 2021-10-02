const Transaction = require("./transaction.js");
const Category = require("./category.js");

class Account{
    constructor(id, name, balance, categories){
        this._id = id;
        this._name = name;
        this._balance = balance;
        this._income = [];
        this._bills = [];
        this._allowances = [];
        this._transactions = [];

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
                    document.getElementById("accountTitle").innerText = `${this._name} account`;
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            })
            .finally(()=>{
                loader.style.display = "none";
            });

        for(let i = 0; i < categories.length; i++){
            switch(categories.kind){
                case "Income":
                    this._income.push(new Category.Income(
                        categories[i]._id,
                        categories[i].name,
                        categories[i].amount
                    ));
                    break;
                case "Bill":
                    this._bills.push(new Category.Bill(
                        categories[i]._id,
                        categories[i].name,
                        categories[i].amount
                    ));
                    break;
                case "Allowance":
                    this._allowances.push(new Category.Allowance(
                        categories[i]._id,
                        categories[i].name,
                        categories[i].amount,
                        categories[i].isPercent
                    ));
                    break;
            }
        }
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

    set balance(value){
        this._balance = value;
    }

    get income(){
        return this._income;
    }

    addIncome(income){
        this._income.push(new Category.Income(
            income._id,
            income.name,
            income.amount
        ));
    }

    findIncome(id){
        for(let i = 0; i < this._income.length; i++){
            if(this._income[i].id === id) return this._income[i];
        }
    }

    deleteIncome(id){
        for(let i = 0; i < this._income.length; i++){
            if(this._income[i].id === id){
                this._income.splice(i, 1);
                break;
            }
        }
    }

    getTotalIncome(){
        let income = 0;

        for(let i = 0; i < this._income.length; i++){
            income += this._income[i].amount;
        }

        return income;
    }

    get bills(){
        return this._bills;
    }

    addBill(bill){
        this._bills.push(new Category.Bill(
            bill._id,
            bill.name,
            bill.amount
        ));
    }

    findBill(id){
        for(let i = 0; i < this._bills.length; i++){
            if(this._bills[i].id === id) return this._bills[i].id;
        }
    }

    deleteBill(id){
        for(let i = 0; i < this._bills.length; i++){
            if(this._bills[i].id === id){
                this._bills.splice(i, 1);
                break;
            }
        }
    }

    getTotalBills(){
        let bills = 0;

        for(let i = 0; i < this._bills.length; i++){
            bills += this._bills[i].amount;
        }

        return bills;
    }

    get allowances(){
        return this._allowances;
    }

    addAllowance(allowance){
        this._allowances.push(new Category.Allowance(
            allowance.id,
            allowance.name,
            allowance.amount,
            allowance.isPercent,
            this
        ));
    }

    findAllowance(id){
        for(let i = 0; i < this._allowances.length; i++){
            if(this._allowances[i].id === id) return this._allowances[i];
        }
    }

    deleteAllowance(id){
        for(let i = 0; i < this._allowances.length; i++){
            if(this._allowances[i].id === id){
                this._allowances.splice(i, 1);
                break;
            }
        }
    }

    getTotalAllowances(){
        let allowances = 0;

        for(let i = 0; i < this._allowances.length; i++){
            allowances += this._allowances[i].amount;
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