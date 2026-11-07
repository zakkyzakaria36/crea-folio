import React from 'react';
import { X, ExternalLink, Download, FileText, BarChart3, Calendar } from 'lucide-react';
import type { PortfolioItem } from '../types';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {item.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Media Player / Viewer */}
          <div className="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center min-h-[300px]">
            {item.mediaType === 'image' && (
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="max-h-[500px] w-auto max-w-full object-contain rounded-lg"
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
                    Your browser does not support the video tag.
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
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Document Attachment (PDF)</h4>
                  <p className="text-sm text-slate-400 mt-1 max-w-md">
                    Full booklet / report document available for download and inspection.
                  </p>
                </div>
                <div className="flex gap-3">
                  <a
                    href={item.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Open / Download PDF
                  </a>
                </div>
              </div>
            )}

            {item.mediaType === 'link' && (
              <div className="w-full p-8 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Live Interactive Project</h4>
                  <p className="text-sm text-slate-400 mt-1 max-w-md">
                    This project is deployed as an active web application or dashboard.
                  </p>
                </div>
                <a
                  href={item.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Launch Live Demo
                </a>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {item.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Extra Data / Metrics if any */}
          {item.extraData && typeof item.extraData === 'object' && item.extraData.metrics && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Project Metrics</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {item.extraData.metrics.map((m: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <p className="text-xs text-slate-400">{m.label}</p>
                    <p className="text-lg font-bold text-brand-400 mt-0.5">{m.value}</p>
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
