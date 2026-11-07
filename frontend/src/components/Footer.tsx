import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">CreaFolio Studio</span>
              <p className="text-[11px] text-slate-500">Illustration • Video Production • Data Analytics</p>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Built with precision & high craft</span>
            <span className="text-slate-600">•</span>
            <span>&copy; {new Date().getFullYear()} CreaFolio</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
