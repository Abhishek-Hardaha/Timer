'use client';

import React, { useEffect, useState, useRef } from 'react';
import { sound } from '@/utils/sound';

export default function RadialTimer({
  totalSeconds = 600,
  onTimeUp,
  soundEnabled = true,
  onTick
}) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  // Intro stages: 0: initial, 1: glass plates, 2: ticks/rings, 3: arc sweep, 4: jewel & digits, 5: timer active
  const [introStep, setIntroStep] = useState(0);

  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  // Urgent mode in the last 2 minutes (120 seconds)
  const isUrgent = timeLeft <= 120;
  const ringColor = isUrgent ? '#ef4444' : '#10b981';

  // One-by-one intro animation sequence
  useEffect(() => {
    const t1 = setTimeout(() => setIntroStep(1), 100);  // 1. Glass plates scale in
    const t2 = setTimeout(() => setIntroStep(2), 350);  // 2. Hairline rings & ticks
    const t3 = setTimeout(() => setIntroStep(3), 600);  // 3. Progress arc sweeps in
    const t4 = setTimeout(() => {
      setIntroStep(4);
      sound.playKeypress();
    }, 1100); // 4. White jewel & digits appear
    const t5 = setTimeout(() => {
      setIntroStep(5);
      setIsRunning(true); // 5. Automatic countdown begins
    }, 1350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Sync if totalSeconds changes from settings
  useEffect(() => {
    setTimeLeft(totalSeconds);
  }, [totalSeconds]);

  // Safely inform parent of tick changes outside the render/updater cycle
  useEffect(() => {
    onTickRef.current?.(timeLeft);
  }, [timeLeft]);

  // Main countdown interval - pure state update
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Audio signals and timeup notification
  useEffect(() => {
    if (isRunning && soundEnabled && timeLeft > 0) {
      if (timeLeft <= 10) {
        sound.playWarningTick();
      } else if (timeLeft % 60 === 0 && timeLeft !== totalSeconds) {
        sound.playTick();
      }
    }
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      sound.playAlarm();
      const timer = setTimeout(() => {
        onTimeUpRef.current?.();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isRunning, soundEnabled, totalSeconds]);

  // Click on the dial to pause or resume
  const togglePause = () => {
    sound.playClick();
    setIsRunning(prev => !prev);
  };

  // Spacious FocusLock Proportions
  const viewBoxSize = 460;
  const center = 230;
  const radius = 166;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalSeconds > 0 ? timeLeft / totalSeconds : 0;

  // Intro arc sweep animation from 0 to full, then tracks countdown
  const arcProgress = introStep < 3 ? 0 : progressRatio;
  const strokeDashoffset = circumference * (1 - arcProgress);

  // Precision position of the jewel dot inside the -90deg rotated SVG coordinate space
  const angleRad = arcProgress * 2 * Math.PI;
  const dotX = center + radius * Math.cos(angleRad);
  const dotY = center + radius * Math.sin(angleRad);

  // Format time MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formattedMinutes = String(mins).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  // FocusLock luxury tick marks (60 ticks around the ring)
  const ticks = Array.from({ length: 60 }, (_, i) => i * 6);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full select-none z-10 pointer-events-auto">
      {/* Dial Container - 450x450 matching viewBox */}
      <div
        onClick={togglePause}
        className="relative flex items-center justify-center cursor-pointer transition-transform duration-300 active:scale-[0.985]"
        style={{ width: '450px', height: '450px', maxWidth: '88vw', maxHeight: '88vw' }}
        title={isRunning ? 'Click to pause' : 'Click to resume'}
      >
        {/* Ambient Halo (Turns subtle red in the last 2 minutes) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-all duration-1000"
          style={{
            background: isUrgent
              ? 'radial-gradient(circle, rgba(239, 68, 68, 0.16) 0%, rgba(220, 38, 38, 0.05) 40%, transparent 68%)'
              : 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 65%)',
            filter: 'blur(70px)',
            opacity: introStep >= 1 ? (isRunning ? 0.7 : 0.3) : 0,
            transform: introStep >= 1 ? 'scale(1)' : 'scale(0.85)'
          }}
        />

        {/* Outer Translucent Glass Plate (FocusLock: w-[86%] h-[86%]) */}
        <div
          className="absolute rounded-full pointer-events-none transition-all duration-700"
          style={{
            width: '86%',
            height: '86%',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            background: 'rgba(255, 255, 255, 0.005)',
            border: isUrgent ? '1px solid rgba(239, 68, 68, 0.14)' : '1px solid rgba(255, 255, 255, 0.025)',
            boxShadow: isUrgent
              ? 'inset 0 0 60px rgba(239, 68, 68, 0.04), 0 0 35px rgba(0, 0, 0, 0.6)'
              : 'inset 0 0 60px rgba(255, 255, 255, 0.005), 0 0 35px rgba(0, 0, 0, 0.5)',
            opacity: introStep >= 1 ? 1 : 0,
            transform: introStep >= 1 ? 'scale(1)' : 'scale(0.92)'
          }}
        />

        {/* Inner Smoked Glass Plate (FocusLock: w-[68%] h-[68%]) */}
        <div
          className="absolute rounded-full pointer-events-none transition-all duration-700"
          style={{
            width: '68%',
            height: '68%',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: isUrgent ? 'rgba(16, 4, 6, 0.62)' : 'rgba(4, 9, 6, 0.55)',
            border: isUrgent ? '1px solid rgba(239, 68, 68, 0.24)' : '1px solid rgba(255, 255, 255, 0.035)',
            boxShadow: isUrgent
              ? 'inset 0 0 45px rgba(239, 68, 68, 0.14), 0 0 35px rgba(0, 0, 0, 0.7)'
              : 'inset 0 0 35px rgba(0, 0, 0, 0.7)',
            opacity: introStep >= 1 ? 1 : 0,
            transform: introStep >= 1 ? 'scale(1)' : 'scale(0.9)'
          }}
        />

        {/* FocusLock Precision SVG Rings */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'center'
          }}
        >
          {/* Inner ring track border */}
          <circle
            cx={center}
            cy={center}
            r="148"
            fill="none"
            stroke={isUrgent ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.02)'}
            strokeWidth="1"
            style={{
              opacity: introStep >= 2 ? 1 : 0,
              transition: 'opacity 0.6s ease, stroke 0.6s ease'
            }}
          />

          {/* Outer ring track border */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={isUrgent ? 'rgba(239, 68, 68, 0.14)' : 'rgba(255, 255, 255, 0.025)'}
            strokeWidth="1"
            style={{
              opacity: introStep >= 2 ? 1 : 0,
              transition: 'opacity 0.6s ease, stroke 0.6s ease'
            }}
          />

          {/* Luxury Tick Marks (FocusLock 1px hairline lines - turns red in last 2 mins) */}
          <g
            style={{
              opacity: introStep >= 2 ? 0.35 : 0,
              transition: 'opacity 0.7s ease'
            }}
          >
            {ticks.map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const isMajor = i % 5 === 0;
              const x1 = center + (isMajor ? 148 : 153) * Math.cos(rad);
              const y1 = center + (isMajor ? 148 : 153) * Math.sin(rad);
              const x2 = center + 160 * Math.cos(rad);
              const y2 = center + 160 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMajor ? ringColor : (isUrgent ? 'rgba(239, 68, 68, 0.45)' : '#ffffff')}
                  strokeWidth={isMajor ? 1.5 : 1}
                  strokeOpacity={isMajor ? 0.7 : 0.25}
                />
              );
            })}
          </g>

          {/* Sleek 3.5px Progress Arc (Turns red in last 2 mins) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: isUrgent
                ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.85)) drop-shadow(0 0 3px rgba(255, 68, 68, 0.6))'
                : 'drop-shadow(0 0 7px rgba(16, 185, 129, 0.45))',
              transition: introStep === 3 ? 'stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'stroke-dashoffset 0.5s linear, stroke 0.6s ease',
              opacity: introStep >= 3 ? 1 : 0
            }}
          />

          {/* Rotating White Jewel Dot (FocusLock r="4") */}
          <circle
            cx={dotX}
            cy={dotY}
            r="4"
            fill="#ffffff"
            style={{
              filter: isUrgent
                ? 'drop-shadow(0 0 8px #ef4444) drop-shadow(0 0 3px #ff3b30)'
                : 'drop-shadow(0 0 5px #10b981) drop-shadow(0 0 2px #ffffff)',
              opacity: introStep >= 4 && arcProgress > 0 ? 1 : 0,
              transition: 'opacity 0.4s ease, cx 0.5s linear, cy 0.5s linear'
            }}
          />
        </svg>

        {/* Center Typography */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-30 transition-all duration-700"
          style={{
            opacity: introStep >= 4 ? 1 : 0,
            transform: introStep >= 4 ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)'
          }}
        >
          {/* Main Time Digits - Kept clean white */}
          <div
            className="font-mono font-bold text-white select-none tabular-nums tracking-tight leading-none"
            style={{
              fontSize: 'clamp(3.2rem, 8vw, 4.4rem)',
              color: '#ffffff',
              textShadow: isUrgent
                ? '0 0 25px rgba(255, 255, 255, 0.55), 0 0 50px rgba(239, 68, 68, 0.35)'
                : '0 0 25px rgba(255, 255, 255, 0.45), 0 0 50px rgba(16, 185, 129, 0.18)',
              transition: 'text-shadow 0.8s ease'
            }}
          >
            {formattedMinutes}:{formattedSeconds}
          </div>

          {/* Subtle pause micro-indicator when paused */}
          {!isRunning && introStep >= 5 && (
            <div
              className={`mt-3.5 px-2.5 py-0.5 rounded-full border text-[9px] font-mono tracking-widest uppercase animate-pulse ${
                isUrgent
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-white/[0.04] border-white/10 text-emerald-400'
              }`}
            >
              PAUSED
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
