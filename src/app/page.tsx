'use client';

import React, { useState } from 'react';
import IntroPhase from '@/components/IntroPhase';
import Dither from '@/components/Dither';
import RadialTimer from '@/components/RadialTimer';
import TimesUpPhase from '@/components/TimesUpPhase';
import SettingsModal from '@/components/SettingsModal';
import { Settings } from 'lucide-react';
import { sound } from '@/utils/sound';

export default function Home() {
  // Phase state: 'intro' | 'timer' | 'timesup'
  const [phase, setPhase] = useState<'intro' | 'timer' | 'timesup'>('intro');
  // Default 10 minutes = 600 seconds
  const [totalSeconds, setTotalSeconds] = useState(600);
  const [remainingSecs, setRemainingSecs] = useState(600);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Turn red in the last 2 minutes (<= 120 seconds)
  const isUrgent = remainingSecs <= 120 && phase === 'timer';

  const handleIntroComplete = () => {
    setPhase('timer');
  };

  const handleTimeUp = () => {
    setPhase('timesup');
  };

  const handleRestartTimer = () => {
    setRemainingSecs(totalSeconds);
    setPhase('intro');
  };

  const handleReplayIntro = () => {
    setRemainingSecs(totalSeconds);
    setPhase('intro');
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white select-none">
      {/* Settings small button at the top right corner */}
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 40 }}>
        <button
          onClick={() => {
            sound.playClick();
            setIsSettingsOpen(true);
          }}
          className="p-2.5 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-emerald-400/50 text-white/60 hover:text-white transition-all duration-300 active:scale-90 group shadow-[0_0_15px_rgba(0,0,0,0.8)] cursor-pointer"
          title="Timer Settings"
          aria-label="Timer Settings"
        >
          <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
        </button>
      </div>

      {/* PHASE 1: INTRO */}
      {phase === 'intro' && (
        <IntroPhase onComplete={handleIntroComplete} />
      )}

      {/* PHASE 2: RADIAL TIMER (With pure black background & prominent Dither effect that turns red in last 2 mins) */}
      {phase === 'timer' && (
        <div
          className="relative w-full h-full flex items-center justify-center bg-black"
          style={{ backgroundColor: '#000000' }}
        >
          {/* Prominent, elegant Dither background from React Bits (Turns red in last 2 mins) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-80 transition-opacity duration-700">
            <Dither
              waveColor={isUrgent ? [0.92, 0.08, 0.14] : [0.035, 0.36, 0.18]}
              backgroundColor={[0.0, 0.0, 0.0]}
              ditherMode="bayer"
              colorNum={4}
              pixelSize={2}
              waveSpeed={isUrgent ? 0.045 : 0.032}
              waveFrequency={2.5}
              waveAmplitude={0.32}
              contrast={1.18}
              mouseEffect="erase"
              mouseRadius={0.35}
              clickRipple={true}
            />
          </div>

          {/* Gentle edge vignette framing */}
          <div
            className="absolute inset-0 z-1 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 45%, rgba(0, 0, 0, 0.45) 100%)'
            }}
          />

          {/* Center Main Radial Timer (FocusLock inspired with one-by-one intro animation) */}
          <RadialTimer
            totalSeconds={totalSeconds}
            onTimeUp={handleTimeUp}
            soundEnabled={soundEnabled}
            onTick={(rem) => setRemainingSecs(rem)}
          />
        </div>
      )}

      {/* PHASE 3: TIMES UP (With AeroShards background) */}
      {phase === 'timesup' && (
        <TimesUpPhase
          onRestart={handleRestartTimer}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        totalSeconds={totalSeconds}
        onSaveTime={(secs) => {
          setTotalSeconds(secs);
          setRemainingSecs(secs);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        onSwitchPhase={(newPhase) => setPhase(newPhase)}
      />
    </main>
  );
}
