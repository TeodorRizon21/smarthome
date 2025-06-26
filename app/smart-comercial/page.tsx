import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ProductCarousel from '@/components/ProductCarousel';
import Newsletter from '@/components/Newsletter';
import { prisma } from '@/lib/prisma';
import { CATEGORIES } from '@/lib/categories';
import type { Product, ColorVariant } from '@/lib/types';

const businessSolutions = [
  {
    title: "Retail & Magazine",
    icon: "🛍️",
    features: [
      "Urmărirea inteligentă a stocurilor",
      "Sisteme automate de plată",
      "Analiza comportamentului clienților",
      "Management energetic",
      "Sisteme de securitate"
    ]
  },
  {
    title: "Hoteluri & Ospitalitate",
    icon: "🏨",
    features: [
      "Check-in/out automatizat",
      "Automatizarea camerelor",
      "Optimizare energetică",
      "Îmbunătățirea experienței oaspeților",
      "Managementul personalului"
    ]
  },
  {
    title: "Birouri & Spații de Lucru",
    icon: "🏢",
    features: [
      "Control acces",
      "Managementul sălilor de ședințe",
      "Control climatizare",
      "Monitorizare ocupare",
      "Eficiență energetică"
    ]
  }
];

const implementationSteps = [
  {
    step: "1",
    title: "Analiză & Planificare",
    icon: "📊",
    desc: "Începem cu o evaluare completă a nevoilor afacerii tale, analizând sistemele actuale și identificând oportunități pentru automatizare inteligentă.",
    details: [
      "Evaluarea locației",
      "Colectarea cerințelor",
      "Planificarea arhitecturii sistemului",
      "Analiza ROI"
    ],
    image: "/proiectare.jpg"
  },
  {
    step: "2",
    title: "Design Personalizat",
    icon: "✏️",
    desc: "Echipa noastră proiectează o soluție smart adaptată perfect cerințelor și obiectivelor afacerii tale.",
    details: [
      "Specificații tehnice",
      "Planificarea integrării",
      "Design interfață utilizator",
      "Protocoale de securitate"
    ],
    image: "/design.jpg"
  },
  {
    step: "3",
    title: "Instalare Profesională",
    icon: "🔧",
    desc: "Instalare expertă a tuturor sistemelor smart, asigurând perturbări minime ale operațiunilor afacerii tale.",
    details: [
      "Instalare hardware",
      "Implementare software",
      "Integrare sisteme",
      "Testare calitate"
    ],
    image: "/instalare.jpg"
  },
  {
    step: "4",
    title: "Training & Suport",
    icon: "🤝",
    desc: "Training comprehensiv pentru echipa ta și suport continuu pentru a asigura funcționarea optimă a sistemelor smart.",
    details: [
      "Instruirea personalului",
      "Documentație",
      "Suport 24/7",
      "Mentenanță regulată"
    ],
    image: "/suport.jpg"
  }
];

// Hotspots for the interactive office image
const officeHotspots = [
  {
    x: 25, y: 35,
    label: "Control Center",
    desc: "Centrul de control pentru întreaga clădire. Gestionează toate sistemele smart din birouri.",
  },
  {
    x: 45, y: 25,
    label: "Smart Lighting",
    desc: "Iluminat inteligent care se adaptează la prezența angajaților și la lumina naturală.",
  },
  {
    x: 70, y: 30,
    label: "Access Control",
    desc: "Sistem de control al accesului cu carduri RFID și recunoaștere facială.",
  },
  {
    x: 55, y: 60,
    label: "HVAC Smart",
    desc: "Sistem de climatizare inteligent care optimizează temperatura și calitatea aerului.",
  },
  {
    x: 35, y: 75,
    label: "Security Cameras",
    desc: "Camere de securitate cu recunoaștere facială și alertare automată.",
  },
  {
    x: 80, y: 80,
    label: "Smart Parking",
    desc: "Sistem de parcare inteligent cu ghidare automată și plățile integrate.",
  },
];

export default async function SmartComercialPage() {
  const prismaProducts = await prisma.product.findMany({
    include: { colorVariants: true },
    orderBy: { createdAt: 'desc' },
  });
  
  type PrismaProduct = typeof prismaProducts[number];
  
  const productsWithDefaults = prismaProducts.map((product: PrismaProduct) => {
    const minVariant = product.colorVariants.reduce((min: ColorVariant | null, variant: ColorVariant) => 
      (!min || variant.price < min.price) ? variant : min
    , product.colorVariants[0]);

    return {
      ...product,
      pdfUrl: product.pdfUrl ?? null,
      price: minVariant?.price ?? 0,
      oldPrice: minVariant?.oldPrice ?? null,
      tags: [],
      colorVariants: product.colorVariants.map((v: ColorVariant) => ({
        ...v,
        oldPrice: v.oldPrice ?? null
      }))
    };
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 overflow-hidden">
        <Image
          src="/smart-hotel.jpg"
          alt="Smart Commercial Hero"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
        <div className="absolute z-10 text-center w-full px-4 max-w-6xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">Smart Comercial</h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-6 max-w-3xl mx-auto drop-shadow">
            Transformă-ți afacerea cu soluții inteligente. Crește eficiența, securitatea și experiența clienților cu tehnologie de ultimă generație.
          </p>
          <Button className="bg-white text-blue-800 px-8 py-4 text-lg rounded-full font-semibold shadow-lg hover:bg-blue-50 transition-colors">
            Află mai multe
          </Button>
        </div>
      </section>

      {/* Business Solutions Grid */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900 animate-slide-up">
          Soluții Smart pentru Orice Afacere
        </h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          {businessSolutions.map((solution, index) => (
            <div
              key={solution.title}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-blue-100 animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-5xl mb-6">{solution.icon}</div>
              <h3 className="text-xl font-semibold mb-4 text-blue-900">{solution.title}</h3>
              <ul className="space-y-3">
                {solution.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-gray-700 animate-fade-in"
                    style={{ animationDelay: `${(i * 100) + (index * 200)}ms` }}
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Implementation Process */}
      <section className="bg-blue-50 py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900 animate-fade-in">
            Procesul Nostru de Implementare
          </h2>
          
          <div className="space-y-20">
            {implementationSteps.map((step, index) => (
              <div 
                key={step.step}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                } animate-slide-up`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Content Side */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-2xl font-semibold text-blue-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-lg">{step.desc}</p>
                  <ul className="grid grid-cols-2 gap-3 mt-4">
                    {step.details.map((detail, i) => (
                      <li 
                        key={i}
                        className="flex items-center text-gray-700 animate-fade-in"
                        style={{ animationDelay: `${(i * 100) + (index * 200)}ms` }}
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image Side */}
                <div className="flex-1 relative">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900 animate-fade-in">
          Beneficii Cheie
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '📊', text: 'Eficiență Operațională Crescută', color: 'bg-blue-50' },
            { icon: '💰', text: 'Reducerea Costurilor de Operare', color: 'bg-green-50' },
            { icon: '🔒', text: 'Securitate Îmbunătățită', color: 'bg-purple-50' },
            { icon: '📱', text: 'Management Centralizat', color: 'bg-yellow-50' }
          ].map((benefit, index) => (
            <div
              key={benefit.text}
              className={`${benefit.color} p-6 rounded-xl text-center shadow hover:shadow-lg transition-all duration-300 animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-4xl mb-3 block">{benefit.icon}</span>
              <p className="text-sm font-medium text-gray-700">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="w-full bg-blue-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-900 animate-fade-in">
            Produse Smart pentru Afacerea Ta
          </h2>
          <div className="mt-8">
            <ProductCarousel products={productsWithDefaults} />
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
} 