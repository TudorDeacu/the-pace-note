-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    first_name text,
    status text DEFAULT 'subscribed', -- 'subscribed' or 'unsubscribed'
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (for the subscription form)
CREATE POLICY "Public can insert newsletter subscribers" 
    ON public.newsletter_subscribers FOR INSERT 
    WITH CHECK (true);

-- Allow admins to read/update subscribers
CREATE POLICY "Admins can manage newsletter subscribers"
    ON public.newsletter_subscribers FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
