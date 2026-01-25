import express from "express";
import { authRequired } from "../middleware/auth.js";
import { Resume } from "../models/Resume.js";

const router = express.Router();

// Create or update a resume
router.post("/", authRequired, async (req, res) => {
  try {
    const data = req.body;
    let resume;
    if (data._id) {
      resume = await Resume.findOneAndUpdate(
        { _id: data._id, userId: req.user.id },
        data,
        { new: true }
      );
    } else {
      resume = await Resume.create({ ...data, userId: req.user.id });
    }
    res.json(resume);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Save resume failed" });
  }
});

// List resumes
router.get("/", authRequired, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({
      updatedAt: -1
    });
    res.json(resumes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fetch resumes failed" });
  }
});

// Get single resume
router.get("/:id", authRequired, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!resume) return res.status(404).json({ error: "Not found" });
    res.json(resume);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fetch resume failed" });
  }
});

export default router;
