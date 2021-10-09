const home = require("./home.js");

const enterModal = require("./modals/enter.js");
const newAccountModal = require("./modals/newAccount.js");
const createIncomeModal = require("./modals/createIncome.js");
const createBillModal = require("./modals/createBill.js");
const createAllowanceModal = require("./modals/createAllowance.js");
const createTransactionModal = require("./modals/createTransaction.js");
const transactionModal = require("./modals/transaction.js");
const switchAccountModal = require("./modals/switchAccount.js");
const helpModal = require("./modals/help.js");
const transferModal = require("./modals/transfer.js");
const restoreModal = require("./modals/restoreCategory.js");

const User = require("./classes/user.js");

user = null;

controller = {
    openModal: function(modal, data){
        let modals = document.querySelectorAll(".modal");
        for(let i = 0; i < modals.length; i++){
            modals[i].style.display = "none";
        }

        let container = document.getElementById("modalContainer");
        container.style.display = "flex";
        if(user !== null && user.getAccount() !== undefined){
            container.onclick = ()=>{controller.closeModal()};
        }

        let categories = {};

        switch(modal){
            case "enter":
                modal = document.getElementById("enterModal");
                enterModal.display();
                break;
            case "newAccount":
                modal = document.getElementById("newAccountModal");
                newAccountModal.display();
                break;
            case "createIncome":
                categories = user
                    .getAccount()
                    .income()
                    .filter(c => c.removed === true);
                if(categories.length > 0){
                    modal = document.getElementById("restoreCategoryModal");
                    restoreModal.display(categories);
                }else{
                    modal = document.getElementById("createIncomeModal");
                    createIncomeModal.display();
                }
                break;
            case "createBill":
                categories = user
                    .getAccount()
                    .bills()
                    .filter(c => c.removed === true);
                if(categories.length > 0){
                    modal = document.getElementById("restoreCategoryModal");
                    restoreModal.display(categories);
                }else{
                    modal = document.getElementById("createBillModal");
                    createBillModal.display();
                }
                break;
            case "createAllowance":
                categories = user
                    .getAccount()
                    .allowances()
                    .filter(c => c.removed === true);
                if(categories.length > 0){
                    modal = document.getElementById("restoreCategoryModal");
                    restoreModal.display(categories);
                }else{
                    modal = document.getElementById("createAllowanceModal");
                    createAllowanceModal.display();
                }
                break;
            case "createTransaction":
                modal = document.getElementById("createTransactionModal");
                createTransactionModal.display(data);
                break;
            case "transaction":
                modal = document.getElementById("transactionModal");
                transactionModal.display(data);
                break;
            case "switchAccount":
                modal = document.getElementById("switchAccountModal");
                switchAccountModal.display();
                break;
            case "help":
                modal = document.getElementById("helpModal");
                helpModal.display();
                break;
            case "transfer":
                modal = document.getElementById("transferModal");
                transferModal.display();
                break;
        }

        modal.style.display = "flex";
        modal.onclick = ()=>{event.stopPropagation()};
    },

    closeModal: function(){
        document.getElementById("modalContainer").style.display = "none";

        let modals = document.querySelectorAll(".modal");
        for(let i = 0; i < modals.length; i++){
            modals[i].style.display = "none";
        }
    },

    createBanner: function(message, type){
        let banner = document.getElementById("banner");
        banner.style.display = "flex";
        banner.classList.add(`${type}Banner`);

        document.getElementById("bannerText").innerText = message;

        setTimeout(()=>{
            banner.style.display = "none";
            banner.classList = "";
        }, 5000);
    }
};

state = {
    income: function(){
        home.populateCategories();
        home.populateStats();
    },

    bills: function(){
        home.populateCategories();
        home.populateStats();
    },

    allowances: function(){
        home.populateCategories();
        home.populateStats();
    },

    transactions: function(){
        home.populateTransactions();
        home.populateCategories();
        home.populateStats();
    },
    
    all: function(){
        home.all();
    }
}

let loader = document.getElementById("loaderContainer");
loader.style.display = "flex";

fetch("/session")
    .then(response => response.json())
    .then((response)=>{
        if(typeof(response) === "string"){
            controller.openModal("enter");
        }else{
            user = new User(response.accounts);
            
            let from = new Date();
            from.setDate(1);
            from.setHours(0, 0, 0, 0);
            let data = {
                account: user.getAccount().id,
                from: from,
                to: new Date()
            };
            
            return fetch("/transactions/get", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
        }
    })
    .then(response => response.json())
    .then((response)=>{
        let account = user.getAccount();
        for(let i = 0; i < response.length; i++){
            account.addTransaction(response[i], false);
        }

        home.all();
    })
    .catch((err)=>{
        controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
    })
    .finally(()=>{
        loader.style.display = "none";
    });

home.buttons();