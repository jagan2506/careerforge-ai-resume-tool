// server/src/services/aiRewriteService.js

import { groq, GROQ_MODEL } from "../config/groqClient.js";

export const rewriteBullets = async ({ bullets, jobDescription, keywords }) => {
  const keywordList = keywords.map((k) => k.term).join(", ");
  const prompt = `
You are an expert resume writer optimizing content for ATS systems.

- Use an authoritative, concise tone.
- Integrate relevant keywords from: ${keywordList}
- Keep each bullet 1 line, max ~25 words.
- Do not invent responsibilities; only rephrase or mildly enhance.

Job Description:
"""
${jobDescription}
"""

Original bullets (JSON):
${JSON.stringify(bullets, null, 2)}

Return JSON:
{
  "bullets": [
    { "original": "...", "rewritten": "..." }
  ]
}
  `;

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: "You output only JSON." },
      { role: "user", content: prompt }
    ],
    temperature: 0.4
  });

  const raw = completion.choices[0].message.content;
  console.log("rewriteBullets raw:", raw);

  try {
    // Strip ```json ``` wrappers so JSON.parse works
    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    return parsed.bullets || [];
  } catch (e) {
    console.error("rewriteBullets parse error:", e);
    return [];
  }
};

export const generateCoverLetter = async ({
  resumeSummary,
  jobDescription,
  company,
  role
}) => {
  const prompt = `
Write a tailored cover letter (max 350 words) for the role "${role}" at "${company}".

Use first person, professional tone, and integrate achievements from this resume summary:
${resumeSummary}

Job Description:
"""
${jobDescription}
"""`;

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: "You are a professional cover letter writer." },
      { role: "user", content: prompt }
    ],
    temperature: 0.5
  });

  return completion.choices[0].message.content;
};
