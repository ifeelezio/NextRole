# AI Resume Analyzer

Upload a PDF resume, get an AI score with strengths, weaknesses and skill gaps, compare it against a job
description, and generate interview questions.

**Stack:** Next.js (App Router) + TypeScript, Tailwind CSS, Supabase (Auth, Postgres, Storage), OpenAI API, Vercel.
No separate backend: everything runs in Next.js Route Handlers and Server Components.

## 1. Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values
```

### Environment variables

| Variable | Where | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server | Supabase Project Settings -> API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser + server | The anon (public) key. RLS protects the data. |
| `OPENAI_API_KEY` | **server only** | Never prefix with `NEXT_PUBLIC_`. Only `src/lib/openai.ts` reads it. |
| `OPENAI_MODEL` | server, optional | Defaults to `gpt-4o-mini`. |

The Supabase service-role key is never used or needed.

## 1a. macOS quick start (Apple Silicon or Intel)

```bash
npm run setup     # checks Homebrew + Node >= 20.9, installs dependencies, creates .env.local
npm run dev       # Turbopack dev server on http://localhost:3000
```

Notes:
- `.nvmrc` pins Node 22 (`nvm use` / `fnm use` / `brew install node@22`).
- Everything in the stack is pure JavaScript (including `unpdf`), so there are no native modules to
  compile and no Xcode Command Line Tools are required beyond what Homebrew needs. Next.js ships
  prebuilt `darwin-arm64` and `darwin-x64` binaries.
- macOS file systems are case-insensitive by default while Vercel (Linux) is case-sensitive.
  `forceConsistentCasingInFileNames` is on so a wrong import casing fails locally instead of in production.
- `.DS_Store` and other Finder files are git-ignored; `.gitattributes` and `.editorconfig` keep line endings as LF.
- If port 3000 is busy: `npm run dev -- -p 3001`. (Avoid 5000 and 7000; AirPlay Receiver uses them.)

## 2. Supabase setup

1. Create a project at supabase.com.
2. Open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it. It creates:
   - tables `profiles`, `resumes`, `analyses`, `job_analyses` with indexes
   - a trigger that creates a `profiles` row on sign-up
   - Row Level Security on every table (users can select/insert/update/delete only rows where `auth.uid() = user_id`;
     inserts into `analyses` / `job_analyses` must also reference a resume the user owns)
   - the private `resumes` storage bucket (PDF only, 5 MB limit) with policies that restrict each user to
     their own `<user_id>/` folder
3. **Authentication -> URL Configuration:** set *Site URL* to your app URL and add these *Redirect URLs*:
   - `http://localhost:3000/auth/callback`
   - `https://<your-vercel-domain>/auth/callback`
4. Email confirmation: leave it on for production. For quick local testing you can turn it off under
   **Authentication -> Providers -> Email**.

### Database schema

```
profiles(id -> auth.users, email, full_name, created_at)
resumes(id, user_id, file_name, file_url [storage path], resume_text, created_at)
analyses(id, user_id, resume_id, score, skills, strengths, weaknesses, missing_skills, suggestions, created_at)
job_analyses(id, user_id, resume_id, job_description, match_percentage, matching_skills,
             missing_skills, relevant_experience, suggestions, created_at)
```

Deleting an analysis never deletes the resume. Deleting a user cascades to all of their rows.

## 3. Local development

```bash
npm run dev         # http://localhost:3000
npm run lint
npm run typecheck
npm test            # vitest
npm run build       # production build
```

## 4. How it works

```
Select PDF -> validate (type, size) -> upload to Storage (browser, RLS-protected)
  -> POST /api/resumes   server downloads it, checks MIME + %PDF signature, extracts text, saves resume row
  -> POST /api/analyze   server calls OpenAI, validates the JSON with zod, saves analysis
  -> redirect to /dashboard/analysis/[id]
```

Every API route: verifies the Supabase session -> takes the user id from the session (never from the request)
-> validates the body with zod -> verifies the resume belongs to that user (404 otherwise) -> only then touches
the database or OpenAI. AI output is validated against a strict schema before it is saved; invalid output
returns a 502 and nothing is stored.

| Route | Purpose |
| --- | --- |
| `POST /api/resumes` | Extract text from an uploaded PDF and create the resume record |
| `POST /api/analyze` | `{ resumeId }` -> `{ analysisId }` |
| `POST /api/job-analysis` | `{ resumeId, jobDescription }` -> match result (saved) |
| `POST /api/interview` | `{ resumeId, jobDescription }` -> 5 technical, 5 HR, 5 project questions |
| `GET /auth/callback` | Completes the email-confirmation link |

## 5. Deploy to Vercel

1. Push the repo to GitHub (`.env.local` is git-ignored).
2. Import the repo in Vercel (framework preset: Next.js).
3. Add the environment variables above in **Project Settings -> Environment Variables**.
4. Deploy, then add the production URL to Supabase's Site URL and Redirect URLs (step 2.3).
5. Smoke test: sign up, upload a PDF, open the analysis, run a job comparison.

## 6. Notes and limitations

- Scanned (image-only) PDFs have no extractable text and are rejected with a clear message.
- Interview questions are generated on demand and are not stored.
- There is no per-user rate limiting on the AI routes. Add one (e.g. a daily cap counted from the
  `analyses` table) before opening the app to the public.
- Resume text is sent to OpenAI. Tell users, and review OpenAI's data-use terms for your account.
