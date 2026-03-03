"use client";

import { useTranslationContext } from "@/context/TranslationContext";

export default function LanguageToggle() {
    const { language, setLanguage } = useTranslationContext();

    const switchLanguage = (lang: string) => {
        if (lang === language) return;
        setLanguage(lang);
    };

    return (
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            <button
                onClick={() => switchLanguage("ro")}
                className={`transition-colors hover:text-white ${language === "ro" ? "text-white" : ""}`}
            >
                RO
            </button>
            <span className="text-zinc-600">|</span>
            <button
                onClick={() => switchLanguage("en")}
                className={`transition-colors hover:text-white ${language === "en" ? "text-white" : ""}`}
            >
                EN
            </button>
        </div>
    );
}
