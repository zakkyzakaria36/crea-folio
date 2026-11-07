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
      label: 'Campaign Revenue ($)',
      color: '#8b5cf6',
      unit: '$',
      total: '$57,400',
      growth: '+28.4% MoM',
    },
    audience: {
      label: 'Total Viewers & Engagement',
      color: '#38bdf8',
      unit: '',
      total: '297,000',
      growth: '+42.1% Reach',
    },
    completionRate: {
      label: 'Video Retention / Completion Rate',
      color: '#34d399',
      unit: '%',
      total: '96%',
      growth: '+18% Benchmark',
    },
  };

  const activeConfig = metricConfig[metric];

  return (
    <section id="dataviz" className="py-16 sm:py-24 border-t border-slate-900 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            Specialty Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Interactive Data Storytelling & Dashboards
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Data visualization is not just charts; it is decision intelligence. Here is a live sample of custom analytics UI tailored for video production metrics and client growth.
          </p>
        </div>

        {/* Dashboard Card Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Controls & Metric Selectors */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Performance Metric</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">{activeConfig.total}</span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {activeConfig.growth}
                </span>
              </div>
            </div>

            {/* Toggle Pills */}
            <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setMetric('revenue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  metric === 'revenue'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setMetric('audience')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  metric === 'audience'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Reach / Views
              </button>
              <button
                onClick={() => setMetric('completionRate')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  metric === 'completionRate'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Retention %
              </button>
            </div>
          </div>

          {/* Interactive Chart Area */}
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${activeConfig.unit}${value}`, activeConfig.label]}
                />
                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke={activeConfig.color}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#metricGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* KPI Mini-Cards below chart */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Data Pipeline</p>
                <p className="text-sm font-semibold text-white">Automated ETL & Sync</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Audience Segmentation</p>
                <p className="text-sm font-semibold text-white">Dynamic Cohorts</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Interactive Tooling</p>
                <p className="text-sm font-semibold text-white">D3, Recharts, PowerBI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
