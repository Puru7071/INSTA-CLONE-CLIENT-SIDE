const mongoose = require("mongoose") ; 

const blockedUserSchema = mongoose.Schema({
    email : {
        type : String , 
        required : true , 
        unique : true 
    }
} , {
    timestamps : true 
})

const blockedUsers = mongoose.model("blockedUsers" , blockedUserSchema) ; 
module.exports = blockedUsers ; 