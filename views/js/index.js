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