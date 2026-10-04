import React from "react";
import { ResumeData } from "@/lib/types";

interface TemplateProps {
  resume: ResumeData;
}

export default function DeveloperTemplate({ resume }: TemplateProps) {
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
          {/* Terminal/Code Header */}
          <header className="border-b border-zinc-300 pb-3 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1
                  className="font-bold text-zinc-950 tracking-tight"
                  style={{ fontSize: "var(--rf-name, 28px)" }}
                >
                  {personalInfo.fullName || "John Doe"}
                </h1>
                <p
                  className="font-medium mt-0.5"
                  style={{ color: accent, fontSize: "var(--rf-title, 13.5px)" }}
                >
                  &gt; {personalInfo.jobTitle || "Software Engineer"}
                </p>
              </div>
              <div
                className="text-right text-zinc-600 space-y-0.5"
                style={{ fontSize: "var(--rf-sub, 10px)" }}
              >
                {personalInfo.github && <div>gh: {personalInfo.github}</div>}
                {personalInfo.website && <div>web: {personalInfo.website}</div>}
                {personalInfo.email && <div>mail: {personalInfo.email}</div>}
                {personalInfo.location && <div>loc: {personalInfo.location}</div>}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex flex-col" style={{ gap: "var(--resume-gap, 14px)" }}>
            {/* Summary */}
            {summary && (
              <section>
                <h2
                  className="font-bold text-zinc-500 uppercase tracking-widest"
                  style={{
                    fontSize: "var(--rf-sec-heading, 10px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.35)",
                  }}
                >
                  {"// Summary"}
                </h2>
                <p
                  className="text-zinc-800"
                  style={{
                    fontSize: "var(--rf-body, 11px)",
                    lineHeight: "var(--rf-line-height, 1.55)",
                  }}
                >
                  {summary}
                </p>
              </section>
            )}

            {/* Technical Stack */}
            {skillList.length > 0 && (
              <section>
                <h2
                  className="font-bold text-zinc-500 uppercase tracking-widest"
                  style={{
                    fontSize: "var(--rf-sec-heading, 10px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.45)",
                  }}
                >
                  {"// Technical Stack"}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skillList.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-800 rounded font-medium"
                      style={{ fontSize: "var(--rf-sub, 10px)" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
              <section>
                <h2
                  className="font-bold text-zinc-500 uppercase tracking-widest"
                  style={{
                    fontSize: "var(--rf-sec-heading, 10px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.45)",
                  }}
                >
                  {"// Experience"}
                </h2>
                <div className="flex flex-col" style={{ gap: "calc(var(--resume-gap, 14px) * 0.85)" }}>
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <div
                          className="font-bold text-zinc-950"
                          style={{ fontSize: "var(--rf-item-title, 12px)" }}
                        >
                          {exp.role} <span style={{ color: accent }}>@{exp.company}</span>
                        </div>
                        <span
                          className="text-zinc-500"
                          style={{ fontSize: "var(--rf-sub, 10px)" }}
                        >
                          [{exp.startDate} - {exp.current ? "present" : exp.endDate}]
                        </span>
                      </div>
                      {exp.description && (
                        <p
                          className="text-zinc-700 mt-1 whitespace-pre-line"
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
                  className="font-bold text-zinc-500 uppercase tracking-widest"
                  style={{
                    fontSize: "var(--rf-sec-heading, 10px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.45)",
                  }}
                >
                  {"// Open Source & Projects"}
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
                        className="text-zinc-700 mt-0.5"
                        style={{
                          fontSize: "var(--rf-body, 11px)",
                          lineHeight: "var(--rf-line-height, 1.55)",
                        }}
                      >
                        {proj.description}
                      </p>
                      {proj.technologies && (
                        <p
                          className="text-zinc-500 mt-0.5"
                          style={{ fontSize: "var(--rf-sub, 10px)" }}
                        >
                          stack: {proj.technologies}
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
                  className="font-bold text-zinc-500 uppercase tracking-widest"
                  style={{
                    fontSize: "var(--rf-sec-heading, 10px)",
                    marginBottom: "calc(var(--resume-gap, 14px) * 0.35)",
                  }}
                >
                  {"// Education"}
                </h2>
                <div className="flex flex-col" style={{ gap: "calc(var(--resume-gap, 14px) * 0.5)" }}>
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                      <span
                        className="text-zinc-900 font-bold"
                        style={{ fontSize: "var(--rf-item-title, 12px)" }}
                      >
                        {edu.degree} · {edu.school}
                      </span>
                      <span
                        className="text-zinc-500"
                        style={{ fontSize: "var(--rf-sub, 10px)" }}
                      >
                        {edu.startDate} - {edu.endDate}
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
