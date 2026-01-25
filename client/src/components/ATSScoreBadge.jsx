import React from "react";

const ATSScoreBadge = ({ score }) => {
  const color =
    score >= 80
      ? "bg-emerald-100 text-emerald-700"
      : score >= 60
      ? "bg-amber-100 text-amber-700"
      : "bg-rose-100 text-rose-700";

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${color}`}>
      <span className="h-2 w-2 rounded-full bg-current"></span>
      <span>ATS score: {score || 0}%</span>
    </div>
  );
};

export default ATSScoreBadge;
