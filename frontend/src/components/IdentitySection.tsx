import React from 'react';
import { Camera, GraduationCap, UserRound } from 'lucide-react';

export const IdentitySection: React.FC = () => (
  <section id="identitas" className="py-16 sm:py-20 border-t border-slate-200/80 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Profil Kreator</p>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Identitas Saya</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex items-center gap-5 p-5 rounded-2xl bg-blue-50/60 border border-blue-100 shadow-sm">
          <img src="/IMG_2801.png" alt="Zakky Zakaria" className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" />
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1"><UserRound className="w-4 h-4" /><span className="text-xs font-bold uppercase">Nama</span></div>
            <h3 className="text-xl font-black text-slate-900">Zakky Zakaria</h3>
          </div>
        </div>

        <div className="flex items-center gap-5 p-5 rounded-2xl bg-blue-50/60 border border-blue-100 shadow-sm">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white">
            <img src="/images.jpeg" alt="Ikon Instagram ZxProject" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1"><Camera className="w-4 h-4" /><span className="text-xs font-bold uppercase">Instagram</span></div>
            <a href="https://instagram.com/zkyzakariaa" target="_blank" rel="noreferrer" className="text-xl font-black text-slate-900 hover:text-blue-600">@zkyzakariaa</a>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600">
        <GraduationCap className="w-5 h-5 text-blue-600" />
        Student Data Science
      </div>
    </div>
  </section>
);
