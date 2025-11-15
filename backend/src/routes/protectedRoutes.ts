import { Router } from "express";
import {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  getMe,
  getUserByUsername,
  updateProfilePicture,
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

import {
  createReview,
  deleteReviewById,
} from "../controllers/ReviewController";

import {
  followUser,
  unfollowUser,
  getFollowCounts,
  getFollowers,
  getFollowing,
  isFollowing,
} from "../controllers/FollowController";

const protectedRoutes = Router();

// Aplica o middleware JWT p/ todas rotas abaixo
protectedRoutes.use(authMiddleware);

// Users
protectedRoutes.get("/users", getUsers);
protectedRoutes.get("/profile/:username", getUserByUsername);
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

// Follows
protectedRoutes.post("/follows/:userId", followUser); // Require userId from token
protectedRoutes.delete("/follows/:userId", unfollowUser); // Require userId from token
protectedRoutes.get("/follows/:userId/isFollowing", isFollowing); // Require userId from token

// Profile Picture
protectedRoutes.put(
  "/users/me/picture",
  upload.single("profilePicture"),
  updateProfilePicture
);

export { protectedRoutes };
