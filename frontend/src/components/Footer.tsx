import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            {/* Logo ZX */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-black text-xs flex items-center justify-center shadow-xs">
              ZX
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm">ZxProject Studio</span>
              <p className="text-[11px] text-slate-500 font-medium">Ilustrasi Digital • Produksi Video • Analisis Data</p>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <span>Didesain bersih & elegan</span>
            <span className="text-slate-300">•</span>
            <span>&copy; {new Date().getFullYear()} ZxProject. Hak Cipta Dilindungi.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
