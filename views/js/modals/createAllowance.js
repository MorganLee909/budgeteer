let createAllowance = {
    display: function(){
        document.getElementById("createAllowanceForm").onsubmit = ()=>{this.submit()};
        document.getElementById("createAllowanceCancel").onclick = ()=>{
            document.getElementById("createAllowanceName").value = "";
            document.getElementById("createAllowanceAmount").value = "";
            document.getElementById("createAllowancePercent").value = "";

            controller.closeModal();
        }
    },

    submit: function(){
        event.preventDefault();

        let amount = document.getElementById("createAllowanceAmount").value;
        let percent = document.getElementById("createAllowancePercent").value;

        let data = {
            name: document.getElementById("createAllowanceName").value,
            account: user.getAccount().id,
            
        }

        if(amount === ""){
            if(percent === ""){
                controller.createBanner("PLEASE ENTER EITHER AN AMOUNT OR A PERCENT OF INCOME", "error");
                return;
            }else{
                data.amount = parseInt(percent);
                data.isPercent = true;
            }
        }else{
            if(percent !== ""){
                controller.createBanner("CHOOSE AMOUNT OR PERCENT. NOT BOTH", "error");
                return;
            }else{
                data.amount = parseInt(amount * 100);
                data.isPercent = false;
            }
        }

        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        fetch("/allowances", {
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
                    user.getAccount().addAllowance(response);
                    state.allowances();
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

module.exports = createAllowance;