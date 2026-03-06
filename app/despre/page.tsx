"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import heroImage from "../../public/img111.jpg";

type Lang = "ro" | "en";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as any },
  transition: { duration: 0.5 },
};

export default function DesprePage() {
  const [lang, setLang] = useState<Lang>("ro");
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isRO = lang === "ro";

  const handleOfferSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const payload = {
        name: (formData.get("name") || "").toString().trim(),
        email: (formData.get("email") || "").toString().trim(),
        phone: (formData.get("phone") || "").toString().trim(),
        rooms: (formData.get("rooms") || "").toString().trim(),
        heatingType: (formData.get("heatingType") || "").toString().trim(),
        blinds: (formData.get("blinds") || "").toString().trim(),
        priority: (formData.get("priority") || "").toString().trim(),
        message: (formData.get("message") || "").toString().trim(),
        lang,
      };

      const response = await fetch("/api/offer-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.error ||
            (isRO
              ? "A apărut o eroare la trimiterea formularului."
              : "An error occurred while sending the form.")
        );
      }

      setSubmitSuccess(true);
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      setSubmitError(
        error?.message ||
          (isRO
            ? "Nu am putut trimite mesajul. Încearcă din nou."
            : "We could not send your message. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="pt-28 pb-20 bg-gray-50 overflow-hidden">
        <div className="max-w-[1250px] mx-auto w-full px-4">
          {/* Language Switcher */}
          <div className="flex justify-end mb-6">
            <div className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-1 py-1 text-sm shadow-sm">
              <button
                type="button"
                onClick={() => setLang("ro")}
                className={`px-3 py-1 rounded-full transition ${
                  isRO
                    ? "bg-blue-900 text-white font-semibold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                RO
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full transition ${
                  !isRO
                    ? "bg-blue-900 text-white font-semibold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#29b4b9]">
                Smart Home Mall
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-[1.15] text-blue-900">
                {isRO
                  ? "Automatizări simple pentru casa ta"
                  : "Simple home automation for your home"}
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                {isRO
                  ? "Fă-ți casa mai confortabilă, redu consumul de energie și controlează totul ușor - zi de zi, chiar și când internetul nu este perfect."
                  : "Make your home more comfortable, reduce energy waste, and control everything easily — every day, even when the internet isn't perfect."}
              </p>
              <p className="text-sm text-gray-500 max-w-lg">
                {isRO
                  ? "Construim sisteme de casă inteligentă gândite ca o instalație electrică: stabile, curate și ușor de folosit de toată familia."
                  : "We build home automation systems like an electrical installation: stable, clean, and easy to use for the whole family."}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOfferOpen(true)}
                  className="inline-flex items-center justify-center rounded-full bg-blue-900 px-7 py-3.5 text-sm md:text-base font-semibold text-white shadow-lg hover:bg-blue-800 transition"
                >
                  {isRO ? "Cere o ofertă simplă" : "Ask for a simple offer"}
                </button>
                <a
                  href="tel:+40712345678"
                  className="inline-flex items-center justify-center rounded-full border-2 border-blue-900 px-7 py-3.5 text-sm md:text-base font-semibold text-blue-900 hover:bg-blue-900 hover:text-white transition"
                >
                  {isRO ? "Vorbește cu un instalator" : "Talk to an installer"}
                </a>
              </div>
            </motion.div>

            {/* Image + Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src={heroImage.src}
                  alt={isRO ? "Casă inteligentă" : "Smart home"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-4 md:-left-8 right-8 md:right-12 rounded-2xl bg-white border border-gray-100 p-5 shadow-xl">
                <h2 className="text-sm font-bold mb-2.5 text-blue-900">
                  {isRO
                    ? "Ce rezolvi cu o casă inteligentă?"
                    : "What do you solve with a smart home?"}
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600">
                  {[
                    isRO ? "Lumini automate" : "Auto lights",
                    isRO ? "Temperatură optimă" : "Optimal temperature",
                    isRO ? "Liniște când ești plecat" : "Peace when away",
                    isRO ? "Control simplu" : "Simple control",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#29b4b9] flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is a smart home */}
      <section className="py-20 bg-white">
        <div className="max-w-[1250px] mx-auto w-full px-4">
          <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] items-start">
            <motion.div {...fadeUp}>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#29b4b9] mb-3">
                {isRO ? "Introducere" : "Introduction"}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-900">
                {isRO ? 'Ce înseamnă o "casă inteligentă"?' : "What is a 'smart home'?"}
              </h2>
              <p className="text-gray-600 mb-5 text-lg">
                {isRO
                  ? "O casă inteligentă înseamnă că locuința ta poate face automat lucrurile mici, repetitive, în locul tău."
                  : "A smart home means your house can do small, repetitive things automatically instead of you."}
              </p>
              <ul className="space-y-3 text-gray-700">
                {[
                  isRO
                    ? "Aprinde și stinge luminile când este nevoie"
                    : "Turn lights on and off when needed",
                  isRO
                    ? "Menține temperatura confortabilă în camerele folosite"
                    : "Keep the temperature comfortable in the rooms you use",
                  isRO
                    ? "Reduce risipa de electricitate și încălzire"
                    : "Reduce wasted electricity and heating",
                  isRO
                    ? "Te ajută să te simți mai în siguranță când ești plecat"
                    : "Helps you feel safer when you're away",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#29b4b9] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl bg-blue-50 border border-blue-100 p-7"
            >
              <p className="font-semibold mb-2 text-blue-900">
                {isRO ? "Nu trebuie să fii tehnic" : "You don't need to be technical"}
              </p>
              <p className="text-gray-600">
                {isRO
                  ? "Ne spui în limbaj simplu ce vrei: să nu uiți luminile aprinse, să nu mai încălzești camerele goale, să știi că totul este oprit când ieși pe ușă. Noi traducem asta în soluții concrete de automatizare."
                  : "You explain in simple words what you want: no forgotten lights, no heating of empty rooms, knowing everything is off when you leave. We translate that into concrete automation solutions."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1250px] mx-auto w-full px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              {...fadeUp}
              className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-100 text-red-600 text-2xl mb-5">
                ⚠
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {isRO
                  ? "Problema reală cu gadgeturile smart ieftine"
                  : "The real problem with cheap smart gadgets"}
              </h2>
              <p className="text-gray-600 mb-4">
                {isRO
                  ? "Mulți încep cu dispozitive Wi‑Fi ieftine pentru că par o soluție rapidă și accesibilă. Dar în timp apar problemele:"
                  : "Many people start with cheap Wi‑Fi devices because they seem quick and affordable. But over time, problems appear:"}
              </p>
              <ul className="space-y-2.5 text-gray-600 text-sm">
                {[
                  isRO ? "Prea multe aplicații, fiecare cu meniul ei" : "Too many apps, each with its own menu",
                  isRO ? "Dispozitive care se deconectează" : "Devices that disconnect",
                  isRO ? "Automatizări care uneori funcționează, alteori nu" : "Automations that sometimes work and sometimes don't",
                  isRO
                    ? 'Nimeni nu își asumă responsabilitatea când ceva nu merge'
                    : "No one takes responsibility when something breaks",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-gray-500 border-t border-gray-100 pt-4">
                {isRO
                  ? "În final, plătești de două ori: o dată pe gadgeturi și încă o dată ca să le repari sau să le înlocuiești."
                  : "In the end, you pay twice: once for the gadgets, and again to fix or replace them."}
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 text-2xl mb-5">
                ✓
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {isRO
                  ? "Soluția noastră: un sistem fiabil, ca o instalație electrică"
                  : "Our solution: a reliable system (built like an electrical installation)"}
              </h2>
              <p className="text-gray-600 mb-4">
                {isRO
                  ? "Noi construim automatizarea ca parte din casă, nu ca un set de gadgeturi disparate."
                  : "We build automation as part of the home, not as a random set of gadgets."}
              </p>
              <ul className="space-y-2.5 text-gray-600 text-sm">
                {[
                  isRO
                    ? "Control simplu: de la întrerupător, de pe telefon sau ambele"
                    : "Simple control: from the switch, from your phone, or both",
                  isRO
                    ? "Comportament previzibil – funcționează la fel în fiecare zi"
                    : "Predictable behavior – it works the same way every day",
                  isRO
                    ? "Un sistem care poate fi extins ușor mai târziu"
                    : "A system that can be easily extended later",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-[1250px] mx-auto w-full px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#29b4b9] mb-3">
              {isRO ? "De ce merită" : "Why it's worth it"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
              {isRO
                ? "Beneficii care contează când bugetul este limitat"
                : "Benefits that matter when budget is tight"}
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: "💡",
                title: isRO ? "Mai puțină risipă = facturi mai mici" : "Lower waste = lower bills",
                desc: isRO
                  ? "Automatizarea te ajută să nu plătești energie pe care nu o folosești."
                  : "Automation helps you avoid paying for energy you don't use.",
                items: [
                  isRO ? "Încălzirea se reduce automat când nu este nimeni acasă" : "Heating is reduced automatically when nobody is home",
                  isRO ? "Luminile se sting singure în holuri și băi" : "Lights turn off automatically in halls and bathrooms",
                  isRO ? 'Control mai bun pe cameră, nu "încălzești totul toată ziua"' : 'Better per-room control, not "heat everything all day"',
                ],
              },
              {
                icon: "🏠",
                title: isRO ? "Confort în fiecare zi" : "Comfort every day",
                items: [
                  isRO ? 'Un singur buton pentru "Noapte" (stinge luminile, setează temperatura)' : 'One button for "Night" (turn off lights, set temperature)',
                  isRO ? 'Scenă "Bună dimineața" (lumini + temperatură confortabilă)' : '"Good morning" scene (lights + comfortable temperature)',
                  isRO ? "Nu mai alergi prin casă să verifici totul" : "No more running around the house to check everything",
                ],
              },
              {
                icon: "🔐",
                title: isRO ? "Siguranță și liniște" : "Safety and peace of mind",
                items: [
                  isRO ? "Simulare de prezență când ești plecat" : "Presence simulation when you're away",
                  isRO ? "Lumini exterioare aprinse pe bază de mișcare" : "Outdoor lights triggered by motion",
                  isRO ? 'Buton "All Off" când pleci de acasă' : '"All Off" when leaving home',
                ],
              },
              {
                icon: "📈",
                title: isRO ? "Pornești mic, extinzi când vrei" : "Start small, upgrade later",
                desc: isRO
                  ? "Nu trebuie să automatizezi toată casa din prima zi. Poți începe cu esențialul și adăuga mai mult pe măsură ce bugetul îți permite."
                  : "You don't need to automate the whole house from day one. You can start with the essentials and add more as your budget allows.",
              },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl bg-blue-50 border border-blue-100 p-7 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-blue-900">{benefit.title}</h3>
                {benefit.desc && <p className="text-sm text-gray-600 mb-3">{benefit.desc}</p>}
                {benefit.items && (
                  <ul className="text-sm text-gray-600 space-y-2">
                    {benefit.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#29b4b9] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Starter Packages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1250px] mx-auto w-full px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#29b4b9] mb-3">
              {isRO ? "Pachete" : "Packages"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
              {isRO
                ? "Pachete de start populare"
                : "Popular starter packages"}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {isRO
                ? "Prețul final depinde de numărul de camere, tipul de cablare și ce vrei să automatizăm."
                : "Final price depends on rooms, wiring, and what you want automated."}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: isRO ? "Confort de bază" : "Basic Comfort",
                desc: isRO
                  ? "Ideal pentru a simți primele beneficii fără investiții mari."
                  : "Ideal for feeling the first benefits without a big investment.",
                items: [
                  isRO ? "Iluminat pe bază de mișcare în holuri și băi" : "Hallway/bathroom motion lighting",
                  isRO ? 'Buton "All Off" la intrare' : '"All Off" button at the entrance',
                  isRO ? "Scene simple (Acasă / Noapte)" : "Simple scenes (Home / Night)",
                ],
                featured: false,
              },
              {
                title: isRO ? "Confort + Control Încălzire" : "Comfort + Heating Control",
                desc: isRO
                  ? "Pentru cei care vor control real al temperaturii și facturi mai clare."
                  : "For those who want real temperature control and clearer bills.",
                items: [
                  isRO ? "Control al temperaturii pe fiecare cameră" : "Room-by-room temperature control",
                  isRO ? "Programe zi/noapte" : "Day/night schedules",
                  isRO ? 'Mod "Plecat" pentru reducerea consumului' : "Away mode to reduce waste",
                ],
                featured: true,
              },
              {
                title: isRO ? "Confort + Siguranță" : "Comfort + Safety",
                desc: isRO
                  ? "Potrivit dacă vrei să combini confortul cu siguranța casei."
                  : "Perfect if you want to combine comfort with home safety.",
                items: [
                  isRO ? "Iluminat exterior pe bază de mișcare" : "Motion-based exterior lighting",
                  isRO ? "Simulare de prezență când ești plecat" : "Presence simulation when you're away",
                  isRO ? "Control centralizat pentru lumini + încălzire" : "Central control for lights + heating",
                ],
                featured: false,
              },
            ].map((pkg, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-2xl p-7 flex flex-col transition-shadow ${
                  pkg.featured
                    ? "bg-blue-900 text-white shadow-xl shadow-blue-900/20 ring-2 ring-[#29b4b9]"
                    : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                {pkg.featured && (
                  <span className="self-start text-xs font-semibold uppercase tracking-wider bg-[#29b4b9] text-white px-3 py-1 rounded-full mb-4">
                    {isRO ? "Popular" : "Popular"}
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-2 ${pkg.featured ? "text-white" : "text-blue-900"}`}>
                  {pkg.title}
                </h3>
                <p className={`text-sm mb-5 ${pkg.featured ? "text-blue-200" : "text-gray-500"}`}>
                  {pkg.desc}
                </p>
                <ul className={`text-sm space-y-2.5 flex-1 ${pkg.featured ? "text-blue-100" : "text-gray-600"}`}>
                  {pkg.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${pkg.featured ? "bg-cyan-400" : "bg-[#29b4b9]"}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setIsOfferOpen(true)}
                  className={`mt-6 w-full rounded-full py-3 text-sm font-semibold transition ${
                    pkg.featured
                      ? "bg-[#29b4b9] text-white hover:bg-[#24a0a5]"
                      : "bg-blue-900 text-white hover:bg-blue-800"
                  }`}
                >
                  {isRO ? "Cere ofertă" : "Get a quote"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-[1250px] mx-auto w-full px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#29b4b9] mb-3">
              {isRO ? "Proces" : "Process"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
              {isRO ? "Cum funcționează" : "How it works"}
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "1",
                text: isRO
                  ? "Ne spui: numărul de camere, tipul de încălzire și ce vrei să controlezi."
                  : "You tell us: rooms, heating type, and what you want to control.",
              },
              {
                step: "2",
                text: isRO
                  ? "Îți propunem un plan simplu + opțiuni clare de preț."
                  : "We propose a simple plan plus clear price options.",
              },
              {
                step: "3",
                text: isRO
                  ? "Realizăm instalarea și programarea."
                  : "We handle installation and programming.",
              },
              {
                step: "4",
                text: isRO
                  ? "Testăm totul împreună și îți arătăm cum să folosești sistemul."
                  : "We test everything together and show you how to use it.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-900 text-white text-lg font-bold mb-4 shadow-md">
                  {item.step}
                </div>
                <p className="text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="oferta-simpla" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-[1250px] mx-auto w-full px-4 text-center text-white">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isRO
                ? "Vrei o ofertă simplă pentru casa ta?"
                : "Want a simple offer for your home?"}
            </h2>
            <p className="text-blue-200 mb-10 max-w-2xl mx-auto">
              {isRO
                ? "Trimite-ne câteva detalii de bază și îți propunem rapid o variantă potrivită pentru bugetul tău."
                : "Send us a few basic details and we'll quickly propose an option that fits your budget."}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 text-left max-w-3xl mx-auto mb-10">
            <motion.div
              {...fadeUp}
              className="rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur-sm"
            >
              <p className="font-semibold mb-3 text-white">
                {isRO ? "Ce să ne trimiți" : "What to send us"}
              </p>
              <ul className="text-blue-100 text-sm space-y-2">
                {[
                  isRO ? "Numărul de camere (sau o poză cu planul)" : "Number of rooms (or a photo of the plan)",
                  isRO ? "Tipul de încălzire (radiatoare / încălzire în pardoseală)" : "Heating type (radiators / floor heating)",
                  isRO ? "Ai rulouri/jaluzele? (da/nu)" : "Do you have blinds/shutters? (yes/no)",
                  isRO ? "Ce contează cel mai mult: confort / economie / siguranță" : "What matters most: comfort / savings / safety",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              id="contact-instalator"
              className="rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                <p className="font-semibold mb-3 text-white">
                  {isRO ? "Pasul următor" : "Next step"}
                </p>
                <p className="text-blue-100 text-sm">
                  {isRO
                    ? "Trimite-ne aceste detalii pe canalul tău preferat (email, WhatsApp, formular de contact) și un instalator partener te va contacta cu o ofertă simplă, pe înțelesul tău."
                    : "Send these details via your preferred channel (email, WhatsApp, contact form) and a partner installer will contact you with a simple, easy-to-understand quote."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOfferOpen(true)}
                className="mt-5 w-full rounded-full bg-[#29b4b9] text-white px-6 py-3 text-sm font-semibold hover:bg-[#24a0a5] transition"
              >
                {isRO ? "Obține o ofertă simplă" : "Get a simple quote"}
              </button>
            </motion.div>
          </div>

          <p className="text-xs text-blue-300/70 max-w-xl mx-auto">
            {isRO
              ? 'Nu promitem "casă din viitor". Promitem o casă care funcționează mai bine, în fiecare zi, cu un sistem pe care îl vei înțelege și folosi.'
              : "We don't promise a \"house from the future\". We promise a home that works better every day, with a system you'll actually understand and use."}
          </p>
        </div>
      </section>

      {/* Offer Modal */}
      {isOfferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-blue-900">
                  {isRO ? "Completează câteva detalii" : "Fill in a few details"}
                </h2>
                <p className="text-xs text-gray-500">
                  {isRO
                    ? "Îți trimitem o ofertă simplă, pe înțelesul tău."
                    : "We'll send you a simple, easy-to-understand quote."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOfferOpen(false);
                  setSubmitError(null);
                  setSubmitSuccess(false);
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                aria-label={isRO ? "Închide" : "Close"}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="px-6 py-5 space-y-4 text-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    {isRO ? "Nume complet *" : "Full name *"}
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={isRO ? "Ex: Popescu Andrei" : "e.g. John Smith"}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">Email *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    {isRO ? "Telefon" : "Phone"}
                  </label>
                  <input
                    name="phone"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={isRO ? "Ex: 07xx xxx xxx" : "e.g. +40 7xx xxx xxx"}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    {isRO ? "Număr de camere" : "Number of rooms"}
                  </label>
                  <input
                    name="rooms"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={isRO ? "Ex: 3 dormitoare + living" : "e.g. 3 bedrooms + living"}
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    {isRO ? "Tip încălzire" : "Heating type"}
                  </label>
                  <select
                    name="heatingType"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="" disabled>{isRO ? "Selectează..." : "Select..."}</option>
                    <option value="radiators">{isRO ? "Radiatoare" : "Radiators"}</option>
                    <option value="floor">{isRO ? "Încălzire în pardoseală" : "Floor heating"}</option>
                    <option value="mixed">{isRO ? "Mixt" : "Mixed"}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    {isRO ? "Rulouri / jaluzele" : "Blinds / shutters"}
                  </label>
                  <select
                    name="blinds"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="" disabled>{isRO ? "Selectează..." : "Select..."}</option>
                    <option value="yes">{isRO ? "Da" : "Yes"}</option>
                    <option value="no">{isRO ? "Nu" : "No"}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  {isRO ? "Ce contează cel mai mult?" : "What matters most?"}
                </label>
                <select
                  name="priority"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue=""
                >
                  <option value="" disabled>{isRO ? "Selectează..." : "Select..."}</option>
                  <option value="comfort">{isRO ? "Confort" : "Comfort"}</option>
                  <option value="savings">{isRO ? "Economie" : "Savings"}</option>
                  <option value="safety">{isRO ? "Siguranță" : "Safety"}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  {isRO ? "Detalii suplimentare (opțional)" : "Additional details (optional)"}
                </label>
                <textarea
                  name="message"
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={
                    isRO
                      ? "Ex: casă în construcție, sistem pe care îl ai deja, buget aproximativ..."
                      : "e.g. house under construction, systems you already have, approximate budget..."
                  }
                />
              </div>

              {submitError && <p className="text-xs text-red-500">{submitError}</p>}
              {submitSuccess && (
                <p className="text-xs text-emerald-600">
                  {isRO
                    ? "Mulțumim! Cererea ta a fost trimisă. Te vom contacta în curând."
                    : "Thank you! Your request has been sent. We will contact you soon."}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOfferOpen(false);
                    setSubmitError(null);
                    setSubmitSuccess(false);
                  }}
                  className="rounded-full px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 transition"
                >
                  {isRO ? "Renunță" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting
                    ? isRO ? "Se trimite..." : "Sending..."
                    : isRO ? "Trimite cererea" : "Send request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
