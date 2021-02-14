const User = require("../classes/user.js");

let enter = {
    display: function(){
        document.getElementById("registerForm").onsubmit = ()=>{this.register()};
        document.getElementById("loginform").onsubmit = ()=>{this.login()};
    },

    register: function(){
        event.preventDefault();

        let data = {
            email: document.getElementById("registerEmail").value,
            password: document.getElementById("registerPass").value,
            confirmPassword: document.getElementById("registerConfirm").value
        }

        if(data.password !== data.confirmPassword){
            return;
        }

        fetch("/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                    return;
                }

                user = new User(response.accounts);
                controller.openModal("newAccount");
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            })
    },

    login: function(){
        event.preventDefault();

        let data = {
            email: document.getElementById("loginEmail").value,
            password: document.getElementById("loginPass").value
        }

        fetch("/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                }else{
                    user = new User(response.accounts);
                    controller.closeModal();
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            });
    }
}

module.exports = enter;