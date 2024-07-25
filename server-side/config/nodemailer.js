const nodemailer = require("nodemailer") ; 
const ejs = require("ejs") ; 
const path = require("path") ; 
let smtp = {
    service : 'gmail' , 
    host : 'smtp.gmail.com' , 
    port : 587 , 
    secure : false , 
    auth : {
        user: 'puru.bhargava011@gmail.com' , 
        pass : 'fsenrnvmxdbgiorh'
    } 
}

let transporter = nodemailer.createTransport(smtp) ; 

let renderTemplate = (data , relativePath) => {
    let mailHTML ; 

    ejs.renderFile(path.join(__dirname , "../views/mailer" , relativePath) , data , (err , template)=>{
        if(err){
            console.log(`Something went wrong : ${err}`) ; 
            return ; 
        }
        mailHTML = template ; 
    }) ; 
    return mailHTML ; 
} ; 

module.exports = {
    renderTemplate : renderTemplate , 
    transporter : transporter 
} ; 