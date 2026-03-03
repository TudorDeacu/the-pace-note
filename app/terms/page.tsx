import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import Link from "next/link";

export default function Terms() {
    return (
        <div className="bg-black min-h-screen">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-24 sm:py-32 lg:px-8 text-zinc-300">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase tracking-widest"><T>Termeni și Condiții</T></h2>
                    <p className="mt-4 text-sm leading-8 text-zinc-500 uppercase tracking-widest">
                        <T>Ultima actualizare:</T> {new Date().toLocaleDateString('ro-RO', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                <div className="space-y-16 leading-relaxed">

                    {/* SECTION 1 */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider border-b border-zinc-800 pb-4"><T>SECȚIUNEA 1: TERMENI ȘI CONDIȚII GENERALE</T></h2>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>1. Introducere</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><T>Bun venit pe The Pace Note! Acest document stabilește regulile de utilizare a site-ului</T> <Link href="/" className="text-red-500 hover:text-red-400 underline">thepacenote</Link> <T>și a magazinului nostru online.</T></li>
                                <li><T>Acceptarea termenilor: Prin accesarea site-ului, crearea unui cont, lăsarea de comentarii sau plasarea unei comenzi, ești de acord cu acești Termeni și Condiții. Dacă nu ești de acord, te rugăm să nu folosești platforma.</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>2. Drepturi de Proprietate Intelectuală</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><T>Conținutul site-ului: Toate materialele de pe acest site – incluzând, dar fără a se limita la, bloguri, texte, fotografii, videoclipuri/vloguri, logo-uri, grafică și design – aparțin The Pace Note și sunt protejate de legislația privind drepturile de autor.</T></li>
                                <li><T>Restricții: Este strict interzisă copierea, reproducerea, distribuirea sau utilizarea comercială a conținutului nostru fără acordul prealabil scris.</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>3. Contul de Utilizator</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><T>Crearea contului: Pentru a lăsa comentarii sau a face cumpărături mai ușor, utilizatorii își pot crea un cont. Vârsta minimă pentru crearea unui cont este de 16 ani.</T></li>
                                <li><T>Securitate: Utilizatorul este responsabil pentru păstrarea confidențialității parolei. Orice activitate desfășurată de pe contul tău este responsabilitatea ta.</T></li>
                                <li><T>Ștergerea contului: Ne rezervăm dreptul de a suspenda sau șterge conturile care încalcă acești Termeni și Condiții (ex: spam, limbaj inadecvat). Utilizatorul poate solicita oricând ștergerea contului.</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>4. Conținut Generat de Utilizatori (Comentarii)</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><T>Reguli de conduită: Utilizatorii pot lăsa comentarii la vloguri/bloguri. Limbajul trebuie să fie respectuos.</T></li>
                                <li><T>Sunt strict interzise: Mesajele defăimătoare, rasiste, discriminatorii, injuriile, spam-ul, promovarea altor afaceri sau orice conținut ilegal.</T></li>
                                <li><T>Moderare: Ne rezervăm dreptul de a modera, edita sau șterge fără notificare prealabilă orice comentariu care încalcă aceste reguli.</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>5. Magazinul Online (Comenzi, Prețuri și Plăți)</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><T>Produse: Facem eforturi pentru a prezenta merch-ul cât mai clar prin fotografii și descrieri. Pot exista mici diferențe de culoare în funcție de ecranul utilizatorului.</T></li>
                                <li><T>Prețuri: Toate prețurile sunt exprimate în RON/EUR și includ TVA. Costurile de livrare vor fi afișate separat înainte de finalizarea comenzii.</T></li>
                                <li><T>Plasarea comenzii: Comanda este considerată acceptată doar în momentul în care primești un e-mail de confirmare din partea noastră.</T></li>
                                <li><T>Plata: Plata se poate face online cu cardul sau prin ramburs la curier.</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>6. Livrare</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><T>Expediere: Produsele vor fi livrate prin curierat rapid în termen de 2-4 zile lucrătoare.</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>7. Limitarea Răspunderii</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><T>Ne străduim ca site-ul să funcționeze fără întreruperi, dar nu garantăm că va fi 100% lipsit de erori, bug-uri sau perioade de mentenanță.</T></li>
                                <li><T>Nu suntem răspunzători pentru eventualele daune directe sau indirecte cauzate de utilizarea site-ului sau a produselor cumpărate (în limitele permise de lege).</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>8. Legislație și Litigii</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><T>Acești Termeni și Condiții sunt guvernați de legile din România.</T></li>
                                <li><T>Orice dispută va fi rezolvată pe cale amiabilă. Dacă acest lucru nu este posibil, litigiul va fi soluționat de instanțele judecătorești competente din București.</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>9. Modificări ale Termenilor</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><T>Ne rezervăm dreptul de a actualiza acești Termeni și Condiții în orice moment. Modificările vor intra în vigoare din momentul publicării pe site.</T></li>
                            </ul>
                        </div>
                    </section>

                    {/* SECTION 2 */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider border-b border-zinc-800 pb-4"><T>SECȚIUNEA 2: POLITICA DE RETUR</T></h2>

                        <p>
                            <strong><T>Dreptul de retragere (Retur în 14 zile):</T></strong> <T>Conform OUG 34/2014, dacă te-ai răzgândit sau produsul (merch-ul) nu ți se potrivește, ai dreptul să returnezi produsele cumpărate de pe The Pace Note în termen de 14 zile calendaristice de la primirea coletului, fără a fi nevoit să justifici decizia.</T>
                        </p>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>Condiții pentru acceptarea returului</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><T>Produsele trebuie să fie noi, în aceeași stare în care au fost livrate.</T></li>
                                <li><T>Să nu fie purtate, spălate, pătate sau deteriorate.</T></li>
                                <li><T>Să aibă toate etichetele originale atașate.</T></li>
                                <li><T>Ne rezervăm dreptul de a refuza returul dacă produsul prezintă urme de uzură sau deteriorare.</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>Cum inițiezi un retur?</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><T>Trimite-ne un e-mail la</T> <a href="mailto:thepacenote.crew@gmail.com" className="text-red-500 hover:text-red-400">thepacenote.crew@gmail.com</a> <T>cu subiectul „Cerere Retur Comanda Nr. [Număr]”.</T></li>
                                <li><T>Include în e-mail: numele tău, numărul comenzii, produsul returnat și un cont IBAN valid (împreună cu numele titularului) pentru restituirea banilor.</T></li>
                                <li><T>Ambalează produsul corespunzător pentru a nu fi deteriorat la transport.</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>Expedierea și Costurile de Retur</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><T>Taxa de transport pentru returnarea produselor este suportată de cumpărător.</T></li>
                                <li><T>Trimite coletul prin orice firmă de curierat (nu prin Poșta Română cu ridicare de la ghișeu) conform instrucțiunilor de retur din e-mail.</T></li>
                                <li><T>Nu acceptăm colete trimise cu plată ramburs.</T></li>
                            </ul>
                        </div>

                        <p>
                            <strong><T>Restituirea banilor:</T></strong> <T>Odată ce coletul ajunge la noi și verificăm starea produselor, îți vom restitui contravaloarea produselor în contul bancar specificat în termen de maxim 14 zile calendaristice.</T>
                        </p>
                    </section>

                    {/* SECTION 3 */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider border-b border-zinc-800 pb-4"><T>SECȚIUNEA 3: POLITICA DE CONFIDENȚIALITATE (GDPR)</T></h2>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>Ce date personale colectăm?</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong><T>La comenzi:</T></strong> <T>Nume, prenume, adresa de livrare/facturare, telefon, e-mail.</T></li>
                                <li><strong><T>La crearea contului:</T></strong> <T>E-mail, nume de utilizator, parolă (stocată criptat).</T></li>
                                <li><strong><T>La comentarii:</T></strong> <T>Numele de utilizator și adresa IP (pentru prevenirea spam-ului).</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>De ce colectăm aceste date?</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong><T>Executarea unui contract:</T></strong> <T>Pentru expedierea comenzilor și emiterea facturilor (obligație legală).</T></li>
                                <li><strong><T>Funcționarea platformei:</T></strong> <T>Pentru acces la cont și postarea de comentarii.</T></li>
                                <li><strong><T>Comunicare:</T></strong> <T>Te vom contacta doar în legătură cu statusul comenzii tale.</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>Cine mai are acces la datele tale?</T></h3>
                            <p className="mb-2"><T>Nu vindem datele tale! Le împărtășim doar cu partenerii de încredere pentru procesarea comenzii:</T></p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong><T>Firma de curierat:</T></strong> <T>Pentru livrare.</T></li>
                                <li><strong><T>Procesatorul de plăți:</T></strong> <T>Pentru securizarea plăților.</T></li>
                                <li><strong><T>Firma de contabilitate:</T></strong> <T>Pentru înregistrarea facturilor.</T></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>Cât timp păstrăm datele?</T></h3>
                            <p><T>Datele de facturare sunt păstrate conform legislației (de regulă, 10 ani). Datele contului tău sunt păstrate atâta timp cât acesta este activ.</T></p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2"><T>Drepturile tale (GDPR)</T></h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong><T>Dreptul de acces:</T></strong> <T>Să afli ce date avem despre tine.</T></li>
                                <li><strong><T>Dreptul la rectificare:</T></strong> <T>Să modifici datele incorecte.</T></li>
                                <li><strong><T>Dreptul la ștergere („dreptul de a fi uitat”):</T></strong> <T>Ne poți cere oricând ștergerea contului și a datelor asociate (exceptând obligațiile legale).</T></li>
                                <li><T>Pentru exercitarea drepturilor, trimite-ne un e-mail la</T> <a href="mailto:thepacenote.crew@gmail.com" className="text-red-500 hover:text-red-400">thepacenote.crew@gmail.com</a><T>, iar noi vom rezolva solicitarea în maxim 30 de zile.</T></li>
                            </ul>
                        </div>
                    </section>

                    {/* SECTION 4 */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider border-b border-zinc-800 pb-4"><T>SECȚIUNEA 4: POLITICA DE UTILIZARE A COOKIE-URILOR</T></h2>

                        <p className="mb-4"><T>Acest site folosește module cookie pentru a funcționa corect și a-ți îmbunătăți experiența:</T></p>

                        <ul className="list-disc pl-5 space-y-4">
                            <li><strong><T>Cookie-uri strict necesare:</T></strong> <T>Esențiale pentru coșul de cumpărături și autentificarea în cont. Acestea nu pot fi dezactivate.</T></li>
                            <li><strong><T>Cookie-uri de analiză/statistici:</T></strong> <T>(ex: Google Analytics) Ne ajută să înțelegem cum interacționează vizitatorii cu site-ul, complet anonimizat.</T></li>
                            <li><strong><T>Cookie-uri de marketing:</T></strong> <T>(ex: Facebook Pixel/Ads) Ne ajută să îți afișăm reclame relevante pe alte platforme, dacă optezi pentru acceptarea lor.</T></li>
                        </ul>

                        <div className="mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
                            <p className="text-zinc-400">
                                <T>Pentru orice întrebări, nelămuriri sau asistență legată de comenzi, contul de utilizator sau funcționarea site-ului, ne poți contacta oricând la adresa de e-mail:</T> <a href="mailto:thepacenote.crew@gmail.com" className="text-white font-bold hover:text-red-500 transition-colors">thepacenote.crew@gmail.com</a>.
                            </p>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
