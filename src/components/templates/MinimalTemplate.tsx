import React from "react";
import { ResumeData } from "@/lib/types";

interface TemplateProps {
  resume: ResumeData;
}

export default function MinimalTemplate({ resume }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects } = resume;

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean);

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
          {/* Header */}
          <header className="border-b border-zinc-200 pb-4 mb-4">
            <h1
              className="font-light tracking-tight text-zinc-950"
              style={{ fontSize: "var(--rf-name, 28px)" }}
            >
              {personalInfo.fullName || "John Doe"}
            </h1>
            <p
              className="font-medium text-zinc-600 mt-1"
              style={{ fontSize: "var(--rf-title, 13.5px)" }}
            >
              {personalInfo.jobTitle || "Software Engineer"}
            </p>
            <div
              className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-500 mt-2.5"
              style={{ fontSize: "var(--rf-sub, 10.5px)" }}
            >
              {contactItems.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-zinc-300">·</span>}
                  {item}
                </span>
              ))}
            </div>
          </header>

          {/* Main Content Sections */}
          <div className="flex flex-col" style={{ gap: "var(--resume-gap, 14px)" }}>
            {/* Summary */}
            {summary && (
              <section>
                <h2
                  className="font-semibold uppercase tracking-[0.14em] text-zinc-400"
                  style={{
                    fontSize: "var(--rf-sec-heading, 11px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.35)",
                  }}
                >
                  Summary
                </h2>
                <p
                  className="text-zinc-700"
                  style={{
                    fontSize: "var(--rf-body, 11px)",
                    lineHeight: "var(--rf-line-height, 1.55)",
                  }}
                >
                  {summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
              <section>
                <h2
                  className="font-semibold uppercase tracking-[0.14em] text-zinc-400"
                  style={{
                    fontSize: "var(--rf-sec-heading, 11px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.45)",
                  }}
                >
                  Experience
                </h2>
                <div className="flex flex-col" style={{ gap: "calc(var(--resume-gap, 14px) * 0.85)" }}>
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <div
                          className="font-semibold text-zinc-900"
                          style={{ fontSize: "var(--rf-item-title, 12px)" }}
                        >
                          {exp.role} <span className="font-normal text-zinc-600">· {exp.company}</span>
                        </div>
                        <span
                          className="text-zinc-500"
                          style={{ fontSize: "var(--rf-sub, 10.5px)" }}
                        >
                          {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      {exp.description && (
                        <p
                          className="text-zinc-600 mt-1 whitespace-pre-line"
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

            {/* Projects */}
            {projects && projects.length > 0 && (
              <section>
                <h2
                  className="font-semibold uppercase tracking-[0.14em] text-zinc-400"
                  style={{
                    fontSize: "var(--rf-sec-heading, 11px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.45)",
                  }}
                >
                  Projects
                </h2>
                <div className="flex flex-col" style={{ gap: "calc(var(--resume-gap, 14px) * 0.7)" }}>
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <span
                          className="font-semibold text-zinc-900"
                          style={{ fontSize: "var(--rf-item-title, 12px)" }}
                        >
                          {proj.name}
                        </span>
                        {proj.link && (
                          <span
                            className="text-zinc-400"
                            style={{ fontSize: "var(--rf-sub, 10px)" }}
                          >
                            {proj.link}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-zinc-600 mt-0.5"
                        style={{
                          fontSize: "var(--rf-body, 11px)",
                          lineHeight: "var(--rf-line-height, 1.55)",
                        }}
                      >
                        {proj.description}
                      </p>
                      {proj.technologies && (
                        <p
                          className="text-zinc-400 mt-0.5"
                          style={{ fontSize: "var(--rf-sub, 10px)" }}
                        >
                          {proj.technologies}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <section>
                <h2
                  className="font-semibold uppercase tracking-[0.14em] text-zinc-400"
                  style={{
                    fontSize: "var(--rf-sec-heading, 11px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.35)",
                  }}
                >
                  Education
                </h2>
                <div className="flex flex-col" style={{ gap: "calc(var(--resume-gap, 14px) * 0.5)" }}>
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                      <div>
                        <span
                          className="font-semibold text-zinc-900"
                          style={{ fontSize: "var(--rf-item-title, 12px)" }}
                        >
                          {edu.degree}
                        </span>
                        <span
                          className="text-zinc-600 ml-2"
                          style={{ fontSize: "var(--rf-body, 11px)" }}
                        >
                          {edu.school} {edu.gpa ? `· ${edu.gpa}` : ""}
                        </span>
                      </div>
                      <span
                        className="text-zinc-500"
                        style={{ fontSize: "var(--rf-sub, 10.5px)" }}
                      >
                        {edu.startDate} – {edu.endDate}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {skillList.length > 0 && (
              <section>
                <h2
                  className="font-semibold uppercase tracking-[0.14em] text-zinc-400"
                  style={{
                    fontSize: "var(--rf-sec-heading, 11px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.35)",
                  }}
                >
                  Skills
                </h2>
                <p
                  className="text-zinc-700"
                  style={{
                    fontSize: "var(--rf-body, 11px)",
                    lineHeight: "var(--rf-line-height, 1.55)",
                  }}
                >
                  {skillList.join("  ·  ")}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
