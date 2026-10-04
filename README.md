# NextRole

An AI resume analyzer. Upload a PDF resume, get a score with strengths, weaknesses and skill gaps, compare it against a job description, and practice with generated interview questions.

## Features

- **Resume analysis:** a score out of 100, detected skills, strengths, weaknesses, missing skills and suggestions.
- **Job match:** paste a job description to get a match percentage, matching and missing skills, and tips.
- **Interview prep:** 5 technical, 5 HR and 5 project-based questions, which you can regenerate.
- **Accounts:** sign up, log in, and manage your own past analyses. Each user only sees their own data.

## Tech stack

Next.js (App Router) and TypeScript, Tailwind CSS, Supabase (Auth, PostgreSQL, Storage), Google Gemini API (Flash), deployed on Vercel. There is no separate backend: everything runs in Next.js Route Handlers and Server Components.

## How it works

1. You upload a PDF, which is validated and stored in a private Supabase bucket.
2. The server extracts the text from the PDF.
3. The text is sent to Gemini, which returns structured JSON.
4. The response is validated before it is saved to PostgreSQL.
5. You see the results on your dashboard.

## Security

- Row Level Security on every table, so users can only read and change their own rows.
- The user ID always comes from the Supabase session, never from the request.
- The Gemini API key stays on the server.
- Uploads are limited to PDFs under 5 MB, checked by MIME type and file signature.

## Getting started

```bash
npm install
cp .env.example .env.local   # add your Supabase and Gemini keys
npm run dev                  # http://localhost:3000
```

Then run `supabase/schema.sql` in the Supabase SQL editor to create the tables, security policies and storage bucket.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public (anon) key |
| `GEMINI_API_KEY` | Gemini API key (server only) |

## Limitations

- Scanned, image-only PDFs can't be read.
- AI results are for guidance only and are not a hiring decision.
- There is no rate limiting on the AI routes yet.
