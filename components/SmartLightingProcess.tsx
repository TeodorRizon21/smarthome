"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const PROCESS_STEPS = [
  {
    image: '/detectare.jpg',
    icon: '🌅',
    title: 'Detectare automată',
    description: 'Senzorii detectează prezența și nivelul de lumină naturală',
    color: 'from-orange-100 to-yellow-200',
    highlight: 'bg-orange-100'
  },
  {
    image: '/procesare.jpg',
    icon: '🧠',
    title: 'Procesare inteligentă',
    description: 'Sistemul analizează datele și determină setările optime',
    color: 'from-blue-100 to-blue-200',
    highlight: 'bg-blue-100'
  },
  {
    image: '/ajustare.jpg',
    icon: '⚡',
    title: 'Ajustare dinamică',
    description: 'Luminile se adaptează automat la condițiile ambientale',
    color: 'from-purple-100 to-purple-200',
    highlight: 'bg-purple-100'
  },
  {
    image: '/control.jpg',
    icon: '📱',
    title: 'Control total',
    description: 'Controlează totul din aplicație sau prin comenzi vocale',
    color: 'from-green-100 to-green-200',
    highlight: 'bg-green-100'
  }
];

export default function SmartLightingProcess() {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  return (
    <section className="relative w-full py-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16">
          Cum funcționează iluminatul inteligent?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Interactive Process Display */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeStep}
                  className={`w-full h-full rounded-xl overflow-hidden bg-gradient-to-br ${PROCESS_STEPS[activeStep].color} shadow-md`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image 
                    src={PROCESS_STEPS[activeStep].image}
                    alt={PROCESS_STEPS[activeStep].title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Connection Lines */}
            <div className="absolute -right-4 top-1/2 w-8 h-1 bg-blue-200 hidden md:block" />
          </div>

          {/* Steps List */}
          <div className="flex flex-col gap-4">
            {PROCESS_STEPS.map((step, index) => (
              <motion.button
                key={step.title}
                className={`w-full p-6 rounded-xl transition-all duration-300 ${
                  activeStep === index 
                    ? `${step.highlight} shadow-md transform translate-x-4` 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleStepClick(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm">
                    {step.icon}
                  </span>
                  <div className="text-left flex-1">
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Benefits Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { icon: '💡', text: 'Reducere consum până la 60%', color: 'bg-yellow-50' },
            { icon: '🌱', text: 'Sustenabil și eco-friendly', color: 'bg-green-50' },
            { icon: '⚙️', text: 'Întreținere minimă', color: 'bg-blue-50' },
            { icon: '🎯', text: 'Control precis și personalizat', color: 'bg-purple-50' }
          ].map(benefit => (
            <motion.div
              key={benefit.text}
              className={`${benefit.color} p-4 rounded-xl text-center shadow-sm`}
              whileHover={{ y: -5 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-3xl mb-2 block">{benefit.icon}</span>
              <p className="text-sm font-medium text-gray-700">{benefit.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 