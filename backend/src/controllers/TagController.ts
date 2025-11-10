import { RowDataPacket } from "mysql2";
import pool from "../db";
import { Request, Response } from "express";

interface Tag extends RowDataPacket {
  id: number;
  name: string;
}

export const getTags = async (req: Request, res: Response) => {
  const sql = "SELECT * FROM music_tags";

  try {
    const [rows] = await pool.query(sql);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  const tagId = req.params.id;
  const sql = "SELECT * FROM music_tags WHERE id = ?";

  try {
    const [rows] = await pool.query(sql, [tagId]);
    const results = rows as any[];

    if (results.length === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.status(200).json(results[0]);
  } catch (error) {
    console.error("Error fetching tag by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTagsPerUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const sql =
    "SELECT id, name FROM music_tags JOIN user_music_tags ON id = tagid WHERE userid = ?";

  try {
    const [rows] = await pool.query(sql, [userId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching tags for user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMyTags = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const sql =
    "SELECT id, name FROM music_tags JOIN user_music_tags ON id = tagid WHERE userid = ?";

  try {
    const [rows] = await pool.query<Tag[]>(sql, [userId]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addTagToUser = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const tagId = req.params.tagId;
  console.log("Adding tag", tagId, "to user", userId);

  const sql =
    "INSERT INTO user_music_tags (userid, tagid, created_at) VALUES (?, ?, ?)";

  try {
    await pool.query(sql, [userId, tagId, new Date()]);
    res.status(201).json({ message: "Tag added to user successfully" });
  } catch (error) {
    if ((error as any).code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Tag already added to user" });
    }

    console.error("Error adding tag to user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeTagFromUser = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const tagId = req.params.tagId;

  const sql = "DELETE FROM user_music_tags WHERE userid = ? AND tagid = ?";

  try {
    const [result] = await pool.query(sql, [userId, tagId]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Tag not found for user" });
    }
    res.status(200).json({ message: "Tag removed from user successfully" });
  } catch (error) {
    console.error("Error removing tag from user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
