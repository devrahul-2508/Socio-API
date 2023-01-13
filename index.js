require('dotenv').config()
const express = require("express");
const { default: helmet } = require('helmet');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")

app.use(express.json())


let username = process.env.USER_NAME
let password = process.env.PASSWORD
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://"+username+":"+password+"@cluster0.hehvlg7.mongodb.net/socioDB")


app.get("/",(req,res)=>{
    res.send("Hello World")
})


app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)


app.listen(3000,(req,res)=>{
    console.log("Server Started at port 3000");
})