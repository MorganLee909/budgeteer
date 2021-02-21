let transfer = {
    display: function(){
        document.getElementById("transferForm").onsubmit = ()=>{this.submit()};
        document.getElementById("transferFrom").innerText = user.getAccount().name;
        document.getElementById("transferCancel").onclick = ()=>{controller.closeModal()};
        document.getElementById("transferDate").valueAsDate = new Date();

        let select = document.getElementById("transferSelect");
        select.onchange = ()=>{this.updateCategories()};

        while(select.children.length > 0){
            select.removeChild(select.firstChild);
        }

        for(let i = 0; i < user.accounts.length; i++){
            if(user.accounts[i] === user.getAccount()){
                continue;
            }

            let option = document.createElement("option");
            option.innerText = user.accounts[i].name;
            option.value = i;
            select.appendChild(option);
        }

        let fromCategory = document.getElementById("fromCategory");

        while(fromCategory.children.length > 0){
            fromCategory.removeChild(fromCategory.firstChild);
        }

        let categories = user.getAccount().categories;
        for(let i = 0; i < categories.length; i++){
            let option = document.createElement("option");
            option.innerText = categories[i].name;
            option.value = categories[i].id;
            fromCategory.appendChild(option);
        }

        this.updateCategories();
    },

    updateCategories: function(){
        let account = user.accounts[document.getElementById("transferSelect").value];
        let select = document.getElementById("toCategory");

        while(select.children.length > 0){
            select.removeChild(select.firstChild);
        }

        for(let i = 0; i < account.categories.length; i++){
            let option = document.createElement("option");
            option.innerText = account.categories[i].name;
            option.value = account.categories[i].id;
            select.appendChild(option);
        }
    },

    submit: function(){
        event.preventDefault();

        let fromAccount = user.getAccount();
        let toAccount = user.accounts[document.getElementById("transferSelect").value];

        let data = {
            from: fromAccount.id,
            fromCategory: document.getElementById("fromCategory").value,
            to: toAccount.id,
            toCategory: document.getElementById("toCategory").value,
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
                    fromAccount.addTransaction(response.from);
                    toAccount.addTransaction(response.to);
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