const { populateAllowances } = require("../home");

let createTransaction = {
    display: function(){
        document.getElementById("createTransactionForm").onsubmit = ()=>{this.submit()};

        let select = document.getElementById("createTransactionSelect");

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
        option.value = "discretionary";
        option.innerText = "Discretionary";
        select.appendChild(option);
    },

    submit(){
        event.preventDefault();

        console.log("submit new transaction");
    }
};

module.exports = createTransaction;