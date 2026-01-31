import React, { useState } from "react";
import JDInput from "./JDInput.jsx";
import ResumePreview from "./ResumePreview.jsx";
import ATSScoreBadge from "./ATSScoreBadge.jsx";
import CoverLetterModal from "./CoverLetterModal.jsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
console.log("API_BASE is:", API_BASE);

const defaultExperience = [
  {
    role: "Software Engineer",
    company: "Example Corp",
    location: "Remote",
    period: "2023 - Present",
    bullets: [
      "Built RESTful APIs in Node.js and Express for internal tools and reporting dashboards.",
      "Implemented JWT-based authentication and role-based authorization for a multi-tenant web app."
    ]
  }
];

const ResumeBuilder = ({ externalResume, onResumeChange }) => {
  const [resume, setResume] = useState(
    externalResume || {
      name: "",
      title: "",
      email: "",
      phone: "",
      summary: "",
      experience: defaultExperience,
      skills: []
    }
  );

  const [jobDescription, setJobDescription] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [atsScore, setAtsScore] = useState(0);

  const [loadingJD, setLoadingJD] = useState(false);
  const [loadingRewrite, setLoadingRewrite] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);
  const [loadingLetter, setLoadingLetter] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [coverLetter, setCoverLetter] = useState("");
  const [showLetter, setShowLetter] = useState(false);

  // Helper to update local resume + notify parent (App) AFTER initial render
  const syncResume = (updater) => {
    setResume((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (onResumeChange) {
        onResumeChange(next);
      }
      return next;
    });
  };

  const handleFieldChange = (field, value) => {
    syncResume((prev) => ({ ...prev, [field]: value }));
  };

  const handleExperienceChange = (idx, field, value) => {
    syncResume((prev) => {
      const copy = [...prev.experience];
      copy[idx] = { ...copy[idx], [field]: value };
      return { ...prev, experience: copy };
    });
  };

  const handleBulletChange = (idx, bIdx, value) => {
    syncResume((prev) => {
      const copy = [...prev.experience];
      const bullets = [...copy[idx].bullets];
      bullets[bIdx] = value;
      copy[idx].bullets = bullets;
      return { ...prev, experience: copy };
    });
  };

  const handleSkillsChange = (value) => {
    const tokens = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    syncResume((prev) => ({ ...prev, skills: tokens }));
  };

  const analyzeJD = async () => {
    try {
      if (!jobDescription.trim()) {
        alert("Paste a Job Description first.");
        return;
      }
      setLoadingJD(true);
      const res = await fetch(`${API_BASE}/ai/analyze-jd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription })
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("analyze-jd error:", text);
        alert("JD analysis failed on server");
        return;
      }
      const data = await res.json();
      setKeywords(data.keywords || []);
    } catch (e) {
      console.error(e);
      alert("JD analysis failed");
    } finally {
      setLoadingJD(false);
    }
  };

  const rewriteExperience = async () => {
    try {
      if (!jobDescription.trim()) {
        alert("Paste a Job Description first.");
        return;
      }
      if (!keywords.length) {
        alert("Run Analyze JD before Magic Rewrite.");
        return;
      }
      setLoadingRewrite(true);

      const bulletsFlat = resume.experience.flatMap((exp) => exp.bullets);
      console.log("Rewrite payload:", {
        bullets: bulletsFlat,
        jobDescription,
        keywords,
});



      const res = await fetch(`${API_BASE}/ai/rewrite-bullets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullets: bulletsFlat,
          jobDescription,
          keywords
        })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("rewrite-bullets error:", text);
        alert("Rewrite failed on server");
        return;
      }

      const data = await res.json();
      const rewritten = data.bullets || [];

      syncResume((prev) => {
        let i = 0;
        const expCopy = prev.experience.map((exp) => {
          const newBullets = exp.bullets.map(() => {
            const mapped =
              rewritten[i]?.rewritten ||
              rewritten[i]?.original ||
              exp.bullets[i] ||
              "";
            i += 1;
            return mapped;
          });
          return { ...exp, bullets: newBullets };
        });
        return { ...prev, experience: expCopy };
      });
    } catch (e) {
      console.error(e);
      alert("Rewrite failed");
    } finally {
      setLoadingRewrite(false);
    }
  };

  const computeScore = async () => {
    try {
      if (!jobDescription.trim()) {
        alert("Paste a Job Description first.");
        return;
      }
      setLoadingScore(true);

      const resumeText = [
        resume.summary,
        resume.skills.join(" "),
        ...resume.experience.flatMap((exp) => [
          exp.role,
          exp.company,
          exp.location,
          exp.period,
          ...(exp.bullets || [])
        ])
      ].join("\n");

      const res = await fetch(`${API_BASE}/ai/ats-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          resumeText,
          keywords
        })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("ats-score error:", text);
        alert("ATS score failed on server");
        return;
      }

      const data = await res.json();
      setAtsScore(data.score || 0);
    } catch (e) {
      console.error(e);
      alert("ATS score failed");
    } finally {
      setLoadingScore(false);
    }
  };
  const generatePDF = async () => {
  try {
    setPdfLoading(true);

    const element = document.getElementById("resume-preview");
    if (!element) {
      alert("Resume preview not found");
      return;
    }

    const opt = {
      margin: 10,
      filename: "careerforge-resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" }
    };

    // @ts-ignore
    window.html2pdf().set(opt).from(element).save();
  } catch (e) {
    console.error(e);
    alert("PDF generation failed");
  } finally {
    setPdfLoading(false);
  }
};

 
  const generateCoverLetter = async () => {
    try {
      if (!jobDescription.trim()) {
        alert("Paste a Job Description first.");
        return;
      }
      setLoadingLetter(true);

      const resumeSummary = [
        resume.summary,
        ...resume.experience.flatMap((exp) => exp.bullets)
      ].join(" ");

      const res = await fetch(`${API_BASE}/ai/cover-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeSummary,
          jobDescription,
          company: "Target Company",
          role: resume.title || "Target Role"
        })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("cover-letter error:", text);
        alert("Cover letter failed on server");
        return;
      }

      const data = await res.json();
      setCoverLetter(data.letter || "");
      setShowLetter(true);
    } catch (e) {
      console.error(e);
      alert("Cover letter generation failed");
    } finally {
      setLoadingLetter(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <JDInput
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          onAnalyze={analyzeJD}
          loading={loadingJD}
        />

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Resume Details
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              className="border border-slate-200 rounded-lg px-2 py-1 text-xs"
              placeholder="Full name"
              value={resume.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
            <input
              className="border border-slate-200 rounded-lg px-2 py-1 text-xs"
              placeholder="Target role (e.g. Backend Engineer)"
              value={resume.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
            />
            <input
              className="border border-slate-200 rounded-lg px-2 py-1 text-xs"
              placeholder="Email"
              value={resume.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
            />
            <input
              className="border border-slate-200 rounded-lg px-2 py-1 text-xs"
              placeholder="Phone"
              value={resume.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
            />
          </div>

          <label className="block text-xs font-medium text-slate-600 mb-1">
            Professional summary
          </label>
          <textarea
            className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs mb-3"
            rows={3}
            value={resume.summary}
            onChange={(e) => handleFieldChange("summary", e.target.value)}
          />

          <label className="block text-xs font-medium text-slate-600 mb-1">
            Skills (comma separated)
          </label>
          <input
            className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs mb-4"
            placeholder="React, Node.js, MongoDB, AWS, Python"
            value={resume.skills.join(", ")}
            onChange={(e) => handleSkillsChange(e.target.value)}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                Experience
              </span>
              <button
                className="text-xs text-primary"
                onClick={() =>
                  syncResume((prev) => ({
                    ...prev,
                    experience: [
                      ...prev.experience,
                      {
                        role: "",
                        company: "",
                        location: "",
                        period: "",
                        bullets: [""]
                      }
                    ]
                  }))
                }
              >
                + Add role
              </button>
            </div>

            {resume.experience.map((exp, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50"
              >
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border border-slate-200 rounded px-2 py-1 text-xs"
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) =>
                      handleExperienceChange(idx, "role", e.target.value)
                    }
                  />
                  <input
                    className="border border-slate-200 rounded px-2 py-1 text-xs"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      handleExperienceChange(idx, "company", e.target.value)
                    }
                  />
                  <input
                    className="border border-slate-200 rounded px-2 py-1 text-xs"
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) =>
                      handleExperienceChange(idx, "location", e.target.value)
                    }
                  />
                  <input
                    className="border border-slate-200 rounded px-2 py-1 text-xs"
                    placeholder="Period"
                    value={exp.period}
                    onChange={(e) =>
                      handleExperienceChange(idx, "period", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-1 mt-1">
                  <span className="text-[11px] font-medium text-slate-600">
                    Bullets
                  </span>
                  {exp.bullets.map((b, bIdx) => (
                    <input
                      key={bIdx}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-xs mb-1"
                      placeholder="Describe your impact..."
                      value={b}
                      onChange={(e) =>
                        handleBulletChange(idx, bIdx, e.target.value)
                      }
                    />
                  ))}
                  <button
                    className="text-[11px] text-primary"
                    onClick={() =>
                      syncResume((prev) => {
                        const copy = [...prev.experience];
                        copy[idx].bullets = [...copy[idx].bullets, ""];
                        return { ...prev, experience: copy };
                      })
                    }
                  >
                    + Add bullet
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <button
              onClick={rewriteExperience}
              disabled={loadingRewrite || !jobDescription || keywords.length === 0}
              className="px-4 py-1.5 rounded-full text-xs bg-primary text-white disabled:opacity-40"
            >
              {loadingRewrite ? "Rewriting..." : "Magic Rewrite"}
            </button>

            <button
              onClick={computeScore}
              disabled={loadingScore || !jobDescription}
              className="px-4 py-1.5 rounded-full text-xs border border-slate-300 text-slate-700 disabled:opacity-40"
            >
              {loadingScore ? "Computing..." : "Update ATS score"}
            </button>

            <button
              onClick={generatePDF}
              disabled={pdfLoading}
              className="px-4 py-1.5 rounded-full text-xs border border-slate-300 text-slate-700 disabled:opacity-40"
            >
              {pdfLoading ? "Generating PDF..." : "Download PDF"}
            </button>

            <button
              onClick={generateCoverLetter}
              disabled={loadingLetter || !jobDescription}
              className="px-4 py-1.5 rounded-full text-xs bg-emerald-500 text-white disabled:opacity-40"
            >
              {loadingLetter ? "Drafting letter..." : "Cover Letter"}
            </button>

            <ATSScoreBadge score={atsScore} />
          </div>

          {keywords.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] text-slate-500 mb-1">
                Key JD keywords:
              </p>
              <div className="flex flex-wrap gap-1">
                {keywords.slice(0, 12).map((k, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700"
                  >
                    {k.term}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sticky top-4 h-[calc(100vh-6rem)] overflow-auto">
        <ResumePreview resume={resume} />
      </div>

      <CoverLetterModal
        open={showLetter}
        onClose={() => setShowLetter(false)}
        letter={coverLetter}
      />
    </div>
  );
};

export default ResumeBuilder;
