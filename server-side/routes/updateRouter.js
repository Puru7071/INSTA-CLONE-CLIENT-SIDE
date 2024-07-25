const express = require("express"); 
const router = express.Router() ; 
const updateController = require("../controllers/updateController") ; 

router.post("/profile/:id" , updateController.updateProfile) ; 
router.post("/privacy/:id/:isPrivate" , updateController.updatePrivacy) ; 
router.post("/delete/post/:postId/:userId" , updateController.deletePost) ; 

module.exports = router ; 