import Image from 'next/image';
import IntercomSetup from '@/components/IntercomSetup';
import IntercomFeatures from '@/components/IntercomFeatures';
import Newsletter from '@/components/Newsletter';
import { Button } from '@/components/ui/button';

export default function SmartIntercomPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-900 overflow-hidden">
        <Image
          src="/smart-intercom.jpg"
          alt="Smart Intercom"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-indigo-900/60 mix-blend-multiply" />
        <div className="absolute z-10 text-center w-full px-4 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
            Smart Intercom
          </h1>
          <p className="text-lg md:text-2xl text-indigo-100 mb-6 max-w-3xl mx-auto drop-shadow">
            Transformă intrarea în casa ta într-o experiență inteligentă și sigură
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🎥 Video HD
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🔐 Acces Securizat
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              📱 Control din Aplicație
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🔔 Notificări Instant
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Setup Process */}
      <IntercomSetup />

      {/* Features Section */}
      <IntercomFeatures />

      {/* Use Cases Section */}
      <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-indigo-900">
            Scenarii de Utilizare
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Pentru Familii",
                icon: "👨‍👩‍👧‍👦",
                scenarios: [
                  "Monitorizare copii când ajung acasă",
                  "Acces pentru bone sau îngrijitori",
                  "Comunicare cu vizitatori când nu ești acasă",
                  "Înregistrare video pentru siguranță"
                ]
              },
              {
                title: "Pentru Business",
                icon: "🏢",
                scenarios: [
                  "Control acces angajați",
                  "Programare vizite",
                  "Monitorizare livrări",
                  "Istoric complet al accesului"
                ]
              },
              {
                title: "Pentru Vacanțe",
                icon: "🏖️",
                scenarios: [
                  "Acces pentru oaspeți Airbnb",
                  "Monitorizare de la distanță",
                  "Coduri temporare de acces",
                  "Comunicare cu servicii de curățenie"
                ]
              }
            ].map((useCase) => (
              <div 
                key={useCase.title}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-4">
                  {useCase.title}
                </h3>
                <ul className="space-y-3">
                  {useCase.scenarios.map((scenario) => (
                    <li key={scenario} className="flex items-start gap-2">
                      <span className="text-indigo-500">✓</span>
                      <span className="text-gray-700">{scenario}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Securitate și Confidențialitate
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0">
                  🔒
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Criptare End-to-End</h3>
                  <p className="text-indigo-100">
                    Toate comunicațiile video și audio sunt criptate pentru maximă siguranță
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0">
                  👁️
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Control Total asupra Datelor</h3>
                  <p className="text-indigo-100">
                    Tu decizi cât timp se păstrează înregistrările și cine are acces la ele
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0">
                  🛡️
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Protecție Avansată</h3>
                  <p className="text-indigo-100">
                    Sistem anti-tamper și alertare în timp real la activități suspecte
                  </p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl transform -rotate-3"></div>
              <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl">
                <Image
                  src="/sigla smart home.svg"
                  alt="Security Visualization"
                  fill
                  className="p-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
} 