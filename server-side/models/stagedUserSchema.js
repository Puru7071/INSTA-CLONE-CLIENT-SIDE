const mongoose = require("mongoose") ; 

const stagedUserSchema = mongoose.Schema({
    OTP : {
        type: String 
    } , 
    email : {
        type: String , 
        required : true , 
        unique : true 
    } , 
    password : {
        type : String , 
        required : true 
    } , 
    name : {
        type : String , 
        required: true 
    } , 
    bio : {
        type: String 
    } , 
    postBlocked : {
        type : Number
    }
} , {
    timestamps: true
}) ; 

stagedUserSchema.index({createdAt: 1},{expireAfterSeconds: 120});

const stagedUsers = mongoose.model("stagedUsers" , stagedUserSchema) ; 

module.exports = stagedUsers ; 
