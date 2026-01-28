"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main>
        {/* Hero Section */}
        <div className="relative isolate px-6 pt-14 lg:px-8 h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* Placeholder for Hero Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-zinc-900 to-black opacity-80" />
            <div className="absolute inset-0 bg-[url('/images/ultrace_gatti.jpeg')] bg-cover bg-center -z-20 opacity-60 mix-blend-overlay"></div>
          </div>
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
            <h1 className="text-4xl font-black tracking-tighter text-white sm:text-6xl uppercase italic transform -skew-x-12">
              {t.home.hero_title}
            </h1>
            {/*}
            <p className="mt-6 text-lg leading-8 text-zinc-300 font-medium tracking-wide">
              {t.home.hero_subtitle}
             </p>
            */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/blog"
                className="rounded-none bg-[#E9482F] px-8 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-red-500 hover:scale-105 transition-all uppercase tracking-widest"
              >
                {t.home.hero_cta_blog}
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-white uppercase tracking-widest hover:text-red-500 transition-colors">
                {t.home.hero_cta_about} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Viziune Section */}
        <div className="bg-black py-24 sm:py-32 border-y border-zinc-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl uppercase mb-6">
                  {t.home.vision_title}
                </h2>
                <div className="prose prose-invert lg:prose-xl">
                  <p className="text-zinc-300 leading-relaxed text-justify">
                    {t.home.vision_p1}
                  </p>
                  <p className="text-zinc-400 mt-4 text-justify">
                    {t.home.vision_p2}
                  </p>
                </div>
              </div>
              {/* Abstract/Texture Image Placeholder */}
              <div className="relative h-64 lg:h-full min-h-[400px] bg-zinc-900 overflow-hidden grayscale">
                <div className="absolute inset-0 bg-[url('/images/visiontpn.jpeg')] bg-cover bg-center opacity-50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Orange Tainted Dreams Banner */}
        <div className="bg-black w-full py-12 flex items-center justify-center border-b border-zinc-900">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter text-center">
            {t.home.dreams_title_1} <span className="text-transparent bg-clip-text bg-[#E9482F]">{t.home.dreams_title_2}</span>
          </h2>
        </div>

        {/* Split Section: Image & Despre Noi */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          <div className="relative h-96 md:h-auto bg-zinc-900">
            {/* Placeholder for Car Detail Image */}
            <div className="absolute inset-0 bg-[url('/images/homepage_gif.gif')] bg-cover bg-center grayscale"></div>
            <div className="absolute bottom-10 left-10 p-4 bg-black/80 backdrop-blur-sm">
              <h3 className="text-white text-4xl font-bold uppercase whitespace-pre-line">{t.home.story_title}</h3>
            </div>
          </div>
          <div className="bg-[#E9482F] p-12 lg:p-24 flex flex-col justify-center">
            <h2 className="text-white text-4xl font-bold uppercase mb-8">{t.home.vision_title}</h2> {/* Reusing Vision title for now, or could use Story title if different */}
            <p className="text-white/90 text-lg leading-relaxed mb-8 font-medium">
              {t.home.story_desc}
            </p>
            <Link href="/about" className="inline-block bg-white text-red-600 px-8 py-3 font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all text-center w-fit">
              {t.home.story_cta}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
