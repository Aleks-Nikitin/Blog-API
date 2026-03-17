import { Router } from "express";
import userController from "../controllers/userController.js";
import authController from '../controllers/authController.js';
const userRouter=Router();

userRouter.get("/", authController.verifyToken,userController.getUsers);
userRouter.post("/",userController.createUser)
userRouter.get("/:userId",userController.getUser)
//userRouter.put("/:userId",userController.updateUser)
userRouter.post("/login",authController.verifyLogin)
export default userRouter;