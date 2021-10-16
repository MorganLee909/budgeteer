module.exports = {
    display: function(category){
        let orThing = document.getElementById("editCatOr");
        let amountInput = document.getElementById("editCatAmount");
        amountInput.value = "";
        let percentInput = document.getElementById("editCatPercentLabel");
        percentInput.value = "";
        document.getElementById("editCatForm").onsubmit = ()=>{this.submit(category)};
        document.getElementById("editCatName").value = category.name;
        document.getElementById("editCatCancel").onclick = ()=>{controller.closeModal()};
        
        if(category.constructor.name === "Allowance"){
            orThing.style.display = "block";
            percentInput.style.display = "flex";
            if(category.isPercent){
                amountInput.value = "";
                percentInput.children[0].value = category.amount;
            }else{
                amountInput.value = category.amount.toFixed(2);
                percentInput.children[0].value = "";
            }
        }else{
            orThing.style.display = "none";
            percentInput.style.display = "none";
            amountInput.value = category.amount.toFixed(2);
        }
    },

    submit: function(category){
        event.preventDefault();
        let name = document.getElementById("editCatName").value;
        let amount = document.getElementById("editCatAmount").value;
        let percent = document.getElementById("editCatPercentLabel").children[0].value;

        if(category.constructor.name !== "Allowance"){
            if(amount === "") return controller.createBanner("Amount is required", "error");
        }else{
            if(amount !== "" && percent !== "") return controller.createBanner("Must enter amount OR percent", "error");
            if(amount === "" && percent === "") return controller.createBanner("Must enter amount or percent", "error");
        }

        let data = {
            account: user.getAccount().id,
            category: category.id,
            name: name,
            amount: parseInt(amount * 100),
            isPercent: percent === "" ? false : true
        };

        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        fetch("/categories/update", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                }else{
                    user.getAccount().updateCategory(response);
                    state.all();
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
}