'use client';

import React, { useState, useEffect } from 'react';
import GradientASCII from '@/components/GradientASCII';
import ASCIIText from '@/components/ASCIIText';
import { sound } from '@/utils/sound';

// EXACT 8 phrases requested by the user formatted into multiple balanced lines
const PHRASES = [
  'Boot Through Time',
  'Then you have to\nsolve it in 10 Minutes',
  'There are 5 OS\nfrom 5 diffrent eras',
  'Look at hints,\nget the codes,',
  'Combine them:',
  'WIN',
  'ALL THE BEST',
  'May the FOSS\nBe with you'
];

export default function IntroPhase({ onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [bgLoaded, setBgLoaded] = useState(false);

  const currentPhrase = PHRASES[currentIdx];
  // 2-line text lines like 'There are 5 OS / from 5 diffrent eras' get 3 seconds (3000ms); single lines get 2 seconds
  const slideDuration = currentPhrase.includes('\n') ? 3000 : 2000;

  // The text appears after the background is loaded
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setBgLoaded(true);
    }, 350);
    return () => clearTimeout(loadTimer);
  }, []);

  // Slide advancement with dynamic duration
  useEffect(() => {
    if (!bgLoaded) return;
    const timer = setTimeout(() => {
      if (currentIdx < PHRASES.length - 1) {
        sound.playKeypress();
        setCurrentIdx(prev => prev + 1);
      } else {
        // Finished all 8 phrases, transition to timer
        sound.playWarp();
        onComplete();
      }
    }, slideDuration);

    return () => clearTimeout(timer);
  }, [currentIdx, bgLoaded, onComplete, slideDuration]);

  // Click anywhere to immediately advance
  const handleScreenClick = () => {
    sound.playClick();
    if (currentIdx < PHRASES.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      sound.playWarp();
      onComplete();
    }
  };

  return (
    <div
      onClick={handleScreenClick}
      className="relative w-full h-screen overflow-hidden bg-black text-white select-none cursor-pointer"
      title="Click anywhere to advance"
    >
      {/* Background: Gradient ASCII (Subtle, classy deep emerald matrix palette) */}
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
        <GradientASCII
          colors={['#010904', '#031a0c', '#06361a', '#0d592e', '#157e43']}
          shape="rise"
          density={0.7}
          glyphOpacity={0.3}
          glow={0.08}
          speed={0.4}
          flow={0.5}
        />
      </div>

      {/* Subtle vignette for deep focus */}
      <div className="absolute inset-0 pointer-events-none z-1 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.85)_100%)]" />

      {/* Pure, elegant, white colored ASCII text via React Bits ASCIIText - 2s duration, white, crisp */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none transition-opacity duration-1000"
        style={{ opacity: bgLoaded ? 1 : 0 }}
      >
        {bgLoaded && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <ASCIIText
              key={`ascii-${currentIdx}`}
              text={currentPhrase}
              asciiFontSize={6}
              colors={['#ffffff', '#ffffff', '#ffffff']}
              textColor="#ffffff"
              textScale={1}
              blocks={0.8}
              waves={0}
              waveSpeed={1}
              chroma={0}
              tilt={0.4}
              hueShift={0}
              scramble={0.5}
              clickRipple={true}
              intro={true}
              idle={true}
              interactive={true}
              theme="dark"
            />
          </div>
        )}
      </div>
    </div>
  );
}
