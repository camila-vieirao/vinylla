import pool from "../db";
import { Request, Response } from "express";

// Get de todos os Posts do DB. Útil para não precisarmos pensar em um
// algoritmo de paginação agora.
export const getPosts = async (req: Request, res: Response) => {
  const sql = "SELECT * FROM posts";

  try {
    const [rows] = await pool.query(sql);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Get de um Post específico pelo ID
export const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const sql = "SELECT * FROM posts WHERE id = ?";

  try {
    const [rows] = await pool.query(sql, [postId]);

    const results = rows as any[];
    if (results.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json(results[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch post" });
  }
};

// Get de todos os Posts de um usuário específico pelo ID do usuário
export const getPostsByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM posts WHERE userid = ?";

  try {
    const [rows] = await pool.query(sql, [userId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch posts for user" });
  }
};

export const createPostByUserId = async (req: Request, res: Response) => {
  // Campos: postText` VARCHAR(200) NULL,
  // `postImg` VARCHAR(100) NULL,
  // `userid` INT NOT NULL,
  // `postMention` VARCHAR(200) NULL,
  // `createdAt` DATETIME NULL,

  const userId = req.params.userId;
  console.log(userId);
  const { postText, postImg, postMention } = req.body;

  const sql = `
    INSERT INTO posts (postText, postImg, userid, postMention, createdAt)
    VALUES (?, ?, ?, ?, NOW())
  `;

  try {
    const [result] = await pool.query(sql, [
      postText,
      postImg,
      userId,
      postMention,
    ]);
    res
      .status(201)
      .json({ message: "Post created", postId: (result as any).insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const deletePostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const sql = "DELETE FROM posts WHERE id = ?";

  try {
    const [result] = await pool.query(sql, [postId]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// Caso queiramos deletar um usuário, a chave estrangeira dos posts vai barrar. Portanto

export const deletePostsByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const sql = "DELETE FROM posts WHERE userid = ?";

  try {
    await pool.query(sql, [userId]);
    res.status(200).json({ message: "Posts deleted for user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete posts for user" });
  }
};

// Atualiza um post específico pelo ID

export const updatePostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { postText, postImg, postMention } = req.body;

  let updateFields = [];
  let values: any[] = [];

  if (postText) {
    updateFields.push("postText = ?");
    values.push(postText);
  }
  if (postImg) {
    updateFields.push("postImg = ?");
    values.push(postImg);
  }
  if (postMention) {
    updateFields.push("postMention = ?");
    values.push(postMention);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }
  values.push(postId);
  const sql = `UPDATE posts SET ${updateFields.join(", ")} WHERE id = ?`;

  try {
    const [result] = await pool.query(sql, values);
    const updateResult = result as any;

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update post" });
  }
};
