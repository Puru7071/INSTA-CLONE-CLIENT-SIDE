const express = require("express") ; 

const cookieParser = require("cookie-parser") ; 

const path = require("path") ; 

const jwt = require('jsonwebtoken');

const multer = require("multer") ; 


const ejs = require("ejs") ; 

const expressLayouts = require("express-ejs-layouts") ; 

const cors = require('cors');

const port = 7777 ; 

const app = express() ; 
const db = require("./config/mongoose") ; 
const bodyParser = require("body-parser");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true})) ; 
app.use(bodyParser.json()); 

app.set("view engine" , "ejs") ; 

app.set("views" , path.join(__dirname , "views")) ; 

app.use(cookieParser()) ; 

app.use(cors()) ; 

app.use("/uploads/posts" ,express.static(__dirname + "/uploads/posts")) ; 
app.use("/uploads/avatars" ,express.static(__dirname + "/uploads/avatars")) ; 
app.use("/uploads/stories" ,express.static(__dirname + "/uploads/stories")) ; 

app.use("/" , require("./routes/basicRouter.js"))

app.listen(port , (error) => {
    if(error){
        console.log("Something went wrong" , error) ; 
    }
    else{
        console.log("Server is up and running on the port no " , port) ; 
    }
}) ; 
