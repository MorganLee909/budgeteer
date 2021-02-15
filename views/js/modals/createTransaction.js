let createTransaction = {
    display: function(){
        document.getElementById("createTransactionForm").onsubmit = ()=>{this.submit()};

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
            option.value = income[i].id;
            option.innerText = income[i].name;
            incomeGroup.appendChild(option);
        }

        let billGroup = document.createElement("optgroup");
        billGroup.label = "BILLS";
        select.appendChild(billGroup);
        let bills = user.getAccount().getBills();
        for(let i = 0; i < bills.length; i++){
            let option = document.createElement("option");
            option.value = bills[i].id;
            option.innerText = bills[i].name;
            billGroup.appendChild(option);
        }

        let allowanceGroup = document.createElement("optgroup");
        allowanceGroup.label = "ALLOWANCES";
        select.appendChild(allowanceGroup);
        let allowances = user.getAccount().getAllowances();
        for(let i = 0; i < allowances.length; i++){
            let option = document.createElement("option");
            option.value = allowances[i].id;
            option.innerText = allowances[i].name;
            allowanceGroup.appendChild(option);
        }

        let option = document.createElement("option");
        option.innerText = "Discretionary";
        let categories = user.getAccount().categories;
        for(let i = 0; i < categories.length; i++){
            if(categories[i].group === "discretionary"){
                option.value = categories[i].id;
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
            if(income[i].id === data.category){
                data.amount = -data.amount;
                break;
            }
        }

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
            });
    }
};

module.exports = createTransaction;