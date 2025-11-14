import { Router } from "express";
import {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  getMe,
} from "../controllers/UserController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import {
  getPosts,
  getPostById,
  getPostsByUserId,
  createPostByUserId,
  deletePostById,
  deletePostsByUserId,
  updatePostById,
} from "../controllers/PostController";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  updateComment,
} from "../controllers/CommentController";
import { upload } from "../middlewares/UploadMiddleware";

import {
  addTagToUser,
  removeTagFromUser,
  getTagsPerUser,
  getMyTags,
} from "../controllers/TagController";

import { likePost, unlikePost } from "../controllers/LikeController";

import { createReview, deleteReviewById } from "../controllers/ReviewController";

const protectedRoutes = Router();

// Aplica o middleware JWT p/ todas rotas abaixo
protectedRoutes.use(authMiddleware);

// Users
protectedRoutes.get("/users", getUsers);
protectedRoutes.get("/users/me", getMe);
protectedRoutes.get("/users/:id", getUserById);
protectedRoutes.delete("/users/:id", deleteUser);
protectedRoutes.put("/users/:id", updateUser);

// Posts
protectedRoutes.get("/posts/:id", getPostById);
protectedRoutes.post("/posts", upload.single("postImg"), createPostByUserId); // Require userId from token
protectedRoutes.delete("/posts/:id", deletePostById);
protectedRoutes.delete("/posts", deletePostsByUserId); // Require userId from token
protectedRoutes.put("/posts/:id", updatePostById);

// Comments
protectedRoutes.post("/comments/post/:postId", createComment); // Require userId from token
protectedRoutes.delete("/comments/:commentId", deleteComment); // Require userId from token
protectedRoutes.put("/comments/:commentId", updateComment); // Require userId from token

// Tags
protectedRoutes.get("/users/me/tags", getMyTags);
protectedRoutes.post("/users/tags/:tagId", addTagToUser); // Require userId from token
protectedRoutes.delete("/users/tags/:tagId", removeTagFromUser); // Require userId from token
protectedRoutes.get("/users/:userId/tags", getTagsPerUser);
// Likes
protectedRoutes.post("/posts/:postId/like", likePost); // Require userId from token
protectedRoutes.delete("/posts/:postId/like", unlikePost); // Require userId from token

// Reviews
protectedRoutes.post("/reviews/:albumId", createReview); // Require userId from token)
protectedRoutes.delete("/reviews/:reviewId", deleteReviewById); // Require userId from token


export { protectedRoutes };
