class Category{
    constructor(id, name, amount, removed){
        this.id = id;
        this.name = name;
        this._amount = amount;
        this.removed = removed;
    }

    get amount(){
        return parseFloat((this._amount / 100).toFixed(2));
    }
}

class Income extends Category{
    constructor(id, name, amount){
        super(id, name, amount);

        this.isPaid = false;
    }

    get isPaid(){
        return this.isPaid;
    }

    addTransaction(amount){
        this.isPaid = true;
        this.oldAmount = this._amount;
        this._amount = amount;
    }

    removeTransaction(){
        this.isPaid = false;
        this._amount = this.oldAmount;
        this.oldAmount = undefined;
    }
}

class Bill extends Category{
    constructor(id, name, amount){
        super(id, name, amount);

        this.isPaid = false;
    }

    get isPaid(){
        return this.isPaid;
    }

    addTransaction(amount){
        this.isPaid = true;
        this.oldAmount = this._amount;
        this._amount = -amount;
    }

    removeTransaction(){
        this.isPaid = false;
        this._amount = this.oldAmount;
        this.oldAmount = undefined;
    }
}

class Allowance extends Category{
    constructor(id, name, amount, isPercent, parent){
        super(id, name, amount);
        this._isPercent = isPercent;
        this._parent = parent;
        this._spent = 0;
    }

    get amount(){
        if(this._isPercent === true) return parseFloat((this._parent.getTotalIncome() * (this._amount / 100)).toFixed(2));
        return parseFloat((this._amount / 100).toFixed(2));
    }

    get spent(){
        return parseFloat((this._spent / 100).toFixed(2));
    }

    addTransaction(amount){
        this._spent -= amount;
    }

    removeTransaction(amount){
        this._spent += amount;
    }
}

module.exports = {
    Income: Income,
    Bill: Bill,
    Allowance: Allowance
};