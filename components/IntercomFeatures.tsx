"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    title: "Video HD & Night Vision",
    description: "Cameră HD cu vedere nocturnă și unghi larg de 160°",
    icon: "🎥",
    color: "from-blue-500 to-blue-600",
    details: [
      "Rezoluție 1080p",
      "Night vision IR",
      "Unghi larg de vizualizare",
      "Senzor de mișcare"
    ]
  },
  {
    title: "Audio Bidirectional",
    description: "Comunicare clară în ambele sensuri cu reducere de zgomot",
    icon: "🔊",
    color: "from-purple-500 to-purple-600",
    details: [
      "Microfon HD",
      "Reducere zgomot",
      "Echo cancellation",
      "Volum ajustabil"
    ]
  },
  {
    title: "Control Acces",
    description: "Multiple metode de acces și management utilizatori",
    icon: "🔐",
    color: "from-green-500 to-green-600",
    details: [
      "Coduri PIN",
      "Carduri RFID",
      "Amprentă digitală",
      "Recunoaștere facială"
    ]
  },
  {
    title: "Smart Integration",
    description: "Integrare cu ecosistemul smart home și automatizări",
    icon: "🏠",
    color: "from-orange-500 to-orange-600",
    details: [
      "Control din aplicație",
      "Integrare Alexa/Google",
      "Automatizări IFTTT",
      "API deschis"
    ]
  }
];

export default function IntercomFeatures() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,indigo-900_1px,transparent_0)] [background-size:40px_40px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-indigo-900">
          Funcționalități Avansate
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300
                ${activeFeature === index ? 'bg-gradient-to-br ' + feature.color + ' text-white' : 'bg-white hover:bg-indigo-50'}`}
              onHoverStart={() => {
                setActiveFeature(index);
                setIsHovering(true);
              }}
              onHoverEnd={() => {
                setIsHovering(false);
              }}
              initial={false}
              animate={{
                scale: activeFeature === index ? 1.05 : 1,
                zIndex: activeFeature === index ? 10 : 1
              }}
            >
              {/* Feature Card Content */}
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center text-3xl
                  ${activeFeature === index ? 'bg-white/20' : 'bg-indigo-50'}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2
                  ${activeFeature === index ? 'text-white' : 'text-indigo-900'}`}>
                  {feature.title}
                </h3>
                <p className={activeFeature === index ? 'text-white/90' : 'text-gray-600'}>
                  {feature.description}
                </p>

                {/* Feature Details */}
                <motion.div
                  initial={false}
                  animate={{
                    height: activeFeature === index ? 'auto' : 0,
                    opacity: activeFeature === index ? 1 : 0
                  }}
                  className="overflow-hidden"
                >
                  <ul className="mt-4 space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <motion.li
                        key={detail}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ 
                          x: activeFeature === index ? 0 : -20,
                          opacity: activeFeature === index ? 1 : 0
                        }}
                        transition={{ delay: detailIndex * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-white/90">•</span>
                        <span className={activeFeature === index ? 'text-white/90' : 'text-gray-600'}>
                          {detail}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0"
                initial={false}
                animate={{
                  opacity: activeFeature === index ? 0.1 : 0
                }}
                style={{
                  background: `radial-gradient(circle at ${isHovering ? '50%' : '100%'} ${isHovering ? '50%' : '100%'}, ${activeFeature === index ? 'white' : 'transparent'} 0%, transparent 70%)`
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 