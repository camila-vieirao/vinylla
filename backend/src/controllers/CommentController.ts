import pool from "../db";
import { Request, Response } from "express";

export const createComment = async (req: Request, res: Response) => {
  // `commentText`, `createdAt`, `userid`, `postid`
  const userId = (req as any).user.id;
  const { postId, commentText } = req.body;

  const sql =
    "INSERT INTO comments (commentText, createdAt, userid, postid) VALUES (?, NOW(), ?, ?)";

  try {
    const [result] = await pool.query(sql, [commentText, userId, postId]);
    return res.status(201).json({
      message: "Comment created successfully.",
      commentId: (result as any).insertId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  const postId = req.params.postId;

  const sql = `
    SELECT c.id, c.commentText, c.createdAt, c.userid
    FROM comments c
    WHERE c.postid = ?
    ORDER BY c.createdAt DESC
  `;

  try {
    const [rows] = await pool.query(sql, [postId]);
    return res.status(200).json({ comments: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const commentId = req.params.commentId;

  const sql = "DELETE FROM comments WHERE id = ? AND userid = ?";

  try {
    const [result] = await pool.query(sql, [commentId, userId]);
    if ((result as any).affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Comment not found or unauthorized." });
    }
    return res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const commentId = req.params.commentId;
  const { commentText } = req.body;

  const sql = "UPDATE comments SET commentText = ? WHERE id = ? AND userid = ?";

  try {
    const [result] = await pool.query(sql, [commentText, commentId, userId]);
    if ((result as any).affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Comment not found or unauthorized." });
    }
    return res.status(200).json({ message: "Comment updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
