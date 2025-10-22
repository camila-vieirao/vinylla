import express from "express";

import {
  getPosts,
  getPostById,
  getPostsByUserId,
  createPostByUserId,
  deletePostById,
  deletePostsByUserId,
  updatePostById,
} from "../controllers/PostController";

const router = express.Router();

// Rota para obter todos os posts
router.get("/posts", getPosts); // x
router.get("/posts/:id", getPostById); // x
router.get("/posts/user/:userId", getPostsByUserId); //x
router.post("/posts/user/:userId", createPostByUserId); // x
router.delete("/posts/:id", deletePostById); // x
router.delete("/posts/user/:userId", deletePostsByUserId);
router.put("/posts/:id", updatePostById);

export default router;
