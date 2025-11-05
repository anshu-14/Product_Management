import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../../config/db.js";

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const [existingUserName] = await pool.query(
      "SELECT * FROM users WHERE UserName = ?",
      [userName]
    );


    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }
    if (existingUserName.length > 0) {
      return res.status(400).json({ message: "UserName already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (UserName, Email, Password,CreatedBy) VALUES (?, ?, ?,?)",
      [userName, email, hashedPassword, 1]
    );

    res.status(201).json({ message: "User registered successfully", statusCode:1, });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error",  statusCode:0,});
  }
};

export const test = (req, res) => {
  return res.json({ message: "Auth route working fine" });
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE UserName = ?", [
      username,
    ]);

    const user = rows[0];
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.UserId, userName: user.UserName },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.UserId, userName: user.UserName },
      statusCode:1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error",statusCode:0 });
  }
};
