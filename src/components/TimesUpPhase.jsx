'use client';

import React, { useState, useEffect } from 'react';
import AeroShards from '@/components/AeroShards';
import { RotateCcw } from 'lucide-react';
import { sound } from '@/utils/sound';

export default function TimesUpPhase({ onRestart, onReplayIntro = undefined }) {
  // Text appears after the background is loaded
  const [textVisible, setTextVisible] = useState(false);
  // Overtime counter in seconds
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTextVisible(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Continuous overtime counter incrementing every second
  useEffect(() => {
    const interval = setInterval(() => {
      setOvertimeSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRestart = () => {
    sound.playWarp();
    onRestart();
  };

  const mins = Math.floor(overtimeSeconds / 60);
  const secs = overtimeSeconds % 60;
  const formattedMinutes = String(mins).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white select-none">
      {/* Overtime Small Text Clock at the Corner */}
      <div
        className="absolute top-5 left-5 z-20 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.25)] select-none transition-all duration-700"
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0)' : 'translateY(-10px)'
        }}
        title="Overtime elapsed"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="text-[10px] font-mono tracking-widest text-red-400 font-semibold uppercase">OVERTIME</span>
        <span className="text-xs sm:text-sm font-mono font-bold text-white tabular-nums tracking-wider">
          +{formattedMinutes}:{formattedSeconds}
        </span>
      </div>
      {/* Background AeroShards from React Bits */}
      <div className="absolute inset-0 z-0">
        <AeroShards
          shardColor="#10b981"
          accentColor="#059669"
          backgroundColor="#020804"
          material="glass"
          placement="full"
          markers="none"
          count={1000}
          depthOfField={0.7}
          glow={0.25}
          grain={0.04}
          vignette={0.4}
          mouseInteraction={true}
          pulseOnClick={true}
          holdToGather={true}
          scale={1}
        />
      </div>

      {/* Cybernetic vignette */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.92)_85%)]" />

      {/* Content overlay: Free-floating text without any glass box, appearing after background loads */}
      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 text-center transition-all duration-1000"
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)'
        }}
      >
        {/* Big White Text */}
        <h1
          className="font-bold tracking-tight text-white select-none"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: 'clamp(4rem, 11vw, 7.5rem)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textShadow: '0 0 35px rgba(255, 255, 255, 0.6), 0 0 80px rgba(16, 185, 129, 0.3)'
          }}
        >
          TIME&apos;S UP
        </h1>

        {/* Single Classy Restart Button */}
        <button
          onClick={handleRestart}
          className="mt-8 flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/25 hover:border-white font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.15)] active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESTART</span>
        </button>
      </div>
    </div>
  );
}
