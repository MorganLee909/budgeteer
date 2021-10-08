const Income = require("../classes/category").Income;

let createTransaction = {
    display: function(category){
        let form = document.getElementById("createTransactionForm");
        let amount = document.getElementById("createTransactionAmount");
        form.reset();
        
        document.getElementById("createTransactionDate").valueAsDate = new Date();
        
        if(category === undefined){
            amount.value = 0;
            form.onsubmit = ()=>{this.submit()};
        }else{
            amount.value = category.amount;
            form.onsubmit = ()=>{this.submit(category)};
        }

        document.getElementById("createTransactionCancel").onclick = ()=>{controller.closeModal()};
    },

    submit(category){
        event.preventDefault();

        let tags = document.getElementById("createTransactionTags").value;

        let data = {
            account: user.getAccount().id,
            amount: -parseInt(document.getElementById("createTransactionAmount").value * 100),
            location: document.getElementById("createTransactionLocation").value,
            date: document.getElementById("createTransactionDate").valueAsDate,
            note: document.getElementById("createTransactionNote").value,
            tags: (tags === "") ? [] : tags.split(" ")
        };

        if(category !== undefined){
            data.category = category.id;
            if(category instanceof Income) data.amount = -data.amount;
        }

        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        fetch("/transactions", {
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
                    user.getAccount().addTransaction(response);
                    state.transactions();
                    controller.closeModal();
                }
            })
            .catch((err)=>{
                console.log(err);
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            })
            .finally(()=>{
                loader.style.display = "none";
            });
    }
};

module.exports = createTransaction;