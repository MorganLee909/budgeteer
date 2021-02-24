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

        let select = document.getElementById("createTransactionSelect");

        while(select.children.length > 0){
            select.removeChild(select.firstChild);
        }

        let incomeGroup = document.createElement("optgroup");
        incomeGroup.label = "INCOME";
        select.appendChild(incomeGroup);
        let income = user.getAccount().getIncome();
        for(let i = 0; i < income.length; i++){
            let option = document.createElement("option");
            option.value = income[i].name;
            option.innerText = income[i].name;
            incomeGroup.appendChild(option);
        }

        let billGroup = document.createElement("optgroup");
        billGroup.label = "BILLS";
        select.appendChild(billGroup);
        let bills = user.getAccount().getBills();
        for(let i = 0; i < bills.length; i++){
            let option = document.createElement("option");
            option.value = bills[i].name;
            option.innerText = bills[i].name;
            billGroup.appendChild(option);
        }

        let allowanceGroup = document.createElement("optgroup");
        allowanceGroup.label = "ALLOWANCES";
        select.appendChild(allowanceGroup);
        let allowances = user.getAccount().getAllowances();
        for(let i = 0; i < allowances.length; i++){
            let option = document.createElement("option");
            option.value = allowances[i].name;
            option.innerText = allowances[i].name;
            allowanceGroup.appendChild(option);
        }

        let option = document.createElement("option");
        option.innerText = "Discretionary";
        let categories = user.getAccount().categories;
        for(let i = 0; i < categories.length; i++){
            if(categories[i].group === "discretionary"){
                option.value = categories[i].name;
                break;
            }
        }
        select.appendChild(option);
    },

    submit(){
        event.preventDefault();

        let data = {
            account: user.getAccount().id,
            category: document.getElementById("createTransactionSelect").value,
            amount: -parseInt(document.getElementById("createTransactionAmount").value * 100),
            location: document.getElementById("createTransactionLocation").value,
            date: document.getElementById("createTransactionDate").valueAsDate,
            note: document.getElementById("createTransactionNote").value
        }

        let account = user.getAccount();
        let income = account.getIncome();
        for(let i = 0; i < income.length; i++){
            if(income[i].name === data.category){
                data.amount = -data.amount;
                break;
            }
        }

        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        fetch("/transaction/create", {
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