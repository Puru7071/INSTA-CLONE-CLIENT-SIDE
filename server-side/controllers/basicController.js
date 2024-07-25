const instaUser = require("../models/users");
const stagedUsers = require("../models/stagedUserSchema");
const blockedUsers = require("../models/blockedUserSchema") ; 
const OTPMailer = require("../mailer/OTPMailer") ; 
const jwt = require('jsonwebtoken');

module.exports.createNewUserFn = async (request, response) => {
    const { username, email, password, confirmPassword } = request.body;

    if (password !== confirmPassword) {
        return response.json({
            created: false,
            errMsg: "Password Doesn't Match !"
        })
    }
    try {
        const user = await instaUser.findOne({ email: email }).exec();

        if (user) {
            return response.json({
                created: false,
                errMsg: "User Already exists."
            })
        }

        const dictionary = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
        let OTP = "";
        for (let i = 0; i < 6; i++) {
            OTP = OTP + dictionary[Math.floor(Math.random() * 70)];
        }

        const obj = { OTP, email, password, name: username, bio: "", postBlocked: 0 };

        const stagedUser = await stagedUsers.create(obj)

        const { err } = OTPMailer.sendOTP(OTP, email);

        if (err) {
            return response.json({
                created: false,
                errMsg: "Email might be wrong !"
            })
        }
        return response.json({
            created: true,
            sucMsg: "Check your email for OTP !"
        })
    }
    catch (err) {
        return response.json({
            created: false,
            errMsg: "Something went wrong ! Try later..."
        })
    }

}

module.exports.createAccountNowFn = async (request, response) => {
    const { OTP } = request.body;
    try {
        const checkedOTP = await stagedUsers.findOne({ OTP: OTP });

        if (checkedOTP) {
            const { email, password, bio, name, postBlocked } = checkedOTP;

            const newUser = instaUser.create({ email, password, name, bio, postBlocked , isPrivate: true });
            if (newUser) {
                return response.json({
                    created: true,
                    sucMsg: "Account created successfully !!"
                })
            }
            else {
                response.json({
                    created: false,
                    errMsg: "Something is wrong, Try later..."
                })
            }
        }
        else {
            response.json({
                created: false,
                errMsg: "Not a valid OTP !!"
            })
        }

    } catch (err) {
        console.log(err);
        return response.json({
            created: false,
            errMsg: "Something is wrong, Try later..."
        })

    }
}

module.exports.checkLoginRequest = async (req, res) => {
    const {email, password} = req.body;

    const blockedUser = await blockedUsers.findOne({ email: email }); // Await for the result
    if (blockedUser) {
        return res.json({ log: false , msg : "Your account is blocked !!"});
    }

    const user = await instaUser.findOne({ email: email }); // Await for the result 
    if(!user){
        return res.json({ log: false , msg : "Email not registered !!"});
    }
    if (user.password !== password) { // Corrected the comparison operator
        return res.json({ log: false , msg : "Email or password is incorrect !!"});
    }
    const payload = {
        "id": user.id
    }
    jwt.sign(payload , "This fucking serious Puru !!" , {expiresIn: "2h"} , (err , token) => {
         if(err){
            return res.json({log: false , msg : "Something went wrong !!" })
         }
         else{
            return res.json({token:token , log: true , msg : "Login was successful !!"}) ; 
         }
    }) ; 
}

module.exports.verifyAuth = async  (req , res) => {
    jwt.verify(req.token , "This fucking serious Puru !!"  ,async (err , authData) => {
        console.log(authData) ; 
        console.log("A verified user!!") ; 
        if(err){
            return res.json({
                isAuth : false 
            })
        }
        else{
            const user = await instaUser.findById(authData.id) ; 
            return res.json({
                isAuth : true  , 
                userID: authData.id , 
                username : user.name ,
                avatar : user.avatar
            })
        }
    }) ;
}