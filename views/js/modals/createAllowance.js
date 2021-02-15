let createAllowance = {
    display: function(){
        document.getElementById("createAllowanceForm").onsubmit = ()=>{this.submit()};
    },

    submit: function(){
        event.preventDefault();

        let amount = document.getElementById("createAllowanceAmount").value;
        let percent = document.getElementById("createAllowancePercent").value;

        let data = {
            name: document.getElementById("createAllowanceName").value,
            account: user.getAccount().id
        }

        if(amount === ""){
            if(percent === ""){
                controller.createBanner("PLEASE ENTER EITHER AN AMOUNT OR A PERCENT OF INCOME");
                return;
            }else{
                data.amount = parseInt(percent);
                data.isPercent = true;
            }
            
        }else{
            if(percent !== ""){
                controller.createBanner("CHOOSE AMOUNT OR PERCENT. NOT BOTH");
                return;
            }else{
                data.amount = parseInt(amount * 100);
                data.isPercent = false;
            }
        }

        fetch("/allowance/create", {
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
                    user.getAccount().addCategory(response);
                    controller.closeModal();
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            });
    }
};

module.exports = createAllowance;