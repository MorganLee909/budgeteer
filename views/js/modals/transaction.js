let transaction = {
    display: function(transaction){
        document.getElementById("transactionLocation").innerText = transaction.location;
        document.getElementById("transactionCategory").innerText = transaction.category.name;
        document.getElementById("transactionAmount").innerText = `$${transaction.amount}`;
        document.getElementById("transactionDate").innerText = transaction.formattedDate("long");
        document.getElementById("transactionNote").innerText = transaction.note;
        document.getElementById("transactionClose").onclick = ()=>{controller.closeModal()};
        document.getElementById("deleteTransaction").onclick = ()=>{this.delete(transaction)};
    },

    delete: function(transaction){
        fetch(`/transactions/${user.getAccount().id}/${transaction.id}`, {method: "delete"})
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                }else{
                    user.getAccount().removeTransaction(transaction);
                    controller.closeModal();
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            });
    }
};

module.exports = transaction;