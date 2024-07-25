const express = require("express");
const router = express.Router();
const basicControllers = require("../controllers/basicController");

const verifyToken = (req , res , next) => {
    const bearerHeader = req.headers['authorization'] ; 
    
    if(typeof bearerHeader !=='undefined'){
        const bearer = bearerHeader.split(' ') ; 
        const bearerToken = bearer[1] ; 
        req.token = bearerToken ; 
        next() ; 
    }

    else return res.json({error : false}) ; 
}

router.post("/create-new-account", basicControllers.createNewUserFn);
router.post("/validate-OTP", basicControllers.createAccountNowFn);
router.post("/login-request" , basicControllers.checkLoginRequest) ; 
router.post("/is-auth-user" , verifyToken , basicControllers.verifyAuth) ;  

router.use("/create" , require("./createRouter")); 
router.use("/update" , require("./updateRouter")) ; 
router.use("/fetch" , require("./fetchRouter")) ; 
module.exports = router;
