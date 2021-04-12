class Transaction{
    constructor(id, category, tags, amount, location, date, note, parent){
        this._id = id;
        this._tags = tags;
        this._amount = amount;
        this._location = location;
        this._date = new Date(date);
        this._note = note;
        this._parent = parent;

        if(category === undefined) return;
        let arrays = [this._parent.income, this._parent.bills, this._parent.allowances];
        let categories = [].concat(...arrays);

        for(let i = 0; i < categories.length; i++){
            if(categories[i].id === category){
                this._category = categories[i];
                break;
            }
        }

        this._category.addTransaction(this._amount);
    }

    //id
    get id(){
        return this._id;
    }

    //category
    get category(){
        if(this._category === undefined) return "Discretionary";
        return this._category.name;
    }

    //amount
    get amount(){
        return parseFloat((this._amount / 100).toFixed(2));
    }

    //location
    get location(){
        return this._location;
    }

    //date
    get date(){
        return this._date;
    }

    formattedDate(length){
        let options;
        if(length === "short"){
            options = {month: "short", day: "numeric", year: "numeric"};
        }else if(length === "long"){
            options = {weekday: "long", month: "long", day: "numeric", year: "numeric"};
        }

        return this._date.toLocaleDateString("en-US", options);
    }

    //note
    get note(){
        return this._note;
    }

    
}

module.exports = Transaction;