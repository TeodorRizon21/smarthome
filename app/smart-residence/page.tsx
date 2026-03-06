import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ProductCarousel from '@/components/ProductCarousel';
import { prisma } from '@/lib/prisma';
import { CATEGORIES } from '@/lib/categories';
import ProductList from '@/components/ProductList';
import Newsletter from '@/components/Newsletter';
import type { Product } from '@/lib/types';

// Hotspots for the interactive house image
const houseHotspots = [
  {
    x: 20, y: 30,
    label: "Hub",
    desc: "Centrul de control al casei inteligente. Conectează și gestionează toate dispozitivele smart.",
  },
  {
    x: 40, y: 20,
    label: "Smart Lights",
    desc: "Controlează iluminatul casei de la distanță sau automatizat.",
  },
  {
    x: 75, y: 25,
    label: "Smart Intercom",
    desc: "Comunică ușor cu vizitatorii și controlează accesul în locuință.",
  },
  {
    x: 60, y: 60,
    label: "Smart Thermostat",
    desc: "Reglează temperatura pentru confort și eficiență energetică.",
  },
  {
    x: 30, y: 70,
    label: "Blinds",
    desc: "Jaluzele automate pentru controlul luminii și intimității.",
  },
  {
    x: 80, y: 80,
    label: "AC",
    desc: "Aer condiționat inteligent pentru un climat perfect.",
  },
];

export default async function SmartResidencePage() {
  const prismaProducts = await prisma.product.findMany({
    include: { colorVariants: true },
    orderBy: { createdAt: 'desc' },
  });
  
  type PrismaProduct = typeof prismaProducts[number];
  
  const products = prismaProducts.map((p: PrismaProduct) => ({
    ...p,
    pdfUrl: p.pdfUrl ?? null,
    colorVariants: p.colorVariants.map((v: typeof p.colorVariants[number]) => ({
      ...v,
      oldPrice: v.oldPrice ?? null
    }))
  }));

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 overflow-hidden">
        <Image
          src="/smart-residence.jpg"
          alt="Smart Residence Hero"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
        <div className="absolute z-10 text-center w-full px-4 max-w-[1250px] left-1/2 -translate-x-1/2">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
            Smart Residence
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-6 max-w-3xl mx-auto drop-shadow">
            Transformă-ți locuința într-un spațiu inteligent, sigur și eficient energetic.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🏠 Control Total
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🔐 Securitate Avansată
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              💡 Iluminat Smart
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🌡️ Climat Inteligent
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Smart House Layout */}
      <section className="py-16 px-4">
        <div className="max-w-[1250px] mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">Explorează Casa Inteligentă</h2>
        <div className="relative w-full max-w-3xl mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
          <img src="/img1.jpg" alt="Smart House" className="w-full h-full object-cover" />
          {houseHotspots.map((dot, idx) => (
            <div
              key={idx}
              className="absolute group"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Dot */}
              <div className="w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-lg cursor-pointer animate-pulse" />
              {/* Tooltip */}
              <div className="absolute left-1/2 top-0 z-10 hidden group-hover:block min-w-[180px] -translate-x-1/2 -translate-y-full bg-white text-blue-900 text-sm rounded-lg shadow-lg px-4 py-2 mt-2">
                <div className="font-bold">{dot.label}</div>
                <div>{dot.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-4">Atinge sau plasează cursorul pe puncte pentru detalii.</p>
        </div>
      </section>

      {/* Animated Info Cards */}
      <section className="py-16 px-4">
        <div className="max-w-[1250px] mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">Cum îți îmbunătățește viața o casă smart?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* TODO: Add cool animations to these cards */}
          <div className="bg-blue-50 rounded-xl p-8 shadow-lg text-center transition-transform hover:scale-105">
            <div className="text-5xl mb-4">💡</div>
            <h3 className="text-xl font-semibold mb-2">Confort Personalizat</h3>
            <p>Controlezi luminile, temperatura și dispozitivele din orice colț al casei, direct de pe telefon.</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-8 shadow-lg text-center transition-transform hover:scale-105">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Siguranță Avansată</h3>
            <p>Monitorizezi și securizezi locuința cu senzori, camere și alerte inteligente, oriunde te-ai afla.</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-8 shadow-lg text-center transition-transform hover:scale-105">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Eficiență Energetică</h3>
            <p>Optimizezi consumul de energie și reduci costurile cu soluții smart pentru fiecare cameră.</p>
          </div>
        </div>
        </div>
      </section>

      {/* What is a Smart Home Section */}
      <section className="py-16 px-4">
        <div className="max-w-[1250px] mx-auto w-full flex flex-col md:flex-row items-center gap-12">
        {/* TODO: Add animated illustration or video */}
        <div className="flex-1 flex justify-center">
          <div className="w-64 h-64 bg-blue-100 rounded-full flex items-center justify-center text-6xl text-blue-400">
            🏠
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">Ce este o casă inteligentă?</h2>
          <p className="text-lg text-gray-700 mb-4">O casă inteligentă integrează tehnologia pentru a-ți oferi control, siguranță și confort sporit. Dispozitivele smart comunică între ele și pot fi gestionate de la distanță, adaptându-se nevoilor tale zilnice.</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Automatizare pentru lumină, climat și securitate</li>
            <li>Control vocal și de la distanță</li>
            <li>Monitorizare în timp real</li>
          </ul>
        </div>
        </div>
      </section>

      

      {/* How We Can Help Section */}
      <section className="py-16 px-4">
        <div className="max-w-[1250px] mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-900">Cum te putem ajuta cu proiectele de smart residence?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-transform hover:scale-105">
            <div className="text-5xl mb-4">🏡</div>
            <h3 className="text-xl font-semibold mb-2">Case individuale & vile</h3>
            <ul className="list-disc text-left pl-4 text-gray-700 space-y-2">
              <li>Control total pentru lumină, climat, jaluzele și securitate</li>
              <li>Acces smart cu amprentă, cod sau telefon</li>
              <li>Monitorizare video și alerte instant</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-transform hover:scale-105">
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold mb-2">Blocuri de apartamente</h3>
            <ul className="list-disc text-left pl-4 text-gray-700 space-y-2">
              <li>Interfonie video și acces controlat pentru locatari</li>
              <li>Lifturi care se cheamă automat când te apropii de clădire</li>
              <li>Iluminat și climatizare pe zone comune, automatizate</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-transform hover:scale-105">
            <div className="text-5xl mb-4">🏘️</div>
            <h3 className="text-xl font-semibold mb-2">Cartiere rezidențiale & gated communities</h3>
            <ul className="list-disc text-left pl-4 text-gray-700 space-y-2">
              <li>Barieră automată cu recunoaștere a plăcuței de înmatriculare</li>
              <li>Management centralizat pentru toate locuințele</li>
              <li>Acces vizitatori și livrări cu cod temporar</li>
            </ul>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-10 text-center text-gray-600 text-base md:text-lg">
          <p>
            Indiferent de tipul proiectului, oferim soluții personalizate pentru confort, siguranță și eficiență energetică. De la controlul inteligent al locuinței până la automatizări pentru întregul ansamblu rezidențial, suntem partenerul tău de încredere pentru un viitor smart.
          </p>
        </div>
        </div>
      </section>

      {/* Product Scroller */}
      <section className="w-full bg-blue-50 py-16 px-4">
        <div className="max-w-[1250px] mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-900">Produse Smart pentru Casa Ta</h2>
          <div className="mt-8">
            <ProductCarousel products={products} />
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
} 