const mongoose = require("mongoose");

let isSanitary = (str)=>{
    let disallowed = ["\\", "<", ">", "$", "{", "}", "(", ")"];

    for(let j = 0; j < disallowed.length; j++){
        if(str.includes(disallowed[j])) return false;
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
    balance: {
        type: Number,
        required: [true, "ACCOUNT MUST CONTAIN A BALANCE"]
    }
});

module.exports = {
    AccountSchema: AccountSchema,
    Account: mongoose.model("account", AccountSchema)
}