"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";

const SETUP_STEPS_CONFIG = [
  { icon: "🔧", titleKey: "intercom.setup.s1.title" as const, descKey: "intercom.setup.s1.desc" as const, detailKeys: ["intercom.setup.s1.d1", "intercom.setup.s1.d2", "intercom.setup.s1.d3", "intercom.setup.s1.d4"] as const },
  { icon: "📡", titleKey: "intercom.setup.s2.title" as const, descKey: "intercom.setup.s2.desc" as const, detailKeys: ["intercom.setup.s2.d1", "intercom.setup.s2.d2", "intercom.setup.s2.d3", "intercom.setup.s2.d4"] as const },
  { icon: "📱", titleKey: "intercom.setup.s3.title" as const, descKey: "intercom.setup.s3.desc" as const, detailKeys: ["intercom.setup.s3.d1", "intercom.setup.s3.d2", "intercom.setup.s3.d3", "intercom.setup.s3.d4"] as const },
  { icon: "✅", titleKey: "intercom.setup.s4.title" as const, descKey: "intercom.setup.s4.desc" as const, detailKeys: ["intercom.setup.s4.d1", "intercom.setup.s4.d2", "intercom.setup.s4.d3", "intercom.setup.s4.d4"] as const },
];

export default function IntercomSetup() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredDetail, setHoveredDetail] = useState<number | null>(null);

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-indigo-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-indigo-900">
          {t("intercom.setup.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square">
            <div className="absolute inset-0">
              {SETUP_STEPS_CONFIG.map((step, index) => (
                <motion.div
                  key={step.titleKey}
                  className={`absolute inset-0 bg-gradient-to-br rounded-3xl shadow-2xl backdrop-blur-sm ${
                    index === activeStep ? "from-indigo-500/90 to-purple-500/90" : "from-white/50 to-white/50"
                  }`}
                  initial={false}
                  animate={{
                    scale: index === activeStep ? 1 : 0.9,
                    rotate: `${(index - activeStep) * 5}deg`,
                    translateY: `${(index - activeStep) * 20}px`,
                    opacity: index === activeStep ? 1 : 0.5,
                    zIndex: SETUP_STEPS_CONFIG.length - Math.abs(index - activeStep),
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                    <span className="text-6xl mb-4">{step.icon}</span>
                    <h3 className="text-2xl font-bold mb-2 text-center">{t(step.titleKey)}</h3>
                    <p className="text-center text-white/90">{t(step.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {SETUP_STEPS_CONFIG.map((step, index) => (
              <motion.div
                key={step.titleKey}
                className={`rounded-xl p-6 cursor-pointer transition-colors ${activeStep === index ? "bg-indigo-50" : "hover:bg-gray-50"}`}
                onClick={() => setActiveStep(index)}
                initial={false}
                animate={{ x: activeStep === index ? 20 : 0 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      activeStep === index ? "bg-indigo-500 text-white" : "bg-gray-100"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-900">{t(step.titleKey)}</h3>
                    <p className="text-gray-600">{t(step.descKey)}</p>
                  </div>
                </div>
                <AnimatePresence>
                  {activeStep === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="grid grid-cols-2 gap-3 mt-4">
                        {step.detailKeys.map((key, detailIndex) => (
                          <motion.li
                            key={key}
                            className={`p-3 rounded-lg text-sm ${hoveredDetail === detailIndex ? "bg-indigo-100" : "bg-white"}`}
                            onHoverStart={() => setHoveredDetail(detailIndex)}
                            onHoverEnd={() => setHoveredDetail(null)}
                            whileHover={{ scale: 1.02 }}
                          >
                            {t(key)}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 