let enter = {
    display: function(){
        document.getElementById("registerForm").onsubmit = ()=>{this.register()};
        document.getElementById("loginform").onsubmit = ()=>{this.login()};
    },

    register: function(){
        event.preventDefault();

        let data = {
            email: document.getElementById("registerEmail").value,
            password: document.getElementById("registerPass").value,
            confirmPassword: document.getElementById("registerConfirm").value
        }

        if(data.password !== data.confirmPassword){
            return;
        }

        fetch("/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(response = response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    throw response;
                }

                user = response;
                //open create account modal
            })
            .catch((err)=>{
                //createBanner
            })
    }
}

module.exports = enter;