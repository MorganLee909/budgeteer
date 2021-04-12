let transaction = {
    display: function(transaction){
        document.getElementById("transactionNoEdit").style.display = "flex";
        document.getElementById("transactionEditForm").style.display = "none";

        let tags = "";
        for(let i = 0; i < transaction.tags.length; i++){
            tags += transaction.tags[i] + " ";
        }

        document.getElementById("transactionLocation").innerText = transaction.location;
        document.getElementById("transactionCategory").innerText = transaction.category;
        document.getElementById("transactionTags").innerText = tags;
        document.getElementById("transactionAmount").innerText = `$${transaction.getAbsoluteValue()}`;
        document.getElementById("transactionDate").innerText = transaction.formattedDate("long");
        document.getElementById("transactionNote").innerText = transaction.note;
        document.getElementById("transactionClose").onclick = ()=>{controller.closeModal()};
        document.getElementById("transactionEdit").onclick = ()=>{this.edit(transaction)};
        document.getElementById("deleteTransaction").onclick = ()=>{this.delete(transaction)};
    },

    edit: function(transaction){
        document.getElementById("transactionEditForm").onsubmit = ()=>{this.submit(transaction)};
        document.getElementById("transactionNoEdit").style.display = "none";
        document.getElementById("transactionEditForm").style.display = "flex";

        let tags = "";
        for(let i = 0; i < transaction.tags.length; i++){
            tags += transaction.tags[i] + " ";
        }

        document.getElementById("transactionEditDate").valueAsDate = transaction.date;
        document.getElementById("transactionEditLocation").value = transaction.location;
        document.getElementById("transactionEditTags").value = tags;
        document.getElementById("transactionEditAmount").value = transaction.getAbsoluteValue();
        document.getElementById("transactionEditNote").value = transaction.note;
    },

    submit: function(transaction){
        console.log(transaction);
    },

    delete: function(transaction){
        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        fetch(`/transactions/${user.getAccount().id}/${transaction.id}`, {method: "delete"})
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                }else{
                    user.getAccount().removeTransaction(transaction);
                    state.transactions();
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
};

module.exports = transaction;