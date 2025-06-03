"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./HeroPulse.css";

interface HeroSlide {
  id: string;
  imageUrl: string;
  collectionLink: string;
}

interface HeroProps {
  slides: HeroSlide[];
  autoChangeInterval: number;
}

const boxBlue = "bg-blue-800";
const boxText = "text-white";
const boxShadow = "shadow-lg";
const boxRounded = "rounded-xl";
const boxPadding = "px-6 py-4";
const boxTitle = "font-bold text-lg mb-1";
const boxDesc = "text-sm opacity-90";
const lineBlue = "bg-blue-800";
const lineThick = "h-2";
const arrow =
  "w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-blue-800";

const hotpoints = [
  {
    // Stânga sus
    point: { x: 164, y: 102 },
    box: { x: -210, y: 45 },
    label: "Smart residence",
    desc: "Gestionează iluminatul casei tale din orice locație",
    polyline: "163,116 90,116 90,60 30,60",
    link: "/smart-residence",
  },
  {
    // Stânga jos
    point: { x: 147, y: 263 },
    box: { x: -210, y: 322 },
    label: "Smart Comercial",
    desc: "Gestionează iluminatul casei tale din orice locație",
    polyline: "148,273 90,360 30,360",
    link: "/smart-comercial",
  },
  {
    // dreapta jos
    point: { x: 417, y: 263 },
    box: { x: 570, y: 345 },
    label: "Smart Lighting",
    desc: "Gestionează iluminatul casei tale din orice locație",
    polyline: "570,390 495,360 440,280",
    link: "/smart-lighting",
  },
  {
    // Dreapta sus
    point: { x: 400, y: 102 },
    box: { x: 600, y: 45 },
    label: "Smart Intercom",
    desc: "Menține temperatura perfectă în fiecare cameră",
    polyline: "425,114 510,114 510,60 615,60",
    link: "/smart-intercom",
  },
  {
    // Dreapta mijloc
    point: { x: 428, y: 174 },
    box: { x: 600, y: 195 },
    label: "Produse",
    desc: "Comandă-ți casa folosind doar vocea",
    polyline: "600,232 525,232,448,185",
    link: "/products"
  },
  {
    // Stânga mijloc
    point: { x: 136, y: 173 },
    box: { x: -172, y: 180 },
    label: "Despre",
    desc: "Creează scenarii personalizate pentru casa ta",
    polyline: "141,176 112,210 67,210",
    link: "/despre",
  },
];

const SmartHomeHero = () => {
  const [dots, setDots] = useState<Array<{ x: number; y: number }>>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 600, scale: 1 });

  // Calculate container size and scale based on breakpoints
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;

      const viewportWidth = window.innerWidth;
      let newWidth = 600;
      let newScale = 1;

      // Define precise breakpoints for scaling
      if (viewportWidth >= 1536) { // 2xl
        newWidth = 600;
        newScale = 1;
      } else if (viewportWidth >= 1280) { // xl
        newWidth = 600;
        newScale = 1;
      } else if (viewportWidth >= 1024) { // lg
        newWidth = 525;
        newScale = 0.875;
      } else if (viewportWidth >= 768) { // md
        newWidth = 450;
        newScale = 0.75;
      } else {
        newWidth = Math.min(viewportWidth - 32, 375);
        newScale = newWidth / 600;
      }

      setContainerSize({ width: newWidth, scale: newScale });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Găsim toate cercurile albastre din SVG
    const blueCircles = svg.querySelectorAll('path[fill="#1a64b7"]');
    const newDots: Array<{ x: number; y: number }> = [];

    blueCircles.forEach((circle) => {
      const rect = circle.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();

      newDots.push({
        x: rect.left - svgRect.left + rect.width / 2,
        y: rect.top - svgRect.top + rect.height / 2,
      });
    });

    setDots(newDots);
  }, []);

  return (
    <div className="relative w-full min-h-[100svh] flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Emblem Container */}
          <div
            ref={containerRef}
            className="relative mx-auto mb-4 md:mb-8"
            style={{ width: containerSize.width }}
          >
            {/* Logo Image */}
            <div className="relative">
              <Image
                src="/sigla smart home.svg"
                alt="SmartHomeMall Logo"
                width={600}
                height={450}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Hotpoints Container */}
            <div className="hidden md:block absolute inset-0">
              <div
                className="relative w-[600px] h-[450px]"
                style={{
                  transform: `scale(${containerSize.scale})`,
                  transformOrigin: 'top left'
                }}
              >
                {/* SVG Lines */}
                <svg
                  ref={svgRef}
                  className="absolute pointer-events-none left-0 top-0 w-full h-full z-20"
                  width="600"
                  height="450"
                >
                  {hotpoints.map((h, i) => (
                    <polyline
                      key={i}
                      points={h.polyline}
                      fill="none"
                      stroke="#4fd1ff"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      filter="url(#glow)"
                      className="animate-pulse-glow"
                    />
                  ))}
                  <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                </svg>

                {/* Hotpoints and Boxes */}
                {hotpoints.map((h, i) => (
                  <div key={i}>
                    {/* Hotpoint */}
                    <div
                      style={{ left: h.point.x, top: h.point.y }}
                      className="absolute w-6 h-6 rounded-full bg-blue-800 border-3 border-cyan-300 shadow-[0_0_12px_3px_#4fd1ff] z-30 animate-pulse-glow"
                    />
                    {/* Box */}
                    {h.link ? (
                      <Link
                        href={h.link}
                        style={{ left: h.box.x, top: h.box.y }}
                        className="absolute w-60 h-20 rounded-lg bg-blue-900/80 border-2 border-cyan-300 shadow-[0_0_12px_3px_#4fd1ff] flex flex-col justify-center px-4 z-30 animate-pulse-glow cursor-pointer hover:bg-blue-800 transition"
                      >
                        <span className="text-cyan-200 font-semibold text-base">
                          {h.label}
                        </span>
                        <span className="text-cyan-100 text-xs mt-1">{h.desc}</span>
                      </Link>
                    ) : (
                      <div
                        style={{ left: h.box.x, top: h.box.y }}
                        className="absolute w-60 h-20 rounded-lg bg-blue-900/80 border-2 border-cyan-300 shadow-[0_0_12px_3px_#4fd1ff] flex flex-col justify-center px-4 z-30 animate-pulse-glow"
                      >
                        <span className="text-cyan-200 font-semibold text-base">
                          {h.label}
                        </span>
                        <span className="text-cyan-100 text-xs mt-1">{h.desc}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin font-sans uppercase mb-3 md:mb-4 text-white">
              Transformă-ți Casa într-un Spațiu Inteligent
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-blue-50 mb-4 md:mb-6 max-w-2xl mx-auto">
              Descoperă lumea smart home și bucură-te de confortul și eficiența
              oferită de tehnologia modernă. Controlul casei tale la un click
              distanță.
            </p>
            <Button className="bg-white hover:bg-blue-50 text-blue-600 px-6 py-4 md:px-8 md:py-6 text-base md:text-lg rounded-full">
              Explorează Soluțiile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartHomeHero;
