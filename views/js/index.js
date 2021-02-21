const home = require("./home.js");

const enterModal = require("./modals/enter.js");
const newAccountModal = require("./modals/newAccount.js");
const createIncomeModal = require("./modals/createIncome.js");
const createBillModal = require("./modals/createBill.js");
const createAllowanceModal = require("./modals/createAllowance.js");
const createTransactionModal = require("./modals/createTransaction.js");
const transactionModal = require("./modals/transaction.js");
const switchAccountModal = require("./modals/switchAccount.js");

const User = require("./classes/user.js");

user = null;

controller = {
    openModal: function(modal, data = {}){
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
                enterModal.display();
                break;
            case "newAccount":
                modal = document.getElementById("newAccountModal");
                newAccountModal.display();
                break;
            case "createIncome":
                modal = document.getElementById("createIncomeModal");
                createIncomeModal.display();
                break;
            case "createBill":
                modal = document.getElementById("createBillModal");
                createBillModal.display();
                break;
            case "createAllowance":
                modal = document.getElementById("createAllowanceModal");
                createAllowanceModal.display();
                break;
            case "createTransaction":
                modal = document.getElementById("createTransactionModal");
                createTransactionModal.display();
                break;
            case "transaction":
                modal = document.getElementById("transactionModal");
                transactionModal.display(data);
                break;
            case "switchAccount":
                modal = document.getElementById("switchAccountModal");
                switchAccountModal.display();
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

fetch("/session")
    .then(response => response.json())
    .then((response)=>{
        if(response === null){
            controller.openModal("enter");
        }else{
            user = new User(response.accounts);
            home.all();
        }
        home.buttons();
    })
    .catch((err)=>{
        console.log(err);
        controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
    });