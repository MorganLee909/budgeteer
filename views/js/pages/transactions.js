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
        document.getElementById("filterTagsInput").oninput = ()=>{this.filter()};
        document.getElementById("filterLocationInput").oninput = ()=>{this.filter()};

        this.updateCategories();
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

    updateCategories: function(){
        let categories = user.getAccount().categories;
        let container = document.getElementById("categoriesLabel");
        let template = document.getElementById("categoryChoice").content.children[0];

        while(container.children.length > 0){
            container.removeChild(container.firstChild);
        }

        let discCategory = template.cloneNode(true);
        discCategory.querySelector(".ccName").innerText = "Discretionary";
        discCategory.onchange = ()=>{this.filter()};
        discCategory._id = "1";
        container.appendChild(discCategory);

        for(let i = 0; i < categories.length; i++){
            let category = template.cloneNode(true);
            category.querySelector(".ccName").innerText = categories[i].name;
            category.onchange = ()=>{this.filter()};
            category._id = categories[i].id;
            container.appendChild(category);
        }
    },

    filter: function(){
        let from = document.getElementById("filterDateFrom").valueAsDate;
        let to = document.getElementById("filterDateTo").valueAsDate;
        let categories = document.getElementById("categoriesLabel").children;

        if(from > to){
            controller.createBanner("Start date must be before end date", "error");
            return;
        }

        from.setHours(0, 0, 0, 0);

        let tags = document.getElementById("filterTagsInput").value.split(",");
        if(tags[tags.length-1] === "") tags.splice(tags.length-1, 1);

        let location = document.getElementById("filterLocationInput").value;

        let options = {
            from: from,
            to: to,
            categories: [],
            tags: tags.length === 0 ? undefined : tags,
            location: location
        };

        for(let i = 0; i < categories.length; i++){
            if(categories[i].children[0].checked) options.categories.push(categories[i]._id);
        }
        if(options.categories.length === 0) options.categories = undefined;

        this.populateTransactions(user.getAccount().getTransactions(options));
    }
}