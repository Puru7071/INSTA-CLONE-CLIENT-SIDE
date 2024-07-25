const mongoose = require("mongoose");
const instaPosts = require("../models/instaPostSchema");
const instaStories = require("../models/instaStorySchema");
const instaHighlights = require("../models/instaHighlightsSchema");
const instaComments = require("../models/instaComments");
const instaNoti = require("../models/instaNotifications");
const blockedUsers = require("../models/blockedUserSchema") ; 
const instaUser = require("../models/users");
const utilityfns = require("./utilityfns");
const path = require("path") ; 
const fs = require("fs"); 

const deletePost = async (postId) => {
    let post = await instaPosts.findById(postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    const baseDir = path.resolve(__dirname, '../')
    for (let postImagePath of post.postImages) {
        const parts = postImagePath.split('7777');
        const relativePath = parts[1];
        const result = relativePath.startsWith('/') ? relativePath : '/' + relativePath;
        const fullPath = path.join(baseDir, result);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        } else {
            console.warn(`File not found: ${fullPath}`);
        }
    }

    await post.deleteOne(); 
    await instaComments.deleteMany({ post: postId });

    return ; 
}

module.exports.createNewPost = (req, res) => {
    try {
        instaPosts.uploadImages(req, res, async (err) => {
            const userId = req.query.id

            let post = await instaPosts.create({
                bio: req.body.bio,
                user: userId,
                postImages: [],
                likes: [],
                dislikes: [],
                reports: [],
                comments: []
            })

            if (req.files) {
                for (let file of req.files) {
                    post.postImages.push("http://localhost:7777/" + file.path);
                }
            }
            post.save();
            console.log(post);
            return res.json({ isPostCreated: true, msg: "Post created successfully !!" });
        })

    } catch (err) {
        return res.json({ isPostCreated: false, msg: "Post was not created try again !!" });
    }
}

module.exports.createStory = (req, res) => {
    try {
        instaStories.makeStory(req, res, async (err) => {
            if (err) {
                return res.json({ isCreated: false, msg: "Something went wrong !!" });
            }
            let data = {
                creator: req.params.id,
                story: "http://localhost:7777/" + req.file.path
            };
            let story = await instaStories.create(data);

            console.log(story);
            return res.json({ isCreated: true, msg: "Story posted !!" })
        })
    }
    catch (error) {
        return res.json({ isCreated: false, msg: "Something went wrong !!" });
    }
}

module.exports.createHighlight = async (req, res) => {
    try {
        const data = {
            creator: req.params.id,
            name: req.body.name,
            images: req.body.highlights
        }
        const highlight = await instaHighlights.create(data);
        await highlight.populate("images");

        const imageData = highlight.images.map(image => ({
            relativeTime: utilityfns.getRelativeTime(image.createdAt),
            url: image.story
        }))

        const finalOutput = {
            name: highlight.name,
            images: imageData,
            highlightRelativeTime: "Just Now"
        }
        return res.json({ highlightCreated: true, msg: "Highlight created !!", highlightNew: finalOutput });
    } catch (err) {
        console.error(err);
        return res.json({ highlightCreated: false, msg: "Something went wrong !!" })
    }
}

module.exports.createComment = async (req, res) => {
    try {
        const data = {
            content: req.body.comment,
            user: req.params.userId,
            post: req.params.postId
        }
        const comment = (await (await instaComments.create(data)).populate("user"));
        let post = await instaPosts.findById(req.params.postId).populate("user");

        post.comments.push(comment)
        post.save();


        const { user, content, createdAt } = comment;
        const userInfo = {
            userID: user._id,
            username: user.name,
            avatar: user.avatar
        }
        const relativeTime = utilityfns.getRelativeTime(createdAt);
        const notificationData = {
            for: post?.user?._id,
            by: user._id,
            type: "POST_COMMENT",
            metadata: {
                msg: "commented on your post",
                requestMakerName: user.name,
                requestMakerId: user._id,
                requestMakerAvatar: user.avatar,
                postFirstImg: post?.postImages?.[0],
                postId: post?._id,
                comment: comment?.content
            }
        }
        const notification = await instaNoti.create(notificationData);

        return res.json({
            msg: "Comment was added !!", commentCreated: true, createdComment: {
                userInfo: userInfo,
                relativeTime: relativeTime,
                content: content
            }
        });
    } catch (err) {
        console.error(err);
        return res.json({ msg: "Something went wrong", commentCreated: false });
    }
}

