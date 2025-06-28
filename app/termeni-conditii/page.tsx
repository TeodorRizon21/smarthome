import React from "react";

export default function TermeniConditiiPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">Termeni și Condiții</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">1. Despre Noi</h2>
          <p className="text-gray-700 mb-2">
            Site-ul <b>www.smarthomemall.ro</b> se află în proprietatea și administrarea <b>[COMPANIA TA]</b>, cu sediul social în București, Str. Exemplu 123.
            <br />Număr de ordine în Registrul Comerțului: [J00/0000/2024], Cod Unic de Înregistrare: [RO00000000].
          </p>
          <p className="text-gray-700 mb-2">
            <b>Contact:</b><br />
            Adresă de corespondență: Str. Exemplu 123, București<br />
            Program de lucru: L-V 09:00 – 18:00<br />
            Telefon: <a href="tel:+40712345678" className="text-blue-600 underline">+40 712 345 678</a><br />
            E-mail: <a href="mailto:office@smarthomemall.ro" className="text-blue-600 underline">office@smarthomemall.ro</a>
          </p>
          <p className="text-gray-700">
            Folosirea acestui site implică acceptarea termenilor și condițiilor de mai jos. Recomandăm citirea cu atenție a acestora. [COMPANIA TA] își asumă dreptul de a modifica aceste prevederi fără o altă notificare. Cea mai recentă versiune poate fi găsită accesând această pagină.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">2. Proprietatea Intelectuală</h2>
          <p className="text-gray-700 mb-2">
            Conținutul și designul <b>www.smarthomemall.ro</b>, precum și orice alt material având legătură cu acesta trimis prin email sau furnizat dumneavoastră prin orice altă modalitate (ex: articole, design, descriere produse și orice alte materiale), sunt proprietatea exclusivă a [COMPANIA TA] și/sau colaboratorilor săi (acolo unde este specificat în mod expres) și sunt protejate de legislația privind proprietatea intelectuală.
          </p>
          <p className="text-gray-700 mb-2">
            Nu puteți utiliza, reproduce sau permite nimănui să utilizeze sau să reproducă materialele <b>www.smarthomemall.ro</b> fără permisiune scrisă, prealabilă din partea [COMPANIA TA].
          </p>
          <p className="text-gray-700 mb-2">
            Este permisă crearea limitată, revocabilă și neexclusivă a hiperlinkurilor către pagina de index a <b>www.smarthomemall.ro</b>, atâta timp cât această acțiune nu prezintă serviciul într-o lumină falsă, înșelătoare, derogatorie sau ofensivă.
          </p>
          <p className="text-gray-700">
            Sesizările cu privire la eventuale încălcări ale drepturilor de autor pe site-ul <b>www.smarthomemall.ro</b> se pot raporta în scris pe adresa de e-mail <a href="mailto:office@smarthomemall.ro" className="text-blue-600 underline">office@smarthomemall.ro</a>.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">3. Înregistrarea ca utilizator</h2>
          <p className="text-gray-700 mb-2">
            <b>www.smarthomemall.ro</b> poate fi accesat gratuit, iar simpla navigare nu este condiționată de înregistrare. Pentru anumite servicii (ex: achiziționarea produselor, primirea newsletterului, verificarea comenzilor), este necesară crearea unui cont de utilizator.
          </p>
          <p className="text-gray-700 mb-2">
            Înregistrarea presupune acceptarea prealabilă a termenilor și condițiilor și a Politicii de Confidențialitate. Aceste reglementări constituie baza contractuală a raporturilor dintre utilizatori și [COMPANIA TA].
          </p>
          <p className="text-gray-700 mb-2">
            Dacă folosiți informații din acest site, sunteți responsabil pentru păstrarea confidențialității datelor de acces și pentru toate activitățile efectuate din contul dumneavoastră.
          </p>
          <p className="text-gray-700 mb-2">
            <b>www.smarthomemall.ro</b> poate vinde produse pentru copii sub 14 ani, dar doar adulților autorizați să efectueze plăți. Dacă aveți sub 14 ani, puteți achiziționa produse doar cu ajutorul unui părinte sau tutore.
          </p>
          <p className="text-gray-700">
            [COMPANIA TA] își rezervă dreptul de a închide conturi, de a modifica sau elimina conținut, sau de a refuza vânzarea de produse, la propria discreție.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">4. Datele Personale</h2>
          <p className="text-gray-700 mb-2">
            Prin înregistrarea ca utilizator al <b>www.smarthomemall.ro</b> vă vom solicita o serie de date personale (nume, email, data nașterii etc.) pentru identificare și pentru a vă oferi serviciile dorite. Pentru newsletter sau alerte, este necesară o adresă de e-mail validă.
          </p>
          <p className="text-gray-700">
            <b>www.smarthomemall.ro</b> nu solicită și nu stochează informații referitoare la cardurile bancare ale clienților, acestea fiind procesate direct pe serverele furnizorului de servicii de plată online.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">5. Procedura de cumpărare</h2>
          <p className="text-gray-700 mb-2">
            <b>www.smarthomemall.ro</b> depune toate eforturile pentru a fi cât mai precis. Totuși, nu garantăm că descrierile produselor sau alte materiale sunt fără erori. Dacă un produs este diferit față de descriere, îl puteți returna conform Politicii de returnare și legislației în vigoare.
          </p>
          <p className="text-gray-700 mb-2">
            Pentru a cumpăra produse, este necesară parcurgerea următorilor pași: identificarea produselor, înregistrarea ca utilizator, efectuarea plății. Plata se poate face online, ramburs sau prin transfer bancar.
          </p>
          <p className="text-gray-700">
            Prin lansarea unei comenzi pe <b>www.smarthomemall.ro</b>, sunteți de acord cu forma de comunicare (telefonică sau prin e-mail) prin care site-ul își derulează operațiunile.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">6. Livrarea comenzilor</h2>
          <p className="text-gray-700 mb-2">
            Livrarea se face doar pe teritoriul României, prin curier rapid. Pentru produsele aflate în stoc, livrarea se face în 3 zile lucrătoare. Pentru precomenzi, livrarea se face în maxim 90 de zile.
          </p>
          <p className="text-gray-700 mb-2">
            Comenzile cu valoare mai mare de 150 RON beneficiază de livrare gratuită. Pentru comenzile sub această valoare, se percepe un cost de livrare afișat în coșul de cumpărături.
          </p>
          <p className="text-gray-700">
            Produsele sunt livrate în ambalajul original, sigilat, al producătorului (cu excepția produselor resigilate).
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">7. Cum cumpăr și plătesc</h2>
          <p className="text-gray-700 mb-2">
            Prețurile afișate pe <b>www.smarthomemall.ro</b> includ TVA. Plata se poate face prin transfer bancar, numerar la livrare sau online cu cardul.
          </p>
          <p className="text-gray-700 mb-2">
            În cazul unor erori de preț sau caracteristici, [COMPANIA TA] are dreptul să anuleze comanda. Dacă nu sunteți de acord cu propunerile noastre, comanda poate fi anulată.
          </p>
          <p className="text-gray-700">
            Pentru a cumpăra, selectați produsul, adăugați-l în coș, introduceți datele personale și finalizați comanda. Veți primi detalii pe email.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">8. Garanție și service postvânzare</h2>
          <p className="text-gray-700 mb-2">
            Toate produsele comercializate de <b>www.smarthomemall.ro</b> beneficiază de garanția legală de 2 ani pentru produsele de folosință îndelungată, precum și de garanția de conformitate conform Legii 449/2003.
          </p>
          <p className="text-gray-700">
            Pentru detalii legate de garanție, contactați-ne la <a href="mailto:office@smarthomemall.ro" className="text-blue-600 underline">office@smarthomemall.ro</a>.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">9. Returnarea produselor</h2>
          <p className="text-gray-700 mb-2">
            Renunțarea la cumpărare se poate face în termen de 14 zile de la primirea produsului, doar pentru persoane fizice, conform O.U.G. 34/2014.
          </p>
          <p className="text-gray-700 mb-2">
            Produsele returnate trebuie să fie în aceeași stare în care au fost livrate. Cheltuielile de returnare sunt suportate de client, iar rambursarea se face în maxim 14 zile prin transfer bancar.
          </p>
          <p className="text-gray-700">
            Adresa pentru trimiterea coletului: Str. Exemplu 123, București, România.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">10. Recenzii, comentarii, comunicări și conținut</h2>
          <p className="text-gray-700 mb-2">
            Utilizatorii pot posta recenzii, comentarii sau alte tipuri de conținut, atâta timp cât acestea nu sunt ilegale, obscene, amenințătoare, defăimătoare sau nu încalcă dreptul la intimitate sau proprietatea intelectuală.
          </p>
          <p className="text-gray-700 mb-2">
            [COMPANIA TA] are dreptul, dar nu obligația, de a elimina sau edita conținutul postat de utilizatori.
          </p>
          <p className="text-gray-700">
            Prin postarea de conținut, transmiteți drepturile de proprietate intelectuală către [COMPANIA TA] și garantați că dețineți aceste drepturi.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">11. Forța Majoră</h2>
          <p className="text-gray-700">
            [COMPANIA TA] și furnizorii săi nu pot fi făcuți responsabili pentru întârzieri sau erori cauzate de factori externi (ex: lipsa conexiunii la internet, viruși, acces neautorizat, etc.).
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">12. Publicitatea</h2>
          <p className="text-gray-700">
            <b>www.smarthomemall.ro</b> poate afișa reclame la produse proprii sau ale terților. Prin utilizarea site-ului și acceptarea termenilor, vă exprimați acordul de a primi astfel de comunicări comerciale.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">13. Reclamații privind încălcarea drepturilor de proprietate intelectuală</h2>
          <p className="text-gray-700">
            Dacă observați conținut care încalcă drepturile de proprietate intelectuală, vă rugăm să ne contactați la <a href="mailto:office@smarthomemall.ro" className="text-blue-600 underline">office@smarthomemall.ro</a>.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">14. Legislația aplicabilă</h2>
          <p className="text-gray-700">
            Serviciile oferite de [COMPANIA TA] prin <b>www.smarthomemall.ro</b> sunt guvernate de legislația română. În caz de litigiu, se va încerca o rezolvare pe cale amiabilă, iar dacă nu este posibil, litigiile se vor soluționa de instanțele competente din București.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">15. Prezentarea ofertei</h2>
          <p className="text-gray-700">
            [COMPANIA TA] își rezervă dreptul de a opera oricând modificări asupra prețurilor și datelor tehnice prezente pe site, fără notificare prealabilă. Fotografiile au caracter informativ și pot exista diferențe față de produsul real.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">16. Politica privind protecția datelor personale</h2>
          <p className="text-gray-700">
            Conform cerințelor legale, <b>www.smarthomemall.ro</b> administrează în condiții de siguranță datele personale furnizate de utilizatori, doar pentru scopurile specificate (informare, comenzi, evaluare produse, marketing etc.).
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">17. Conciliere</h2>
          <p className="text-gray-700">
            Dacă aveți probleme legate de o comandă, care nu pot fi rezolvate prin email sau telefonic, puteți solicita conciliere internă gratuită la <a href="tel:+40712345678" className="text-blue-600 underline">+40 712 345 678</a> sau <a href="mailto:office@smarthomemall.ro" className="text-blue-600 underline">office@smarthomemall.ro</a>.
          </p>
        </section>
        <div className="text-xs text-gray-400 text-center mt-8">
          <p>
            Acest document este un model. Informațiile legale vor fi completate ulterior conform specificațiilor companiei SmartHomeMall.
          </p>
        </div>
      </div>
    </main>
  );
} 