import React from 'react';
import { ArrowRight, Palette, Film, LineChart } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
      {/* Decorative Blue Shapes & Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-blue-400/15 via-sky-300/10 to-indigo-200/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-16 right-10 w-64 h-64 bg-blue-200/20 blur-[80px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-sky-200/25 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200/80 text-xs text-slate-700 mb-8 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-700">Menerima Proyek & Komisi</span>
          <span className="text-slate-300">•</span>
          <span className="text-blue-600 font-bold">ZxProject Studio</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
          Kreasi Seni, Video & <br />
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
            Visualisasi Data Interaktif
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-10 leading-relaxed font-normal">
          Solusi terpadu untuk ilustrasi digital kustom, produksi & editing video berkecepatan tinggi, serta dashboard analitik visual yang siap pakai.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <a
            href="#commission"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/25 hover:scale-[1.02]"
          >
            <span>Pesan Komisi Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#showcase"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-blue-50/70 border border-slate-200 text-slate-700 font-bold text-sm transition-all shadow-xs"
          >
            <span>Lihat Koleksi Karya</span>
          </a>
        </div>

        {/* 3 Discipline Cards (Blue + White styling) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mt-16">
          <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-md shadow-blue-500/5 text-left hover:border-blue-300 transition-all hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Ilustrasi Digital</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Desain karakter, konsep seni (concept art), sampul buku, poster, dan karya gambar resolusi tinggi.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-md shadow-blue-500/5 text-left hover:border-blue-300 transition-all hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Editing Video & Motion</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Reels dinamis, color grading sinematik, efek suara, teks bergerak, serta iklan promosi singkat.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-md shadow-blue-500/5 text-left hover:border-blue-300 transition-all hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Visualisasi Data</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dashboard interaktif, grafik tren bisnis, perancangan metrik KPI, dan storytelling data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
