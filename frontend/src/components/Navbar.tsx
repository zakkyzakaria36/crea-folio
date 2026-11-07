import React from 'react';
import { Palette, Video, BarChart3, Search, ShieldCheck, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTracker, onOpenAdmin }) => {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Crea<span className="text-brand-400">Folio</span>
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Art • Video • Data</p>
            </div>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="#showcase" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-400" />
              Showcase
            </a>
            <a href="#dataviz" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Live Analytics
            </a>
            <a href="#commission" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
              <Video className="w-4 h-4 text-sky-400" />
              Order Commission
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenTracker}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
              title="Track your order status"
            >
              <Search className="w-3.5 h-3.5 text-brand-400" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-600/20 border border-brand-500/40 text-brand-300 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
