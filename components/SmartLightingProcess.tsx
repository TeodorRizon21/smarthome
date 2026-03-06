"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";

const PROCESS_STEPS_CONFIG = [
  { image: "/detectare.jpg", icon: "🌅", titleKey: "lighting.process.s1.title" as const, descKey: "lighting.process.s1.desc" as const, color: "from-orange-100 to-yellow-200", highlight: "bg-orange-100" },
  { image: "/procesare.jpg", icon: "🧠", titleKey: "lighting.process.s2.title" as const, descKey: "lighting.process.s2.desc" as const, color: "from-blue-100 to-blue-200", highlight: "bg-blue-100" },
  { image: "/ajustare.jpg", icon: "⚡", titleKey: "lighting.process.s3.title" as const, descKey: "lighting.process.s3.desc" as const, color: "from-purple-100 to-purple-200", highlight: "bg-purple-100" },
  { image: "/control.jpg", icon: "📱", titleKey: "lighting.process.s4.title" as const, descKey: "lighting.process.s4.desc" as const, color: "from-green-100 to-green-200", highlight: "bg-green-100" },
];

const BENEFIT_KEYS = ["lighting.process.b1", "lighting.process.b2", "lighting.process.b3", "lighting.process.b4"] as const;
const BENEFIT_ICONS = ["💡", "🌱", "⚙️", "🎯"];
const BENEFIT_COLORS = ["bg-yellow-50", "bg-green-50", "bg-blue-50", "bg-purple-50"];

export default function SmartLightingProcess() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  return (
    <section className="relative w-full py-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16">
          {t("lighting.process.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  className={`w-full h-full rounded-xl overflow-hidden bg-gradient-to-br ${PROCESS_STEPS_CONFIG[activeStep].color} shadow-md`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={PROCESS_STEPS_CONFIG[activeStep].image}
                    alt={t(PROCESS_STEPS_CONFIG[activeStep].titleKey)}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute -right-4 top-1/2 w-8 h-1 bg-blue-200 hidden md:block" />
          </div>
          <div className="flex flex-col gap-4">
            {PROCESS_STEPS_CONFIG.map((step, index) => (
              <motion.button
                key={step.titleKey}
                className={`w-full p-6 rounded-xl transition-all duration-300 ${
                  activeStep === index ? `${step.highlight} shadow-md transform translate-x-4` : "hover:bg-gray-50"
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
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">{t(step.titleKey)}</h3>
                    <p className="text-gray-600">{t(step.descKey)}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {BENEFIT_KEYS.map((key, i) => (
            <motion.div
              key={key}
              className={`${BENEFIT_COLORS[i]} p-4 rounded-xl text-center shadow-sm`}
              whileHover={{ y: -5 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-3xl mb-2 block">{BENEFIT_ICONS[i]}</span>
              <p className="text-sm font-medium text-gray-700">{t(key)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 