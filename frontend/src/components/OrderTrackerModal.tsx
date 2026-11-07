import React, { useState } from 'react';
import { X, Search, AlertCircle } from 'lucide-react';
import type { OrderStatus } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(code.trim())}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Nomor resi pesanan tidak ditemukan');
      }

      setOrder(json.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mencari data pesanan');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 1;
      case 'reviewed': return 2;
      case 'in_progress': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Antrean';
      case 'reviewed': return 'Ditelaah';
      case 'in_progress': return 'Sedang Dikerjakan';
      case 'completed': return 'Selesai';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-black text-slate-900 mb-1">Lacak Status Pesanan</h3>
        <p className="text-xs text-slate-500 mb-6">
          Masukkan kode resi yang Anda peroleh saat checkout (contoh: <span className="text-blue-600 font-mono font-bold">CF-20261107-XXXX</span>).
        </p>

        {/* Lookup form */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <input
            type="text"
            required
            placeholder="Ketik Kode Resi..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 font-mono uppercase focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-blue-600/20"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Mencari...' : 'Lacak'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 mb-4 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Details Result */}
        {order && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-5 animate-in fade-in duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-black text-blue-600">{order.orderCode}</span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">{order.projectTitle}</h4>
                <p className="text-xs text-slate-500 capitalize">Kategori: {order.serviceCategory}</p>
              </div>

              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                order.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : order.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : order.status === 'reviewed'
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}>
                {translateStatus(order.status)}
              </span>
            </div>

            {/* Progress Stepper */}
            <div className="pt-2">
              <div className="grid grid-cols-4 text-center text-[10px] font-bold text-slate-400 mb-2">
                <span className={currentStep >= 1 ? 'text-blue-600' : ''}>Diterima</span>
                <span className={currentStep >= 2 ? 'text-blue-600' : ''}>Ditelaah</span>
                <span className={currentStep >= 3 ? 'text-blue-600' : ''}>Dikerjakan</span>
                <span className={currentStep >= 4 ? 'text-emerald-600' : ''}>Selesai</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-blue-600 h-full transition-all duration-500"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 border-t border-blue-100 pt-3 flex justify-between font-medium">
              <span>Diajukan: {new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
              <span>Pembaruan: {new Date(order.updatedAt).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
