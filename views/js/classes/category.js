class Category{
    constructor(name, group, amount, isPercent){
        this._name = name;
        this._group = group;
        this._amount = amount;
        this._isPercent = isPercent;
    }

    get name(){
        return this._name;
    }

    get group(){
        return this._group;
    }

    get amount(){
        return parseFloat((this._amount /100).toFixed(2));
    }
}

module.exports = Category;