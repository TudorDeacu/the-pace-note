import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { text, targetLang = 'en' } = await request.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Guard against abuse of the open translations cache (anyone can POST here).
        // UI strings are short; reject anything unreasonably long.
        if (text.length > 2000) {
            return NextResponse.json({ error: 'Text too long' }, { status: 413 });
        }

        // Only allow the languages we actually support as a target.
        if (targetLang !== 'en') {
            return NextResponse.json({ error: 'Unsupported target language' }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. Check database cache first
        const { data: cachedTranslation } = await supabase
            .from('translations')
            .select('en_text')
            .eq('ro_text', text)
            .single();

        if (cachedTranslation && cachedTranslation.en_text) {
            return NextResponse.json({ translation: cachedTranslation.en_text });
        }

        // 2. Not in cache, call Lingva API (Free Google Translate mirror)
        const response = await fetch(`https://lingva.ml/api/v1/ro/${targetLang}/${encodeURIComponent(text)}`);

        if (!response.ok) {
            console.error("Lingva API Error:", response.statusText);
            return NextResponse.json({ translation: null }); // Fallback silently
        }

        const data = await response.json();
        const translatedText = data.translation;

        if (translatedText) {
            // 3. Save to database cache asynchronously (don't block the response)
            // Fire and forget
            supabase.from('translations').insert([
                { ro_text: text, en_text: translatedText }
            ]).then(({ error }) => {
                if (error) console.error("Failed to cache translation:", error);
            });

            return NextResponse.json({ translation: translatedText });
        }

        throw new Error('No translation returned');

    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
