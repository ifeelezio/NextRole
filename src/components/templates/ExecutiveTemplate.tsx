import React from "react";
import { ResumeData } from "@/lib/types";

interface TemplateProps {
  resume: ResumeData;
}

export default function ExecutiveTemplate({ resume }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, settings } = resume;
  const accent = settings?.accentColor || "#18181b";

  const skillList = (skills || "")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="w-[794px] min-h-[1123px] bg-white text-[#18181b] flex flex-col box-border select-none">
      <div
        className="flex-1 flex flex-col justify-between"
        style={{ padding: "var(--resume-pad, 36px)" }}
      >
        <div>
          {/* Executive Header */}
          <header className="border-b-2 border-zinc-900 pb-3 mb-4">
            <div className="flex justify-between items-end">
              <div>
                <h1
                  className="font-bold text-zinc-950 tracking-tight"
                  style={{ fontSize: "var(--rf-name, 28px)" }}
                >
                  {personalInfo.fullName || "John Doe"}
                </h1>
                <p
                  className="font-medium text-zinc-700 mt-0.5 tracking-wide"
                  style={{ fontSize: "var(--rf-title, 13.5px)" }}
                >
                  {personalInfo.jobTitle || "Executive Leader"}
                </p>
              </div>
              <div
                className="text-right text-zinc-600 space-y-0.5"
                style={{ fontSize: "var(--rf-sub, 10.5px)" }}
              >
                <div>{personalInfo.email}</div>
                <div>
                  {[personalInfo.phone, personalInfo.location, personalInfo.linkedin]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
            </div>
          </header>

          {/* Content Flow */}
          <div className="flex flex-col" style={{ gap: "var(--resume-gap, 14px)" }}>
            {/* Executive Profile */}
            {summary && (
              <section>
                <h2
                  className="font-bold uppercase tracking-wider text-zinc-900"
                  style={{
                    fontSize: "var(--rf-sec-heading, 11px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.35)",
                  }}
                >
                  Executive Profile
                </h2>
                <p
                  className="text-zinc-800 text-justify border-l-2 pl-3"
                  style={{
                    borderColor: accent,
                    fontSize: "var(--rf-body, 11px)",
                    lineHeight: "var(--rf-line-height, 1.55)",
                  }}
                >
                  {summary}
                </p>
              </section>
            )}

            {/* Core Competencies Grid */}
            {skillList.length > 0 && (
              <section>
                <h2
                  className="font-bold uppercase tracking-wider text-zinc-900"
                  style={{
                    fontSize: "var(--rf-sec-heading, 11px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.45)",
                  }}
                >
                  Core Competencies &amp; Governance
                </h2>
                <div
                  className="grid grid-cols-3 gap-x-4 gap-y-1 text-zinc-800"
                  style={{ fontSize: "var(--rf-sub, 10.5px)" }}
                >
                  {skillList.slice(0, 9).map((skill, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                      <span className="truncate">{skill}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Career History */}
            {experience && experience.length > 0 && (
              <section>
                <h2
                  className="font-bold uppercase tracking-wider text-zinc-900"
                  style={{
                    fontSize: "var(--rf-sec-heading, 11px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.45)",
                  }}
                >
                  Executive Career History
                </h2>
                <div className="flex flex-col" style={{ gap: "calc(var(--resume-gap, 14px) * 0.85)" }}>
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline font-bold text-zinc-950">
                        <span style={{ fontSize: "var(--rf-item-title, 12px)" }}>{exp.role}</span>
                        <span
                          className="font-medium text-zinc-600"
                          style={{ fontSize: "var(--rf-sub, 10.5px)" }}
                        >
                          {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      <div
                        className="font-semibold text-zinc-700 mb-0.5"
                        style={{ fontSize: "var(--rf-sub, 11px)" }}
                      >
                        {exp.company}
                      </div>
                      {exp.description && (
                        <p
                          className="text-zinc-800 whitespace-pre-line"
                          style={{
                            fontSize: "var(--rf-body, 11px)",
                            lineHeight: "var(--rf-line-height, 1.55)",
                          }}
                        >
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Strategic Initiatives / Projects */}
            {projects && projects.length > 0 && (
              <section>
                <h2
                  className="font-bold uppercase tracking-wider text-zinc-900"
                  style={{
                    fontSize: "var(--rf-sec-heading, 11px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.35)",
                  }}
                >
                  Strategic Initiatives
                </h2>
                <div className="flex flex-col" style={{ gap: "calc(var(--resume-gap, 14px) * 0.7)" }}>
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <span
                          className="font-bold text-zinc-900"
                          style={{ fontSize: "var(--rf-item-title, 12px)" }}
                        >
                          {proj.name}
                        </span>
                        {proj.link && (
                          <span
                            className="text-zinc-500"
                            style={{ fontSize: "var(--rf-sub, 10px)" }}
                          >
                            {proj.link}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-zinc-700 mt-0.5 leading-snug"
                        style={{
                          fontSize: "var(--rf-body, 10.5px)",
                          lineHeight: "var(--rf-line-height, 1.55)",
                        }}
                      >
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Credentials & Education */}
            {education && education.length > 0 && (
              <section>
                <h2
                  className="font-bold uppercase tracking-wider text-zinc-900"
                  style={{
                    fontSize: "var(--rf-sec-heading, 11px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.35)",
                  }}
                >
                  Credentials &amp; Education
                </h2>
                <div className="flex flex-col" style={{ gap: "calc(var(--resume-gap, 14px) * 0.5)" }}>
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                      <span
                        className="font-bold text-zinc-900"
                        style={{ fontSize: "var(--rf-item-title, 11.5px)" }}
                      >
                        {edu.degree} — {edu.school}
                      </span>
                      <span
                        className="text-zinc-600"
                        style={{ fontSize: "var(--rf-sub, 10.5px)" }}
                      >
                        {edu.startDate} – {edu.endDate}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
