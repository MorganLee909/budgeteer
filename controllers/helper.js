module.exports = {
    findAccount: function(user, account){
        try{
            for(let i = 0; i < user.accounts.length; i++){
                if(user.accounts[i]._id.toString() === account){
                    return user.accounts[i];
                }
            }

            return null;
        }catch{
            return null;
        }
    },

    generateId: function(length){
        let result = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for(let i = 0; i < 25; i++){
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return result;
    }
}