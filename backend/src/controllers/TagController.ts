import pool from "../db";
import { Request, Response } from "express";

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
