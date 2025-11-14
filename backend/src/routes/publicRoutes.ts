import { Router } from "express";
import { login } from "../controllers/AuthenticateUserController";
import { createUser } from "../controllers/UserController";
import { getCommentsByPost } from "../controllers/CommentController";
import { getPosts } from "../controllers/PostController";
import { getPostsByUserId } from "../controllers/PostController";
import { getTags } from "../controllers/TagController";
import { getTagById } from "../controllers/TagController";
import { getLikesByPostId } from "../controllers/LikeController";
import { getReviewsByUserId } from "../controllers/ReviewController";

const publicRoutes = Router();

// Authentication
publicRoutes.post("/login", login);
publicRoutes.post("/users", createUser);

// Posts
publicRoutes.get("/posts", getPosts);
publicRoutes.get("/posts/user/:userId", getPostsByUserId);

// Comments
publicRoutes.get("/comments/post/:postId", getCommentsByPost);

// Tags
publicRoutes.get("/tags", getTags);
publicRoutes.get("/tags/:id", getTagById);

// Likes
publicRoutes.get("/likes/post/:postId", getLikesByPostId);

// Reviews
publicRoutes.get("/reviews/user/:userId", getReviewsByUserId);

export { publicRoutes };
