import React, { useState } from 'react';
import { Send, Upload, CheckCircle2, Copy, AlertCircle, Sparkles } from 'lucide-react';
import type { CategoryType } from '../types';

export const CommissionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceCategory: 'illustration' as CategoryType | 'other',
    projectTitle: '',
    description: '',
    budgetRange: '$200 - $500',
    deadline: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrderCode, setSubmittedOrderCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      let referenceFileUrl: string | null = null;

      // 1. Upload attachment if provided
      if (file) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload attachment file');
        }

        const uploadJson = await uploadRes.json();
        referenceFileUrl = uploadJson.url;
        setUploading(false);
      }

      // 2. Submit order to backend
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          referenceFileUrl,
        }),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || 'Failed to submit order');
      }

      setSubmittedOrderCode(resJson.orderCode);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const copyCode = () => {
    if (submittedOrderCode) {
      navigator.clipboard.writeText(submittedOrderCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="commission" className="py-16 sm:py-24 border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Let's Collaborate
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Order Commission or Project
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Fill out your project specifications. You will receive an instant Tracking Code to monitor progress directly on this website.
          </p>
        </div>

        {submittedOrderCode ? (
          /* Success Card */
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Commission Order Received!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
              Thank you for your inquiry. Please store your unique Order Tracking Code below to check real-time progress.
            </p>

            {/* Code Box */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
              <span className="font-mono text-xl sm:text-2xl font-bold text-brand-400 tracking-wider">
                {submittedOrderCode}
              </span>
              <button
                onClick={copyCode}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Copy code"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-xs text-emerald-400 font-medium mb-4">Copied to clipboard!</p>}

            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmittedOrderCode(null);
                  setFormData({
                    clientName: '',
                    clientEmail: '',
                    clientPhone: '',
                    serviceCategory: 'illustration',
                    projectTitle: '',
                    description: '',
                    budgetRange: '$200 - $500',
                    deadline: '',
                  });
                  setFile(null);
                }}
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
              >
                Submit another inquiry
              </button>
            </div>
          </div>
        ) : (
          /* Form Card */
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Service Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Select Discipline / Service *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'illustration', label: 'Illustration' },
                  { id: 'video', label: 'Video Editing' },
                  { id: 'dataviz', label: 'Data Dashboard' },
                  { id: 'other', label: 'Other Project' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceCategory: cat.id as any })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      formData.serviceCategory === cat.id
                        ? 'bg-brand-600 border-brand-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone / WhatsApp (Optional)</label>
                <input
                  type="text"
                  placeholder="+62 812..."
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2D Cyberpunk Character Cover"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* Brief Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Brief / Requirements Description *</label>
              <textarea
                required
                rows={4}
                placeholder="Explain your visual goals, style preferences, duration / dimensions, and expectations..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {/* File Upload Reference */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Reference Document or Image (PDF / PNG / ZIP)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors">
                  <Upload className="w-4 h-4 text-brand-400" />
                  <span>{file ? file.name : 'Choose File (Max 50MB)'}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,video/*,.zip"
                  />
                </label>
                {file && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Budget & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Estimated Budget</label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                >
                  <option value="Under $200">Under $200</option>
                  <option value="$200 - $500">$200 - $500</option>
                  <option value="$500 - $1,500">$500 - $1,500</option>
                  <option value="$1,500+">$1,500+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>{uploading ? 'Uploading Attachment...' : 'Submitting Order...'}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Commission Brief</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
