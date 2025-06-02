'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MODES = [
  { 
    label: 'Incepe ziua', 
    color: 'from-yellow-300 to-orange-400', 
    icon: '🌅',
    isStart: true
  },
  { 
    label: 'Termina ziua', 
    color: 'from-blue-400 to-indigo-600', 
    icon: '🌙',
    isStart: false
  }
];

export default function MoodVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleModeClick = (mode: typeof MODES[0]) => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    setActiveMode(mode.label);
    setIsPlaying(true);

    if (mode.isStart) {
      // For "Incepe ziua", start from beginning and play to middle
      video.currentTime = 0;
      video.play();

      const checkStartTime = () => {
        if (!videoRef.current) return;
        if (video.currentTime >= video.duration / 2) {
          video.pause();
          setIsPlaying(false);
        } else {
          requestAnimationFrame(checkStartTime);
        }
      };

      requestAnimationFrame(checkStartTime);
    } else {
      // For "Termina ziua", start from middle and play to end
      video.currentTime = video.duration / 2;
      video.play();

      const checkEndTime = () => {
        if (!videoRef.current) return;
        if (video.currentTime >= video.duration) {
          video.pause();
          setIsPlaying(false);
        } else {
          requestAnimationFrame(checkEndTime);
        }
      };

      requestAnimationFrame(checkEndTime);
    }
  };

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900">
          Controlează lumina casei tale
        </h2>
        
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            src="/videolumina.mp4"
            className="w-full h-full object-cover"
            muted
            playsInline
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex flex-col items-center gap-4">
              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="text-white text-sm font-medium px-4 py-2 rounded-full bg-blue-500/70"
                  >
                    ⏩ {activeMode}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex gap-6 justify-center">
                {MODES.map((mode) => (
                  <motion.button
                    key={mode.label}
                    onClick={() => handleModeClick(mode)}
                    className={`px-8 py-4 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105 ${
                      activeMode === mode.label
                        ? 'bg-gradient-to-r ' + mode.color + ' shadow-lg'
                        : 'bg-black/50 hover:bg-black/70'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isPlaying}
                  >
                    <span className="mr-2">{mode.icon}</span>
                    {mode.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 