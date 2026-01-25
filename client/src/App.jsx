import React, { useState } from "react";
import ResumeBuilder from "./components/ResumeBuilder.jsx";
import Pricing from "./components/Pricing.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  const [view, setView] = useState("builder");

  // Lifted resume state so Builder data persists when switching tabs
  const [resumeState, setResumeState] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              CF
            </div>
            <div>
              <h1 className="text-lg font-semibold">CareerForge Pro</h1>
              <p className="text-xs text-slate-500">
                ATS-proof resumes & tailored job matching
              </p>
            </div>
          </div>
          <nav className="flex gap-4 text-sm">
            <button
              className={view === "builder" ? "text-primary font-medium" : "text-slate-600"}
              onClick={() => setView("builder")}
            >
              Builder
            </button>
            <button
              className={view === "dashboard" ? "text-primary font-medium" : "text-slate-600"}
              onClick={() => setView("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={view === "pricing" ? "text-primary font-medium" : "text-slate-600"}
              onClick={() => setView("pricing")}
            >
              Pricing
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-slate-50">
        {view === "builder" && (
          <ResumeBuilder
            externalResume={resumeState}
            onResumeChange={setResumeState}
          />
        )}
        {view === "dashboard" && <Dashboard />}
        {view === "pricing" && <Pricing />}
      </main>
    </div>
  );
}

export default App;
