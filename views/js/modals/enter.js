const User = require("../classes/user.js");

let enter = {
    display: function(){
        document.getElementById("registerForm").onsubmit = ()=>{this.register()};
        document.getElementById("loginForm").onsubmit = ()=>{this.login()};
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

        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

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
            .finally(()=>{
                loader.style.display = "none";
            });
    },

    login: function(){
        event.preventDefault();

        let data = {
            email: document.getElementById("loginEmail").value,
            password: document.getElementById("loginPass").value
        }

        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

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
                    user.updateAll();
                    controller.closeModal();
                }

                return fetch(`/transactions/${user.getAccount().id}`);
            })
            .then(r=>r.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                }else{
                    let account = user.getAccount();
                    for(let i = 0; i < response.length; i++){
                        account.addTransaction(response[i], false);
                    }

                    state.all();
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            })
            .finally(()=>{
                loader.style.display = "none";
            });
    }
}

module.exports = enter;