"use client";

import { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import heroImage from '../../public/img111.jpg'
import image1 from '../../public/img11.jpg'
import image10 from '../../public/img112.jpg'
import image2 from '../../public/img113.jpg'
import image3 from '../../public/img114.jpg'
import image5 from '../../public/img115.jpg'

export default function DesprePage() {
  const { scrollYProgress } = useScroll();
  
  // Multiple transform values for different parallax speeds
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  // Vision section parallax
  const visionY = useTransform(scrollYProgress, [0.1, 0.4], [100, 0]);
  const visionOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  
  // Timeline parallax
  const timelineProgress = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  
  // Impact section parallax
  const impactScale = useTransform(scrollYProgress, [0.6, 0.8], [0.8, 1]);
  const impactRotate = useTransform(scrollYProgress, [0.6, 0.8], [-5, 0]);

  return (
    <main className="min-h-screen">
      {/* Hero Section with Enhanced Parallax */}
      <section className="relative h-[80vh] overflow-hidden">
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0"
        >
          <Image
            src={heroImage.src}
            alt="Smart Home Visualization"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
        <motion.div 
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative h-full flex items-center justify-center text-white"
        >
          <div className="text-center space-y-6 max-w-4xl px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold"
            >
              Transformăm Case în Experiențe
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl"
            >
              Pionieri în revoluția locuințelor inteligente din România
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Vision Section with Parallax */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <motion.div
          style={{ y: visionY, opacity: visionOpacity }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-8"
            >
              Viziunea Noastră
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Inovație Continuă</h3>
                <p className="text-gray-300">Căutăm constant cele mai noi tehnologii pentru a aduce viitorul în casele clienților noștri.</p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-semibold mb-2">Sustenabilitate</h3>
                <p className="text-gray-300">Promovăm soluții inteligente care reduc consumul de energie și protejează mediul.</p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-2">Parteneriat</h3>
                <p className="text-gray-300">Construim relații pe termen lung cu clienții noștri, oferind suport continuu.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />
        </div>
      </section>

      {/* Innovation Journey with Progress-based Parallax */}
      <section className="py-24 bg-white relative overflow-hidden">
        <motion.div
          style={{ scaleX: timelineProgress }}
          className="absolute left-1/2 top-0 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500 origin-top"
        />
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Călătoria Noastră în Inovație
          </motion.h2>
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500" />
              
              {/* Timeline Items */}
              <div className="space-y-24">
                <TimelineItem
                  year="2020"
                  title="Începutul Călătoriei"
                  description="Am pornit cu viziunea de a face tehnologia smart home accesibilă tuturor românilor."
                  imageSrc={image1.src}
                  imageAlt="Start of journey"
                  align="left"
                />
                <TimelineItem
                  year="2021"
                  title="Expansiune Națională"
                  description="Am dezvoltat o rețea de parteneri în toată țara și am lansat primele noastre produse exclusive."
                  imageSrc={image2.src}
                  imageAlt="National expansion"
                  align="right"
                />
                <TimelineItem
                  year="2022"
                  title="Inovație în Sustenabilitate"
                  description="Am introdus soluții de automatizare care au redus consumul de energie al clienților noștri cu până la 40%."
                  imageSrc={image3.src}
                  imageAlt="Sustainability innovation"
                  align="left"
                />
                <TimelineItem
                  year="2023"
                  title="Viitorul Este Aici"
                  description="Lansăm noi tehnologii de inteligență artificială pentru case cu adevărat inteligente."
                  imageSrc={image5.src}
                  imageAlt="Future innovation"
                  align="right"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section with 3D Parallax */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <motion.div
          style={{ 
            scale: impactScale,
            rotate: impactRotate,
          }}
          className="container mx-auto px-4 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-8">Impactul Nostru</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <ImpactStat number="10,000+" label="Case Inteligente" />
              <ImpactStat number="40%" label="Economie de Energie" />
              <ImpactStat number="24/7" label="Suport Tehnic" />
              <ImpactStat number="98%" label="Clienți Mulțumiți" />
            </div>
          </motion.div>
        </motion.div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0.8, 1], [100, 0]),
            opacity: useTransform(scrollYProgress, [0.8, 0.9], [0, 1])
          }}
          className="container mx-auto px-4"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-4xl font-bold mb-6">Viziunea Viitorului</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Ne imaginăm un viitor în care fiecare casă din România este o casă inteligentă, 
                  eficientă energetic și perfect adaptată nevoilor locuitorilor săi.
                </p>
                <div className="space-y-4">
                  <FutureFeature
                    title="Inteligență Artificială Avansată"
                    description="Case care învață și se adaptează la stilul tău de viață"
                  />
                  <FutureFeature
                    title="Integrare Completă"
                    description="Toate dispozitivele lucrează perfect împreună"
                  />
                  <FutureFeature
                    title="Sustenabilitate Maximă"
                    description="Zero risipă de energie și impact minim asupra mediului"
                  />
                </div>
              </div>
              <div className="relative h-[600px]">
                <Image
                  src={image10.src}
                  alt="Future Smart Home Vision"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function TimelineItem({ year, title, description, imageSrc, imageAlt, align }: {
  year: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  align: 'left' | 'right';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`flex items-center ${align === 'right' ? 'flex-row-reverse' : ''}`}
    >
      <div className="w-1/2 px-8">
        <div className={`${align === 'right' ? 'text-left' : 'text-right'}`}>
          <div className="text-2xl font-bold text-indigo-600 mb-2">{year}</div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      <div className="w-8 h-8 absolute left-1/2 transform -translate-x-1/2 rounded-full border-4 border-indigo-500 bg-white" />
      <div className="w-1/2 px-8">
        <div className="relative h-48 rounded-xl overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}

function ImpactStat({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-sm opacity-80">{label}</div>
    </motion.div>
  );
}

function FutureFeature({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-1">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
} 