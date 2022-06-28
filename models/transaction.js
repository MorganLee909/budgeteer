const mongoose = require("mongoose");

let TransactionSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user.accounts",
        required: [true, "TRANSACTION MUST BE ASSOCIATED WITH AN ACCOUNT"],
        index: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: false
    },
    tags: [{
        type: String,
        required: false
    }],
    amount: {
        type: Number,
        required: [true, "TRANSACTION MUST HAVE AN AMOUNT"]
    },
    location: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: [true, "TRANSACTION MUST CONTAIN A DATE"]
    },
    note: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model("transaction", TransactionSchema);