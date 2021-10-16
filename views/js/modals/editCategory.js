module.exports = {
    display: function(category){
        let orThing = document.getElementById("editCatOr");
        let amountInput = document.getElementById("editCatAmount");
        amountInput.value = "";
        document.getElementById("editCatForm").onsubmit = ()=>{this.submit(category)};
        document.getElementById("editCatName").value = category.name;
        document.getElementById("editCatCancel").onclick = ()=>{controller.closeModal()};
        
        if(category.constructor.name === "Allowance"){
            let percentInput = document.getElementById("editCatPercentLabel");
            percentInput.value = "";
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
    }
}