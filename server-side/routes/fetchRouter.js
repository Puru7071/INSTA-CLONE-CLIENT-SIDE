const express = require("express") ; 
const router = express.Router() ;
const fetchController = require("../controllers/fetchController")

router.get("/profile/:id" , fetchController.fetchProfile)
router.get("/highlights/:id" , fetchController.fetchHighlights) ; 
router.get("/comments/:postID" , fetchController.fetchComments) ; 
router.get("/like-comments-of-a-post/:postID" , fetchController.fetchLikeCommentsCount)
router.get("/home-page-posts" , fetchController.fetchHomePagePosts) ; 
router.get("/home-page-stories/:userId" , fetchController.fetchHomePageStories) ; 
router.get("/all-users" , fetchController.fetchUsers)
router.get("/notifications/:for" , fetchController.fetchNoti) ; 
router.get("/suggestions/:userId" , fetchController.fetchSuggestions) ; 

module.exports = router ; 