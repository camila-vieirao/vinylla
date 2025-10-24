import { Router } from "express";
import { login } from "../controllers/AuthenticateUserController";
import { createUser } from "../controllers/UserController";
import { getCommentsByPost } from "../controllers/CommentController";

const publicRoutes = Router();

publicRoutes.post("/login", login);
publicRoutes.post("/users", createUser);

// Comments
publicRoutes.get("/comments/post/:postId", getCommentsByPost);

export { publicRoutes };
