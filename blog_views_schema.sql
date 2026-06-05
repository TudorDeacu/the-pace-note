-- Add views column to articles table if it doesn't exist
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;

-- Create a secure function to increment views
-- We use SECURITY DEFINER so that any user (even anonymous) can increment the views
-- without needing UPDATE permissions on the whole articles table.
CREATE OR REPLACE FUNCTION increment_article_views(article_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.articles
  SET views = COALESCE(views, 0) + 1
  WHERE slug = article_slug;
END;
$$;
