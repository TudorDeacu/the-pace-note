-- Table for storing automatic translations
CREATE TABLE public.translations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    ro_text text NOT NULL UNIQUE,
    en_text text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Secure it with RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read translations
CREATE POLICY "Translations are viewable by everyone" ON public.translations
    FOR SELECT USING (true);

-- API can insert them (using Service Role key implicitly in server components, 
-- or we can open it up for authenticated requests if strictly needed, 
-- but Next.js API routes run with admin privileges if configured correctly.
-- For now, allow inserts to facilitate the auto-cache via public calls, but ideally restrict to a service role later).
CREATE POLICY "Translations can be inserted by anyone" ON public.translations
    FOR INSERT WITH CHECK (true);
