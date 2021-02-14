const enterModal = require("./modals/enter.js");

user = null;

controller = {
    openModal: function(modal){
        document.getElementById("modalContainer").style.display = "flex";
        switch(modal){
            case "enter":
                document.getElementById("enterModal").style.display = "flex";
                enterModal.display();
                break;
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
            return;
        }

        user = response;
        //open main
    })
    .catch((err)=>{
        //create banner
    });