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

const IncomeBillSchema = new mongoose.Schema({
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
        required: [true, "MUST CONTAIN AN AMOUNT"]
    }
});

const AllowanceSchema = new mongoose.Schema({
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
});

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "ACCOUNT MUST HAVE A NAME"],
        validate: {
            validator: isSanitary,
            message: "ACCOUNT NAME CONTAINS ILLEGAL CHARACTERS"
        }
    },
    balance: {
        type: Number,
        required: [true, "ACCOUNT MUST CONTAIN A BALANCE"]
    },
    income: [IncomeBillSchema],
    bills: [IncomeBillSchema],
    allowances: [AllowanceSchema]
});

module.exports = {
    AccountSchema: AccountSchema,
    Account: mongoose.model("account", AccountSchema),
    IncomeBill: mongoose.model("incomeBill", IncomeBillSchema),
    Allowance: mongoose.model("allowance", AllowanceSchema)
}