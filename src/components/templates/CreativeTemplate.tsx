import React from "react";
import { ResumeData } from "@/lib/types";

interface TemplateProps {
  resume: ResumeData;
}

export default function CreativeTemplate({ resume }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, settings } = resume;
  const accent = settings?.accentColor || "#18181b";

  const contactItems = [
    { label: "Email", val: personalInfo.email },
    { label: "Phone", val: personalInfo.phone },
    { label: "Location", val: personalInfo.location },
    { label: "Portfolio", val: personalInfo.website },
    { label: "LinkedIn", val: personalInfo.linkedin },
    { label: "GitHub", val: personalInfo.github },
  ].filter((item) => Boolean(item.val));

  const skillList = (skills || "")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const initials = (personalInfo.fullName || "JD")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="w-[794px] min-h-[1123px] grid grid-cols-[260px_1fr] box-border select-none">
      {/* Dark Sidebar */}
      <aside
        className="bg-zinc-950 text-white flex flex-col justify-between"
        style={{ padding: "var(--resume-pad, 36px)" }}
      >
        <div>
          {/* Avatar Monogram */}
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm mb-4 text-white border border-white/20"
            style={{ backgroundColor: accent === "#18181b" ? "#27272a" : accent }}
          >
            {initials}
          </div>

          <h1
            className="font-bold tracking-tight leading-tight"
            style={{ fontSize: "var(--rf-name, 24px)" }}
          >
            {personalInfo.fullName || "John Doe"}
          </h1>
          <p
            className="text-zinc-400 mt-1 font-medium"
            style={{ fontSize: "var(--rf-title, 12px)" }}
          >
            {personalInfo.jobTitle || "Software Engineer"}
          </p>

          {/* Contact Details */}
          <div
            className="mt-6 space-y-2 text-zinc-300"
            style={{ fontSize: "var(--rf-sub, 10px)" }}
          >
            {contactItems.map((item, i) => (
              <div key={i} className="break-all">
                <span className="text-zinc-500 uppercase tracking-wider block text-[9px]">{item.label}</span>
                <span className="text-zinc-200">{item.val}</span>
              </div>
            ))}
          </div>

          {/* Skills in Sidebar */}
          {skillList.length > 0 && (
            <div className="mt-6">
              <h2
                className="font-bold uppercase tracking-widest text-zinc-400 mb-2 border-b border-zinc-800 pb-1"
                style={{ fontSize: "var(--rf-sec-heading, 10px)" }}
              >
                Core Skills
              </h2>
              <div
                className="space-y-1 text-zinc-200"
                style={{ fontSize: "var(--rf-sub, 10px)" }}
              >
                {skillList.slice(0, 10).map((skill, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-zinc-500 text-[9px]">•</span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education in Sidebar */}
          {education && education.length > 0 && (
            <div className="mt-6">
              <h2
                className="font-bold uppercase tracking-widest text-zinc-400 mb-2 border-b border-zinc-800 pb-1"
                style={{ fontSize: "var(--rf-sec-heading, 10px)" }}
              >
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} style={{ fontSize: "var(--rf-sub, 10px)" }}>
                    <p className="font-semibold text-white">{edu.degree}</p>
                    <p className="text-zinc-400" style={{ fontSize: "calc(var(--rf-sub, 10px) * 0.95)" }}>{edu.school}</p>
                    <p className="text-zinc-500" style={{ fontSize: "calc(var(--rf-sub, 10px) * 0.9)" }}>{edu.startDate} – {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className="bg-white flex flex-col justify-between text-[#18181b]"
        style={{ padding: "var(--resume-pad, 36px)" }}
      >
        <div className="flex flex-col" style={{ gap: "var(--resume-gap, 14px)" }}>
          {/* Profile Summary */}
          {summary && (
            <section>
              <h2
                className="font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-1"
                style={{
                  fontSize: "var(--rf-sec-heading, 11px)",
                  marginBottom: "calc(var(--resume-gap, 14px) * 0.35)",
                }}
              >
                Professional Profile
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
                className="font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-1"
                style={{
                  fontSize: "var(--rf-sec-heading, 11px)",
                  marginBottom: "calc(var(--resume-gap, 14px) * 0.45)",
                }}
              >
                Work Experience
              </h2>
              <div className="flex flex-col" style={{ gap: "calc(var(--resume-gap, 14px) * 0.85)" }}>
                {experience.slice(0, 3).map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3
                        className="font-bold text-zinc-950"
                        style={{ fontSize: "var(--rf-item-title, 12px)" }}
                      >
                        {exp.role}
                      </h3>
                      <span
                        className="text-zinc-500"
                        style={{ fontSize: "var(--rf-sub, 10.5px)" }}
                      >
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div
                      className="font-semibold text-zinc-600 mb-0.5"
                      style={{ fontSize: "var(--rf-sub, 11px)" }}
                    >
                      {exp.company}
                    </div>
                    {exp.description && (
                      <p
                        className="text-zinc-700 whitespace-pre-line"
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

          {/* Featured Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2
                className="font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-1"
                style={{
                  fontSize: "var(--rf-sec-heading, 11px)",
                  marginBottom: "calc(var(--resume-gap, 14px) * 0.45)",
                }}
              >
                Featured Projects
              </h2>
              <div className="flex flex-col" style={{ gap: "calc(var(--resume-gap, 14px) * 0.7)" }}>
                {projects.slice(0, 2).map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <h3
                        className="font-semibold text-zinc-950"
                        style={{ fontSize: "var(--rf-item-title, 12px)" }}
                      >
                        {proj.name}
                      </h3>
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
        </div>
      </main>
    </div>
  );
}
