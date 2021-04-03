class Transaction{
    constructor(id, category, labels, amount, location, date, note, parent){
        this._id = id;
        this._labels = labels;
        this._amount = amount;
        this._location = location;
        this._date = new Date(date);
        this._note = note;
        this._parent = parent;

        if(category !== undefined){
            this._category = {
                type: category.type,
            }

            let categories = [];
            switch(this._category.type){
                case "income": categories = this._parent.income; break;
                case "bills": categories = this._parent.bills; break;
                case "allowances": categories = this._parent.allowances; break;
            }

            for(let i = 0; i < categories.length; i++){
                if(categories[i].id === category.id){
                    this._category.category = categories[i];
                    categories[i]._oldAmount = categories[i]._amount;
                    categories[i]._amount = -this._amount;
                    break;
                }
            }
        }
    }

    //id
    get id(){
        return this._id;
    }

    //category
    get category(){
        if(this._category === undefined) return "Discretionary";
        return this._category.category.name;
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