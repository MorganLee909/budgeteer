const mongoose = require("mongoose");

let isSanitary = (str)=>{
    let disallowed = ["\\", "<", ">", "$", "{", "}", "(", ")"];

    for(let j = 0; j < disallowed.length; j++){
        if(str.includes(disallowed[j])) return false;
    }

    return true;
}

const CategorySchema = new mongoose.Schema({
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
    },
    removed: {
        type: Boolean,
        default: false
    }
}, {discriminatorKey: "kind"});
const Category = mongoose.model("Category", CategorySchema);

Category.discriminator("Income", new mongoose.Schema());

Category.discriminator("Bill", new mongoose.Schema());

Category.discriminator("Allowance",
    new mongoose.Schema({
        isPercent: {
            type: Boolean,
            required: true
        }
    })
);

module.exports = {
    Category: Category,
    CategorySchema: CategorySchema
};