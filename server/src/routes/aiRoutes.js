import express from "express";
import { extractKeywordsFromJD } from "../services/jdAnalysisService.js";
import { rewriteBullets, generateCoverLetter } from "../services/aiRewriteService.js";
import { computeATSScore } from "../services/atsScoreService.js";

const router = express.Router();

router.post("/analyze-jd", async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const keywords = await extractKeywordsFromJD(jobDescription);
    res.json({ keywords });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "JD analysis failed" });
  }
});

router.post("/rewrite-bullets", async (req, res) => {
  try {
    const { bullets, jobDescription, keywords } = req.body;
    const rewritten = await rewriteBullets({ bullets, jobDescription, keywords });
    res.json({ bullets: rewritten });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Rewrite failed" });
  }
});

router.post("/ats-score", async (req, res) => {
  try {
    const { jobDescription, resumeText, keywords } = req.body;
    const score = computeATSScore({ jobDescription, resumeText, keywords });
    res.json({ score });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Scoring failed" });
  }
});

router.post("/cover-letter", async (req, res) => {
  try {
    const { resumeSummary, jobDescription, company, role } = req.body;
    const letter = await generateCoverLetter({
      resumeSummary,
      jobDescription,
      company,
      role
    });
    res.json({ letter });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Cover letter generation failed" });
  }
});

export default router;
