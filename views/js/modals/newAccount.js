let newAccount = {
    display: function(){
        let form = document.getElementById("newAccountForm");
        form.onsubmit = ()=>{this.submit()};
        form.reset();

        let cancelButton = document.getElementById("newAccountCancel");
        if(user.getAccount() === undefined){
            cancelButton.style.display = "none";
        }else{
            cancelButton.style.display = "block";
            cancelButton.onclick = ()=>{controller.closeModal()};
        }
    },

    submit: function(){
        event.preventDefault();

        let data = {
            name: document.getElementById("newAccountName").value,
            balance: parseInt(document.getElementById("newAccountBalance").value * 100)
        };

        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        fetch("/account/create", {
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
                    user.addAccount(response);
                    controller.closeModal();
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            })
            .finally(()=>{
                loader.style.display = "none";
            });
    }
}

module.exports = newAccount;