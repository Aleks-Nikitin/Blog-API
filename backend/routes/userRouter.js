import { Router } from "express";
import userController from "../controllers/userController.js";
const userRouter=Router();

userRouter.get("/", userController.getUsers);
export default userRouter;