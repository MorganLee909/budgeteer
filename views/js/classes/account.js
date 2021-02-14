class Account{
    constructor(name, balance, categories){
        this._name = name;
        this._balance = balance;
        this._categories = categories;
    }

    get name(){
        return this._name;
    }

    getIncome(){
        let income = [];

        for(let i = 0; i < this._categories.length; i++){
            if(this._categories[i].group === "income"){
                income.push(this.categories[i]);
            }
        }

        return income;
    }
}

module.exports = Account;