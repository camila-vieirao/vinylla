import pool from "../db";
import { Request, Response } from "express";

// Campos das reviews
// id	INT AUTO_INCREMENT	Identificador único da review
// reviewText	VARCHAR(500)	Texto da review (aumentei de 45 para 500)
// reviewRating	INT	Nota da review (1–10, etc.)
// audiodb_album_id	VARCHAR(200)	ID do álbum no serviço externo (musicdb)
// userid	INT	Usuário que fez a review (FK)

export const createReview = async (req: Request, res: Response) => {
  const audiodb_album_id = req.params.albumId;
  const { reviewText, reviewRating } = req.body;
  const userId = (req as any).user.id;
  console.log(userId);

  // Validar se usuario ja fez uma review desse album, se sim retornar erro
  const validationSql =
    "SELECT id FROM reviews WHERE userid = ? AND audiodb_album_id = ?";

  const [validationResult] = await pool.query(validationSql, [
    userId,
    audiodb_album_id,
  ]);

  if ((validationResult as any[]).length > 0) {
    return res
      .status(400)
      .json({ message: "User has already reviewed this album" });
  }

  const sql =
    "INSERT INTO reviews (reviewText, reviewRating, audiodb_album_id, userid) VALUES (?, ?, ?, ?)";

  try {
    const [result] = await pool.query(sql, [
      reviewText,
      reviewRating,
      audiodb_album_id,
      userId,
    ]);
    res.status(201).json({
      message: "Review created successfully",
      reviewId: (result as any).insertId,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getReviewsByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const sql =
    "SELECT r.id, r.reviewText, r.reviewRating, r.audiodb_album_id, u.username FROM reviews r JOIN users u ON r.userid = u.id WHERE r.userid = ?";

  try {
    const [rows] = await pool.query(sql, [userId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching reviews for user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteReviewById = async (req: Request, res: Response) => {
  const reviewId = req.params.reviewId;
  const userId = (req as any).user.id;

  const sql = "DELETE FROM reviews WHERE id = ? AND userid = ?";

  try {
    const [result] = await pool.query(sql, [reviewId, userId]);
    if ((result as any).affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Review not found or unauthorized" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
