-- ============================================================================
-- The Pace Note — Supabase security hardening
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to run on the live database. Each statement is idempotent.
-- Read the comments; a couple of steps need YOU to fill in a value.
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────
-- 1) FIX PII LEAK: profiles must NOT be world-readable.
--    The old policy "Public profiles are viewable by everyone" (USING true)
--    exposed every user's email, phone and address to anyone with the anon key.
--    We replace it with: a user can read ONLY their own row; admins read all.
-- ─────────────────────────────────────────────────────────────────────────
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can view own profile." on public.profiles;
drop policy if exists "Admins can view all profiles." on public.profiles;

create policy "Users can view own profile."
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Admins can view all profiles."
  on public.profiles for select
  using ( exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') );

-- Prevent users from privilege-escalating by editing their own `role`.
-- (The existing UPDATE policy allows updating own row; this trigger pins `role`
--  so only a DB admin / service role can change it.)
create or replace function public.prevent_role_change()
returns trigger as $$
begin
  if new.role is distinct from old.role then
    new.role := old.role;  -- silently ignore client attempts to change role
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists profiles_pin_role on public.profiles;
create trigger profiles_pin_role
  before update on public.profiles
  for each row execute procedure public.prevent_role_change();

-- ─────────────────────────────────────────────────────────────────────────
-- 2) MAKE YOURSELF AN ADMIN
--    Replace the email with the account you log into the admin panel with.
--    (This runs as the SQL editor's service role, so the trigger above does
--     not block it.)
-- ─────────────────────────────────────────────────────────────────────────
-- update public.profiles set role = 'admin' where email = 'YOUR-ADMIN-EMAIL@example.com';

-- Verify who is admin:
-- select email, role from public.profiles where role = 'admin';

-- ─────────────────────────────────────────────────────────────────────────
-- 3) TIGHTEN STORAGE UPLOADS to admins only.
--    Currently ANY logged-in user can upload to your buckets. Only the admin
--    panel uploads (blog/gallery/product images), so restrict INSERT to admins.
--    Public READ stays open (buckets are public). TEST an admin upload after.
-- ─────────────────────────────────────────────────────────────────────────
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Authenticated Upload Galleries" on storage.objects;
drop policy if exists "Admins can upload" on storage.objects;
drop policy if exists "Admins can update objects" on storage.objects;
drop policy if exists "Admins can delete objects" on storage.objects;

create policy "Admins can upload"
  on storage.objects for insert
  with check (
    bucket_id in ('blogs','products','projects','other','galleries')
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update objects"
  on storage.objects for update
  using (
    bucket_id in ('blogs','products','projects','other','galleries')
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete objects"
  on storage.objects for delete
  using (
    bucket_id in ('blogs','products','projects','other','galleries')
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─────────────────────────────────────────────────────────────────────────
-- 4) (OPTIONAL) Lock down the translations cache.
--    Anyone can currently INSERT rows via /api/translate. The translation
--    feature is disabled in the UI right now (components/T.tsx), so you can
--    safely restrict inserts. Re-open this if you re-enable translations.
-- ─────────────────────────────────────────────────────────────────────────
-- drop policy if exists "Translations can be inserted by anyone" on public.translations;

-- ─────────────────────────────────────────────────────────────────────────
-- 5) SANITY CHECK — list every policy so you can review access.
-- ─────────────────────────────────────────────────────────────────────────
-- select schemaname, tablename, policyname, cmd, qual, with_check
-- from pg_policies where schemaname = 'public' order by tablename, policyname;
