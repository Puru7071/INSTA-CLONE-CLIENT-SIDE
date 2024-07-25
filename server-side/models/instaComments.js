const mongoose = require("mongoose")

const instaCommentSchema = new mongoose.Schema({
    content : {
        type : String , 
        required: true 
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId , 
        ref: "instaUser"
    } , 
    post : {
        type: mongoose.Schema.Types.ObjectId , 
        ref : "instaPosts"
    } 
} , {
    timestamps: true 
})

const instaComments = mongoose.model("instaComments" , instaCommentSchema) ; 

module.exports = instaComments ; 