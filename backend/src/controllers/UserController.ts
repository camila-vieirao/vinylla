import pool from "../db";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

export const getUsers = async (req: Request, res: Response) => {
  const sql = "SELECT * FROM users";

  try {
    const [rows] = await pool.query(sql);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const sql = "SELECT * FROM users WHERE id = ?";

  try {
    const [rows] = await pool.query(sql, [userId]);

    const results = rows as any[];
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(results[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  // Campos na criacao: username, email, password, name

  var { username, email, password, name } = req.body;

  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(password, salt);
  password = hashedPassword;

  const sql =
    "INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)";

  try {
    const [result] = await pool.query(sql, [username, email, password, name]);
    res
      .status(201)
      .json({ message: "User created", userId: (result as any).insertId });
  } catch (error) {
    if ((error as any).code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Username or email already exists" });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";

  try {
    const [result] = await pool.query(sql, [userId]);
    const deleteResult = result as any;

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { username, email, name, password } = req.body;

  let updateFields = [];
  let values: any[] = [];

  if (username) {
    updateFields.push("username = ?");
    values.push(username);
  }
  if (email) {
    updateFields.push("email = ?");
    values.push(email);
  }
  if (name) {
    updateFields.push("name = ?");
    values.push(name);
  }
  if (password) {
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);
    updateFields.push("password = ?");
    values.push(hashedPassword);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  values.push(userId);
  const sql = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;

  try {
    const [result] = await pool.query(sql, values);
    const updateResult = result as any;

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};
