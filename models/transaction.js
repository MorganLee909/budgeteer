const mongoose = require("mongoose");

let isSanitary = (str)=>{
    let disallowed = ["\\", "<", ">", "$", "{", "}", "(", ")"];

    for(let j = 0; j < disallowed.length; j++){
        if(str.includes(disallowed[j])){
            return false;
        }
    }

    return true;
}

let TransactionSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user.accounts",
        required: [true, "TRANSACTION MUST BE ASSOCIATED WITH AN ACCOUNT"]
    },
    category: {
        type: {type: String},
        id: String
    },
    labels: [String],
    amount: {
        type: Number,
        required: [true, "TRANSACTION MUST HAVE AN AMOUNT"]
    },
    location: {
        type: String,
        validate: {
            validator: isSanitary,
            message: "LOCATION CONTAINS ILLEGAL CHARACTERS"
        }
    },
    date: {
        type: Date,
        required: [true, "TRANSACTION MUST CONTAIN A DATE"]
    },
    note: {
        type: String,
        validate: {
            validator: isSanitary,
            message: "NOTE CONTAINS ILLEGAL CHARACTERS"
        }
    }
});

module.exports = mongoose.model("transaction", TransactionSchema);