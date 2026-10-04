"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ResumeData, ResumeLayout, ExperienceItem, EducationItem, ProjectItem, ResumeSettings } from "@/lib/types";
import { defaultResumeData, TEMPLATE_PREVIEWS } from "@/lib/default-resume";
import DocumentViewer from "@/components/DocumentViewer";
import ResumeDocument from "@/components/ResumeDocument";
import { GlassInput, GlassTextarea } from "@/components/GlassComponents";
import { exportResumeToPdf } from "@/lib/pdf-export";
import { ArrowLeft } from "lucide-react";

function BuilderContent() {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template") as ResumeLayout | null;

  const [data, setData] = useState<ResumeData>(() => {
    if (templateParam && TEMPLATE_PREVIEWS[templateParam]) {
      return {
        ...TEMPLATE_PREVIEWS[templateParam],
        id: "res-" + Date.now(),
        updatedAt: new Date().toISOString(),
      };
    }
    return {
      ...defaultResumeData,
      id: "res-" + Date.now(),
      updatedAt: new Date().toISOString(),
    };
  });

  // Editor navigation
  const [activeSection, setActiveSection] = useState<
    "personal" | "summary" | "experience" | "education" | "skills" | "projects"
  >("personal");

  // Mobile tab state
  const [mobileTab, setMobileTab] = useState<"edit" | "preview" | "design">("edit");

  // Autosave status
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>("Just now");

  // Preview zoom
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Right panel tab state (AI Assistant vs Design)
  const [rightPanelTab, setRightPanelTab] = useState<"ai" | "design">("ai");

  // AI Assistant state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLoadingMessage, setAiLoadingMessage] = useState("");

  // Audit data & interactive questions
  const [auditData, setAuditData] = useState<{
    scoreEstimate: number;
    strengths: string[];
    missingElements: string[];
    questionsToAsk: Array<{
      id: string;
      section: "personal" | "summary" | "experience" | "education" | "skills" | "projects" | "general";
      question: string;
      hint?: string;
      suggestedAnswer?: string;
    }>;
  } | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  // Upgrades & prompts
  const [targetRoleInput, setTargetRoleInput] = useState("");
  const [customAiPrompt, setCustomAiPrompt] = useState("");

  // Changelog & rollback
  const [aiResultChangelog, setAiResultChangelog] = useState<string[] | null>(null);
  const [aiResultMessage, setAiResultMessage] = useState<string | null>(null);
  const [previousResumeSnapshot, setPreviousResumeSnapshot] = useState<ResumeData | null>(null);

  // AI Assistant sub-mode (Commands, 1-by-1 Interview, Project Studio)
  const [aiMode, setAiMode] = useState<"copilot" | "interview" | "project">("copilot");

  // Step-by-Step 1-by-1 Interview State
  const [stepQuestion, setStepQuestion] = useState<{
    id: string;
    section: "personal" | "summary" | "experience" | "education" | "skills" | "projects" | "general";
    question: string;
    hint?: string;
    suggestedAnswer?: string;
  } | null>(null);
  const [stepAnswerInput, setStepAnswerInput] = useState("");
  const [stepCompletedIds, setStepCompletedIds] = useState<string[]>([]);
  const [stepProgress, setStepProgress] = useState<{
    currentStep: number;
    totalSteps: number;
    isComplete: boolean;
  } | null>(null);

  // Field Project Studio State
  const [fieldTopicInput, setFieldTopicInput] = useState("");
  const [generatedProject, setGeneratedProject] = useState<ProjectItem | null>(null);

  // Direct PDF Export State
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportStatusMessage, setExportStatusMessage] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("resume_builder_active");
    if (saved && !templateParam) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.personalInfo) {
          setData(parsed);
        }
      } catch (e) {
        console.error("Could not parse saved resume", e);
      }
    }
  }, [templateParam]);

  // Debounced autosave
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    setSaveStatus("saving");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      const updated = { ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem("resume_builder_active", JSON.stringify(updated));

      try {
        const listStr = localStorage.getItem("user_resumes_list");
        const list: ResumeData[] = listStr ? JSON.parse(listStr) : [];
        const existingIdx = list.findIndex((r) => r.id === updated.id);
        if (existingIdx >= 0) {
          list[existingIdx] = updated;
        } else {
          list.unshift(updated);
        }
        localStorage.setItem("user_resumes_list", JSON.stringify(list));
      } catch (e) {
        console.error(e);
      }

      setSaveStatus("saved");
      setLastSavedTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 800);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [data]);

  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateSettings = <K extends keyof ResumeSettings>(field: K, value: ResumeSettings[K]) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, [field]: value },
    }));
  };

  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: "exp-" + Date.now(),
      role: "Job Title",
      company: "Company Name",
      location: "City, State",
      startDate: "2022",
      endDate: "Present",
      current: true,
      description: "Key responsibility or achievement here",
    };
    setData((prev) => ({ ...prev, experience: [newItem, ...prev.experience] }));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string | boolean | undefined) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
  };

  const addEducation = () => {
    const newItem: EducationItem = {
      id: "edu-" + Date.now(),
      degree: "Degree / Field of Study",
      school: "Institution Name",
      location: "City, State",
      startDate: "2018",
      endDate: "2022",
    };
    setData((prev) => ({ ...prev, education: [...prev.education, newItem] }));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string | undefined) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  };

  const addProject = () => {
    const newItem: ProjectItem = {
      id: "proj-" + Date.now(),
      name: "Project Name",
      description: "Description of the project impact and implementation",
      technologies: "Tech Stack",
      link: "github.com/project",
    };
    setData((prev) => ({ ...prev, projects: [...prev.projects, newItem] }));
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: string | undefined) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      setExportStatusMessage("Generating PDF...");
      await exportResumeToPdf(data, (msg) => setExportStatusMessage(msg));
      setAiResultMessage(`Downloaded ${data.personalInfo.fullName || "Resume"}_Resume.pdf`);
    } catch (err) {
      console.error("Direct PDF export failed:", err);
      setAiResultMessage(
        err instanceof Error
          ? `PDF export failed: ${err.message}`
          : "PDF export failed. Please check browser permissions or use the Print button."
      );
    } finally {
      setIsExportingPdf(false);
      setExportStatusMessage("");
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const runAiAudit = async () => {
    setAiLoading(true);
    setAiLoadingMessage("Auditing entire resume and analyzing missing details...");
    try {
      const res = await fetch("/api/ai/builder-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "audit_and_ask",
          resumeData: data,
        }),
      });
      const json = await res.json();
      if (json.audit) {
        setAuditData(json.audit);
        const answers: Record<string, string> = {};
        json.audit.questionsToAsk.forEach((q: { id: string }) => {
          answers[q.id] = "";
        });
        setUserAnswers(answers);
      }
    } catch (e) {
      console.error("AI audit failed", e);
    } finally {
      setAiLoading(false);
      setAiLoadingMessage("");
    }
  };

  const handleApplyAnswers = async () => {
    if (!auditData) return;
    const answered = auditData.questionsToAsk
      .map((q) => ({
        question: q.question,
        answer: (userAnswers[q.id] || "").trim(),
      }))
      .filter((qa) => qa.answer.length > 0);

    if (answered.length === 0) {
      alert("Please provide at least one answer or click a suggestion.");
      return;
    }

    setAiLoading(true);
    setAiLoadingMessage("Weaving your answers into high-impact resume content...");
    try {
      const res = await fetch("/api/ai/builder-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "answer_and_apply",
          resumeData: data,
          qaAnswers: answered,
        }),
      });
      const json = await res.json();
      if (json.improvedResume) {
        setPreviousResumeSnapshot(data);
        setData(json.improvedResume);
        setAiResultChangelog(json.changelog || ["Applied answers and upgraded resume"]);
        setAiResultMessage(json.message || "Resume upgraded successfully!");
        setAuditData(null);
      }
    } catch (e) {
      console.error("AI apply answers failed", e);
    } finally {
      setAiLoading(false);
      setAiLoadingMessage("");
    }
  };

  const runWholeResumeUpgrade = async (
    actionType: "improve_all" | "tailor" | "custom_prompt",
    promptOverride?: string,
  ) => {
    setAiLoading(true);
    setAiLoadingMessage(
      actionType === "tailor"
        ? `Tailoring resume for ${targetRoleInput || "target role"}...`
        : actionType === "custom_prompt"
        ? "Executing custom AI prompt..."
        : "Upgrading all bullet points with action verbs and quantifiable metrics...",
    );

    try {
      const res = await fetch("/api/ai/builder-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          resumeData: data,
          targetRole: actionType === "tailor" ? targetRoleInput : undefined,
          userPrompt: actionType === "custom_prompt" ? (promptOverride || customAiPrompt) : undefined,
        }),
      });
      const json = await res.json();
      if (json.improvedResume) {
        setPreviousResumeSnapshot(data);
        setData(json.improvedResume);
        setAiResultChangelog(json.changelog || ["Upgraded resume content"]);
        setAiResultMessage(json.message || "Resume upgraded successfully!");
      }
    } catch (e) {
      console.error("AI upgrade failed", e);
    } finally {
      setAiLoading(false);
      setAiLoadingMessage("");
    }
  };

  const handleUndoUpgrade = () => {
    if (previousResumeSnapshot) {
      setData(previousResumeSnapshot);
      setPreviousResumeSnapshot(null);
      setAiResultChangelog(null);
      setAiResultMessage("Reverted to previous version.");
    }
  };

  const handleInlineAiPolish = async (
    target: "summary" | "experience" | "skills",
    id?: string,
  ) => {
    setAiLoading(true);
    setAiLoadingMessage(`AI polishing ${target}...`);
    try {
      let prompt = "";
      if (target === "summary") {
        prompt = `Polish and elevate the professional summary into a high-impact 2-3 sentence executive hook highlighting core technical skills and proven business results. Current summary: "${data.summary}"`;
      } else if (target === "experience") {
        const item = data.experience.find((e) => e.id === id);
        prompt = `Upgrade the bullet points for role "${item?.role} at ${item?.company}" using strong action verbs (Architected, Spearheaded, Engineered) and quantifiable metrics following the Google XYZ formula. Current text:\n${item?.description}`;
      } else if (target === "skills") {
        prompt = `Categorize and format these skills into clean, professional groups (e.g. Languages: ..., Frameworks: ..., Cloud & Tools: ...). Current skills: "${data.skills}"`;
      }

      const res = await fetch("/api/ai/builder-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "custom_prompt",
          resumeData: data,
          userPrompt: prompt,
        }),
      });
      const json = await res.json();
      if (json.improvedResume) {
        setPreviousResumeSnapshot(data);
        setData(json.improvedResume);
        setAiResultChangelog(json.changelog || [`Polished ${target}`]);
        setAiResultMessage(json.message || `Updated ${target}`);
      }
    } catch (e) {
      console.error("Inline AI polish failed", e);
    } finally {
      setAiLoading(false);
      setAiLoadingMessage("");
    }
  };

  const handleStepInterview = async (action: "init" | "answer" | "skip", answerOverride?: string) => {
    setAiLoading(true);
    setAiLoadingMessage(
      action === "answer"
        ? "Weaving answer into live resume..."
        : "Preparing next consultation question...",
    );

    try {
      const stepAnswerPayload =
        action === "answer" && stepQuestion
          ? {
              questionId: stepQuestion.id,
              section: stepQuestion.section,
              question: stepQuestion.question,
              answer: answerOverride || stepAnswerInput,
            }
          : undefined;

      const newCompleted =
        stepQuestion && (action === "answer" || action === "skip")
          ? [...stepCompletedIds, stepQuestion.id]
          : stepCompletedIds;

      const res = await fetch("/api/ai/builder-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "step_interview",
          resumeData: data,
          stepAnswer: stepAnswerPayload,
        }),
      });

      const json = await res.json();
      if (json.improvedResume && action === "answer") {
        setPreviousResumeSnapshot(data);
        setData(json.improvedResume);
        setAiResultChangelog(json.changelog || ["Updated resume with your answer"]);
        setAiResultMessage("Applied your answer to the live document!");
      }

      setStepCompletedIds(newCompleted);
      setStepQuestion(json.nextQuestion || null);
      setStepProgress(json.progress || null);
      setStepAnswerInput("");
    } catch (e) {
      console.error("Step interview failed", e);
    } finally {
      setAiLoading(false);
      setAiLoadingMessage("");
    }
  };

  const handleGenerateFieldProject = async (topicOverride?: string) => {
    const topic = topicOverride || fieldTopicInput || "Distributed Systems";
    setAiLoading(true);
    setAiLoadingMessage(`Researching and architecting project for "${topic}"...`);

    try {
      const res = await fetch("/api/ai/builder-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_field_project",
          fieldOrTopic: topic,
          targetRole: data.personalInfo?.jobTitle || "Software Engineer",
        }),
      });

      const json = await res.json();
      if (json.project) {
        setGeneratedProject(json.project);
        setAiResultMessage(`Architected project: ${json.project.name}`);
      }
    } catch (e) {
      console.error("Generate project failed", e);
    } finally {
      setAiLoading(false);
      setAiLoadingMessage("");
    }
  };

  const handleAddProjectToResume = (projToAdd?: ProjectItem) => {
    const target = projToAdd || generatedProject;
    if (!target) return;
    setPreviousResumeSnapshot(data);
    setData((prev) => ({
      ...prev,
      projects: [target, ...(prev.projects || [])],
    }));
    setAiResultMessage(`Added "${target.name}" to your resume!`);
    setAiResultChangelog([`Added portfolio project: ${target.name}`]);
  };


  const templates: { id: ResumeLayout; label: string }[] = [
    { id: "minimal", label: "Minimal" },
    { id: "modern", label: "Modern" },
    { id: "professional", label: "Professional" },
    { id: "developer", label: "Developer" },
    { id: "creative", label: "Creative" },
    { id: "executive", label: "Executive" },
  ];

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-black text-white">
      {/* WORKSPACE TOOLBAR */}
      <div className="no-print h-12 border-b border-white/[0.08] liquid-glass-nav px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-white transition-colors group"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-semibold tracking-tight text-white uppercase text-[11px] hidden sm:inline">Next Role</span>
          </Link>
          <div className="h-3 w-px bg-white/10" />
          <Link
            href="/dashboard"
            className="text-xs text-[#a1a1aa] hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <div className="h-3 w-px bg-white/10" />
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData((p) => ({ ...p, title: e.target.value }))}
            className="bg-transparent text-xs font-semibold text-white focus:bg-white/[0.08] rounded px-2 py-1 outline-none border border-transparent focus:border-white/20 transition-all max-w-[150px] sm:max-w-[220px] truncate"
            placeholder="Untitled Resume"
          />
        </div>

        {/* Center Save Status */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          {saveStatus === "saving" ? (
            <span className="text-[#a1a1aa]">Saving...</span>
          ) : (
            <span className="text-[#71717a]">Saved {lastSavedTime}</span>
          )}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {previousResumeSnapshot && (
            <button
              onClick={handleUndoUpgrade}
              className="text-xs text-[#a1a1aa] hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-all cursor-pointer"
              title="Undo AI Upgrade"
            >
              Undo
            </button>
          )}

          <div className="flex rounded-lg border border-white/10 p-0.5 liquid-glass-control">
            <button
              onClick={() => {
                setRightPanelTab("ai");
                if (!auditData) runAiAudit();
              }}
              className={`text-xs font-medium px-3 py-1 rounded-md transition-all cursor-pointer ${
                rightPanelTab === "ai"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-[#a1a1aa] hover:text-white"
              }`}
            >
              AI Assistant
            </button>
            <button
              onClick={() => setRightPanelTab("design")}
              className={`text-xs font-medium px-3 py-1 rounded-md transition-all cursor-pointer ${
                rightPanelTab === "design"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-[#a1a1aa] hover:text-white"
              }`}
            >
              Design
            </button>
          </div>

          <div className="flex items-center gap-1.5 ml-1">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="bg-white text-black font-semibold px-3.5 py-1.5 rounded-lg text-xs hover:bg-zinc-200 disabled:opacity-50 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              {isExportingPdf ? (
                <>
                  <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin shrink-0" />
                  <span>{exportStatusMessage || "Generating PDF..."}</span>
                </>
              ) : (
                "Download PDF"
              )}
            </button>
            <button
              type="button"
              onClick={handlePrintPdf}
              className="text-[#a1a1aa] hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-xs transition-colors cursor-pointer hidden md:inline-block"
              title="Open Browser Print Dialog"
            >
              Print
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE TAB CONTROLS */}
      <div className="md:hidden flex border-b border-[#27272a] bg-[#09090b] px-4 py-2 shrink-0 justify-around">
        <button
          onClick={() => setMobileTab("edit")}
          className={`text-xs font-semibold px-4 py-1.5 rounded-md transition-colors ${
            mobileTab === "edit" ? "bg-white text-black" : "text-[#a1a1aa]"
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`text-xs font-semibold px-4 py-1.5 rounded-md transition-colors ${
            mobileTab === "preview" ? "bg-white text-black" : "text-[#a1a1aa]"
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setMobileTab("design")}
          className={`text-xs font-semibold px-4 py-1.5 rounded-md transition-colors ${
            mobileTab === "design" ? "bg-white text-black" : "text-[#a1a1aa]"
          }`}
        >
          Customize
        </button>
      </div>

      {/* THREE-PANEL DESKTOP WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* ========================================================================= */}
        {/* LEFT PANEL: EDIT SECTIONS                                                 */}
        {/* ========================================================================= */}
        <div
          className={`w-full md:w-[360px] lg:w-[400px] shrink-0 border-r border-white/[0.08] liquid-glass-panel flex flex-col h-full overflow-hidden ${
            mobileTab === "edit" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Section Selector */}
          <div className="flex gap-1 overflow-x-auto p-2 border-b border-white/[0.08] shrink-0 bg-black/40">
            {(
              [
                { id: "personal", label: "Personal" },
                { id: "summary", label: "Summary" },
                { id: "experience", label: "Experience" },
                { id: "education", label: "Education" },
                { id: "skills", label: "Skills" },
                { id: "projects", label: "Projects" },
              ] as const
            ).map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  activeSection === sec.id
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. PERSONAL INFORMATION */}
            {activeSection === "personal" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Personal Information</h3>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">Contact details for your resume header.</p>
                </div>

                <GlassInput
                  label="Full Name"
                  placeholder="Alex Rivera"
                  value={data.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                />

                <GlassInput
                  label="Professional Title"
                  placeholder="Senior Software Engineer"
                  value={data.personalInfo.jobTitle}
                  onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <GlassInput
                    label="Email"
                    type="email"
                    placeholder="alex@example.com"
                    value={data.personalInfo.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  />
                  <GlassInput
                    label="Phone"
                    placeholder="+1 (555) 000-0000"
                    value={data.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  />
                </div>

                <GlassInput
                  label="Location"
                  placeholder="San Francisco, CA"
                  value={data.personalInfo.location}
                  onChange={(e) => updatePersonalInfo("location", e.target.value)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <GlassInput
                    label="Website"
                    placeholder="alexrivera.dev"
                    value={data.personalInfo.website}
                    onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  />
                  <GlassInput
                    label="LinkedIn"
                    placeholder="linkedin.com/in/alex"
                    value={data.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                  />
                </div>

                <GlassInput
                  label="GitHub"
                  placeholder="github.com/alexrivera"
                  value={data.personalInfo.github}
                  onChange={(e) => updatePersonalInfo("github", e.target.value)}
                />
              </div>
            )}

            {/* 2. SUMMARY */}
            {activeSection === "summary" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Summary</h3>
                    <p className="text-xs text-[#a1a1aa] mt-0.5">A brief professional profile.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInlineAiPolish("summary")}
                    disabled={aiLoading}
                    className="text-xs font-medium text-white px-2.5 py-1 rounded-md border border-white/20 hover:border-white/40 hover:bg-white/[0.06] transition-all cursor-pointer"
                  >
                    AI Rewrite Summary
                  </button>
                </div>

                <GlassTextarea
                  rows={8}
                  placeholder="Briefly describe your career, key skills, and impact..."
                  value={data.summary}
                  onChange={(e) => setData((p) => ({ ...p, summary: e.target.value }))}
                />
              </div>
            )}

            {/* 3. EXPERIENCE */}
            {activeSection === "experience" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Experience</h3>
                    <p className="text-xs text-[#a1a1aa] mt-0.5">Your work history.</p>
                  </div>
                  <button
                    onClick={addExperience}
                    className="text-xs font-semibold bg-white text-black px-3 py-1.5 rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Add Role
                  </button>
                </div>

                {data.experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="border border-[#27272a] bg-black rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                      <span className="text-xs font-semibold text-[#a1a1aa]">
                        Position {index + 1}
                      </span>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-xs text-[#71717a] hover:text-white transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>

                    <GlassInput
                      label="Job Title"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <GlassInput
                        label="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      />
                      <GlassInput
                        label="Location"
                        value={exp.location || ""}
                        onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <GlassInput
                        label="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      />
                      <GlassInput
                        label="End Date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                          Responsibilities & Accomplishments
                        </label>
                        <button
                          type="button"
                          onClick={() => handleInlineAiPolish("experience", exp.id)}
                          disabled={aiLoading}
                          className="text-[11px] font-medium text-white px-2 py-0.5 rounded border border-white/20 hover:border-white/40 hover:bg-white/[0.06] transition-all cursor-pointer"
                        >
                          AI Upgrade Bullets
                        </button>
                      </div>
                      <GlassTextarea
                        rows={4}
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                {data.experience.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-[#27272a] rounded-lg">
                    <p className="text-xs text-[#a1a1aa] mb-3">No work experience added yet.</p>
                    <button
                      onClick={addExperience}
                      className="text-xs font-semibold bg-white text-black px-4 py-2 rounded-md cursor-pointer"
                    >
                      Add Role
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 4. EDUCATION */}
            {activeSection === "education" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Education</h3>
                    <p className="text-xs text-[#a1a1aa] mt-0.5">Degrees and schools.</p>
                  </div>
                  <button
                    onClick={addEducation}
                    className="text-xs font-semibold bg-white text-black px-3 py-1.5 rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Add Degree
                  </button>
                </div>

                {data.education.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="border border-[#27272a] bg-black rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                      <span className="text-xs font-semibold text-[#a1a1aa]">
                        Education {index + 1}
                      </span>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-xs text-[#71717a] hover:text-white transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>

                    <GlassInput
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    />

                    <GlassInput
                      label="School"
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <GlassInput
                        label="Start Date"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                      />
                      <GlassInput
                        label="End Date"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                      />
                    </div>

                    <GlassInput
                      label="GPA / Honors (Optional)"
                      value={edu.gpa || ""}
                      onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 5. SKILLS */}
            {activeSection === "skills" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Skills</h3>
                    <p className="text-xs text-[#a1a1aa] mt-0.5">Comma-separated list of competencies.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInlineAiPolish("skills")}
                    disabled={aiLoading}
                    className="text-xs font-medium text-white px-2.5 py-1 rounded-md border border-white/20 hover:border-white/40 hover:bg-white/[0.06] transition-all cursor-pointer"
                  >
                    AI Categorize Skills
                  </button>
                </div>

                <GlassTextarea
                  rows={6}
                  label="Skills"
                  placeholder="TypeScript, React, Python, PostgreSQL, AWS..."
                  value={data.skills}
                  onChange={(e) => setData((p) => ({ ...p, skills: e.target.value }))}
                />
              </div>
            )}

            {/* 6. PROJECTS */}
            {activeSection === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Projects</h3>
                    <p className="text-xs text-[#a1a1aa] mt-0.5">Open source and portfolio work.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRightPanelTab("ai");
                        setAiMode("project");
                      }}
                      className="text-xs font-medium text-white px-2.5 py-1.5 rounded-md border border-white/20 hover:border-white/40 liquid-glass-control transition-all cursor-pointer"
                    >
                      AI Research Project
                    </button>
                    <button
                      onClick={addProject}
                      className="text-xs font-semibold bg-white text-black px-3 py-1.5 rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
                    >
                      Add Project
                    </button>
                  </div>
                </div>

                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="border border-[#27272a] bg-black rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                      <span className="text-xs font-semibold text-[#a1a1aa]">
                        Project
                      </span>
                      <button
                        onClick={() => removeProject(proj.id)}
                        className="text-xs text-[#71717a] hover:text-white transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>

                    <GlassInput
                      label="Project Name"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <GlassInput
                        label="Technologies"
                        value={proj.technologies || ""}
                        onChange={(e) => updateProject(proj.id, "technologies", e.target.value)}
                      />
                      <GlassInput
                        label="URL"
                        value={proj.link || ""}
                        onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                      />
                    </div>

                    <GlassTextarea
                      label="Description"
                      rows={3}
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER PANEL: REAL WHITE A4 RESUME PREVIEW                                */}
        {/* ========================================================================= */}
        {/* CENTER PANEL: REAL A4 CANVAS                                              */}
        {/* ========================================================================= */}
        <div
          className={`flex-1 bg-black relative overflow-hidden flex flex-col items-center ${
            mobileTab === "preview" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Floating Zoom Control Pill */}
          <div className="no-print absolute top-3.5 z-20 liquid-glass rounded-full px-3.5 py-1.5 flex items-center gap-2.5 shadow-xl">
            <span className="text-[11px] text-[#a1a1aa] font-medium pr-0.5">
              A4
            </span>
            <div className="h-3 w-px bg-white/10" />
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="text-xs font-medium px-2 py-0.5 rounded text-[#a1a1aa] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              Zoom Out
            </button>
            <span className="text-xs text-white font-mono w-9 text-center font-medium">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="text-xs font-medium px-2 py-0.5 rounded text-[#a1a1aa] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              Zoom In
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="text-[11px] text-[#71717a] hover:text-white ml-1 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Canvas */}
          <div className="flex-1 w-full overflow-y-auto p-4 sm:p-10 pt-16 sm:pt-16 flex justify-center items-start">
            <div
              style={{
                width: `${(794 * zoomLevel) / 100}px`,
                maxWidth: "100%",
                transition: "width 0.15s ease-out",
              }}
              className="origin-top shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)]"
            >
              <DocumentViewer resume={data} />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: AI ASSISTANT & DESIGN (NON-BLOCKING DUAL PANEL)              */}
        {/* ========================================================================= */}
        <div
          className={`w-full md:w-[320px] lg:w-[360px] shrink-0 border-l border-white/[0.08] liquid-glass-panel flex flex-col h-full overflow-y-auto p-5 space-y-6 ${
            mobileTab === "design" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Panel Tab Switcher */}
          <div className="flex rounded-lg border border-white/10 p-0.5 liquid-glass-control shrink-0">
            <button
              type="button"
              onClick={() => {
                setRightPanelTab("ai");
                if (!auditData) runAiAudit();
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer text-center ${
                rightPanelTab === "ai"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-[#a1a1aa] hover:text-white"
              }`}
            >
              AI Assistant
            </button>
            <button
              type="button"
              onClick={() => setRightPanelTab("design")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer text-center ${
                rightPanelTab === "design"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-[#a1a1aa] hover:text-white"
              }`}
            >
              Design &amp; Layout
            </button>
          </div>

          {/* AI ASSISTANT MODE */}
          {rightPanelTab === "ai" ? (
            <div className="space-y-6">
              {/* AI Status / Loading */}
              {aiLoading && (
                <div className="p-3 rounded-lg border border-white/20 bg-white/[0.04] flex items-center gap-3">
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin shrink-0" />
                  <p className="text-xs text-white">{aiLoadingMessage || "Processing with AI..."}</p>
                </div>
              )}

              {/* Changelog feedback */}
              {aiResultChangelog && (
                <div className="p-3.5 rounded-lg border border-white/20 bg-white/[0.03] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      {aiResultMessage || "Resume Updated"}
                    </span>
                    {previousResumeSnapshot && (
                      <button
                        type="button"
                        onClick={handleUndoUpgrade}
                        className="text-xs text-white underline hover:text-zinc-300 cursor-pointer"
                      >
                        Undo
                      </button>
                    )}
                  </div>
                  <ul className="text-[11px] text-[#a1a1aa] space-y-1 list-disc list-inside">
                    {aiResultChangelog.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Sub-mode Switcher */}
              <div className="flex rounded-lg border border-white/10 p-0.5 liquid-glass-control text-[11px] shrink-0">
                <button
                  type="button"
                  onClick={() => setAiMode("copilot")}
                  className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer text-center font-medium ${
                    aiMode === "copilot"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-[#a1a1aa] hover:text-white"
                  }`}
                >
                  Commands
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiMode("interview");
                    if (!stepQuestion && !stepProgress?.isComplete) {
                      handleStepInterview("init");
                    }
                  }}
                  className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer text-center font-medium ${
                    aiMode === "interview"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-[#a1a1aa] hover:text-white"
                  }`}
                >
                  1-by-1 Interview
                </button>
                <button
                  type="button"
                  onClick={() => setAiMode("project")}
                  className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer text-center font-medium ${
                    aiMode === "project"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-[#a1a1aa] hover:text-white"
                  }`}
                >
                  Project Studio
                </button>
              </div>

              {/* COPILOT COMMANDS MODE */}
              {aiMode === "copilot" && (
                <div className="space-y-6">
                  {/* Natural Language AI Prompt Bar */}
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  AI Command
                </label>
                <textarea
                  rows={3}
                  value={customAiPrompt}
                  onChange={(e) => setCustomAiPrompt(e.target.value)}
                  placeholder="Tell AI what to edit (e.g. Make bullet points concise, add metrics, tailor for backend)..."
                  className="liquid-glass-input w-full rounded-lg px-3 py-2 text-xs leading-relaxed focus:outline-none focus:border-white/30"
                />
                <div className="flex flex-wrap gap-1">
                  {[
                    "Make concise",
                    "Add metrics",
                    "Action verbs",
                    "Executive tone",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomAiPrompt(preset)}
                      className="text-[10px] text-[#a1a1aa] hover:text-white px-2 py-0.5 rounded bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => runWholeResumeUpgrade("custom_prompt")}
                  disabled={aiLoading || !customAiPrompt.trim()}
                  className="w-full bg-white text-black font-semibold py-2 rounded-lg text-xs hover:bg-zinc-200 disabled:opacity-30 transition-all cursor-pointer shadow-sm"
                >
                  Apply AI Command
                </button>
              </div>

              {/* Whole Resume One-Click Actions */}
              <div className="space-y-2.5 pt-2 border-t border-white/[0.08]">
                <label className="block text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Quick Upgrades
                </label>
                <button
                  type="button"
                  onClick={() => runWholeResumeUpgrade("improve_all")}
                  disabled={aiLoading}
                  className="w-full text-left p-3 rounded-lg border border-white/10 hover:border-white/30 liquid-glass-control transition-all cursor-pointer space-y-1"
                >
                  <div className="text-xs font-semibold text-white">Elevate Entire Resume</div>
                  <div className="text-[11px] text-[#a1a1aa] leading-snug">
                    Applies Google XYZ formula, action verbs, and sharpens summary.
                  </div>
                </button>

                {/* Tailor for Target Role */}
                <div className="p-3 rounded-lg border border-white/10 liquid-glass-control space-y-2">
                  <div className="text-xs font-semibold text-white">Tailor for Target Role</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={targetRoleInput}
                      onChange={(e) => setTargetRoleInput(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="liquid-glass-input flex-1 rounded px-2.5 py-1 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => runWholeResumeUpgrade("tailor")}
                      disabled={aiLoading || !targetRoleInput.trim()}
                      className="bg-white text-black font-semibold px-3 py-1 rounded text-xs hover:bg-zinc-200 disabled:opacity-30 transition-colors shrink-0 cursor-pointer"
                    >
                      Tailor
                    </button>
                  </div>
                </div>
              </div>

              {/* Missing Information & Questions Audit */}
              <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                    Audit &amp; Missing Details
                  </label>
                  <button
                    type="button"
                    onClick={runAiAudit}
                    disabled={aiLoading}
                    className="text-xs text-[#a1a1aa] hover:text-white underline cursor-pointer"
                  >
                    Refresh Audit
                  </button>
                </div>

                {auditData ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white font-medium">ATS Readiness</span>
                        <span className="text-xs font-bold text-white">{auditData.scoreEstimate}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-white h-1 rounded-full transition-all duration-500"
                          style={{ width: `${auditData.scoreEstimate}%` }}
                        />
                      </div>
                      {auditData.missingElements.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] uppercase tracking-wider text-[#71717a]">Gaps Detected:</span>
                          <ul className="text-[11px] text-[#a1a1aa] list-disc list-inside space-y-0.5">
                            {auditData.missingElements.slice(0, 3).map((gap, i) => (
                              <li key={i}>{gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Interactive Questions */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-semibold text-white block">
                        Answer to fill missing details:
                      </span>
                      {auditData.questionsToAsk.slice(0, 3).map((q) => (
                        <div
                          key={q.id}
                          className="p-3 rounded-lg border border-white/10 bg-white/[0.02] space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-white">
                              {q.section}
                            </span>
                            {q.suggestedAnswer && (
                              <button
                                type="button"
                                onClick={() => {
                                  setUserAnswers((prev) => ({
                                    ...prev,
                                    [q.id]: q.suggestedAnswer || "",
                                  }));
                                }}
                                className="text-[10px] text-[#a1a1aa] hover:text-white underline cursor-pointer"
                              >
                                Use suggested answer
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-zinc-200 leading-snug">{q.question}</p>
                          <textarea
                            rows={2}
                            value={userAnswers[q.id] || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setUserAnswers((prev) => ({ ...prev, [q.id]: val }));
                            }}
                            placeholder="Type your answer or numbers here..."
                            className="liquid-glass-input w-full rounded px-2.5 py-1.5 text-xs leading-relaxed focus:outline-none"
                          />
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleApplyAnswers}
                        disabled={aiLoading}
                        className="w-full bg-white text-black font-semibold py-2 rounded-lg text-xs hover:bg-zinc-200 disabled:opacity-30 transition-all cursor-pointer shadow-sm"
                      >
                        Apply Answers to Resume
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={runAiAudit}
                    disabled={aiLoading}
                    className="w-full py-2.5 rounded-lg border border-white/10 hover:border-white/30 text-xs text-[#a1a1aa] hover:text-white text-center liquid-glass-control transition-all cursor-pointer"
                  >
                    {aiLoading ? "Auditing..." : "Audit Resume for Missing Information"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 1-BY-1 STRATEGIC INTERVIEW MODE */}
          {aiMode === "interview" && (
            <div className="space-y-5">
              <div>
                <div className="text-xs font-semibold text-white uppercase tracking-wider mb-1">
                  1-by-1 Strategic Consultation
                </div>
                <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                  Answer targeted questions one by one. The AI will weave each answer directly into the live resume and update the preview.
                </p>
              </div>

              {stepProgress && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-[#a1a1aa]">
                    <span>Consultation Progress</span>
                    <span>
                      {stepProgress.isComplete
                        ? "Completed"
                        : `Question ${stepProgress.currentStep} of ${stepProgress.totalSteps}`}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{
                        width: stepProgress.isComplete
                          ? "100%"
                          : `${Math.min(100, (stepProgress.currentStep / stepProgress.totalSteps) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {stepProgress?.isComplete ? (
                <div className="p-5 rounded-lg border border-white/20 bg-white/[0.03] text-center space-y-3">
                  <div className="text-xs font-semibold text-white">
                    Consultation Complete
                  </div>
                  <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                    All critical sections have been reviewed and strengthened with executive wording and metrics.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleStepInterview("init")}
                    className="bg-white text-black font-semibold px-4 py-2 rounded-lg text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow-sm"
                  >
                    Start New Consultation
                  </button>
                </div>
              ) : stepQuestion ? (
                <div className="p-4 rounded-lg border border-white/20 bg-white/[0.03] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white">
                      {stepQuestion.section}
                    </span>
                    <span className="text-[10px] text-[#71717a]">
                      Step {stepProgress?.currentStep || 1}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-white leading-relaxed">
                    {stepQuestion.question}
                  </p>

                  {stepQuestion.hint && (
                    <p className="text-[11px] text-[#a1a1aa] leading-snug">
                      {stepQuestion.hint}
                    </p>
                  )}

                  {stepQuestion.suggestedAnswer && (
                    <button
                      type="button"
                      onClick={() => setStepAnswerInput(stepQuestion.suggestedAnswer || "")}
                      className="text-left p-2.5 rounded border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-[11px] text-zinc-300 hover:text-white transition-colors cursor-pointer w-full block"
                    >
                      <span className="text-[9px] uppercase tracking-wider text-[#a1a1aa] block mb-1">
                        Suggested Answer (Click to use):
                      </span>
                      &ldquo;{stepQuestion.suggestedAnswer}&rdquo;
                    </button>
                  )}

                  <textarea
                    rows={3}
                    value={stepAnswerInput}
                    onChange={(e) => setStepAnswerInput(e.target.value)}
                    placeholder="Type your answer or numbers here..."
                    className="liquid-glass-input w-full rounded-lg px-3 py-2 text-xs leading-relaxed focus:outline-none focus:border-white/30"
                  />

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleStepInterview("answer")}
                      disabled={aiLoading || !stepAnswerInput.trim()}
                      className="flex-1 bg-white text-black font-semibold py-2 rounded-lg text-xs hover:bg-zinc-200 disabled:opacity-30 transition-all cursor-pointer shadow-sm text-center"
                    >
                      {aiLoading ? "Applying..." : "Implement & Next"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepInterview("skip")}
                      disabled={aiLoading}
                      className="px-3 py-2 rounded-lg border border-white/10 text-xs text-[#a1a1aa] hover:text-white hover:border-white/30 transition-all cursor-pointer"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-lg border border-white/10 text-center space-y-3">
                  <p className="text-xs text-[#a1a1aa]">
                    Start a 1-by-1 dialogue to audit and upgrade each resume section sequentially.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleStepInterview("init")}
                    disabled={aiLoading}
                    className="bg-white text-black font-semibold px-4 py-2 rounded-lg text-xs hover:bg-zinc-200 disabled:opacity-30 transition-all cursor-pointer shadow-sm"
                  >
                    {aiLoading ? "Starting..." : "Begin 1-by-1 Consultation"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PROJECT STUDIO MODE */}
          {aiMode === "project" && (
            <div className="space-y-5">
              <div>
                <div className="text-xs font-semibold text-white uppercase tracking-wider mb-1">
                  Domain Project Architect
                </div>
                <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                  Research and architect a production-grade portfolio project tailored to any domain, complete with architecture bullets and metrics.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Field, Domain or Tech Stack
                </label>
                <input
                  type="text"
                  value={fieldTopicInput}
                  onChange={(e) => setFieldTopicInput(e.target.value)}
                  placeholder="e.g. Distributed Raft Logs, GenAI RAG Agents, Payment Ledger..."
                  className="liquid-glass-input w-full rounded-lg px-3 py-2 text-xs leading-relaxed focus:outline-none focus:border-white/30"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {[
                    "AI & LLM Agents",
                    "Distributed Systems",
                    "Fintech Payments",
                    "Collaborative Canvas",
                    "Cloud Native / K8s",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFieldTopicInput(preset);
                        handleGenerateFieldProject(preset);
                      }}
                      className="text-[10px] text-[#a1a1aa] hover:text-white px-2 py-0.5 rounded bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerateFieldProject()}
                  disabled={aiLoading || !fieldTopicInput.trim()}
                  className="w-full bg-white text-black font-semibold py-2.5 rounded-lg text-xs hover:bg-zinc-200 disabled:opacity-30 transition-all cursor-pointer shadow-sm"
                >
                  {aiLoading ? "Researching Architecture..." : "Research & Architect Project"}
                </button>
              </div>

              {/* Researched Project Preview Card */}
              {generatedProject && (
                <div className="p-4 rounded-lg border border-white/20 bg-white/[0.03] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                      Researched Portfolio Project
                    </span>
                    <span className="text-[10px] text-[#a1a1aa]">
                      {generatedProject.date || "2025"}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white mb-0.5">
                      {generatedProject.name}
                    </div>
                    <div className="text-[10px] text-[#a1a1aa] font-mono">
                      Stack: {generatedProject.technologies}
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-300 leading-relaxed whitespace-pre-line">
                    {generatedProject.description}
                  </p>

                  {generatedProject.link && (
                    <div className="text-[10px] text-[#71717a] font-mono">
                      {generatedProject.link}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleAddProjectToResume()}
                    className="w-full bg-white text-black font-semibold py-2 rounded-lg text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow-sm"
                  >
                    + Add Project to Resume
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
          ) : (
            /* DESIGN & LAYOUT MODE */
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#a1a1aa] mb-3">
                  Template
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => updateSettings("template", tpl.id)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                        data.settings.template === tpl.id
                          ? "bg-white text-black font-semibold border-white shadow-sm"
                          : "liquid-glass-control text-[#a1a1aa] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#a1a1aa] mb-3">
                  Font Family
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "inter", label: "Sans" },
                    { id: "serif", label: "Serif" },
                    { id: "mono", label: "Mono" },
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => updateSettings("fontFamily", font.id as "inter" | "serif" | "mono")}
                      className={`px-2 py-1.5 text-xs rounded-lg border transition-all text-center cursor-pointer ${
                        data.settings.fontFamily === font.id
                          ? "bg-white text-black font-semibold border-white shadow-sm"
                          : "liquid-glass-control text-[#a1a1aa] hover:border-white/20"
                      }`}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizing & Margins */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#a1a1aa] mb-2">
                    Font Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["small", "medium", "large"] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => updateSettings("fontSize", sz)}
                        className={`py-1.5 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                          data.settings.fontSize === sz
                            ? "bg-white text-black font-semibold border-white shadow-sm"
                            : "liquid-glass-control text-[#a1a1aa] hover:border-white/20"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#a1a1aa] mb-2">
                    Margins
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["compact", "normal", "spacious"] as const).map((mg) => (
                      <button
                        key={mg}
                        onClick={() => updateSettings("margins", mg)}
                        className={`py-1.5 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                          data.settings.margins === mg
                            ? "bg-white text-black font-semibold border-white shadow-sm"
                            : "liquid-glass-control text-[#a1a1aa] hover:border-white/20"
                        }`}
                      >
                        {mg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Export PDF */}
              <div className="pt-6 border-t border-white/[0.08] space-y-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf}
                  className="w-full bg-white text-black font-semibold py-2.5 rounded-lg text-xs hover:bg-zinc-200 disabled:opacity-50 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {isExportingPdf ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin shrink-0" />
                      <span>{exportStatusMessage || "Generating PDF..."}</span>
                    </>
                  ) : (
                    "Download A4 PDF"
                  )}
                </button>
                <div className="flex justify-between items-center px-1">
                  <span className="text-[11px] text-[#71717a]">Prefer print dialog?</span>
                  <button
                    type="button"
                    onClick={handlePrintPdf}
                    className="text-[11px] text-[#a1a1aa] hover:text-white underline cursor-pointer"
                  >
                    Print Vector
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Dedicated Offscreen PDF Export & Print Target (Always mounted at root, never blocked by tabs or overflow) */}
      <div
        id="resume-pdf-export-target"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "794px",
          minHeight: "1123px",
          zIndex: -99999,
          pointerEvents: "none",
          backgroundColor: "#ffffff",
        }}
        aria-hidden="true"
      >
        <ResumeDocument resume={data} id="resume-document-to-print" />
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-black text-xs text-[#71717a]">
          Loading editor...
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
