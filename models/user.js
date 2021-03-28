const Account = require("./account.js").AccountSchema;

const mongoose = require("mongoose");

let emailValid = (email)=>{
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

let isSanitary = (str)=>{
    let disallowed = ["\\", "<", ">", "$", "{", "}", "(", ")"];

    for(let j = 0; j < disallowed.length; j++){
        if(str.includes(disallowed[j])){
            return false;
        }
    }

    return true;
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "MUST PROVIDE AN EMAIL"],
        validate: {
            validator: emailValid,
            message: "MUST PROVIDE A VALID EMAIL ADDRESS"
        }
    },
    password: {
        type: String,
        required: [true, "MUST PROVIDE A PASSWORD"]
    },
    accounts: [Account],
    session: {
        sessionId: String,
        expiration: Date
    }
});

module.exports = mongoose.model("user", UserSchema);