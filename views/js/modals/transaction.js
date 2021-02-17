let transaction = {
    display: function(transaction){
        document.getElementById("transactionLocation").innerText = transaction.location;
        document.getElementById("transactionCategory").innerText = transaction.category.name;
        document.getElementById("transactionAmount").innerText = `$${transaction.amount}`;
        document.getElementById("transactionDate").innerText = transaction.formattedDate("long");
        document.getElementById("transactionNote").innerText = transaction.note;
    }
};

module.exports = transaction;