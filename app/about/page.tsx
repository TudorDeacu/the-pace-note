"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";

export default function About() {

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase"><T>Despre Noi</T></h2>

                        <h3 className="mt-6 text-2xl font-semibold leading-8 text-white uppercase"><T>Pasiunea pentru Motorsport</T></h3>

                        <p className="mt-6 text-lg leading-8 text-zinc-300">
                            <T>The Pace Note a luat naștere din dorința de a aduce mai aproape de fani acțiunea, adrenalina și poveștile nescrise din motorsportul românesc și internațional.</T>
                        </p>
                        <p className="mt-6 text-lg leading-8 text-zinc-300">
                            <T>Suntem o echipă de entuziaști, piloți amatori și jurnaliști dedicați, uniți de mirosul de benzină și sunetul motoarelor turate la maximum.</T>
                        </p>
                        <p className="mt-6 text-lg leading-8 text-zinc-300 font-bold italic">
                            <T>Misiunea noastră este să oferim conținut de calitate, analize detaliate și reportaje de la fața locului, acoperind totul, de la raliuri și viteză în coastă, până la sim racing și track days.</T>
                        </p>
                        <p className="mt-6 text-lg leading-8 text-zinc-300">
                            <T>Credem cu tărie în educația auto și promovăm conducerea defensivă pe drumurile publice, încurajând pasionații să-și testeze limitele doar într-un cadru organizat, pe circuit.</T>
                        </p>
                        <p className="mt-6 text-lg leading-8 text-zinc-300">
                            <T>Alătură-te comunității noastre și hai să împărtășim împreună pasiunea pentru tot ce înseamnă cu adevărat 'The Pace Note' - nota de dictare perfectă care te ajută să găsești trasa ideală.</T>
                        </p>
                        <p className="mt-8 text-xl font-bold leading-8 text-white uppercase tracking-widest">
                            <T>Echipa The Pace Note</T>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
