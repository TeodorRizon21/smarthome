"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import heroImage from "../../public/img111.jpg";

type Lang = "ro" | "en";

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
        headers: {
          "Content-Type": "application/json",
        },
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
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage.src}
            alt={isRO ? "Casă inteligentă" : "Smart home"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-gray-950" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 pb-24 flex flex-col gap-10">
          {/* Language Switcher */}
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-white/10 px-1 py-1 text-sm backdrop-blur">
              <button
                type="button"
                onClick={() => setLang("ro")}
                className={`px-3 py-1 rounded-full transition ${
                  isRO
                    ? "bg-white text-gray-900 font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                RO
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full transition ${
                  !isRO
                    ? "bg-white text-gray-900 font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-10 md:flex-row md:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 md:w-3/5"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
                Smart Home Mall
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {isRO
                  ? "Automatizări simple pentru casa ta"
                  : "Simple home automation for your home"}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
                {isRO
                  ? "Fă-ți casa mai confortabilă, redu consumul de energie și controlează totul ușor - zi de zi, chiar și când internetul nu este perfect."
                  : "Make your home more comfortable, reduce energy waste, and control everything easily — every day, even when the internet isn’t perfect."}
              </p>
              <p className="text-sm md:text-base text-gray-300 max-w-xl">
                {isRO
                  ? "Construim sisteme de casă inteligentă gândite ca o instalație electrică: stabile, curate și ușor de folosit de toată familia."
                  : "We build home automation systems like an electrical installation: stable, clean, and easy to use for the whole family."}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOfferOpen(true)}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 transition"
                >
                  {isRO ? "Cere o ofertă simplă" : "Ask for a simple offer"}
                </button>
                <a
                  href="tel:+40712345678"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm md:text-base font-semibold text-white hover:bg-white/10 transition"
                >
                  {isRO ? "Vorbește cu un instalator" : "Talk to an installer"}
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:w-2/5"
            >
              <div className="rounded-3xl bg-black/40 border border-white/10 p-6 backdrop-blur shadow-2xl">
                <h2 className="text-lg font-semibold mb-3">
                  {isRO
                    ? "Ce rezolvi cu o casă inteligentă?"
                    : "What do you solve with a smart home?"}
                </h2>
                <ul className="space-y-2 text-sm text-gray-200">
                  <li>
                    •{" "}
                    {isRO
                      ? "Lumini care se aprind și se sting automat când ai nevoie"
                      : "Lights that turn on and off automatically when needed"}
                  </li>
                  <li>
                    •{" "}
                    {isRO
                      ? "Temperatură confortabilă fără risipă de energie"
                      : "Comfortable temperature without wasting energy"}
                  </li>
                  <li>
                    •{" "}
                    {isRO
                      ? "Mai puțină grijă când ești plecat de acasă"
                      : "Less worry when you’re away from home"}
                  </li>
                  <li>
                    •{" "}
                    {isRO
                      ? "Control simplu: de la întrerupător, din telefon sau ambele"
                      : "Simple control: from the switch, phone, or both"}
                  </li>
                </ul>
                <p className="mt-4 text-xs text-gray-400">
                  {isRO
                    ? "Nu trebuie să fii tehnic. Ne spui doar ce vrei să facă casa pentru tine."
                    : "You don’t need to be technical. You just tell us what you want the house to do for you."}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is a smart home */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 grid gap-10 md:grid-cols-[1.2fr,minmax(0,1fr)] items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {isRO ? 'Ce înseamnă o "casă inteligentă"?' : "What is a ‘smart home’?"}
            </h2>
            <p className="text-gray-200 mb-4">
              {isRO
                ? "O casă inteligentă înseamnă că locuința ta poate face automat lucrurile mici, repetitive, în locul tău."
                : "A smart home means your house can do small, repetitive things automatically instead of you."}
            </p>
            <ul className="space-y-2 text-gray-200">
              <li>
                •{" "}
                {isRO
                  ? "Aprinde și stinge luminile când este nevoie"
                  : "Turn lights on and off when needed"}
              </li>
              <li>
                •{" "}
                {isRO
                  ? "Menține temperatura confortabilă în camerele folosite"
                  : "Keep the temperature comfortable in the rooms you use"}
              </li>
              <li>
                •{" "}
                {isRO
                  ? "Reduce risipa de electricitate și încălzire"
                  : "Reduce wasted electricity and heating"}
              </li>
              <li>
                •{" "}
                {isRO
                  ? "Te ajută să te simți mai în siguranță când ești plecat"
                  : "Helps you feel safer when you’re away"}
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent p-6 text-sm text-gray-200"
          >
            <p className="font-semibold mb-2">
              {isRO ? "Nu trebuie să fii tehnic" : "You don’t need to be technical"}
            </p>
            <p>
              {isRO
                ? "Ne spui în limbaj simplu ce vrei: să nu uiți luminile aprinse, să nu mai încălzești camerele goale, să știi că totul este oprit când ieși pe ușă. Noi traducem asta în soluții concrete de automatizare."
                : "You explain in simple words what you want: no forgotten lights, no heating of empty rooms, knowing everything is off when you leave. We translate that into concrete automation solutions."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem with cheap gadgets & our solution */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-6xl mx-auto px-4 grid gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold mb-3">
              {isRO
                ? "Problema reală cu gadgeturile smart ieftine"
                : "The real problem with cheap smart gadgets"}
            </h2>
            <p className="text-gray-200 mb-4">
              {isRO
                ? "Mulți încep cu dispozitive Wi‑Fi ieftine pentru că par o soluție rapidă și accesibilă. Dar în timp apar problemele:"
                : "Many people start with cheap Wi‑Fi devices because they seem quick and affordable. But over time, problems appear:"}
            </p>
            <ul className="space-y-2 text-gray-200 text-sm">
              <li>
                •{" "}
                {isRO
                  ? "Prea multe aplicații, fiecare cu meniul ei"
                  : "Too many apps, each with its own menu"}
              </li>
              <li>
                • {isRO ? "Dispozitive care se deconectează" : "Devices that disconnect"}
              </li>
              <li>
                •{" "}
                {isRO
                  ? "Automatizări care uneori funcționează, alteori nu"
                  : "Automations that sometimes work and sometimes don’t"}
              </li>
              <li>
                •{" "}
                {isRO
                  ? 'Nimeni nu își asumă responsabilitatea când ceva nu merge ("e de la router", "e de la aplicație", "e de la dispozitiv")'
                  : "No one takes responsibility when something breaks (“it’s the router”, “it’s the app”, “it’s the device”)"}
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-300">
              {isRO
                ? "În final, plătești de două ori: o dată pe gadgeturi și încă o dată ca să le repari sau să le înlocuiești."
                : "In the end, you pay twice: once for the gadgets, and again to fix or replace them."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold mb-3">
              {isRO
                ? "Soluția noastră: un sistem fiabil, ca o instalație electrică"
                : "Our solution: a reliable system (built like an electrical installation)"}
            </h2>
            <p className="text-gray-200 mb-4">
              {isRO
                ? "Noi construim automatizarea ca parte din casă, nu ca un set de gadgeturi disparate."
                : "We build automation as part of the home, not as a random set of gadgets."}
            </p>
            <ul className="space-y-2 text-gray-200 text-sm">
              <li>
                •{" "}
                {isRO
                  ? "Control simplu: de la întrerupător, de pe telefon sau ambele"
                  : "Simple control: from the switch, from your phone, or both"}
              </li>
              <li>
                •{" "}
                {isRO
                  ? "Comportament previzibil – funcționează la fel în fiecare zi"
                  : "Predictable behavior – it works the same way every day"}
              </li>
              <li>
                •{" "}
                {isRO
                  ? "Un sistem care poate fi extins ușor mai târziu"
                  : "A system that can be easily extended later"}
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
          >
            {isRO
              ? "Beneficii care contează când bugetul este limitat"
              : "Benefits that matter when budget is tight"}
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* 1) Lower waste = lower bills */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold mb-2">
                {isRO
                  ? "1) Mai puțină risipă = facturi mai mici"
                  : "1) Lower waste = lower bills"}
              </h3>
              <p className="text-sm text-gray-200 mb-3">
                {isRO
                  ? "Automatizarea te ajută să nu plătești energie pe care nu o folosești."
                  : "Automation helps you avoid paying for energy you don’t use."}
              </p>
              <ul className="text-sm text-gray-200 space-y-1.5">
                <li>
                  •{" "}
                  {isRO
                    ? "Încălzirea se reduce automat când nu este nimeni acasă"
                    : "Heating is reduced automatically when nobody is home"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? "Luminile se sting singure în holuri și băi"
                    : "Lights turn off automatically in halls and bathrooms"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? 'Control mai bun pe cameră, nu "încălzești totul toată ziua"'
                    : "Better per-room control, not “heat everything all day”"}
                </li>
              </ul>
            </motion.div>

            {/* 2) Comfort every day */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold mb-2">
                {isRO ? "2) Confort în fiecare zi" : "2) Comfort every day"}
              </h3>
              <ul className="text-sm text-gray-200 space-y-1.5">
                <li>
                  •{" "}
                  {isRO
                    ? 'Un singur buton pentru "Noapte" (stinge luminile, setează temperatura)'
                    : "One button for “Night” (turn off lights, set temperature)"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? 'Scenă "Bună dimineața" (lumini + temperatură confortabilă)'
                    : "“Good morning” scene (lights + comfortable temperature)"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? "Nu mai alergi prin casă să verifici totul"
                    : "No more running around the house to check everything"}
                </li>
              </ul>
            </motion.div>

            {/* 3) Safety and peace of mind */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold mb-2">
                {isRO
                  ? "3) Siguranță și liniște"
                  : "3) Safety and peace of mind"}
              </h3>
              <ul className="text-sm text-gray-200 space-y-1.5">
                <li>
                  •{" "}
                  {isRO
                    ? "Simulare de prezență când ești plecat"
                    : "Presence simulation when you’re away"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? "Lumini exterioare aprinse pe bază de mișcare"
                    : "Outdoor lights triggered by motion"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? 'Buton "All Off" când pleci de acasă'
                    : "“All Off” when leaving home"}
                </li>
              </ul>
            </motion.div>

            {/* 4) Start small, upgrade later */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold mb-2">
                {isRO
                  ? "4) Pornești mic, extinzi când vrei"
                  : "4) Start small, upgrade later"}
              </h3>
              <p className="text-sm text-gray-200">
                {isRO
                  ? "Nu trebuie să automatizezi toată casa din prima zi. Poți începe cu esențialul și adăuga mai mult pe măsură ce bugetul îți permite."
                  : "You don’t need to automate the whole house from day one. You can start with the essentials and add more as your budget allows."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular starter packages */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl font-bold mb-3 text-center"
          >
            {isRO
              ? "Pachete de start populare (alegeri ușoare)"
              : "Popular starter packages (easy choices)"}
          </motion.h2>
          <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto mb-8">
            {isRO
              ? "Prețul final depinde de numărul de camere, tipul de cablare și ce vrei să automatizăm."
              : "Final price depends on rooms, wiring, and what you want automated."}
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Package 1 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-1">
                {isRO
                  ? "Pachet 1: Confort de bază"
                  : "Package 1: Basic Comfort"}
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                {isRO
                  ? "Ideal pentru a simți primele beneficii fără investiții mari."
                  : "Ideal for feeling the first benefits without a big investment."}
              </p>
              <ul className="text-sm text-gray-200 space-y-1.5 flex-1">
                <li>
                  •{" "}
                  {isRO
                    ? "Iluminat pe bază de mișcare în holuri și băi"
                    : "Hallway/bathroom motion lighting"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? 'Buton "All Off" la intrare'
                    : "“All Off” button at the entrance"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? "Scene simple (Acasă / Noapte)"
                    : "Simple scenes (Home / Night)"}
                </li>
              </ul>
            </motion.div>

            {/* Package 2 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-2xl border border-indigo-500/60 bg-indigo-500/15 p-6 flex flex-col shadow-[0_0_40px_rgba(79,70,229,0.35)]"
            >
              <h3 className="text-lg font-semibold mb-1">
                {isRO
                  ? "Pachet 2: Confort + control încălzire"
                  : "Package 2: Comfort + Heating Control"}
              </h3>
              <p className="text-sm text-gray-100 mb-4">
                {isRO
                  ? "Pentru cei care vor control real al temperaturii și facturi mai clare."
                  : "For those who want real temperature control and clearer bills."}
              </p>
              <ul className="text-sm text-gray-100 space-y-1.5 flex-1">
                <li>
                  •{" "}
                  {isRO
                    ? "Control al temperaturii pe fiecare cameră"
                    : "Room-by-room temperature control"}
                </li>
                <li>
                  • {isRO ? "Programe zi/noapte" : "Day/night schedules"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? 'Mod "Plecat" pentru reducerea consumului'
                    : "Away mode to reduce waste"}
                </li>
              </ul>
            </motion.div>

            {/* Package 3 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-1">
                {isRO
                  ? "Pachet 3: Confort + Siguranță"
                  : "Package 3: Comfort + Safety"}
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                {isRO
                  ? "Potrivit dacă vrei să combini confortul cu siguranța casei."
                  : "Perfect if you want to combine comfort with home safety."}
              </p>
              <ul className="text-sm text-gray-200 space-y-1.5 flex-1">
                <li>
                  •{" "}
                  {isRO
                    ? "Iluminat exterior pe bază de mișcare"
                    : "Motion-based exterior lighting"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? "Simulare de prezență când ești plecat"
                    : "Presence simulation when you’re away"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? "Control centralizat pentru lumini + încălzire"
                    : "Central control for lights + heating"}
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
          >
            {isRO
              ? "Cum funcționează (proces simplu)"
              : "How it works (simple process)"}
          </motion.h2>

          <ol className="grid gap-6 md:grid-cols-4 text-sm text-gray-200">
            <li className="flex flex-col gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold">
                1
              </span>
              <p>
                {isRO
                  ? "Ne spui: numărul de camere, tipul de încălzire și ce vrei să controlezi."
                  : "You tell us: rooms, heating type, and what you want to control."}
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold">
                2
              </span>
              <p>
                {isRO
                  ? "Îți propunem un plan simplu + opțiuni clare de preț."
                  : "We propose a simple plan plus clear price options."}
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold">
                3
              </span>
              <p>
                {isRO
                  ? "Realizăm instalarea și programarea."
                  : "We handle installation and programming."}
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold">
                4
              </span>
              <p>
                {isRO
                  ? "Testăm totul împreună și îți arătăm cum să folosești sistemul."
                  : "We test everything together and show you how to use it."}
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Final Call to Action */}
      <section
        id="oferta-simpla"
        className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl font-bold mb-4"
          >
            {isRO
              ? "Vrei o ofertă simplă pentru casa ta?"
              : "Want a simple offer for your home?"}
          </motion.h2>
          <p className="text-sm md:text-base text-indigo-100 mb-6 max-w-2xl mx-auto">
            {isRO
              ? "Trimite-ne câteva detalii de bază și îți propunem rapid o variantă potrivită pentru bugetul tău."
              : "Send us a few basic details and we’ll quickly propose an option that fits your budget."}
          </p>

          <div className="grid gap-4 text-sm md:grid-cols-2 text-left max-w-2xl mx-auto mb-8">
            <div className="rounded-2xl bg-black/15 border border-white/20 p-4">
              <p className="font-semibold mb-1">
                {isRO ? "Ce să ne trimiți" : "What to send us"}
              </p>
              <ul className="text-indigo-50 space-y-1">
                <li>
                  •{" "}
                  {isRO
                    ? "Numărul de camere (sau o poză cu planul)"
                    : "Number of rooms (or a photo of the plan)"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? "Tipul de încălzire (radiatoare / încălzire în pardoseală)"
                    : "Heating type (radiators / floor heating)"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? "Ai rulouri/jaluzele? (da/nu)"
                    : "Do you have blinds/shutters? (yes/no)"}
                </li>
                <li>
                  •{" "}
                  {isRO
                    ? "Ce contează cel mai mult: confort / economie / siguranță"
                    : "What matters most: comfort / savings / safety"}
                </li>
              </ul>
            </div>
            <div
              id="contact-instalator"
              className="rounded-2xl bg-black/15 border border-white/20 p-4 flex flex-col justify-between"
            >
              <div>
                <p className="font-semibold mb-1">
                  {isRO ? "Pasul următor" : "Next step"}
                </p>
                <p className="text-indigo-50 text-sm">
                  {isRO
                    ? "Trimite-ne aceste detalii pe canalul tău preferat (email, WhatsApp, formular de contact) și un instalator partener te va contacta cu o ofertă simplă, pe înțelesul tău."
                    : "Send these details via your preferred channel (email, WhatsApp, contact form) and a partner installer will contact you with a simple, easy-to-understand quote."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOfferOpen(true)}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-white text-indigo-700 px-6 py-2 text-sm font-semibold hover:bg-indigo-50 transition"
              >
                {isRO ? "Obține o ofertă simplă" : "Get a simple quote"}
              </button>
            </div>
          </div>

          <p className="text-xs text-indigo-100/80 max-w-xl mx-auto">
            {isRO
              ? 'Nu promitem "casă din viitor". Promitem o casă care funcționează mai bine, în fiecare zi, cu un sistem pe care îl vei înțelege și folosi.'
              : "We don’t promise a “house from the future”. We promise a home that works better every day, with a system you’ll actually understand and use."}
          </p>
        </div>
      </section>

      {/* Offer Modal */}
      {isOfferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-gray-950 border border-white/15 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-semibold">
                  {isRO
                    ? "Completează câteva detalii"
                    : "Fill in a few details"}
                </h2>
                <p className="text-xs text-gray-400">
                  {isRO
                    ? "Îți trimitem o ofertă simplă, pe înțelesul tău."
                    : "We’ll send you a simple, easy-to-understand quote."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOfferOpen(false);
                  setSubmitError(null);
                  setSubmitSuccess(false);
                }}
                className="rounded-full p-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition"
                aria-label={isRO ? "Închide" : "Close"}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="px-6 py-5 space-y-4 text-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-300">
                    {isRO ? "Nume complet *" : "Full name *"}
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={isRO ? "Ex: Popescu Andrei" : "e.g. John Smith"}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-300">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-300">
                    {isRO ? "Telefon" : "Phone"}
                  </label>
                  <input
                    name="phone"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={isRO ? "Ex: 07xx xxx xxx" : "e.g. +40 7xx xxx xxx"}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-300">
                    {isRO ? "Număr de camere" : "Number of rooms"}
                  </label>
                  <input
                    name="rooms"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={isRO ? "Ex: 3 dormitoare + living" : "e.g. 3 bedrooms + living"}
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-300">
                    {isRO ? "Tip încălzire" : "Heating type"}
                  </label>
                  <select
                    name="heatingType"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {isRO ? "Selectează..." : "Select..."}
                    </option>
                    <option value="radiators">
                      {isRO ? "Radiatoare" : "Radiators"}
                    </option>
                    <option value="floor">
                      {isRO ? "Încălzire în pardoseală" : "Floor heating"}
                    </option>
                    <option value="mixed">
                      {isRO ? "Mixt" : "Mixed"}
                    </option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-300">
                    {isRO ? "Rulouri / jaluzele" : "Blinds / shutters"}
                  </label>
                  <select
                    name="blinds"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {isRO ? "Selectează..." : "Select..."}
                    </option>
                    <option value="yes">{isRO ? "Da" : "Yes"}</option>
                    <option value="no">{isRO ? "Nu" : "No"}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-300">
                  {isRO ? "Ce contează cel mai mult?" : "What matters most?"}
                </label>
                <select
                  name="priority"
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {isRO ? "Selectează..." : "Select..."}
                  </option>
                  <option value="comfort">
                    {isRO ? "Confort" : "Comfort"}
                  </option>
                  <option value="savings">
                    {isRO ? "Economie" : "Savings"}
                  </option>
                  <option value="safety">
                    {isRO ? "Siguranță" : "Safety"}
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-300">
                  {isRO
                    ? "Detalii suplimentare (opțional)"
                    : "Additional details (optional)"}
                </label>
                <textarea
                  name="message"
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={
                    isRO
                      ? "Ex: casă în construcție, sistem pe care îl ai deja, buget aproximativ..."
                      : "e.g. house under construction, systems you already have, approximate budget..."
                  }
                />
              </div>

              {submitError && (
                <p className="text-xs text-red-400">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="text-xs text-emerald-400">
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
                  className="rounded-full px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10 transition"
                >
                  {isRO ? "Renunță" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting
                    ? isRO
                      ? "Se trimite..."
                      : "Sending..."
                    : isRO
                    ? "Trimite cererea"
                    : "Send request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