module.exports.toggleLike = async (req, res) => {
    const post = await instaPosts.findById(req.params.postId);
    const userId = req.params.userId;
    const byUser = await instaUser.findById(userId);

    if (post.likes.find(user => user == userId)) {
        post.likes = post.likes.filter(user => user != userId);
        await post.save();
        const result = await instaNoti.deleteOne({ 'metadata.postId': post?._id, type: "LIKE_POST", by: userId });
        return res.json({ isLiked: false });
    } else {
        post.likes.push(userId);
        await post.save();

        const notificationData = {
            for: post?.user,
            by: userId,
            type: "LIKE_POST",
            metadata: {
                msg: "liked your post",
                requestMakerName: byUser?.name,
                requestMakerId: userId,
                requestMakerAvatar: byUser?.avatar,
                postFirstImg: post?.postImages?.[0],
                postId: post?._id
            }
        }
        const notification = await instaNoti.create(notificationData);
        return res.json({ isLiked: true });
    }

}

module.exports.toggleStoryLike = async (req, res) => {
    try {
        const story = await instaStories.findById(req?.params?.storyId);
        if (story.likes.find(story => story == req?.params?.userId)) {
            story.likes = story.likes.filter(story => story != req?.params?.userId);
            await story.save();
            console.log(story);
            return res.json({ isLiked: false });
        } else {
            story.likes.push(req?.params?.userId);
            await story.save();
            console.log(story);
            return res.json({ isLiked: true });
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports.createStoryView = async (req, res) => {
    const story = await instaStories.findById(req?.params?.storyId);
    if (!story.views.includes(req?.params?.userId)) {
        story.views.push(req?.params?.userId);
        story.save();
        console.log(story);
        return res.json({ msg: "View saved !!" });
    }
    return res.json({ msg: "Already there !!" });
}

module.exports.createFollowRequest = async (req, res) => {
    const { requestTarget, requestMaker } = req.params;

    const notificationCheck = await instaNoti.find({ for:requestTarget,by: requestMaker, type: "FOLLOW_REQ" });
    if (notificationCheck.length !== 0) {
        return res.json({ done: false, msg: "Request Already sent !!" });
    }

    const requestMakerInfo = await instaUser.findById(requestMaker);
    const notificationData = {
        for: requestTarget,
        by: requestMaker,
        type: "FOLLOW_REQ",
        metadata: {
            msg: "requested to follow you.",
            requestMakerName: requestMakerInfo?.name,
            requestMakerId: requestMaker,
            requestMakerAvatar: requestMakerInfo?.avatar
        }
    }
    const notification = await instaNoti.create(notificationData);

    if (notification) {
        return res.json({
            msg: "Request sent successfully !!",
            done: true
        })
    }
    return res.json({
        msg: "Something went wrong...",
        done: false
    })
}

module.exports.createLink = async (req, res) => {
    const { forr, by } = req.params;

    let forrUser = await instaUser.findById(forr);
    forrUser.followers.push(by);
    console.log(forrUser);

    let byUser = await instaUser.findById(by);
    byUser.following.push(forr);
    console.log(byUser);

    byUser.save();
    forrUser.save();

    const result = await instaNoti.deleteOne({ by: by, type: "FOLLOW_REQ" });
    console.log(result);

    return res.json({ msg: true });

}

module.exports.reportPost = async (req, res) => {
    const { postId, userId } = req?.params;
    const post = await instaPosts.findById(postId);
    if(!post?.reports?.includes(userId)) post?.reports?.push(userId);
    else return res.json({done: true}) ; 

    if (post?.reports?.length >= 2) {
        deletePost(postId) ; 
        const user = await instaUser?.findById(post?.user) ; 

        if(user?.reports) user.reports += 1 ; 
        else user.reports = 1 ; 

        let blocked ; 
        if(user.reports >= 5) blocked = await blockedUsers.create({email : user?.email}) ; 

        user.save() ; 
        console.log("this is user:" , user) ; 
    }
    else post.save() ; 
    console.log(post);
    const notificationData = {
        for: post?.user,
        by: userId,
        type: "REPORT_POST",
        metadata: {
            msg: "Your post has been reported .",
            postFirstImg: post?.postImages?.[0],
            postId: post?._id , 
            postReports : post?.reports?.length
        }
    }
    const notification = await instaNoti.create(notificationData);
    return res.json({ done: true });
}