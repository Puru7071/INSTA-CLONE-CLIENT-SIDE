const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const instaPostSchema = mongoose.Schema({
    bio: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "instaUser",
        required: true
    },
    postImages: [
        { type: String }
    ],
    likes: [
        { type: mongoose.Schema.Types.ObjectId, ref: "instaUser" }
    ],
    dislikes: [
        { type: mongoose.Schema.Types.ObjectId, ref: "instaUser" }
    ],
    reports: [
        { type: mongoose.Schema.Types.ObjectId, ref: "instaUser" }
    ],
    comments: [
        {type: mongoose.Schema.Types.ObjectId , ref:"instaComments"}
    ]
}, {
    timestamps: true
});

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/posts');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + file.originalname);
    },
});

instaPostSchema.statics.uploadImages = multer({ storage: storage1 }).array("images", 10);

const instaPosts = mongoose.model("instaPosts", instaPostSchema);

module.exports = instaPosts; 