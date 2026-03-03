import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val) env[key.trim()] = val.join('=').trim().replace(/"/g, '');
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function findFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findFiles(filePath, fileList);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

async function run() {
    const files = [...findFiles('./app'), ...findFiles('./components')];
    const matches = new Set();
    const regex = /<T>\s*([\s\S]*?)\s*<\/T>/g;

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        let match;
        while ((match = regex.exec(content)) !== null) {
            const text = match[1].trim();
            if (text && !text.includes('{')) { // Ignore dynamic fragments
                matches.add(text);
            }
        }
    });

    const uniqueStrings = Array.from(matches);
    console.log(`Found ${uniqueStrings.length} unique strings to translate.`);

    // Get current DB translations
    const { data: existingData, error: dbError } = await supabase.from('translations').select('ro_text, en_text');
    if (dbError) {
        console.error('DB Error:', dbError);
        return;
    }

    const existingMap = new Map();
    existingData.forEach(row => {
        if (row.en_text && row.en_text.length > 0) {
            existingMap.set(row.ro_text, row.en_text);
        }
    });

    console.log(`Found ${existingMap.size} existing translations in DB.`);

    for (let i = 0; i < uniqueStrings.length; i++) {
        const roText = uniqueStrings[i];
        if (existingMap.has(roText)) {
            continue; // Skip already translated
        }

        console.log(`[${i + 1}/${uniqueStrings.length}] Translating: "${roText.substring(0, 30)}..."`);

        try {
            // Use MyMemory public API
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(roText)}&langpair=ro|en`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('API Error ' + res.status);

            const data = await res.json();
            const enText = data?.responseData?.translatedText;

            if (enText) {
                console.log(` -> ${enText.substring(0, 30)}...`);

                // Insert/Upsert into DB
                const { error: insertError } = await supabase.from('translations').upsert(
                    { ro_text: roText, en_text: enText },
                    { onConflict: 'ro_text' }
                );

                if (insertError) {
                    console.error('Insert error:', insertError);
                }
            }

            // Sleep to respect rate limits
            await new Promise(r => setTimeout(r, 1500));
        } catch (err) {
            console.error('Error translating:', roText, err.message);
            await new Promise(r => setTimeout(r, 3000));
        }
    }

    console.log("Done syncing translations.");
}

run();
