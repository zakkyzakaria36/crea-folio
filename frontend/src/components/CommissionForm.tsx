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
    budgetRange: 'Rp 50rb - 150rb',
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

      // 1. Upload attachment jika ada
      if (file) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          throw new Error('Gagal mengunggah file lampiran');
        }

        const uploadJson = await uploadRes.json();
        referenceFileUrl = uploadJson.url;
        setUploading(false);
      }

      // 2. Kirim data order ke backend
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
        throw new Error(resJson.error || 'Gagal mengirim pesanan');
      }

      setSubmittedOrderCode(resJson.orderCode);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan. Silakan coba kembali.');
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
    <section id="commission" className="py-16 sm:py-24 border-t border-slate-200/80 bg-slate-50/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Kolaborasi & Pemesanan
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Form Pemesanan Jasa & Proyek
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Isi spesifikasi kebutuhan Anda. Setelah dikirim, Anda akan menerima Kode Resi unik untuk memantau status pengerjaan secara berkala.
          </p>
        </div>

        {submittedOrderCode ? (
          /* Kartu Berhasil Kirim */
          <div className="bg-white border-2 border-blue-400 rounded-3xl p-8 sm:p-10 text-center shadow-xl shadow-blue-500/10">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">Pesanan Komisi Berhasil Dikirim!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
              Terima kasih. Simpan kode resi berikut untuk melacak perkembangan proyek Anda di menu <b>Lacak Pesanan</b>.
            </p>

            {/* Box Kode Resi */}
            <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-blue-50 border border-blue-200 mb-6">
              <span className="font-mono text-xl sm:text-2xl font-black text-blue-600 tracking-wider">
                {submittedOrderCode}
              </span>
              <button
                onClick={copyCode}
                className="p-2 rounded-xl bg-white hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors shadow-xs"
                title="Salin kode"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-xs text-blue-600 font-bold mb-4">Kode berhasil disalin ke clipboard!</p>}

            <div className="pt-2">
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
                    budgetRange: 'Rp 50rb - 150rb',
                    deadline: '',
                  });
                  setFile(null);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold underline underline-offset-4"
              >
                Kirim pengajuan proyek lainnya
              </button>
            </div>
          </div>
        ) : (
          /* Kartu Form */
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Kategori Layanan */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Pilih Kategori Layanan *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'illustration', label: 'Ilustrasi Digital' },
                  { id: 'video', label: 'Video Editing' },
                  { id: 'dataviz', label: 'Dashboard Data' },
                  { id: 'other', label: 'Proyek Campuran' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceCategory: cat.id as any })}
                    className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      formData.serviceCategory === cat.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kontak Klien */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Pratama"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alamat Email *</label>
                <input
                  type="email"
                  required
                  placeholder="budi@example.com"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nomor WhatsApp / HP (Opsional)</label>
                <input
                  type="text"
                  placeholder="0812..."
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Judul Proyek *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ilustrasi Sampul Buku Novel Fantasy"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Brief Deskripsi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Deskripsi Brief / Kebutuhan *</label>
              <textarea
                required
                rows={4}
                placeholder="Ceritakan gaya visual yang diinginkan, tema, durasi / resolusi, dan ekspektasi hasil akhir..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Upload File Lampiran */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">File Referensi / Dokumen Brief (PDF, PNG, JPG, ZIP)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 text-xs font-semibold text-slate-700 transition-colors">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>{file ? file.name : 'Pilih File (Maksimal 50MB)'}</span>
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
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>

            {/* Budget & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Perkiraan Anggaran</label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                >
                  <option value="Rp 50rb - 150rb">Rp 50.000 - Rp 150.000</option>
                  <option value="Rp 150rb - 500rb">Rp 150.000 - Rp 500.000</option>
                  <option value="Rp 500rb - 1.5jt">Rp 500.000 - Rp 1.500.000</option>
                  <option value="Di atas Rp 1.5jt">Di atas Rp 1.500.000</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Tenggat Waktu (Deadline)</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Tombol Kirim */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>{uploading ? 'Mengunggah Lampiran...' : 'Mengirimkan Pesanan...'}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Pengajuan Komisi</span>
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
