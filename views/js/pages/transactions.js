module.exports = {
    display: function(){
        let fromDate = document.getElementById("filterDateFrom");
        let toDate = document.getElementById("filterDateTo");

        let from = new Date();
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        let options = {from: from, to: new Date()};
        this.populateTransactions(user.getAccount().getTransactions(options));

        options.from.setHours(0, Math.abs(options.from.getTimezoneOffset()), 0, 0);
        fromDate.valueAsDate = options.from;
        toDate.valueAsDate = options.to;

        fromDate.onchange = ()=>{this.filter()};
        toDate.onchange = ()=>{this.filter()};
    },

    populateTransactions: function(transactions){
        let container = document.getElementById("searchTransactionsBody");
        let template = document.getElementById("tableTransaction").content.children[0];

        let dateOptions = {
            year: "numeric",
            month: "short",
            day: "numeric"
        };

        while(container.children.length > 0){
            container.removeChild(container.firstChild);
        }

        for(let i = 0; i < transactions.length; i++){
            let transaction = template.cloneNode(true);
            transaction.querySelector(".ttDate").innerText = transactions[i].date.toLocaleDateString("en-US", dateOptions);
            transaction.querySelector(".ttCategory").innerText = transactions[i].category.name;
            transaction.querySelector(".ttLocation").innerText = transactions[i].location;
            transaction.querySelector(".ttAmount").innerText = `$${transactions[i].amount.toFixed(2)}`;
            container.appendChild(transaction);
        }
    },

    filter: function(){
        let from = document.getElementById("filterDateFrom").valueAsDate;
        let to = document.getElementById("filterDateTo").valueAsDate;

        if(from > to){
            controller.createBanner("Start date must be before end date", "error");
            return;
        }

        let options = {
            from: from,
            to: to
        };

        this.populateTransactions(user.getAccount().getTransactions(options));
    }
}