const nodemailer = require("../config/nodemailer") ; 

module.exports.sendOTP =(OTP , userEmail) => {
    const htmlContent = nodemailer.renderTemplate({OTP : OTP} , "OTPMail.ejs") ; 
    const error = false ; 

    nodemailer.transporter.sendMail({
        from : 'puru.bhargava011@gmail.com' , 
        to : userEmail , 
        subject : "OTP for Verfication" , 
        html : htmlContent
    } , (err , info) => {
        if(err){
            console.log("OTP Not Send !! " , err) ; 
            error = true ; 
            return ; 
        }
        else{
            console.log("OTP Sent !!") ; 
        }
    }) ; 

    return {err : error} ; 
}