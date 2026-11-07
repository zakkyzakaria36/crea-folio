import React from 'react';
import { Palette, Video, BarChart3, Search, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTracker, onOpenAdmin }) => {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-blue-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <a href="#" className="flex items-center space-x-3 group">
            {/* Logo Badge Teks ZX gradasi biru */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center text-white font-extrabold text-base tracking-wider shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              ZX
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Zx<span className="text-blue-600">Project</span>
              </span>
              <p className="text-[10px] text-blue-600/70 font-semibold tracking-wider uppercase">
                Ilustrasi • Video • Data Viz
              </p>
            </div>
          </a>

          {/* Navigation Links (Bahasa Indonesia) */}
          <div className="hidden md:flex items-center space-x-7 text-sm font-semibold">
            <a href="#showcase" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-blue-600" />
              Galeri Karya
            </a>
            <a href="#dataviz" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Visualisasi Data
            </a>
            <a href="#commission" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <Video className="w-4 h-4 text-blue-600" />
              Pesan Komisi
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenTracker}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-blue-50/80 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-all shadow-xs"
              title="Lacak status pesanan kamu"
            >
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Lacak Pesanan</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
              title="Portal Admin"
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
