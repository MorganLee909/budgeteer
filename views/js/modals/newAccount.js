let newAccount = {
    display: function(){
        document.getElementById("newAccountForm").onsubmit = ()=>{this.submit()};
    },

    submit: function(){
        event.preventDefault();

        console.log("submitting new account");
    }
}

module.exports = newAccount;