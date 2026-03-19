import { Router } from 'express';
import postController from '../controllers/postController.js';
import authController from '../controllers/authController.js';
const postRouter=Router();

// Public: anyone can view published posts
postRouter.get("/",postController.getPublishedPosts);
postRouter.get("/:userId",postController.getPostsByAuthor)
postRouter.put("/:postId",authController.verifyToken,postController.updatePost);
postRouter.post("/",authController.verifyToken,postController.createPost);
postRouter.delete("/:postId",authController.verifyToken,postController.deletePost);
postRouter.put("/status/:postId",authController.verifyToken,postController.togglePublishedStatus)
export default postRouter;