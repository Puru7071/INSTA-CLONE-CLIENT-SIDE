const mongoose = require("mongoose") ; 

mongoose.connect("mongodb+srv://PuruBhargava:Blacky%401234@cloudconnect.vmvqour.mongodb.net/?retryWrites=true&w=majority")

const db = mongoose.connection ; 
db.on("error" , (err) => {
    console.log("Something went wrong" , err) ;
}) ; 

db.once("open" , () => {
    console.log("Successfully connected to DB")
}) ; 