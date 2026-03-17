import { Router } from "express";
import commentController from "../controllers/commentController.js";
import authController from "../controllers/authController.js";
const commentRouter =Router();
commentRouter.post("/:postId",authController.verifyToken,commentController.createComment)
commentRouter.get("/users/:userId",commentController.getCommentsByUser)
commentRouter.get("/:postId",commentController.getCommentsByPost)
commentRouter.put("/:commentId",authController.verifyToken,commentController.updateComment)
commentRouter.delete("/:commentId",authController.verifyToken,commentController.updateComment)
export default commentRouter;