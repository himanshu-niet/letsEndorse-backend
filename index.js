const express=require("express")
const app=express()
const bodyParser = require("body-parser");

require("dotenv").config();
const connectDB = require("./database/db");
const PORT=process.env.PORT
const userRouter =require("./routes/userRoute")



connectDB(process.env.MONGO_URL);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get("/",(req,res)=>res.send("for operation endpoint /user"))

app.use("/user",userRouter)

app.listen(PORT,()=>console.log("Server Running on Port-"+PORT))



