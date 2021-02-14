module.exports = function(){
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(let i = 0; i < 25; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}