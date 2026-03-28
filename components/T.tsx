"use client";

import { useTranslationContext } from "@/context/TranslationContext";
import { useEffect, useState } from "react";

export default function T({ children }: { children: React.ReactNode }) {
    // TEMPORARILY DISABLED TRANSLATION:
    // Simply return the pristine string (Romanian text)
    return <>{children}</>;

    /*
    const { language, dictionary, isLoading } = useTranslationContext();
    const [translatedText, setTranslatedText] = useState<string | null>(null);
    const textToTranslate = typeof children === "string" ? children : null;

    useEffect(() => {
        let isMounted = true;

        async function fetchTranslation() {
            if (language === "ro" || !textToTranslate) {
                if (isMounted) setTranslatedText(null);
                return;
            }

            // 1. Check local pre-loaded dictionary first (Instant)
            if (dictionary[textToTranslate]) {
                if (isMounted) setTranslatedText(dictionary[textToTranslate]);
                return;
            }

            // 2. Fallback to API translation (which also caches it in DB for everyone else)
            // Wait for dictionary to finish loading before falling back to avoid race conditions
            if (isLoading) return;

            try {
                const res = await fetch("/api/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: textToTranslate, targetLang: language }),
                });

                if (!res.ok) {
                    console.warn("Translation API returned an error step, ignoring gracefully for:", textToTranslate);
                    return;
                }

                const data = await res.json();
                if (data.translation && isMounted) {
                    setTranslatedText(data.translation);
                }
            } catch (error) {
                console.error("Auto-translation error:", error);
            }
        }

        fetchTranslation();

        return () => {
            isMounted = false;
        };
    }, [language, textToTranslate, dictionary, isLoading]);

    // Render the original text if we are in Romanian OR if we haven't found a translation yet
    return <>{translatedText || children}</>;
    */
}
