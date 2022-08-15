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

        switch(modal){
            case "enter":
                modal = document.getElementById("enterModal");
                displayFunk = enterModal.display.bind(enterModal);
                break;
            case "newAccount":
                modal = document.getElementById("newAccountModal");
                displayFunk = newAccountModal.display.bind(newAccountModal);
                break;
            case "createIncome":
                modal = document.getElementById("createIncomeModal");
                displayFunk = createIncomeModal.display.bind(createIncomeModal);
                break;
            case "createBill":
                modal = document.getElementById("createBillModal");
                displayFunk = createBillModal.display.bind(createBillModal);
                break;
            case "createAllowance":
                modal = document.getElementById("createAllowanceModal");
                displayFunk = createAllowanceModal.display.bind(createAllowanceModal);
                break;
            case "createTransaction":
                modal = document.getElementById("createTransactionModal");
                displayFunk = ()=>{createTransactionModal.display(data)};
                displayFunk = displayFunk.bind(createTransactionModal);
                break;
            case "transaction":
                modal = document.getElementById("transactionModal");
                displayFunk = ()=>{transactionModal.display(data)};
                displayFunk = displayFunk.bind(transactionModal);
                break;
            case "switchAccount":
                modal = document.getElementById("switchAccountModal");
                displayFunk = switchAccountModal.display.bind(switchAccountModal);
                displayFunk = displayFunk.bind(switchAccountModal);
                break;
            case "help":
                modal = document.getElementById("helpModal");
                displayFunk = helpModal.display.bind(helpModal);
                break;
            case "transfer":
                if(user.accounts.length === 1){
                    controller.createBanner("No other account to transfer to", "error");
                    return;
                }
                modal = document.getElementById("transferModal");
                displayFunk = transferModal.display.bind(transferModal);
                break;
            case "restoreCategory":
                let categories = user
                    .getAccount()
                    .categories
                    .filter(c => c.constructor.name === data && c.removed === true);
                if(categories.length > 0){
                    modal = document.getElementById("restoreCategoryModal");
                    displayFunk = ()=>{restoreModal.display(categories)};
                    displayFunk = displayFunk.bind(restoreModal);
                }else{
                    controller.openModal(`create${data}`);
                    return;
                }
                break;
            case "editCategory":
                modal = document.getElementById("editCategoryModal");
                displayFunk = ()=>{editCategoryModal.display(data)};
                displayFunk = displayFunk.bind(editCategoryModal);
                break;
        }

        let container = document.getElementById("modalContainer");
        container.style.display = "flex";
        if(user !== null && user.getAccount() !== undefined){
            container.onclick = ()=>{controller.closeModal()};
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
            throw "enter";
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
        switch(err){
            case "error":
                controller.createBanner("INCORRECT EMAIL OR PASSWORD", "error");
                break;
            case "enter":
                controller.openModal("enter");
                break;
            default:
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
        }
    })
    .finally(()=>{
        loader.style.display = "none";
    });

home.buttons();
document.onkeydown = (e)=>{
    if(!user) return;
    if(e.keyCode === 27) controller.closeModal();
}