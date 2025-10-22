import { Router } from "express";
import {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
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

const protectedRoutes = Router();

// Aplica o middleware JWT p/ todas rotas abaixo
protectedRoutes.use(authMiddleware);

// Users
protectedRoutes.get("/users", getUsers);
protectedRoutes.get("/users/:id", getUserById);
protectedRoutes.delete("/users/:id", deleteUser);
protectedRoutes.put("/users/:id", updateUser);

// Posts
protectedRoutes.get("/posts", getPosts);
protectedRoutes.get("/posts/:id", getPostById);
protectedRoutes.get("/posts/user/:userId", getPostsByUserId);
protectedRoutes.post("/posts/user/:userId", createPostByUserId);
protectedRoutes.delete("/posts/:id", deletePostById);
protectedRoutes.delete("/posts/user/:userId", deletePostsByUserId);
protectedRoutes.put("/posts/:id", updatePostById);

export { protectedRoutes };
