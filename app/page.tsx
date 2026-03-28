import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import T from "@/components/T";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const isVideo = (url: string) => !!url.match(/\.(mp4|webm|ogg)$/i);

export default async function Home() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', 'page-home')
        .single();
    
    // Default Fallbacks
    const heroMedia = data?.content?.heroMedia || "https://zlcqqmcvbhixcmeapofz.supabase.co/storage/v1/object/public/other/ultrace_gatti.jpeg";
    const visionMedia = data?.content?.visionMedia || "https://zlcqqmcvbhixcmeapofz.supabase.co/storage/v1/object/public/other/visiontpn.jpeg";
    const splitMedia = data?.content?.splitMedia || "https://zlcqqmcvbhixcmeapofz.supabase.co/storage/v1/object/public/other/home_gif.mp4";

    return (
        <div className="min-h-screen bg-black">
            <Navbar />

            <main>
                {/* Hero Section */}
                <div className="relative isolate px-6 pt-14 lg:px-8 h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black via-zinc-900 to-black opacity-80 z-[-15]" />
                        {isVideo(heroMedia) ? (
                            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-20 opacity-60 mix-blend-overlay grayscale" src={heroMedia}></video>
                        ) : (
                            <div className="absolute inset-0 bg-cover bg-center -z-20 opacity-60 mix-blend-overlay grayscale" style={{ backgroundImage: `url('${heroMedia}')` }}></div>
                        )}
                    </div>
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
                        <h1 className="text-4xl font-black tracking-tighter text-white sm:text-6xl uppercase italic transform -skew-x-12">
                            The Pace Note
                        </h1>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/blog"
                                className="rounded-none bg-[#E9482F] px-8 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-red-500 hover:scale-105 transition-all uppercase tracking-widest"
                            >
                                <T>Citește Blogul</T>
                            </Link>
                            <Link href="/about" className="text-sm font-semibold leading-6 text-white uppercase tracking-widest hover:text-red-500 transition-colors">
                                <T>Despre Noi</T> <span aria-hidden="true">→</span>
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
                                    <T>Viziune</T>
                                </h2>
                                <div className="prose prose-invert lg:prose-xl">
                                    <p className="text-zinc-300 leading-relaxed text-justify">
                                        <T>Viziunea noastră este de a contribui la formarea unei culturi în care motorsportul românesc este perceput și respectat la nivelul lui real, un sport complex, tehnic și profund disciplinat. Ne dorim ca The Pace Note să devină un reper de credibilitate și rigoare.</T>
                                    </p>
                                    <p className="text-zinc-400 mt-4 text-justify">
                                        <T>Nu vrem să fim doar o voce; vrem să fim standardul care arată ce se poate și ce ar trebui să fie.</T>
                                    </p>
                                </div>
                            </div>
                            {/* Abstract/Texture Image Placeholder */}
                            <div className="relative h-64 lg:h-full min-h-[400px] bg-zinc-900 overflow-hidden">
                                {isVideo(visionMedia) ? (
                                    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale" src={visionMedia}></video>
                                ) : (
                                    <div className="absolute inset-0 bg-cover bg-center opacity-50 grayscale" style={{ backgroundImage: `url('${visionMedia}')` }}></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orange Tainted Dreams Banner */}
                <div className="bg-black w-full py-12 flex items-center justify-center border-b border-zinc-900">
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter text-center">
                        Orange Tainted <span className="text-transparent bg-clip-text bg-[#E9482F]">Dreams</span>
                    </h2>
                </div>

                {/* Split Section: Image & Despre Noi */}
                <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
                    <div className="relative h-96 md:h-auto bg-zinc-900 overflow-hidden">
                        {isVideo(splitMedia) ? (
                            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover grayscale" src={splitMedia}></video>
                        ) : (
                            <div className="absolute inset-0 bg-cover bg-center grayscale" style={{ backgroundImage: `url('${splitMedia}')` }}></div>
                        )}
                    </div>
                    <div className="bg-[#E9482F] p-12 lg:p-24 flex flex-col justify-center">
                        <h2 className="text-white text-4xl font-bold uppercase mb-8 whitespace-pre-line"><T>Povestea Noastră</T></h2>
                        <p className="text-white/90 text-lg leading-relaxed mb-8 font-medium">
                            <T>The Pace Note urmărește motorsportul românesc dintr-o poziție pe care puțini o văd și și mai puțini o înțeleg. Nu explicăm, nu traducem, nu facem spectacol. Observăm. Selectăm. Notăm.</T>
                        </p>
                        <Link href="/about" className="inline-block bg-white text-red-600 px-8 py-3 font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all text-center w-fit">
                            <T>Citește Mai Mult</T>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
