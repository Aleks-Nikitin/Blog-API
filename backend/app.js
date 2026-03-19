import express from "express";
import 'dotenv/config';
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import commentRouter from "./routes/commentRouter.js";
import cors from "cors"
const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use("/users",userRouter);
app.use("/posts",postRouter)
app.use("/comments",commentRouter)
app.listen(process.env.PORT,"0.0.0.0",(err)=>{
    if(err){
        throw new Error
    }
    console.log("server started...")
})