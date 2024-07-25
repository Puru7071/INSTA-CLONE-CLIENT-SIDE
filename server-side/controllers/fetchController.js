const instaUser = require("../models/users");
const instaPosts = require("../models/instaPostSchema");
const instaComments = require("../models/instaComments");
const instaStories = require("../models/instaStorySchema");
const instaHighlights = require("../models/instaHighlightsSchema");
const instaNoti = require("../models/instaNotifications") ; 
const utilityfns = require("./utilityfns");

module.exports.fetchProfile = async (req, res) => {
    try {
        const user = await instaUser.findById(req.params.id);
        const allStories = await instaStories.find({ creator: req.params.id });
        const posts = await instaPosts.find({ user: req.params.id }).populate({
            path: "comments",
            populate: {
                path: "user"
            }
        });
        const allStoriesReqData = allStories.map((story) => ({
            url: story.story,
            id: story._id,
            date: utilityfns.formatDate(story.createdAt),
            relativeTime: utilityfns.getRelativeTime(story.createdAt) , 
            likes : story.likes
        }))
        const activeStories = allStories.filter(story => utilityfns.isWithin24Hours(story.createdAt));
        const stories = activeStories.map(story => ({
            url: story.story,
            date: utilityfns.formatDate(story.createdAt),
            relativeTime: utilityfns.getRelativeTime(story.createdAt) , 
            id : story._id , 
            likes : story.likes
        }));

        const filteredPosts = posts.map((post) => {
            const date = utilityfns.formatDate(post.createdAt);
            const relativeTime = utilityfns.getRelativeTime(post.createdAt);
            const data = {
                id: post.id,
                description: post.bio,
                postImage: post.postImages,
                likes: post.likes,
                dislikes: post.dislikes,
                reports: post.reports,
                comments: post.comments,
                date: date,
                relativeTime: relativeTime
            }
            return data;
        });
        const finalPosts = filteredPosts.reverse();
        const userInfo = {
            bio: user.bio,
            name: user.name,
            avatar: user.avatar,
            following: user.following,
            followers: user.followers , 
            isPrivate : user?.isPrivate , 
            id: user?._id
        }

        return res.json({ userInfo, posts: finalPosts, activeStories: stories, allStories: allStoriesReqData.reverse() });
    } catch (err) {
        console.log(err);
        return res.json({ msg: "Something went wrong !!" });
    }
}

module.exports.fetchHighlights = async (req, res) => {
    const highlights = await instaHighlights.find({ creator: req.params.id }).populate("images");

    const output = highlights.map(highlight => {
        const imageData = highlight.images.map(image => ({
            relativeTime: utilityfns.getRelativeTime(image.createdAt),
            url: image.story
        }));
        const data = {
            name: highlight.name,
            images: imageData,
            highlightRelativeTime: utilityfns.getRelativeTime(highlight.createdAt)
        }
        return data;
    });

    return res.json({ allhighlights: output.reverse() });
}

module.exports.fetchComments = async (req, res) => {
    try {
        const comments = await instaComments.find({ post: req.params.postID }).populate("user");

        const finalComments = comments.map(comment => {
            const { user, content, createdAt } = comment;
            const userInfo = {
                userID: user._id,
                username: user.name,
                avatar: user.avatar
            }
            const relativeTime = utilityfns.getRelativeTime(createdAt);
            return {
                userInfo: userInfo,
                relativeTime: relativeTime,
                content: content
            };
        });
        return res.json({ msg: "Fetched", commentsFetched: true, fetchedComments: finalComments.reverse() });
    } catch (err) {
        return res.json({ msg: "Comments failed to load", commentsFetched: false })
    }

}

