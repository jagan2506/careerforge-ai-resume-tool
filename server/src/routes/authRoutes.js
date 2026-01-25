import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();
const router = express.Router();

const createToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already used" });

    const user = new User({ email, name });
    await user.setPassword(password);
    await user.save();

    const token = createToken(user);
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, plan: user.plan }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Register failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = createToken(user);
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, plan: user.plan }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
