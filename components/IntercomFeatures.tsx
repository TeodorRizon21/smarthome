"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";

const FEATURES_CONFIG = [
  { icon: "🎥", color: "from-blue-500 to-blue-600", titleKey: "intercom.features.f1.title" as const, descKey: "intercom.features.f1.desc" as const, detailKeys: ["intercom.features.f1.d1", "intercom.features.f1.d2", "intercom.features.f1.d3", "intercom.features.f1.d4"] as const },
  { icon: "🔊", color: "from-purple-500 to-purple-600", titleKey: "intercom.features.f2.title" as const, descKey: "intercom.features.f2.desc" as const, detailKeys: ["intercom.features.f2.d1", "intercom.features.f2.d2", "intercom.features.f2.d3", "intercom.features.f2.d4"] as const },
  { icon: "🔐", color: "from-green-500 to-green-600", titleKey: "intercom.features.f3.title" as const, descKey: "intercom.features.f3.desc" as const, detailKeys: ["intercom.features.f3.d1", "intercom.features.f3.d2", "intercom.features.f3.d3", "intercom.features.f3.d4"] as const },
  { icon: "🏠", color: "from-orange-500 to-orange-600", titleKey: "intercom.features.f4.title" as const, descKey: "intercom.features.f4.desc" as const, detailKeys: ["intercom.features.f4.d1", "intercom.features.f4.d2", "intercom.features.f4.d3", "intercom.features.f4.d4"] as const },
];

export default function IntercomFeatures() {
  const { t } = useLanguage();
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,indigo-900_1px,transparent_0)] [background-size:40px_40px]" />
      </div>
      <div className="max-w-6xl mx-auto relative">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-indigo-900">
          {t("intercom.features.title")}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES_CONFIG.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                activeFeature === index ? "bg-gradient-to-br " + feature.color + " text-white" : "bg-white hover:bg-indigo-50"
              }`}
              onHoverStart={() => {
                setActiveFeature(index);
                setIsHovering(true);
              }}
              onHoverEnd={() => setIsHovering(false)}
              initial={false}
              animate={{
                scale: activeFeature === index ? 1.05 : 1,
                zIndex: activeFeature === index ? 10 : 1,
              }}
            >
              <div className="relative z-10">
                <div
                  className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center text-3xl ${
                    activeFeature === index ? "bg-white/20" : "bg-indigo-50"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${activeFeature === index ? "text-white" : "text-indigo-900"}`}>
                  {t(feature.titleKey)}
                </h3>
                <p className={activeFeature === index ? "text-white/90" : "text-gray-600"}>{t(feature.descKey)}</p>
                <motion.div
                  initial={false}
                  animate={{
                    height: activeFeature === index ? "auto" : 0,
                    opacity: activeFeature === index ? 1 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <ul className="mt-4 space-y-2">
                    {feature.detailKeys.map((key, detailIndex) => (
                      <motion.li
                        key={key}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{
                          x: activeFeature === index ? 0 : -20,
                          opacity: activeFeature === index ? 1 : 0,
                        }}
                        transition={{ delay: detailIndex * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-white/90">•</span>
                        <span className={activeFeature === index ? "text-white/90" : "text-gray-600"}>{t(key)}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0"
                initial={false}
                animate={{ opacity: activeFeature === index ? 0.1 : 0 }}
                style={{
                  background: `radial-gradient(circle at ${isHovering ? "50%" : "100%"} ${isHovering ? "50%" : "100%"}, ${activeFeature === index ? "white" : "transparent"} 0%, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 