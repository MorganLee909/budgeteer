const home = require("./home.js");

const enterModal = require("./modals/enter.js");
const newAccountModal = require("./modals/newAccount.js");
const createIncomeModal = require("./modals/createIncome.js");
const createBillModal = require("./modals/createBill.js");
const createAllowanceModal = require("./modals/createAllowance.js");
const createTransactionModal = require("./modals/createTransaction.js");
const transactionModal = require("./modals/transaction.js");

const User = require("./classes/user.js");

user = null;

controller = {
    openModal: function(modal, data = {}){
        let modals = document.querySelectorAll(".modal");
        for(let i = 0; i < modals.length; i++){
            modals[i].style.display = "none";
        }

        document.getElementById("modalContainer").style.display = "flex";
        switch(modal){
            case "enter":
                document.getElementById("enterModal").style.display = "flex";
                enterModal.display();
                break;
            case "newAccount":
                document.getElementById("newAccountModal").style.display = "flex";
                newAccountModal.display();
                break;
            case "createIncome":
                document.getElementById("createIncomeModal").style.display = "flex";
                createIncomeModal.display();
                break;
            case "createBill":
                document.getElementById('createBillModal').style.display = "flex";
                createBillModal.display();
                break;
            case "createAllowance":
                document.getElementById("createAllowanceModal").style.display = "flex";
                createAllowanceModal.display();
                break;
            case "createTransaction":
                document.getElementById("createTransactionModal").style.display = "flex";
                createTransactionModal.display();
                break;
            case "transaction":
                document.getElementById("transactionModal").style.display = "flex";
                transactionModal.display(data);
                break;
        }
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
        controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
    });