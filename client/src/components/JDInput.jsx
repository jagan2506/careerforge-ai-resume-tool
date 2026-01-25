import React from "react";

const JDInput = ({ jobDescription, setJobDescription, onAnalyze, loading }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-slate-800">Target Job Description</h2>
        <button
          onClick={onAnalyze}
          disabled={loading || !jobDescription.trim()}
          className="text-xs px-3 py-1 rounded-full bg-primary text-white disabled:opacity-40"
        >
          {loading ? "Analyzing..." : "Analyze JD"}
        </button>
      </div>
      <textarea
        className="w-full h-36 text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
        placeholder="Paste the JD here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
    </div>
  );
};

export default JDInput;
