import React from 'react';
import { X, ExternalLink, Download, FileText, BarChart3, Calendar } from 'lucide-react';
import type { PortfolioItem } from '../types';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const translateCategory = (cat: string) => {
    switch (cat) {
      case 'illustration': return 'Ilustrasi Digital';
      case 'video': return 'Video & Motion';
      case 'dataviz': return 'Visualisasi Data';
      default: return cat;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              {translateCategory(item.category)}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(item.createdAt).toLocaleDateString('id-ID')}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Media Player / Viewer */}
          <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center min-h-[300px]">
            {item.mediaType === 'image' && (
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="max-h-[500px] w-auto max-w-full object-contain rounded-xl"
              />
            )}

            {item.mediaType === 'video' && (
              <div className="w-full aspect-video">
                {item.mediaUrl.includes('youtube.com') || item.mediaUrl.includes('youtu.be') ? (
                  <iframe
                    src={item.mediaUrl}
                    title={item.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={item.mediaUrl}
                    controls
                    className="w-full h-full object-contain"
                  >
                    Browser Anda tidak mendukung pemutar video.
                  </video>
                )}
              </div>
            )}

            {item.mediaType === 'embed' && (
              <div className="w-full aspect-video">
                <iframe
                  src={item.mediaUrl}
                  title={item.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            )}

            {item.mediaType === 'pdf' && (
              <div className="w-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Lampiran Dokumen (PDF / Booklet)</h4>
                  <p className="text-sm text-slate-500 mt-1 max-w-md">
                    Dokumen portofolio lengkap tersedia untuk dibaca dan diunduh.
                  </p>
                </div>
                <div className="flex gap-3">
                  <a
                    href={item.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md shadow-blue-600/20"
                  >
                    <Download className="w-4 h-4" />
                    Buka / Unduh PDF
                  </a>
                </div>
              </div>
            )}

            {item.mediaType === 'link' && (
              <div className="w-full p-8 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Aplikasi / Dashboard Interaktif</h4>
                  <p className="text-sm text-slate-500 mt-1 max-w-md">
                    Proyek ini aktif dan dapat dicoba langsung melalui link live demo.
                  </p>
                </div>
                <a
                  href={item.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md shadow-blue-600/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka Live Demo
                </a>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">{item.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {item.description || 'Tidak ada keterangan tambahan.'}
            </p>
          </div>

          {/* Extra Data / Metrics if any */}
          {item.extraData && typeof item.extraData === 'object' && item.extraData.metrics && (
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">Metrik Kunci Proyek</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {item.extraData.metrics.map((m: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-blue-100 text-center shadow-xs">
                    <p className="text-xs text-slate-500 font-semibold">{m.label}</p>
                    <p className="text-lg font-black text-blue-600 mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
