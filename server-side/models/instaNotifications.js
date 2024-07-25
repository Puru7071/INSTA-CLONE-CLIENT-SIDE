const mongoose = require("mongoose") ; 

const notificationInsta = new mongoose.Schema({
    for : {
        type: mongoose.Schema.Types.ObjectId , 
        ref: "instaUser"
    } ,
    by : {
        type: mongoose.Schema.Types.ObjectId , 
        ref: "instaUser"
    } , 
    type : {
        type : String ,
        required : true 
    } , 
    metadata : {
        type: Object , 
        default: {} 
    }
} , {
    timestamps: true
}) ; 

const instaNoti = mongoose.model("instaNoti" , notificationInsta) ; 
module.exports = instaNoti ; 