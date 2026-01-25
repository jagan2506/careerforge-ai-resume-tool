import { groq, GROQ_MODEL } from "../config/groqClient.js";

export const extractKeywordsFromJD = async (jobDescription) => {
  const prompt = `
You are an ATS analyst. From the following Job Description, extract and rank the 25 most critical skills/keywords.

Return JSON of the form:
{
  "keywords": [
    { "term": "Python", "weight": 0.95, "category": "Skill" }
  ]
}

Job Description:
"""
${jobDescription}
"""`;

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: "You output only valid JSON." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
    response_format: { type: "json_object" }
  });

  const raw = completion.choices[0].message.content;
  console.log("JD raw response:", raw);

  try {
    const parsed = JSON.parse(raw);
    return parsed.keywords || [];
  } catch {
    return [];
  }
};
