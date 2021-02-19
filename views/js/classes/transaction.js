class Transaction{
    constructor(id, parent, category, amount, location, date, note){
        this._id = id;
        this._parent = parent;
        this._amount = amount;
        this._location = location;
        this._date = new Date(date);
        this._note = note;

        for(let i = 0; i < this._parent.categories.length; i++){
            if(this._parent.categories[i].id === category){
                this._category = this._parent.categories[i];
            }
        }
    }

    //id
    get id(){
        return this._id;
    }

    //category
    get category(){
        return this._category;
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