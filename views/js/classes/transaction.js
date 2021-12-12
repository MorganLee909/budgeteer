class Transaction{
    constructor(id, category, tags, amount, location, date, note){
        this.id = id;
        this.tags = tags;
        this._amount = amount;
        this.location = location;
        this.date = new Date(date);
        this.note = note;
        this.category = user.getAccount().getCategory(category);

        let monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        if(this.date > monthStart) this.category.addTransaction(this._amount);
    }

    //amount
    get amount(){
        return parseFloat((this._amount / 100).toFixed(2));
    }

    getAbsoluteValue(){
        if(this._amount < 0) return -parseFloat((this._amount / 100).toFixed(2));
        return parseFloat((this._amount / 100).toFixed(2));
    }

    formattedDate(length){
        let options;
        if(length === "short"){
            options = {month: "short", day: "numeric", year: "numeric"};
        }else if(length === "long"){
            options = {weekday: "long", month: "long", day: "numeric", year: "numeric"};
        }

        return this.date.toLocaleDateString("en-US", options);
    }
}

module.exports = Transaction;