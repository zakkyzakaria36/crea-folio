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
        throw new Error(json.error || 'Order code not found');
      }

      setOrder(json.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to locate order');
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

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-2">Track Your Commission</h3>
        <p className="text-xs text-slate-400 mb-6">
          Enter the unique tracking code you received upon submission (e.g. <span className="text-brand-400 font-mono">CF-20261107-XXXX</span>).
        </p>

        {/* Lookup form */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <input
            type="text"
            required
            placeholder="Enter Order Code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-brand-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching...' : 'Track'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Details Result */}
        {order && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5 animate-in fade-in duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-bold text-brand-400">{order.orderCode}</span>
                <h4 className="text-base font-bold text-white mt-0.5">{order.projectTitle}</h4>
                <p className="text-xs text-slate-400 capitalize">Category: {order.serviceCategory}</p>
              </div>

              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                order.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : order.status === 'in_progress'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : order.status === 'reviewed'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>

            {/* Progress Stepper */}
            <div className="pt-2">
              <div className="grid grid-cols-4 text-center text-[10px] font-semibold text-slate-400 mb-2">
                <span className={currentStep >= 1 ? 'text-brand-400' : ''}>Received</span>
                <span className={currentStep >= 2 ? 'text-brand-400' : ''}>Reviewed</span>
                <span className={currentStep >= 3 ? 'text-brand-400' : ''}>In Progress</span>
                <span className={currentStep >= 4 ? 'text-emerald-400' : ''}>Completed</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-brand-500 h-full transition-all duration-500"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 border-t border-slate-900 pt-3 flex justify-between">
              <span>Submitted: {new Date(order.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(order.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
