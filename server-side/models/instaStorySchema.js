const mongoose = require("mongoose") ; 
const multer = require("multer") ; 

const instaStorySchema = new mongoose.Schema({
    creator : {
        type: mongoose.Schema.Types.ObjectId , 
        ref:  "instaUser"
    } , 
    story : {
        type: String
    } , 
    views : [
        { type: mongoose.Schema.Types.ObjectId , ref: "instaUser"}
    ] , 
    likes : [
        { type: mongoose.Schema.Types.ObjectId , ref: "instaUser"} 
    ]
} , {
    timestamps: true 
})

const storage3 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/stories');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + file.originalname);
    },
});

instaStorySchema.statics.makeStory = multer({ storage: storage3 }).single("story");

const instaStories = mongoose.model("instaStories" , instaStorySchema) ; 

module.exports = instaStories ; 
