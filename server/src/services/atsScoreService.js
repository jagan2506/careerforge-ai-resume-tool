export const computeATSScore = ({ jobDescription, resumeText, keywords }) => {
  const jdLower = jobDescription.toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  let matched = 0;
  let totalWeight = 0;

  keywords.forEach((k) => {
    const weight = k.weight || 1;
    totalWeight += weight;
    if (
      jdLower.includes(k.term.toLowerCase()) &&
      resumeLower.includes(k.term.toLowerCase())
    ) {
      matched += weight;
    }
  });

  if (totalWeight === 0) return 0;
  const score = (matched / totalWeight) * 100;
  return Math.round(score);
};
