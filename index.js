const express=require("express")
const app=express()
require("dotenv").config();
const connectDB = require("./database/db");
const PORT=process.env.PORT
const userRouter =require("./routes/userRoute")



connectDB(process.env.MONGO_URL);

app.use(express.json());
app.use(express.urlencoded()); 

app.get("/",(req,res)=>res.send("for operation endpoint /user"))

app.use("/user",userRouter)

app.listen(PORT,()=>console.log("Server Running on Port-"+PORT))



