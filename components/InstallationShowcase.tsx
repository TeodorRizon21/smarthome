"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Installation {
  title: string;
  description: string;
  image: string;
  stats?: { label: string; value: string }[];
  features?: string[];
}

interface InstallationShowcaseProps {
  title: string;
  subtitle: string;
  installations: Installation[];
}

export default function InstallationShowcase({
  title,
  subtitle,
  installations,
}: InstallationShowcaseProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {installations.map((installation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={installation.image}
                  alt={installation.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{installation.title}</h3>
                <p className="text-gray-600 mb-4">{installation.description}</p>

                {installation.features && installation.features.length > 0 ? (
                  <ul className="space-y-2 text-gray-600 text-sm">
                    {installation.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-2"
                      >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : installation.stats && installation.stats.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {installation.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}