import Image from 'next/image';
import ProductCarousel from '@/components/ProductCarousel';
import Newsletter from '@/components/Newsletter';
import { prisma } from '@/lib/prisma';
import MoodVideo from '@/components/MoodVideo';
import SmartLightingProcess from '@/components/SmartLightingProcess';
import type { Product } from '@/lib/types';

const MOODS = [
  { label: 'Relax', color: 'from-blue-200 to-blue-400', icon: '🛋️', time: 0 },
  { label: 'Focus', color: 'from-yellow-100 to-yellow-300', icon: '💡', time: 10 },
  { label: 'Party', color: 'from-pink-200 to-purple-400', icon: '🎉', time: 20 },
  { label: 'Night', color: 'from-gray-700 to-gray-900', icon: '🌙', time: 30 },
];

function EnergyJourney() {
  return (
    <section className="relative w-full py-20 px-4 md:px-0 bg-gradient-to-b from-blue-50 to-white overflow-x-hidden">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 flex flex-col gap-8">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Cum economisești energie cu iluminatul smart?</h2>
          <div className="relative pl-8 md:pl-0">
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 to-blue-200 rounded-full md:hidden" />
            <ul className="space-y-10 md:space-y-0 md:space-x-0 flex flex-col md:flex-row md:items-center md:gap-12">
              <li className="relative flex items-center md:flex-col md:items-start group">
                <span className="absolute -left-8 md:static md:mb-2 w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-xl shadow-lg">💡</span>
                <span className="bg-blue-100 rounded-xl px-4 py-2 shadow-md">Senzori de prezență: Luminile se aprind doar când ai nevoie.</span>
              </li>
              <li className="relative flex items-center md:flex-col md:items-start group">
                <span className="absolute -left-8 md:static md:mb-2 w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center text-white text-xl shadow-lg">🌞</span>
                <span className="bg-yellow-50 rounded-xl px-4 py-2 shadow-md">Reglare automată a intensității în funcție de lumina naturală.</span>
              </li>
              <li className="relative flex items-center md:flex-col md:items-start group">
                <span className="absolute -left-8 md:static md:mb-2 w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-white text-xl shadow-lg">🌱</span>
                <span className="bg-green-50 rounded-xl px-4 py-2 shadow-md">Scenarii personalizate pentru fiecare moment al zilei.</span>
              </li>
              <li className="relative flex items-center md:flex-col md:items-start group">
                <span className="absolute -left-8 md:static md:mb-2 w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white text-xl shadow-lg">📱</span>
                <span className="bg-purple-50 rounded-xl px-4 py-2 shadow-md">Control de la distanță și programare automată.</span>
              </li>
              <li className="relative flex items-center md:flex-col md:items-start group">
                <span className="absolute -left-8 md:static md:mb-2 w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white text-xl shadow-lg">🔋</span>
                <span className="bg-pink-50 rounded-xl px-4 py-2 shadow-md">Reduci consumul cu până la <span className="font-bold text-pink-600">60%</span> față de iluminatul clasic.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Image src="/sigla smart home.svg" alt="Smart Lighting" width={320} height={320} className="rounded-full shadow-2xl bg-white p-8" />
        </div>
      </div>
    </section>
  );
}

export default async function SmartLightingPage() {
  const prismaProducts = await prisma.product.findMany({
    include: { sizeVariants: true },
    orderBy: { createdAt: 'desc' },
  });
  
  type PrismaProduct = typeof prismaProducts[number];
  
  const products = prismaProducts.map((p: PrismaProduct) => ({
    ...p,
    pdfUrl: p.pdfUrl ?? null,
    sizeVariants: p.sizeVariants.map((v: typeof p.sizeVariants[number]) => ({
      ...v,
      oldPrice: v.oldPrice ?? null,
      lowStockThreshold: v.lowStockThreshold ?? null
    }))
  }));

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 overflow-hidden">
        <Image
          src="/pozq-light.png"
          alt="Smart Lighting Hero"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
        <div className="absolute z-10 text-center w-full px-4 max-w-6xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">Smart Lighting</h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-6 max-w-3xl mx-auto drop-shadow">
            Iluminat inteligent pentru orice stare, cu economie de energie și control total. Creează atmosfera perfectă, oricând.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              💡 Control Total
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🌈 Scene Personalizate
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🔋 Eficiență Energetică
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              📱 Control de la Distanță
            </span>
          </div>
        </div>
      </section>

      {/* Smart Lighting Process Section */}
      <SmartLightingProcess />

      {/* Interactive Mood Video Section */}
      <MoodVideo />

      {/* Product Carousel & Newsletter */}
      <section className="w-full bg-blue-50 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-900">Produse Smart pentru Iluminat</h2>
          <div className="mt-8">
            <ProductCarousel products={products} />
          </div>
        </div>
      </section>
      <Newsletter />
    </main>
  );
} 