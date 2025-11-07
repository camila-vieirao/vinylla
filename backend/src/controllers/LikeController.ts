import pool from "../db";
import { Request, Response } from "express";

export const likePost = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const postId = req.params.postId;

  const sql = "INSERT INTO likes (userid, postid) VALUES (?, ?)";
  const values = [userId, postId];

  try {
    await pool.query(sql, values);
    res.status(201).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post:", error);

    if ((error as any).code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Post already liked" });
    }

    if ((error as any).code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const postId = req.params.postId;

  const sql = "DELETE FROM likes WHERE userid = ? AND postid = ?";
  const values = [userId, postId];

  try {
    const [result] = await pool.query(sql, values);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: "Like not found" });
    }
    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error("Error unliking post:", error);

    if ((error as any).code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLikesByPostId = async (req: Request, res: Response) => {
  const postId = req.params.postId;

  const sql = "SELECT count(*) as likeCount FROM likes WHERE postid = ?";

  try {
    const [rows] = await pool.query(sql, [postId]);
    const results = rows as any[];

    res.status(200).json({ likeCount: results[0].likeCount });
  } catch (error) {
    console.error("Error fetching likes for post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
