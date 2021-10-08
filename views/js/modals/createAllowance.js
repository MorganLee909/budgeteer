let createAllowance = {
    display: function(){
        let form = document.getElementById("createAllowanceForm");
        form.reset();
        form.onsubmit = ()=>{this.submit()};
        document.getElementById("createAllowanceCancel").onclick = ()=>{controller.closeModal()};
    },

    submit: function(){
        event.preventDefault();

        let amount = document.getElementById("createAllowanceAmount").value;
        let percent = document.getElementById("createAllowancePercent").value;

        let data = {
            account: user.getAccount().id,
            name: document.getElementById("createAllowanceName").value,
            kind: "Allowance"
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

        fetch("/categories/new", {
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
                    state.allowances();
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

module.exports = createAllowance;