import express from 'express';

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
router.get("/posts", getPosts);
router.get("/posts/:id", getPostById);
router.get("/posts/user/:userId", getPostsByUserId);
router.post("/posts/user/:userId", createPostByUserId);
router.delete("/posts/:id", deletePostById);
router.delete("/posts/user/:userId", deletePostsByUserId);
router.put("/posts/:id", updatePostById);

export default router;