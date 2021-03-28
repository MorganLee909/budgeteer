const Transaction = require("./transaction.js");

class IncomeBill{
    constructor(id, name, amount){
        this._id = id;
        this._name = name;
        this._amount = amount;
    }

    get name(){
        return this._name;
    }

    get amount(){
        return parseFloat((this._amount / 100).toFixed(2));
    }
}

class Allowance{
    constructor(id, name, amount, isPercent, parent){
        this._id = id;
        this._name = name;
        this._amount = amount;
        this._isPercent = isPercent;
        this._parent = parent;
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    get amount(){
        if(this._isPercent === true) return parseFloat((this._parent.getTotalIncome() * (this._amount / 100)).toFixed(2));
        return parseFloat((this._amount / 100).toFixed(2));
    }
}

class Account{
    constructor(id, name, balance, income, bills, allowances){
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
                            response[i].labels,
                            response[i].amount,
                            response[i].location,
                            response[i].date,
                            response[i].note
                        ));
                    }

                    state.transactions();
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            })
            .finally(()=>{
                loader.style.display = "none";
            });

        for(let i = 0; i < income.length; i++){
            this._income.push(new IncomeBill(
                income[i]._id,
                income[i].name,
                income[i].amount
            ));
        }

        for(let i = 0; i < bills.length; i++){
            this._bills.push(new IncomeBill(
                bills[i]._id,
                bills[i].name,
                bills[i].amount
            ));
        }

        for(let i = 0; i < allowances.length; i++){
            this._allowances.push(new Allowance(
                allowances[i]._id,
                allowances[i].name,
                allowances[i].amount,
                allowances[i].isPercent,
                this
            ));
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

    get income(){
        return this._income;
    }

    addIncome(income){
        this._income.push(new IncomeBill(
            income._id,
            income.name,
            income.amount
        ));
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
        this._bills.push(new IncomeBill(
            bill._id,
            bill.name,
            bill.amount
        ));
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
        this._allowances.push(new Allowance(
            allowance.id,
            allowance.name,
            allowance.amount,
            allowance.isPercent,
            this
        ));
    }

    getTotalAllowances(){
        let allowances = 0;

        for(let i = 0; i < this._allowances.length; i++){
            allowances += this._allowances[i].amount;
        }

        return allowances;
    }

    getAllowanceSpent(id){
        let spent = 0;
        for(let i = 0; i < this._transactions.length; i++){
            if(this._transaction[i].category !== undefined && this._transactions[i].category.id === id){
                spent += this._transactions[i].amount;
            }
        }

        return spent;
    }

    //transactions
    get transactions(){
        return this._transactions;
    }

    addTransaction(transaction){
        let newTransaction = new Transaction(
            transaction._id,
            transaction.category,
            transaction.labels,
            transaction.amount,
            transaction.location,
            transaction.date,
            transaction.note
        );

        this._transactions.push(newTransaction);
        this._balance += transaction.amount;

        this._transactions.sort((a, b) => (a.date > b.date) ? -1 : 1);
    }

    removeTransaction(transaction){
        let index = this._transactions.indexOf(transaction);
        this._transactions.splice(index, 1);

        this._balance -= parseInt(transaction.amount * 100);
    }

    //general functions
    getDiscretionary(){
        return this.getTotalIncome() - this.getTotalBills() - this.getTotalAllowances();
    }
}

module.exports = Account;