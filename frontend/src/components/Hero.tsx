import React from 'react';
import { ArrowRight, Palette, Film, LineChart } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-indigo-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-sky-500/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-8 backdrop-blur shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Open for Commissions & Projects</span>
          <span className="text-slate-500">•</span>
          <span className="text-brand-400 font-medium">Q4 2026 Season</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Crafting Art, Motion & <br />
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
            Visual Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
          Multidisciplinary creator bridging bespoke digital illustration, high-retention video editing, and interactive executive data dashboards.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#commission"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-600/30 hover:scale-[1.02]"
          >
            <span>Book Commission</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#showcase"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all"
          >
            <span>Explore Works</span>
          </a>
        </div>

        {/* Discipline Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-16">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur text-left hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base mb-1">Digital Illustration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Character designs, concept art, book covers & high-detail raster / vector graphics.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur text-left hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base mb-1">Video & Motion Editing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast-paced reels, color grading, sound design, commercial cutdowns & dynamic captions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur text-left hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base mb-1">Data Visualization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Insight dashboards, metric storytelling, KPI reports, and interactive charts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
