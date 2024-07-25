const mongoose = require("mongoose");
const multer = require("multer") ; 
const path = require("path") ; 

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    postBlocked: {
        type: Number
    },
    avatar: {
        type: String
    } , 
    followers : [
        {type: mongoose.Schema.Types.ObjectId , ref: "instaUser"}
    ] , 
    following : [
        {type: mongoose.Schema.Types.ObjectId , ref: "instaUser"}
    ] , 
    isPrivate : {
        type : Boolean 
    } , 
    reports : {
        type : Number
    }
}, {
    timestamps: true
})

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + file.originalname);
    },
});

userSchema.statics.uploadAvatar = multer({ storage: storage2 }).single("image");

const instaUser = mongoose.model("instaUser", userSchema);

module.exports = instaUser; 