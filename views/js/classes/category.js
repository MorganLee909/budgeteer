class Category{
    constructor(id, name, amount){
        this._id = id;
        this._name = name;
        this._amount = amount;
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    get amount(){
        return parseFloat((this._amount / 100).toFixed(2));
    }
}

class Income extends Category{
    constructor(id, name, amount){
        super(id, name, amount);

        this._isPaid = false;
    }

    get isPaid(){
        return this._isPaid;
    }

    addTransaction(amount){
        this._isPaid = true;
        this._oldAmount = this._amount;
        this._amount = amount;
    }

    removeTransaction(amount){
        this._isPaid = false;
        this._amount = this._oldAmount;
        this._oldAmount = undefined;
    }
}

class Bill extends Category{
    constructor(id, name, amount){
        super(id, name, amount);

        this._isPaid = false;
    }

    get isPaid(){
        return this._isPaid;
    }

    addTransaction(amount){
        this._isPaid = true;
        this._oldAmount = this._amount;
        this._amount = -amount;
    }

    removeTransaction(amount){
        this._isPaid = false;
        this._amount = this._oldAmount;
        this._oldAmount = undefined;
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
        console.log(amount);
        this._spent -= amount;
    }

    removeTransaction(amount){
        console.log(amount);
        this._spent += amount;
    }
}

module.exports = {
    Income: Income,
    Bill: Bill,
    Allowance: Allowance
}