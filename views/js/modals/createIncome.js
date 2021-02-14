let createIncome = {
    display: function(){
        document.getElementById("createIncomeForm").onsubmit = ()=>{this.submit()};
    },

    submit: function(){
        event.preventDefault();

        let data = {
            name: document.getElementById("createIncomeName").value,
            amount: parseInt(document.getElementById("createIncomeAmount").value * 100),
            account: user.getAccount().id
        };

        fetch("/income/create", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response) =>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                }else{
                    user.getAccount().addCategory(response);
                    controller.closeModal();
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            });
    }   
}

module.exports = createIncome;