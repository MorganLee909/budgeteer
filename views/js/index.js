const home = require("./pages/home.js");
const transactionsPage = require("./pages/transactions.js");

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
const editCategoryModal = require("./modals/editCategory.js");

const User = require("./classes/user.js");

user = null;

controller = {
    openPage: function(page){
        let pages = document.querySelectorAll(".page");
        for(let i = 0; i < pages.length; i++){
            pages[i].style.display = "none";
        }

        document.getElementById(page).style.display = "flex";
    },

    openModal: function(modal, data){
        let displayFunk = {};
        let modals = document.querySelectorAll(".modal");
        for(let i = 0; i < modals.length; i++){
            modals[i].style.display = "none";
        }

        let container = document.getElementById("modalContainer");
        container.style.display = "flex";
        if(user !== null && user.getAccount() !== undefined){
            container.onclick = ()=>{controller.closeModal()};
        }

        switch(modal){
            case "enter":
                modal = document.getElementById("enterModal");
                displayFunk = enterModal.display;
                break;
            case "newAccount":
                modal = document.getElementById("newAccountModal");
                displayFunk = newAccountModal.display;
                break;
            case "createIncome":
                modal = document.getElementById("createIncomeModal");
                displayFunk = createIncomeModal.display;
                break;
            case "createBill":
                modal = document.getElementById("createBillModal");
                displayFunk = createBillModal.display;
                break;
            case "createAllowance":
                modal = document.getElementById("createAllowanceModal");
                displayFunk = createAllowanceModal.display;
                break;
            case "createTransaction":
                modal = document.getElementById("createTransactionModal");
                displayFunk = ()=>{createTransactionModal.display(data)};
                break;
            case "transaction":
                modal = document.getElementById("transactionModal");
                displayFunk = ()=>{transactionModal.display(data)};
                break;
            case "switchAccount":
                modal = document.getElementById("switchAccountModal");
                displayFunk = switchAccountModal.display;
                break;
            case "help":
                modal = document.getElementById("helpModal");
                displayFunk = helpModal.display;
                break;
            case "transfer":
                modal = document.getElementById("transferModal");
                displayFunk = transferModal.display;
                break;
            case "restoreCategory":
                let categories = user
                    .getAccount()
                    .categories
                    .filter(c => c.constructor.name === data && c.removed === true);
                if(categories.length > 0){
                    modal = document.getElementById("restoreCategoryModal");
                    displayFunk = ()=>{restoreModal.display(categories)};
                }else{
                    controller.openModal(`create${data}`);
                    return;
                }
                break;
            case "editCategory":
                modal = document.getElementById("editCategoryModal");
                displayFunk = ()=>{editCategoryModal.display(data)};
                break;
        }

        modal.style.display = "flex";
        displayFunk();
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
        transactionsPage.filter();
    },
    
    all: function(){
        home.all();
        transactionsPage.filter();
    },

    render: function(){
        transactionsPage.display();
        home.all();
        transactionsPage.filter();
    }
}

let loader = document.getElementById("loaderContainer");
loader.style.display = "flex";

fetch("/session")
    .then(response => response.json())
    .then((response)=>{
        if(typeof(response) === "string"){
            controller.openModal("enter");
            throw "noUser";
        }else{
            user = new User(response.accounts);
            
            return fetch(`/transactions/${user.getAccount().id}`);
        }
    })
    .then(response => response.json())
    .then((response)=>{

        let account = user.getAccount();
        for(let i = 0; i < response.length; i++){
            account.addTransaction(response[i], false);
        }

        state.render();
    })
    .catch((err)=>{
        if(err !== "noUser"){
            controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
        }
    })
    .finally(()=>{
        loader.style.display = "none";
    });

home.buttons();