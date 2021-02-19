let createBill = {
    display: function(){
        document.getElementById("createBillForm").onsubmit = ()=>{this.submit()};
        document.getElementById("createBillCancel").onclick = ()=>{
            document.getElementById("createBillName").value = "";
            document.getElementById("createBillAmount").value = "";

            controller.closeModal();
        }
    },

    submit: function(){
        event.preventDefault();

        let data = {
            name: document.getElementById("createBillName").value,
            group: "bill",
            amount: parseInt(document.getElementById("createBillAmount").value * 100),
            account: user.getAccount().id
        }

        fetch("/category/create", {
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
                    user.getAccount().addCategory(response);
                    controller.closeModal();
                }
            })
            .catch((err)=>{
                controller.createBanner("SOMETHING WENT WRONG. PLEASE REFRESH THE PAGE", "error");
            })
    }
}

module.exports = createBill;