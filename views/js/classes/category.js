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

    set amount(amount){
        this._amount = amount;
    }
}

class Income extends Category{
    constructor(id, name, amount, removed){
        super(id, name, amount, removed);

        this.isPaid = false;
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
    constructor(id, name, amount, removed){
        super(id, name, amount, removed);

        this.isPaid = false;
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
    constructor(id, name, amount, removed, isPercent, parent){
        super(id, name, amount, removed);
        this.isPercent = isPercent;
        this.parent = parent;
        this._spent = 0;
    }

    get amount(){
        if(this.isPercent) return parseFloat((this.parent.getTotalIncome() * (this._amount / 100)).toFixed(2));
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