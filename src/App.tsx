import React, { useState } from 'react';
import PitchDeck from './components/PitchDeck';
import PlatformApp from './components/PlatformApp';
import { Sparkles, FileText, Cpu, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'prototype' | 'pitch'>('prototype');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none" id="app-wrapper">
      {/* Top universal mode switcher bar */}
      <nav className="bg-slate-950 border-b border-slate-900 px-4 py-3 sticky top-0 z-50 shadow-md" id="universal-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-slate-100 tracking-tighter uppercase">
              Brotherly
            </span>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <p className="text-xs text-slate-400 capitalize hidden sm:block font-mono">
              Innovator Founder Visa Envisioning
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800" id="mode-switcher-buttons">
            <button
              id="btn-mode-prototype"
              onClick={() => setCurrentMode('prototype')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
                currentMode === 'prototype'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>✨ Open Platform Prototype</span>
            </button>
            <button
              id="btn-mode-pitch"
              onClick={() => setCurrentMode('pitch')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
                currentMode === 'pitch'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>📄 View Business Plan & Pitch</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] uppercase font-mono text-slate-500">
            <span>Edinburgh Node</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>June 2026</span>
          </div>

        </div>
      </nav>

      {/* Main active frame loader */}
      <div className="flex-1" id="main-frame-renderer">
        {currentMode === 'prototype' ? (
          <div className="animate-fade-in duration-300">
            <div className="bg-slate-900 border-b border-slate-800 p-2 text-center text-xs text-slate-400" id="app-promo-info">
              <span>👇 Explore the high-fidelity demo app space. Check out the 1:1 Gemini-powered Advisor chat or toggle </span>
              <button 
                onClick={() => setCurrentMode('pitch')}
                className="text-emerald-400 font-bold underline cursor-pointer hover:text-emerald-300 ml-1 inline-flex items-center gap-1"
              >
                "Business Plan & Pitch" <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <PlatformApp />
          </div>
        ) : (
          <div className="animate-fade-in duration-300">
            <PitchDeck />
          </div>
        )}
      </div>

    </div>
  );
}

