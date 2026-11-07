import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Users, Target, Activity } from 'lucide-react';

const sampleChartData = [
  { month: 'Jan', revenue: 4200, audience: 21000, completionRate: 78 },
  { month: 'Feb', revenue: 5800, audience: 28000, completionRate: 82 },
  { month: 'Mar', revenue: 5100, audience: 25000, completionRate: 80 },
  { month: 'Apr', revenue: 7900, audience: 39000, completionRate: 89 },
  { month: 'May', revenue: 9200, audience: 48000, completionRate: 91 },
  { month: 'Jun', revenue: 11400, audience: 62000, completionRate: 94 },
  { month: 'Jul', revenue: 13800, audience: 74000, completionRate: 96 },
];

export const DataVizShowcase: React.FC = () => {
  const [metric, setMetric] = useState<'revenue' | 'audience' | 'completionRate'>('revenue');

  const metricConfig = {
    revenue: {
      label: 'Estimasi Pendapatan ($)',
      color: '#2563eb',
      unit: '$',
      total: '$57.400',
      growth: '+28,4% MoM',
    },
    audience: {
      label: 'Jangkauan Penonton & Impresi',
      color: '#0284c7',
      unit: '',
      total: '297.000',
      growth: '+42,1% Jangkauan',
    },
    completionRate: {
      label: 'Retensi Tontonan Video',
      color: '#10b981',
      unit: '%',
      total: '96%',
      growth: '+18% Rata-rata',
    },
  };

  const activeConfig = metricConfig[metric];

  return (
    <section id="dataviz" className="py-16 sm:py-24 border-t border-slate-200/80 bg-gradient-to-b from-blue-50/40 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            Fitur Khusus
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Showcase Visualisasi Data & Dashboard
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Data bukan hanya angka tabel, melainkan cerita visual yang memandu keputusan. Berikut contoh dashboard analitik interaktif berbasis chart modern.
          </p>
        </div>

        {/* Dashboard Card Container (Clean White & Blue border) */}
        <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/5">
          {/* Controls & Metric Selectors */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metrik Aktif</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{activeConfig.total}</span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {activeConfig.growth}
                </span>
              </div>
            </div>

            {/* Toggle Pills */}
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto border border-slate-200">
              <button
                onClick={() => setMetric('revenue')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  metric === 'revenue'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                Pendapatan
              </button>
              <button
                onClick={() => setMetric('audience')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  metric === 'audience'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                Jangkauan
              </button>
              <button
                onClick={() => setMetric('completionRate')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  metric === 'completionRate'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                Retensi Video
              </button>
            </div>
          </div>

          {/* Interactive Chart Area */}
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '12px',
                    color: '#0f172a',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  formatter={(value: any) => [`${activeConfig.unit}${value}`, activeConfig.label]}
                />
                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke={activeConfig.color}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#metricGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* KPI Mini-Cards below chart */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Pipeline Data</p>
                <p className="text-sm font-bold text-slate-900">Sinkronisasi Realtime</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Segmentasi Audiens</p>
                <p className="text-sm font-bold text-slate-900">Kohort Dinamis</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Integrasi Teknologi</p>
                <p className="text-sm font-bold text-slate-900">Recharts, D3, PowerBI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
