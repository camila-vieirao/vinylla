import { Request, Response } from "express";
import pool from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.query(sql, [email]);
    const users = rows as any[];

    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect." });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      jwtConfig.secret,
      { expiresIn: "7d" }
    );

    return res.status(202).json({
      message: "Login successful.",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