module.exports.fetchHomePagePosts = async (req, res) => {
    try {
        const posts = await instaPosts.find({}).populate("user");

        const postsData = await Promise.all(posts.map(async (item) => {
            const post = {
                description: item?.bio,
                id: item?._id,
                relativeTime: utilityfns.getRelativeTime(item?.createdAt),
                date: utilityfns.formatDate(item?.createdAt),
                postImage: item?.postImages,
                likes: item?.likes,
                comments: item?.comments
            };
            const first3Posts = await instaPosts.find({ user: item?.user?._id })
                                   .sort({ createdAt: -1 })
                                   .limit(3);
            const totalPosts = await instaPosts.countDocuments({user: item?.user?._id }) ; 
            let i = 0 ; let profileImages = [] ; 
            for(let post of first3Posts){
                profileImages.push(post.postImages[0]) ; 
                i = i + 1 ; 
                if(i === 3) break ; 
            }


            const user = {
                id: item?.user?._id,
                avatar: item?.user?.avatar,
                name: item?.user?.name , 
                profileImages:profileImages , 
                bio : item?.user?.bio , 
                posts : totalPosts , 
                followers : item?.user?.followers , 
                following : item?.user?.following , 
                isPrivate : item?.user?.isPrivate
            };
            return {
                post: post,
                user: user
            };
        }));
        return res.json({ isHomeFetched: true, posts: postsData.reverse() });

    } catch (error) {
        return res.json({ isHomeFetched: false, msg: "Home page reload failed" });
    }
};

module.exports.fetchHomePageStories = async(req , res) => {
    try{
        const allStories = await instaStories.find({}).populate("creator");
        const activeStories = allStories.filter(story => utilityfns.isWithin24Hours(story.createdAt) && !story?.views?.includes(req?.params?.userId) );
        const storiesWithUser = activeStories.map(story => {
            return {
                userId : story.creator._id , 
                followers : story?.creator?.followers , 
                userAvatar : story?.creator?.avatar , 
                username  : story?.creator?.name , 
                isPrivate : story?.creator?.isPrivate , 
                story : story?.story , 
                relativeTime : utilityfns.getRelativeTime(story?.createdAt) , 
                view : false , 
                storyId : story._id , 
                likes : story.likes
            }
        }) ;
        const groupStories = storiesWithUser.reduce((acc , story) => {
            const id = story.userId ; 
            if(acc.has(id)){
                acc.get(id).push(story) ; 
            }
            else{
                acc.set(id, [story]) ; 
            }
            return acc ; 
        } , new Map()) ;
        console.log(groupStories) ; 
        const output =  [...groupStories.values()] ; 

        return res.json({storiesGroupByUser : output}) ;         
    }catch(err){
        console.log(err) ; 
        return res.json({msg: "Something went wrong !!"}) ; 
    }
}

module.exports.fetchLikeCommentsCount = async(req , res) => {
    let post =  await instaPosts.findById(req.params.postID) ;
    return res.json({likes : post.likes , comments : post.comments}) 
}

module.exports.fetchUsers = async(req, res) => {
    const users = await instaUser.find({}) ; 
    const usersWithInfo = users.map((user) => ({
        id : user?._id , 
        avatar : user?.avatar , 
        name : user?.name , 
        bio : user?.bio , 
        followers : user?.followers
    }))
    console.log(users)
    return res.json({users : usersWithInfo})

}

module.exports.fetchNoti = async (req, res) => {
    try {
        const notifications = await instaNoti.find({ for: req.params.for });

        const notificationTransformed = notifications.map(notification => {
            const notificationObj = notification.toObject(); // Convert to plain JS object
            return {
                ...notificationObj,
                relativeTime: utilityfns.getRelativeTime(notification.createdAt)
            };
        });

        console.log(notificationTransformed);
        return res.json({ notifications: notificationTransformed.reverse() });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.fetchSuggestions = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Sample 7 random users from the database
        const users = await instaUser.aggregate([
            { $sample: { size: 7 } }
        ]);
        
        // Filter out users who are already followed by the given user
        const filteredUsers = users.filter(user => !user.followers.includes(userId));

        const usersReqData = filteredUsers.map(user => ({
            id: user._id,
            avatar: user.avatar,
            bio: user.bio,
            name: user.name
        }));

        return res.json({ suggestions: usersReqData });
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


