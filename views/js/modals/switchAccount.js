let switchAccount = {
    display: function(){
        let buttons = document.getElementById("switchAccountButtons");

        while(buttons.children.length > 0){
            buttons.removeChild(buttons.firstChild);
        }

        for(let i = 0; i < user.accounts.length; i++){
            if(i === user.currentAccount){
                continue;
            }

            let button = document.createElement("button");
            button.classList.add("button");
            button.classList.add("green");
            button.innerText = user.accounts[i].name;
            button.onclick = ()=>{
                user.setAccount(i);
                controller.closeModal();
            };
            buttons.appendChild(button);
        }
    }
};

module.exports = switchAccount;