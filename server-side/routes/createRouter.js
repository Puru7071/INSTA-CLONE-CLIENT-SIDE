const express = require("express") ; 
const router = express.Router() ; 
const createController = require("../controllers/createController")

router.post("/post",createController.createNewPost);
router.post("/story/:id" , createController.createStory) ; 
router.post("/highlight/:id" , createController.createHighlight) ;
router.post("/comment/:postId/:userId" , createController.createComment) ; 
router.post("/like/:postId/:userId" , createController.toggleLike) ; 
router.post("/story/view/:storyId/:userId" , createController.createStoryView) ; 
router.post("/story/like/:storyId/:userId" , createController.toggleStoryLike) ; 
router.post("/follower/:requestTarget/:requestMaker" , createController.createFollowRequest) ; 
router.post("/link/:forr/:by" , createController.createLink) ; 
router.post("/report/post/:postId/:userId" , createController.reportPost) ; 

module.exports = router ; 