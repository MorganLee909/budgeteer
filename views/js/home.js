let home = {
    all: function(){
        document.getElementById("accountTitle").innerText = `${user.getAccount().name} account`;

        this.populateCategories();
        this.populateTransactions();
        this.populateStats();
    },

    buttons: function(){
        document.getElementById("createIncomeBtn").onclick = ()=>{controller.openModal("restoreCategory", "Income")};
        document.getElementById("createBillBtn").onclick = ()=>{controller.openModal("restoreCategory", "Bill")};
        document.getElementById("createAllowanceBtn").onclick = ()=>{controller.openModal("restoreCategory", "Allowance")};
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
            input.onblur = ()=>{
                balance.style.display = "block"
                input.style.display = "none";
            }
        }
    },

    populateCategories: function(){
        let categories = user.getAccount().categories;
        let incomeBody = document.getElementById("incomeBody");
        let billBody = document.getElementById("billsBody")
        let allowanceBody = document.getElementById("allowancesBody");
        let template = document.getElementById("categoryRow").content.children[0];

        while(incomeBody.children.length > 0){
            incomeBody.removeChild(incomeBody.firstChild);
        }
        while(billBody.children.length > 0){
            billBody.removeChild(billBody.firstChild);
        }
        while(allowanceBody.children.length > 0){
            allowanceBody.removeChild(allowanceBody.firstChild);
        }

        for(let i = 0; i < categories.length; i++){
            if(categories[i].removed) continue;

            let category = template.cloneNode(true);
            let amount = category.querySelector(".categoryRowAmount");
            let remove = category.querySelector(".categoryRowRemove");
            let pay = category.querySelector(".categoryRowPay");
            let spent = category.querySelector(".categoryRowSpent");
            let name = category.querySelector(".categoryRowName");
            name.innerText = categories[i].name;
            name.onclick = ()=>{this.clickCategory(name, categories[i])}
            amount.innerText = `$${categories[i].amount}`;
            remove.onclick = ()=>{this.removeCategory(categories[i].id)};
            remove.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
            pay.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
            `;
            pay.onclick = ()=>{controller.openModal("createTransaction", categories[i])};

            switch(categories[i].constructor.name){
                case "Income":
                    if(categories[i].isPaid){
                        pay.innerHTML = "paid";
                        pay.onclick = null;
                        pay.classList.remove("statusButton");
                    }
                    incomeBody.appendChild(category);
                    break;
                case "Bill":
                    if(categories[i].isPaid){
                        pay.innerHTML = "paid";
                        pay.onclick = null;
                        pay.classList.remove("statusButton");
                    }
                    billBody.appendChild(category);
                    break;
                case "Allowance":
                    spent.innerText = `$${categories[i].spent}`;
                    spent.style.display = "block";
                    allowanceBody.appendChild(category);
                    break;
            }
        }
    },

    clickCategory: function(element, category){
        element.style.display = "none";

        let input = document.createElement("input");
        input.type = element.classList.contains("categoryRowName") ? "text" : "number";
        input.onchange = ()=>{this.submitCatChange(element, category.id)};
        input.onblur = ()=>{
            element.style.display = "none";
            input.s
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
            if(account.transactions[i].category.name === "Discretionary") discretionary += account.transactions[i].amount;
        }

        document.getElementById("statsRemainingDiscretionary").innerText = `$${discretionary.toFixed(2)}`;
    },

    removeCategory: function(id){
        let account = user.getAccount();
        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        fetch(`/categories/${account.id}/remove/${id}`)
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                }else{

                    account.removeCategory(id);
                    state.all();
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

        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

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
            })
            .finally(()=>{
                loader.style.display = "none";
            });
    }
};

module.exports = home;