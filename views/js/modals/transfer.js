let transfer = {
    display: function(){
        let form = document.getElementById("transferForm");
        form.onsubmit = ()=>{this.submit()};
        form.reset();
        document.getElementById("transferAmount").focus();
        
        document.getElementById("transferFrom").innerText = user.getAccount().name;
        document.getElementById("transferCancel").onclick = ()=>{controller.closeModal()};
        document.getElementById("transferDate").valueAsDate = new Date();

        let select = document.getElementById("transferSelect");
        select.onchange = ()=>{this.updateCategories()};

        while(select.children.length > 0){
            select.removeChild(select.firstChild);
        }

        for(let i = 0; i < user.accounts.length; i++){
            if(user.accounts[i] === user.getAccount()) continue;

            let option = document.createElement("option");
            option.innerText = user.accounts[i].name;
            option.value = i;
            select.appendChild(option);
        }
    },

    submit: function(){
        event.preventDefault();

        let fromAccount = user.getAccount();
        let toAccount = user.accounts[document.getElementById("transferSelect").value];

        let data = {
            from: fromAccount.id,
            to: toAccount.id,
            date : document.getElementById("transferDate").valueAsDate,
            amount: parseInt(document.getElementById("transferAmount").value * 100),
            note: document.getElementById("transferNote").value
        }

        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        fetch("/transactions/transfer", {
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
                    fromAccount.addTransaction(response[0]);
                    toAccount.addTransaction(response[1]);
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

module.exports = transfer;