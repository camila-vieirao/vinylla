import { Router } from "express";
import { login } from "../controllers/AuthenticateUserController";
import { createUser } from "../controllers/UserController";
import { getCommentsByPost } from "../controllers/CommentController";
import { getPosts } from "../controllers/PostController";
import { getPostsByUserId } from "../controllers/PostController";

const publicRoutes = Router();

// Authentication
publicRoutes.post("/login", login);
publicRoutes.post("/users", createUser);

// Posts
publicRoutes.get("/posts", getPosts);
publicRoutes.get("/posts/user/:userId", getPostsByUserId);

// Comments
publicRoutes.get("/comments/post/:postId", getCommentsByPost);

export { publicRoutes };
