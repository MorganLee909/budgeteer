let transaction = {
    display: function(transaction){
        document.getElementById("transactionNoEdit").style.display = "flex";
        document.getElementById("transactionEditForm").style.display = "none";
        document.getElementById("transactionEdit").style.display = "block";

        let tags = "";
        for(let i = 0; i < transaction.tags.length; i++){
            tags += transaction.tags[i] + " ";
        }

        document.getElementById("transactionLocation").innerText = transaction.location;
        document.getElementById("transactionCategory").innerText = transaction.category.name;
        document.getElementById("transactionTags").innerText = tags;
        document.getElementById("transactionAmount").innerText = `$${transaction.getAbsoluteValue()}`;
        document.getElementById("transactionDate").innerText = transaction.formattedDate("long");
        document.getElementById("transactionNote").innerText = transaction.note;
        document.getElementById("transactionClose").onclick = ()=>{controller.closeModal()};
        document.getElementById("deleteTransaction").onclick = ()=>{this.delete(transaction)};

        let editButton = document.getElementById("transactionEdit");
        if(transaction.category.name === "Discretionary"){
            editButton.innerText = "Edit";
            editButton.classList.add("green");
            editButton.classList.remove("red");
            editButton.onclick = ()=>{this.edit(transaction)};
        }else{
            editButton.innerText = "Delete";
            editButton.classList.remove("green");
            editButton.classList.add("red");
            editButton.onclick = ()=>{this.delete(transaction)};
        }
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

        document.getElementById("transactionEdit").style.display = "none";
    },

    submit: function(transaction){
        event.preventDefault();

        let data = {
            transaction: transaction.id,
            tags: document.getElementById("transactionEditTags").value.split(" "),
            amount: document.getElementById("transactionEditAmount").value * 100,
            location: document.getElementById("transactionEditLocation").value,
            date: document.getElementById("transactionEditDate").valueAsDate,
            note: document.getElementById("transactionEditNote").value
        };

        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        fetch("/transactions", {
            method: "put",
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
                let account = user.getAccount();
                account.removeTransaction(transaction);
                let newTransaction = account.addTransaction(response);

                state.transactions();
                this.display(newTransaction);
            }
        })
        .catch((err)=>{
            controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESHE THE PAGE", "error");
        })
        .finally(()=>{
            loader.style.display = "none";
        });
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