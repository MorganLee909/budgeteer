let transaction = {
    display: function(transaction){
        document.getElementById("transactionLocation").innerText = transaction.location;
        document.getElementById("transactionCategory").innerText = transaction.category;
        document.getElementById("transactionAmount").innerText = `$${transaction.amount}`;
        document.getElementById("transactionDate").innerText = transaction.formattedDate("long");
        document.getElementById("transactionNote").innerText = transaction.note;
        document.getElementById("transactionClose").onclick = ()=>{controller.closeModal()};
        document.getElementById("deleteTransaction").onclick = ()=>{this.delete(transaction)};
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
                console.log(err);
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            })
            .finally(()=>{
                loader.style.display = "none";
            });
    }
};

module.exports = transaction;