'use client';

import React, { useState } from 'react';
import { Settings, X, Clock, Volume2, VolumeX, Eye, Check } from 'lucide-react';
import { sound } from '@/utils/sound';

export default function SettingsModal({
  isOpen,
  onClose,
  totalSeconds,
  onSaveTime,
  soundEnabled,
  onToggleSound,
  onSwitchPhase
}) {
  const [minutes, setMinutes] = useState(Math.floor(totalSeconds / 60));
  const [seconds, setSeconds] = useState(totalSeconds % 60);

  if (!isOpen) return null;

  const handleApply = (m, s) => {
    sound.playClick();
    const finalSecs = Math.max(5, (parseInt(m, 10) || 0) * 60 + (parseInt(s, 10) || 0));
    onSaveTime(finalSecs);
    onClose();
  };

  const setPreset = (mins) => {
    sound.playClick();
    setMinutes(mins);
    setSeconds(0);
    handleApply(mins, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-black/90 border border-[#00ff66]/40 rounded-2xl p-6 sm:p-7 text-white font-mono shadow-[0_0_50px_rgba(0,255,102,0.25)] select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4 mb-5">
          <div className="flex items-center gap-2.5 text-[#00ff66]">
            <Settings className="w-5 h-5 animate-spin-slow" />
            <span className="text-sm font-bold tracking-widest uppercase">Timer Configuration</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-emerald-500 hover:text-[#00ff66] hover:bg-emerald-950/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duration input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-emerald-400/80 mb-2 tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>CUSTOM TIMER DURATION</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] text-emerald-500/60 uppercase">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="180"
                  value={minutes}
                  onChange={e => setMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full bg-black/60 border border-emerald-900/80 focus:border-[#00ff66] rounded-xl px-3 py-2 text-center text-lg font-bold text-[#00ff66] outline-none shadow-inner"
                />
              </div>
              <span className="text-2xl text-emerald-500/60 mt-4">:</span>
              <div className="flex-1">
                <label className="text-[10px] text-emerald-500/60 uppercase">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={e => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                  className="w-full bg-black/60 border border-emerald-900/80 focus:border-[#00ff66] rounded-xl px-3 py-2 text-center text-lg font-bold text-[#00ff66] outline-none shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs text-emerald-400/80 mb-2 tracking-wider">
              QUICK PRESETS
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '1m', val: 1 },
                { label: '5m', val: 5 },
                { label: '10m (Default)', val: 10 },
                { label: '15m', val: 15 },
                { label: '20m', val: 20 },
                { label: '30m', val: 30 },
                { label: '45m', val: 45 },
                { label: '60m', val: 60 }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => setPreset(p.val)}
                  className={`py-2 px-2 rounded-xl text-xs font-mono font-medium border transition-all active:scale-95 ${
                    totalSeconds === p.val * 60
                      ? 'bg-[#00ff66] text-black border-[#00ff66] font-bold shadow-[0_0_12px_rgba(0,255,102,0.4)]'
                      : 'bg-black/40 border-emerald-900/70 text-emerald-300 hover:border-[#00ff66]/50 hover:text-[#00ff66]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Preferences */}
          <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between">
            <span className="text-xs text-emerald-300 flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00ff66]" /> : <VolumeX className="w-4 h-4 text-emerald-700" />}
              <span>Cyber Sound Effects</span>
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onToggleSound();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                soundEnabled
                  ? 'bg-emerald-950/80 border-[#00ff66]/60 text-[#00ff66]'
                  : 'bg-black border-emerald-900 text-emerald-600'
              }`}
            >
              {soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          {/* Direct Phase Jump / Preview */}
          <div className="pt-2 border-t border-emerald-900/60">
            <label className="block text-xs text-emerald-400/80 mb-2 tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>TEST PHASES</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onSwitchPhase('intro');
                  onClose();
                }}
                className="py-2 px-1 rounded-xl bg-black/50 border border-emerald-900/70 hover:border-[#00ff66] text-emerald-400 text-xs transition-all text-center"
              >
                1. Intro
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onSwitchPhase('timer');
                  onClose();
                }}
                className="py-2 px-1 rounded-xl bg-black/50 border border-emerald-900/70 hover:border-[#00ff66] text-emerald-400 text-xs transition-all text-center"
              >
                2. Timer
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onSwitchPhase('timesup');
                  onClose();
                }}
                className="py-2 px-1 rounded-xl bg-black/50 border border-emerald-900/70 hover:border-[#00ff66] text-emerald-400 text-xs transition-all text-center"
              >
                3. Times Up
              </button>
            </div>
          </div>
        </div>

        {/* Footer Apply */}
        <div className="mt-6 pt-4 border-t border-emerald-900/60 flex gap-3">
          <button
            onClick={() => handleApply(minutes, seconds)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00ff66] text-black font-bold text-xs tracking-wider uppercase hover:bg-[#33ff85] transition-all shadow-[0_0_20px_rgba(0,255,102,0.4)] active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>SAVE & APPLY</span>
          </button>
        </div>
      </div>
    </div>
  );
}
