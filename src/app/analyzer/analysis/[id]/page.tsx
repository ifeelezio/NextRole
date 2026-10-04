import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import AnalysisCard from "@/components/AnalysisCard";
import { btnGhost } from "@/components/styles";
import Reveal from "@/components/Reveal";

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!analysis) {
    notFound();
  }

  // Generate public URL for the resume if available
  let resumeUrl = "";
  if (analysis.resume_url) {
    const { data } = supabase.storage
      .from("resumes")
      .getPublicUrl(analysis.resume_url);
    resumeUrl = data.publicUrl;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Actions */}
      <Reveal>
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <Link
               href="/dashboard"
               className={`${btnGhost} text-muted hover:text-fg -ml-3`}
            >
               Back to Dashboard
            </Link>
            
            {resumeUrl && (
               <a 
                 href={resumeUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className={`${btnGhost} text-accent hover:bg-accent/10`}
               >
                 View Original Resume
               </a>
            )}
         </div>

         <div>
            <h1 className="text-3xl font-semibold text-fg tracking-tight">
               {analysis.job_title || "General Analysis"}
            </h1>
            <p className="text-subtle mt-1 text-sm flex items-center gap-2">
               {analysis.company_name && <span>{analysis.company_name}</span>}
               {analysis.company_name && <span className="h-1 w-1 rounded-full bg-line" />}
               <span>
                  Analyzed on {new Date(analysis.created_at).toLocaleDateString()}
               </span>
            </p>
         </div>
      </Reveal>

      {/* Main Analysis Display */}
      <div className="mt-8">
         <AnalysisCard analysis={analysis} />
      </div>

      {/* Job Description (If provided) */}
      {analysis.job_description && (
        <Reveal delay={0.2} className="mt-12">
           <div className="glass-panel p-8">
              <h3 className="text-lg font-semibold text-fg mb-4">
                 Original Job Description
              </h3>
              <div className="glass-layer p-4 rounded-xl border border-line overflow-hidden max-h-64 overflow-y-auto">
                 <p className="whitespace-pre-wrap text-sm text-subtle leading-relaxed">
                   {analysis.job_description}
                 </p>
              </div>
           </div>
        </Reveal>
      )}
    </div>
  );
}
