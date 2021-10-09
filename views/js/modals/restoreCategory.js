module.exports = {
    display: function(categories){
        document.getElementById("restoreTitle").innerText = `Restore a previous ${categories[0].constructor.name}`;
        let container = document.getElementById("restoreContainer");
        let template = document.getElementById("restoreCategory").content.children[0];

        while(container.children.length > 0){
            container.removeChild(container.firstChild);
        }
        
        for(let i = 0; i < categories.length; i++){
            let category = template.cloneNode(true);
            category.querySelector(".restoreName").innerText = categories[i].name;
            category.querySelector(".restoreAmount").innerText = `$${categories[i].amount.toFixed(2)}`;
            category.onclick = ()=>{this.restore(categories[i])};
            container.appendChild(category);
        }
    },

    restore: function(category){
        let loader = document.getElementById("loaderContainer");
        loader.style.display = "flex";

        fetch(`/categories/${user.getAccount().id}/remove/${category.id}`)
            .then(response => response.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                }else{
                    category.removed = false;
                    console.time("all");
                    state.all();
                    console.timeEnd("all");
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