import React, { useState } from 'react';
import { Palette, Film, BarChart3, Layers, FileText, ExternalLink, Play, Eye } from 'lucide-react';
import type { PortfolioItem, CategoryType } from '../types';

interface PortfolioGalleryProps {
  items: PortfolioItem[];
  loading: boolean;
  onSelectItem: (item: PortfolioItem) => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ items, loading, onSelectItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryType>('all');

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const getMediaBadge = (type: string) => {
    switch (type) {
      case 'image':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-600/90 text-white backdrop-blur shadow-xs">
            <Palette className="w-3 h-3" /> Gambar
          </span>
        );
      case 'video':
      case 'embed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600/90 text-white backdrop-blur shadow-xs">
            <Play className="w-3 h-3 fill-current" /> Video
          </span>
        );
      case 'pdf':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-600/90 text-white backdrop-blur shadow-xs">
            <FileText className="w-3 h-3" /> Dokumen PDF
          </span>
        );
      case 'link':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white backdrop-blur shadow-xs">
            <ExternalLink className="w-3 h-3" /> Live Demo
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="showcase" className="py-16 sm:py-24 border-t border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              Koleksi Unggulan
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Galeri Portofolio & Proyek Pilihan
            </p>
          </div>

          {/* Category Filter Pills (Blue + White) */}
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 self-start">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Semua Karya
            </button>
            <button
              onClick={() => setSelectedCategory('illustration')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'illustration'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Ilustrasi
            </button>
            <button
              onClick={() => setSelectedCategory('video')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'video'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Video & Motion
            </button>
            <button
              onClick={() => setSelectedCategory('dataviz')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'dataviz'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Visualisasi Data
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-100 border border-slate-200" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            <p className="text-slate-500 text-sm">Belum ada karya pada kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group relative rounded-2xl bg-white border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.thumbnailUrl || item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badge top-left */}
                  <div className="absolute top-3 left-3">
                    {getMediaBadge(item.mediaType)}
                  </div>

                  {/* Hover eye icon center */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="p-3 rounded-full bg-white text-blue-600 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description || 'Tidak ada deskripsi rinci.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
