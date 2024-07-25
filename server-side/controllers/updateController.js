const instaUser = require("../models/users");
const instaPost = require("../models/instaPostSchema");
const instaComments = require("../models/instaComments");
const fs = require("fs");
const path = require("path");

module.exports.updateProfile = async (req, res) => {
    let user = await instaUser.findById(req.params.id);

    instaUser.uploadAvatar(req, res, async function (err) {
        if (err) {
            return res.json({ profileUpdate: false, msg: "Update Failed !!" });
        }
        if (req.body.bio) {
            user.bio = req.body.bio
        }
        if (req.file) {
            user.avatar = "http://localhost:7777/" + req.file.path;
        }
        user.save();
        return res.json({ profileUpdate: true, msg: "Profile updated !!", updUrl: user.avatar, updBio: user.bio });
    })
}

module.exports.updatePrivacy = async (req, res) => {
    try {
        const user = await instaUser.findById(req?.params?.id);
        user.isPrivate = req?.params?.isPrivate;
        user.save();
        return res.json({ done: true });
    } catch (err) {
        return res.json({ done: false });
    }
}

module.exports.deletePost = async function (req, res) {
    try {
        const { postId } = req.params;
        let post = await instaPost.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Base directory where the uploads are stored
        const baseDir = path.resolve(__dirname, '../')
        for (let postImagePath of post.postImages) {
            // Extract the relative path after '7777'
            const parts = postImagePath.split('7777');
            const relativePath = parts[1];
            const result = relativePath.startsWith('/') ? relativePath : '/' + relativePath;
            const fullPath = path.join(baseDir, result);

            // Check if file exists before attempting to delete
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            } else {
                console.warn(`File not found: ${fullPath}`);
            }
        }

        await post.deleteOne(); // Use deleteOne instead of remove
        await instaComments.deleteMany({ post: postId });

        return res.json({ done: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};