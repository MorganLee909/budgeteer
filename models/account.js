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

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "ACCOUNT MUST HAVE A NAME"],
        validate: {
            validator: isSanitary,
            message: "ACCOUNT NAME CONTAINS ILLEGAL CHARACTERS"
        }
    },
    balance: Number,
    income: [{
        name: {
            type: String,
            required: [true, "MUST HAVE A NAME"],
            validate: {
                validator: isSanitary,
                message: "NAME CONTAINS ILLEGAL CHARACTERS"
            }
        },
        amount: {
            type: Number,
            required: [true, "INCOME MUST CONTAIN AN AMOUNT"]
        },
    }],
    bills: [{
        name: {
            type: String,
            required: [true, "MUST HAVE A NAME"],
            validate: {
                validator: isSanitary,
                message: "NAME CONTAINS ILLEGAL CHARACTERS"
            }
        },
        amount: {
            type: Number,
            required: [true, "BILL MUST CONTAIN AN AMOUNT"]
        }
    }],
    allowances: [{
        name: {
            type: String,
            required: [true, "MUST HAVE A NAME"],
            validate: {
                validator: isSanitary,
                message: "NAME CONTAINS ILLEGAL CHARACTERS"
            },
        },
        amount: {
            type: Number,
            required: [true, "ALLOWANCE MUST CONTAIN AN AMOUNT"]
        },
        isPercent: {
            type: Boolean,
            required: true
        }
    }]
});

module.exports = {
    AccountSchema: AccountSchema,
    Account: mongoose.model("account", AccountSchema)
}