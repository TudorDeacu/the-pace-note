"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";

interface TranslationContextType {
    language: string;
    setLanguage: (lang: string) => void;
    dictionary: Record<string, string>;
    isLoading: boolean;
    t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState("ro");
    const [dictionary, setDictionary] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    // Load initial language from localStorage or default
    useEffect(() => {
        const storedLang = localStorage.getItem("app_lang");
        if (storedLang) {
            setLanguageState(storedLang);
        }
    }, []);

    // Load dictionary when app starts or language changes
    useEffect(() => {
        async function loadDictionary() {
            if (language === "ro") {
                setIsLoading(false);
                return; // Romanian is native, no need to load
            }

            setIsLoading(true);
            try {
                // Fetch the entire English dictionary cache at once to prevent N+1 API calls
                const { data, error } = await supabase
                    .from("translations")
                    .select("ro_text, en_text");

                if (data && !error) {
                    const dict: Record<string, string> = {};
                    data.forEach((row) => {
                        if (row.en_text) {
                            dict[row.ro_text] = row.en_text;
                        }
                    });
                    setDictionary(dict);
                }
            } catch (err) {
                console.error("Failed to load dictionary:", err);
            } finally {
                setIsLoading(false);
            }
        }

        loadDictionary();
    }, [language, supabase]);

    const setLanguage = (lang: string) => {
        setLanguageState(lang);
        localStorage.setItem("app_lang", lang);
    };

    const t = (key: string) => {
        if (language === "ro" || !key) return key;
        return dictionary[key] || key;
    };

    return (
        <TranslationContext.Provider value={{ language, setLanguage, dictionary, isLoading, t }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslationContext() {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error("useTranslationContext must be used within a TranslationProvider");
    }
    return context;
}
