-- AI Resume Analyzer: schema, RLS and storage.
-- Run in the Supabase SQL editor. Safe to re-run.

-- ---------- Tables ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  file_name text not null,
  file_url text, -- storage object path inside the private "resumes" bucket
  resume_text text,
  created_at timestamptz default now()
);

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete cascade,
  score integer check (score between 0 and 100),
  skills jsonb,
  strengths jsonb,
  weaknesses jsonb,
  missing_skills jsonb,
  suggestions jsonb,
  created_at timestamptz default now()
);

create table if not exists public.job_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete cascade,
  job_description text not null,
  match_percentage integer check (match_percentage between 0 and 100),
  matching_skills jsonb,
  missing_skills jsonb,
  relevant_experience jsonb,
  suggestions jsonb,
  created_at timestamptz default now()
);

-- ---------- Indexes ----------
create index if not exists resumes_user_created_idx on public.resumes (user_id, created_at desc);
create index if not exists analyses_user_created_idx on public.analyses (user_id, created_at desc);
create index if not exists analyses_resume_idx on public.analyses (resume_id);
create index if not exists job_analyses_user_created_idx on public.job_analyses (user_id, created_at desc);
create index if not exists job_analyses_resume_idx on public.job_analyses (resume_id);

-- ---------- Profile auto-creation ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.analyses enable row level security;
alter table public.job_analyses enable row level security;

-- profiles (keyed by id)
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "profiles_delete_own" on public.profiles for delete to authenticated
  using ((select auth.uid()) = id);

-- resumes
drop policy if exists "resumes_select_own" on public.resumes;
drop policy if exists "resumes_insert_own" on public.resumes;
drop policy if exists "resumes_update_own" on public.resumes;
drop policy if exists "resumes_delete_own" on public.resumes;
create policy "resumes_select_own" on public.resumes for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "resumes_insert_own" on public.resumes for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "resumes_update_own" on public.resumes for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "resumes_delete_own" on public.resumes for delete to authenticated
  using ((select auth.uid()) = user_id);

-- analyses (inserts/updates must also reference a resume the user owns)
drop policy if exists "analyses_select_own" on public.analyses;
drop policy if exists "analyses_insert_own" on public.analyses;
drop policy if exists "analyses_update_own" on public.analyses;
drop policy if exists "analyses_delete_own" on public.analyses;
create policy "analyses_select_own" on public.analyses for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "analyses_insert_own" on public.analyses for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = (select auth.uid()))
  );
create policy "analyses_update_own" on public.analyses for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = (select auth.uid()))
  );
create policy "analyses_delete_own" on public.analyses for delete to authenticated
  using ((select auth.uid()) = user_id);

-- job_analyses
drop policy if exists "job_analyses_select_own" on public.job_analyses;
drop policy if exists "job_analyses_insert_own" on public.job_analyses;
drop policy if exists "job_analyses_update_own" on public.job_analyses;
drop policy if exists "job_analyses_delete_own" on public.job_analyses;
create policy "job_analyses_select_own" on public.job_analyses for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "job_analyses_insert_own" on public.job_analyses for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = (select auth.uid()))
  );
create policy "job_analyses_update_own" on public.job_analyses for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = (select auth.uid()))
  );
create policy "job_analyses_delete_own" on public.job_analyses for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------- Storage: private "resumes" bucket, files live under <user_id>/ ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 5242880, array['application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = 5242880,
      allowed_mime_types = array['application/pdf'];

drop policy if exists "resumes_storage_select_own" on storage.objects;
drop policy if exists "resumes_storage_insert_own" on storage.objects;
drop policy if exists "resumes_storage_update_own" on storage.objects;
drop policy if exists "resumes_storage_delete_own" on storage.objects;
create policy "resumes_storage_select_own" on storage.objects for select to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "resumes_storage_insert_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "resumes_storage_update_own" on storage.objects for update to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "resumes_storage_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);
