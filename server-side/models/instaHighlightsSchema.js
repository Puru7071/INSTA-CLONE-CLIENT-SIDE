const mongoose = require("mongoose") ; 

const highlightSchema = new mongoose.Schema({
    creator : {
        type: mongoose.Schema.Types.ObjectId , 
        ref: "instaUser"
    } , 
    name : {
        type : String
    } , 
    images : [
        {type:mongoose.Schema.Types.ObjectId , ref:"instaStories"}
    ]
} , {
    timestamps: true
}) ; 

const instaHighlights = mongoose.model("instaHighlights" , highlightSchema) ; 
module.exports = instaHighlights ; 
