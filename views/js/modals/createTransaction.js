let createTransaction = {
    display: function(){
        document.getElementById("createTransactionForm").onsubmit = ()=>{this.submit()};
        document.getElementById("createTransactionCancel").onclick = ()=>{
            document.getElementById("createTransactionAmount").value = "";
            document.getElementById("createTransactionLocation").value = "";
            document.getElementById("createTransactionNote").value = "";

            controller.closeModal();
        }
        document.getElementById("createTransactionDate").valueAsDate = new Date();
    },

    submit(){
        event.preventDefault();

        let data = {
            account: user.getAccount().id,
            amount: -parseInt(document.getElementById("createTransactionAmount").value * 100),
            location: document.getElementById("createTransactionLocation").value,
            date: document.getElementById("createTransactionDate").valueAsDate,
            note: document.getElementById("createTransactionNote").value
        }

        let account = user.getAccount();
        let income = account.income;
        for(let i = 0; i < income.length; i++){
            if(income[i].name === data.category){
                data.amount = -data.amount;
                break;
            }
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
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            })
            .finally(()=>{
                loader.style.display = "none";
            });
    }
};

module.exports = createTransaction;