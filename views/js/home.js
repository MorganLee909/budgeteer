let home = {
    all: function(){
        document.getElementById("accountTitle").innerText = `${user.getAccount().name} account`;

        this.populateIncome();
        this.populateBills();
        this.populateAllowances();
        this.populateTransactions();
        this.populateStats();
    },

    buttons: function(){
        document.getElementById("createIncomeBtn").onclick = ()=>{controller.openModal("createIncome")};
        document.getElementById("createBillBtn").onclick = ()=>{controller.openModal("createBill")};
        document.getElementById("createAllowanceBtn").onclick = ()=>{controller.openModal("createAllowance")};
        document.getElementById("createTransactionBtn").onclick = ()=>{controller.openModal("createTransaction")};
        document.getElementById("dropdownButton").onclick = ()=>{this.showMenu()};
        document.getElementById("addAccountButton").onclick = ()=>{controller.openModal("newAccount")};
        document.getElementById("switchAccountButton").onclick = ()=>{controller.openModal("switchAccount")};
        document.getElementById("incomeInfoButton").onclick = ()=>{this.showInfo("income")};
        document.getElementById("billsInfoButton").onclick = ()=>{this.showInfo("bills")};
        document.getElementById("allowancesInfoButton").onclick = ()=>{this.showInfo("allowances")};
        document.getElementById("discretionaryInfoButton").onclick = ()=>{this.showInfo("discretionary")};
        document.getElementById("remainingDiscretionaryInfoButton").onclick = ()=>{this.showInfo("remaining")};
        document.getElementById("statsIncomeInfoButton").onclick = ()=>{this.showInfo("statsIncome")};
        document.getElementById("statsBillsInfoButton").onclick = ()=>{this.showInfo("statsBills")};
        document.getElementById("statsAllowancesInfoButton").onclick = ()=>{this.showInfo("statsAllowances")};
        document.getElementById("helpButton").onclick = ()=>{controller.openModal("help")};
        document.getElementById("transferMoney").onclick = ()=>{controller.openModal("transfer")};

        let balance = document.getElementById("statsBalance");
        balance.onclick = ()=>{
            balance.style.display = "none";

            let input = document.getElementById("balanceInput");
            input.style.display = "block";
            input.value = user.getAccount().balance;
            input.onchange = ()=>{this.updateBalance()};
        }
    },

    populateIncome: function(){
        let income = user.getAccount().income;
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
            amount.innerText = `$${income[i].amount}`;
            tr.appendChild(amount);

            let remove = document.createElement("td");
            remove.classList.add("actionable");
            remove.onclick = ()=>{this.removeCategory("income", income[i].id)};
            remove.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
            tr.appendChild(remove);

            if(income[i].isPaid === false){
                let status = document.createElement("td");
                status.classList.add("actionable");
                status.classList.add("statusButton");
                status.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                `;
                status.onclick = ()=>{controller.openModal("createTransaction", income[i])};
                tr.appendChild(status);
            }else{
                let status = document.createElement("td");
                status.innerText = "paid";
                status.classList.add("statusText");
                tr.appendChild(status);
            }
        }
    },

    populateBills: function(){
        let bills = user.getAccount().bills;
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
            amount.innerText = `$${bills[i].amount}`;
            tr.appendChild(amount);

            let remove = document.createElement("td");
            remove.classList.add("actionable");
            remove.onclick = ()=>{this.removeCategory("bills", bills[i].id)};
            remove.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
            tr.appendChild(remove);

            if(bills[i].isPaid === false){
                let status = document.createElement("td");
                status.classList.add("actionable");
                status.classList.add("statusButton");
                status.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                `;
                status.onclick = ()=>{controller.openModal("createTransaction", bills[i])};
                tr.appendChild(status);
            }else{
                let status = document.createElement("td");
                status.innerText = "paid";
                status.classList.add("statusText");
                tr.appendChild(status);
            }
        }
    },

    populateAllowances: function(){
        let allowances = user.getAccount().allowances;
        let allowancesBody = document.getElementById("allowancesBody");

        while(allowancesBody.children.length > 0){
            allowancesBody.removeChild(allowancesBody.firstChild);
        }

        for(let i = 0; i < allowances.length; i++){
            let tr = document.createElement("tr");
            allowancesBody.appendChild(tr);

            let name = document.createElement("td");
            name.innerText = allowances[i].name;
            tr.appendChild(name);

            let amount = document.createElement("td");
            amount.innerText = `$${allowances[i].amount}`;
            tr.appendChild(amount);

            let spent = document.createElement("td");
            spent.innerText = `$${allowances[i].spent}`;
            tr.appendChild(spent);

            let remove = document.createElement("td");
            remove.classList.add("actionable");
            remove.onclick = ()=>{this.removeCategory("allowances", allowances[i].id)};
            remove.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
            tr.appendChild(remove);

            let add = document.createElement("td");
            add.classList.add("actionable");
            add.classList.add("statusButton");
            add.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
            `;
            add.onclick = ()=>{controller.openModal("createTransaction", allowances[i])};
            tr.appendChild(add);
        }
    },

    populateTransactions: function(){
        let tbody = document.getElementById("transactionsBody");
        let transactions = user.getAccount().transactions;

        while(tbody.children.length > 0){
            tbody.removeChild(tbody.firstChild);
        }

        for(let i = 0; i < transactions.length; i++){
            let tr = document.createElement("tr");
            tr.classList.add("actionable");
            tr.onclick = ()=>{controller.openModal("transaction", transactions[i])};
            tbody.appendChild(tr);
            
            let date = document.createElement("td");
            let dateOptions = {year: "numeric", month: "short", day: "numeric"};
            date.innerText = transactions[i].date.toLocaleDateString("en-US", dateOptions);
            tr.appendChild(date);

            let category = document.createElement("td");
            category.innerText = transactions[i].category.name;
            tr.appendChild(category);

            let location = document.createElement("td");
            location.innerText = transactions[i].location;
            tr.appendChild(location);

            let amount = document.createElement("td");
            amount.innerText = `$${transactions[i].amount}`;
            tr.appendChild(amount);
        }
    },

    populateStats: function(){
        let account = user.getAccount();
        let discretionary = account.getDiscretionary();
        let now = new Date();

        document.getElementById("statsBalance").innerText = `$${account.balance}`;
        document.getElementById("statsMonth").innerText = now.toLocaleDateString("en-US", {month: "long"});
        document.getElementById("statsDiscretionary").innerText = `$${discretionary.toFixed(2)}`;
        document.getElementById("statsIncome").innerText = `$${account.getTotalIncome()}`;
        document.getElementById("statsBills").innerText = `$${account.getTotalBills()}`;
        document.getElementById("statsAllowances").innerText = `$${account.getTotalAllowances()}`;

        for(let i = 0; i < account.transactions.length; i++){
            if(account.transactions[i].category === "Discretionary") discretionary += account.transactions[i].amount;
        }

        document.getElementById("statsRemainingDiscretionary").innerText = `$${discretionary.toFixed(2)}`;
    },

    removeCategory: function(type, id){
        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        let thing = `/${type}/${user.getAccount().id}/${id}`;
        fetch(thing, {method: "delete"})
            .then(response => response.json())
            .then((response) =>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                }else{
                    let account = user.getAccount();

                    switch(type){
                        case "income":
                            account.deleteIncome(id);
                            state.income();
                            break;
                        case "bills":
                            account.deleteBill(id);
                            state.bills();
                            break;
                        case "allowances":
                            account.deleteAllowance(id);
                            state.allowances();
                            break;
                    }
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE.", "error");
            })
            .finally(()=>{
                loader.style.display = "none";
            });
    },

    showMenu: function(){
        document.getElementById("dropdownContent").style.display = "flex";

        setTimeout(()=>{
            window.onclick = ()=>{this.hideMenu()};
            document.getElementById("dropdownButton").onclick = ()=>{this.hideMenu()};
        }, 0);
    },

    hideMenu: function(){
        document.getElementById("dropdownContent").style.display = "none";
        window.onclick = undefined;
        document.getElementById("dropdownButton").onclick = ()=>{this.showMenu()};
    },

    showInfo: function(type){
        let element = {};
        let button = {};

        switch(type){
            case "income":
                element = document.getElementById("incomeInfoText");
                button = document.getElementById("incomeInfoButton");
                break;
            case "bills":
                element = document.getElementById("billsInfoText");
                button = document.getElementById("billsInfoButton");
                break;
            case "allowances":
                element = document.getElementById("allowancesInfoText");
                button = document.getElementById("allowancesInfoButton");
                break;
            case "discretionary":
                element = document.getElementById("discretionaryInfoText");
                button = document.getElementById("discretionaryInfoButton");
                break;
            case "remaining":
                element = document.getElementById("remainingDiscretionaryInfoText");
                button = document.getElementById("remainingDiscretionaryInfoButton");
                break;
            case "statsIncome":
                element = document.getElementById("statsIncomeInfoText");
                button = document.getElementById("statsIncomeInfoButton");
                break;
            case "statsBills":
                element = document.getElementById("statsBillsInfoText");
                button = document.getElementById("statsBillsInfoButton");
                break;
            case "statsAllowances":
                element = document.getElementById("statsAllowancesInfoText");
                button = document.getElementById("statsAllowancesInfoButton");
                break;
        }

        element.style.display = "flex";
        button.onclick = undefined;
        setTimeout(()=>{
            window.onclick = ()=>{
                element.style.display = "none";
                button.onclick = ()=>{this.showInfo(type)};
                window.onclick = undefined
            }
        }, 0);
    },

    updateBalance: function(){
        let input = document.getElementById("balanceInput");

        let data = {
            account: user.getAccount().id,
            balance: input.value * 100
        }

        fetch("/accounts/balance", {
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
                    user.getAccount().balance = response.balance;

                    input.style.display = "none";

                    let balance = document.getElementById("statsBalance");
                    balance.innerText = `$${user.getAccount().balance}`;
                    balance.style.display = "block";
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            });
    }
};

module.exports = home;