let home = {
    all: function(){
        document.getElementById("accountTitle").innerText = `${user.getAccount().name} account`;

        this.populateIncome();
        this.populateBills();
    },

    buttons: function(){
        document.getElementById("createIncomeBtn").onclick = ()=>{controller.openModal("createIncome")};
        document.getElementById("createBillBtn").onclick = ()=>{controller.openModal("createBill")};
    },

    populateIncome: function(){
        let income = user.getAccount().getIncome();
        let incomeBody = document.getElementById("incomeBody");
        while(incomeBody.children.length > 0){
            incomeBody.removeChild(incomeBody.firstChild);
        }

        for(let i = 0; i < income.length; i++){
            let tr = document.createElement("tr");
            incomeBody.appendChild(tr);

            let name = document.createElement("td");
            name.innerText = income[i].name;
            tr.appendChild(name);

            let amount = document.createElement("td");
            amount.innerText = `$${income[i].amount.toFixed(2)}`;
            tr.appendChild(amount);

            let remove = document.createElement("td");
            remove.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
            tr.appendChild(remove);
        }
    },

    populateBills: function(){
        let bills = user.getAccount().getBills();
        let billsBody = document.getElementById("billsBody");

        while(billsBody.children.length > 0){
            billsBody.removeChild(billsBody.firstChild);
        }

        for(let i = 0; i < bills.length; i++){
            let tr = document.createElement("tr");
            billsBody.appendChild(tr);

            let name = document.createElement("td");
            name.innerText = bills[i].name;
            tr.appendChild(name);

            let amount = document.createElement("td");
            amount.innerText = `$${bills[i].amount.toFixed(2)}`;
            tr.appendChild(amount);

            let remove = document.createElement("td");
            remove.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
            tr.appendChild(remove);
        }
    }
};

module.exports = home;