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
            category.querySelector(".restoreAmount").innerText = categories[i].amount;
            container.appendChild(category);
        }
    }
}