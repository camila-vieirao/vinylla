// table relationship
// id
// followerUserid
// followedUserid

import { Request, Response } from "express";
import pool from "../db";

export const followUser = async (req: Request, res: Response) => {
  const followerId = (req as any).user.id;
  const followedId = req.params.userId;

  if (followerId === parseInt(followedId)) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  const sql =
    "INSERT INTO relationships (followerUserid, followedUserid) VALUES (?, ?)";

  // Validar se relacionamento já existe antes de tentar inserir
  const checkSql =
    "SELECT id FROM relationships WHERE followerUserid = ? AND followedUserid = ?";

  try {
    const [existing] = await pool.query(checkSql, [followerId, followedId]);
    if ((existing as any[]).length > 0) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    await pool.query(sql, [followerId, followedId]);
    res.status(201).json({ message: "User followed successfully" });
  } catch (error) {
    console.error(error);
    // Caso raro: se a checagem e o insert ocorrerem em condições de corrida,
    // ainda tratamos o erro de duplicata pelo banco.
    if ((error as any).code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "You are already following this user" });
    } else {
      res.status(500).json({ error: "Failed to follow user" });
    }
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  const followerId = (req as any).user.id;
  const followedId = req.params.userId;

  const sql =
    "DELETE FROM relationships WHERE followerUserid = ? AND followedUserid = ?";
  try {
    const [result] = await pool.query(sql, [followerId, followedId]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Follow relationship not found" });
    }
    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unfollow user" });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const sql = `
    SELECT u.id, u.username, u.name, u.profilePicture
    FROM users u
    JOIN relationships r ON u.id = r.followerUserid
    WHERE r.followedUserid = ?
  `;

  try {
    const [rows] = await pool.query(sql, [userId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve followers" });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const sql = `
    SELECT u.id, u.username, u.name, u.profilePicture
    FROM users u
    JOIN relationships r ON u.id = r.followedUserid
    WHERE r.followerUserid = ?
  `;

  try {
    const [rows] = await pool.query(sql, [userId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve following users" });
  }
};

export const isFollowing = async (req: Request, res: Response) => {
  const followerId = (req as any).user.id;
  const followedId = req.params.userId;

  const sql =
    "SELECT COUNT(*) as count FROM relationships WHERE followerUserid = ? AND followedUserid = ?";

  try {
    const [rows] = await pool.query(sql, [followerId, followedId]);
    const count = (rows as any)[0].count;
    res.status(200).json({ isFollowing: count > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to check follow status" });
  }
};

export const getFollowCounts = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const sqlFollowers =
    "SELECT COUNT(*) as followerCount FROM relationships WHERE followedUserid = ?";
  const sqlFollowing =
    "SELECT COUNT(*) as followingCount FROM relationships WHERE followerUserid = ?";

  try {
    const [followerRows] = await pool.query(sqlFollowers, [userId]);
    const [followingRows] = await pool.query(sqlFollowing, [userId]);

    const followerCount = (followerRows as any)[0].followerCount;
    const followingCount = (followingRows as any)[0].followingCount;
    res
      .status(200)
      .json({ followers: followerCount, following: followingCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve follow counts" });
  }
};
