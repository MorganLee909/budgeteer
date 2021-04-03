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
    }
}

class Bill extends Category{
    constructor(id, name, amount){
        super(id, name, amount);
    }
}

class Allowance extends Category{
    constructor(id, name, amount, isPercent, parent){
        super(id, name, amount);
        this._isPercent = isPercent;
        this._parent = parent;
    }

    get amount(){
        if(this._isPercent === true) return parseFloat((this._parent.getTotalIncome() * (this._amount / 100)).toFixed(2));
        return parseFloat((this._amount / 100).toFixed(2));
    }
}

module.exports = {
    Income: Income,
    Bill: Bill,
    Allowance: Allowance
}