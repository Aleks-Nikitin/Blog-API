import { Router } from "express";
import userController from "../controllers/userController.js";
const userRouter=Router();

userRouter.get("/", userController.verifyToken,userController.getUsers);
userRouter.post("/",userController.createUser)
userRouter.get("/:userId",userController.getUser)
userRouter.post("/login",userController.verifyLogin)
export default userRouter;