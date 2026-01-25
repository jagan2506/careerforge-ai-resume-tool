import React from "react";

const ResumePreview = ({ resume }) => {
  const { name, title, email, phone, summary, experience, skills } = resume;

  return (
    <div
      id="resume-preview"
      className="bg-white border border-slate-200 shadow-md rounded-xl p-6 text-sm leading-relaxed"
    >
      <header className="border-b border-slate-200 pb-3 mb-3">
        <h1 className="text-xl font-semibold">{name || "Your Name"}</h1>
        <p className="text-slate-600">{title || "Target Role"}</p>
        <p className="text-slate-500 text-xs mt-1">
          {email || "email@example.com"} • {phone || "+91-0000000000"}
        </p>
      </header>

      {summary && (
        <section className="mb-3">
          <h2 className="font-semibold text-slate-800 mb-1 text-xs tracking-wide">
            SUMMARY
          </h2>
          <p className="text-xs text-slate-700">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-3">
          <h2 className="font-semibold text-slate-800 mb-1 text-xs tracking-wide">
            EXPERIENCE
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between text-xs font-medium">
                <span>{exp.role || "Role"}</span>
                <span className="text-slate-500">{exp.period || ""}</span>
              </div>
              <div className="text-xs text-slate-600">
                {exp.company || "Company"} • {exp.location || "Location"}
              </div>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {(exp.bullets || []).map((b, i) => (
                  <li key={i} className="text-xs text-slate-700">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="font-semibold text-slate-800 mb-1 text-xs tracking-wide">
            SKILLS
          </h2>
          <p className="text-xs text-slate-700">{skills.join(" • ")}</p>
        </section>
      )}
    </div>
  );
};

export default ResumePreview;
