class Category{
    constructor(parent, id, name, group, amount, isPercent){
        this._id = id;
        this._parent = parent;
        this._name = name;
        this._group = group;
        this._amount = amount;
        this._isPercent = isPercent;
    }

    get id(){
        return this._id;
    }

    get name(){
        if(this._name === "discretionary") return "Discretionary";
        return this._name;
    }

    get group(){
        return this._group;
    }

    get amount(){
        if(this._isPercent === true){
            let income = this._parent.getTotalIncome();
            return parseFloat((income * (this._amount / 100)).toFixed(2));
        }
        return parseFloat((this._amount / 100).toFixed(2));
    }
}

module.exports = Category;