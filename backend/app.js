import express from "express";
import 'dotenv/config';
import userRouter from "./routes/userRouter.js";
const app = express();
app.use("/users",userRouter);
app.listen(process.env.PORT,"localhost",(err)=>{
    if(err){
        throw new Error
    }
    console.log("server started...")
})