const express = require("express");
const urlencoded = require("body-parser").urlencoded;
const app = express()
app.use(urlencoded({ extended : false}));
app.use(express.json())


const mongoose = require("mongoose");
const router = require("./routes/router")

app.use(express.json()) 


mongoose.connect("mongodb+srv://admin:Manikanta2000@cluster0.2ylih5r.mongodb.net/")
.then((conn)=>{
    console.log("Connection established");
})
.catch((err)=>{
    console.log(err.message);
    console.log("Error occured");
})

app.use("/",router);
// app.use((error,req,res) => {
//     statusCode = error.statuscode || 500;
//     message = error.message || "Some error occured";
//     res.json({
//         "status" : "unsuccessfull",
//         "message" : message
//     })
// })

app.listen(3000,()=>{
    console.log("Server started on port 3000");
})
