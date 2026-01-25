import React from "react";

const Dashboard = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-2">Your CareerForge workspace</h2>
      <p className="text-sm text-slate-500 mb-4">
        Saved resumes, job targets, and cover letters will appear here.
      </p>
      <div className="border border-dashed border-slate-300 rounded-xl p-6 text-sm text-slate-500">
        No saved resumes yet. Build your first optimized resume from the Builder tab.
      </div>
    </div>
  );
};

export default Dashboard;
