import React, { useState, useEffect } from 'react';
import { X, Lock, Plus, Trash2, Edit3, Upload, RefreshCw, FileText, LogOut, Shield, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PortfolioItem, OrderItem, AuthState, CategoryType, MediaType, OrderStatus } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, onRefreshData }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedToken = localStorage.getItem('cf_token');
    const savedUser = localStorage.getItem('cf_user');
    return {
      token: savedToken,
      user: savedUser ? JSON.parse(savedUser) : null,
    };
  });

  const [activeTab, setActiveTab] = useState<'portfolios' | 'orders' | 'security'>('portfolios');
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);

  // Password change state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwStatus, setPwStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  // New Portfolio Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    category: 'illustration' as CategoryType,
    mediaType: 'image' as MediaType,
    mediaUrl: '',
    thumbnailUrl: '',
    description: '',
    isFeatured: false,
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (auth.token && isOpen) {
      fetchAdminData();
    }
  }, [auth.token, isOpen, activeTab]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : {};
      if (!res.ok) throw new Error(data.error || `Login gagal (${res.status}). Backend API belum terhubung.`);

      localStorage.setItem('cf_token', data.token);
      localStorage.setItem('cf_user', JSON.stringify(data.user));

      setAuth({ token: data.token, user: data.user });
      setLoginForm({ username: '', password: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Login gagal');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cf_token');
    localStorage.removeItem('cf_user');
    setAuth({ token: null, user: null });
  };

  const fetchAdminData = async () => {
    if (!auth.token) return;
    setErrorMsg(null);

    try {
      if (activeTab === 'portfolios') {
        const res = await fetch('/api/portfolios');
        const json = await res.json();
        setPortfolios(json.data || []);
      } else {
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const json = await res.json();
        setOrders(json.data || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memuat data');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload gagal');

      setPortfolioForm((prev) => ({
        ...prev,
        mediaUrl: json.url,
        thumbnailUrl: json.type.startsWith('image') ? json.url : prev.thumbnailUrl,
      }));
    } catch (err: any) {
      alert('Kesalahan upload: ' + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.token) return;

    try {
      const url = editingId ? `/api/portfolios/${editingId}` : '/api/portfolios';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(portfolioForm),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal menyimpan karya');

      setShowAddModal(false);
      setEditingId(null);
      setPortfolioForm({
        title: '',
        category: 'illustration',
        mediaType: 'image',
        mediaUrl: '',
        thumbnailUrl: '',
        description: '',
        isFeatured: false,
      });
      fetchAdminData();
      onRefreshData();
    } catch (err: any) {
      alert('Gagal menyimpan: ' + err.message);
    }
  };

  const handleDeletePortfolio = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus karya portofolio ini?')) return;
    try {
      const res = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!res.ok) throw new Error('Gagal menghapus');
      fetchAdminData();
      onRefreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: OrderStatus, adminNotes?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (!res.ok) throw new Error('Gagal memperbarui status');
      fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwStatus(null);

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwStatus({ type: 'error', message: 'Konfirmasi password baru tidak sesuai!' });
      return;
    }

    if (pwForm.newPassword.length < 6) {
      setPwStatus({ type: 'error', message: 'Password baru minimal harus 6 karakter!' });
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah password');

      setPwStatus({ type: 'success', message: 'Password berhasil diubah! Simpan password baru Anda dengan aman.' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPwStatus({ type: 'error', message: err.message || 'Terjadi kesalahan' });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-slate-900">Panel Admin ZxProject</h3>
            {auth.token && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                @{auth.user?.username}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {auth.token && (
              <button
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-red-600 font-bold flex items-center gap-1 transition-colors"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!auth.token ? (
            /* Login Form */
            <div className="max-w-md mx-auto py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-1">Masuk Sebagai Pengelola</h4>
              <p className="text-xs text-slate-500 mb-6">Akun bawaan: <span className="text-blue-700 font-mono font-bold">admin</span> / <span className="text-blue-700 font-mono font-bold">admin123</span></p>

              {errorMsg && (
                <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-left font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors disabled:opacity-50 shadow-md shadow-blue-600/20"
                >
                  {loginLoading ? 'Memeriksa...' : 'Masuk Dashboard'}
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard View */
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('portfolios')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'portfolios'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-blue-600 bg-slate-50 border border-slate-200'
                    }`}
                  >
                    Kelola Portofolio ({portfolios.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'orders'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-blue-600 bg-slate-50 border border-slate-200'
                    }`}
                  >
                    Daftar Pesanan Masuk ({orders.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'security'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-blue-600 bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Ubah Password</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={fetchAdminData}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors"
                    title="Segarkan data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  {activeTab === 'portfolios' && (
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setPortfolioForm({
                          title: '',
                          category: 'illustration',
                          mediaType: 'image',
                          mediaUrl: '',
                          thumbnailUrl: '',
                          description: '',
                          isFeatured: false,
                        });
                        setShowAddModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Karya Baru</span>
                    </button>
                  )}
                </div>
              </div>

              {/* TAB 1: Portfolios Management */}
              {activeTab === 'portfolios' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Thumbnail</th>
                          <th className="p-3">Judul</th>
                          <th className="p-3">Kategori</th>
                          <th className="p-3">Tipe Media</th>
                          <th className="p-3">Unggulan</th>
                          <th className="p-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {portfolios.map((item) => (
                          <tr key={item.id} className="hover:bg-blue-50/40">
                            <td className="p-3">
                              <img
                                src={item.thumbnailUrl || item.mediaUrl}
                                alt={item.title}
                                className="w-12 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200"
                              />
                            </td>
                            <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{item.title}</td>
                            <td className="p-3 capitalize">{item.category}</td>
                            <td className="p-3 uppercase font-mono font-bold text-[11px] text-blue-600">{item.mediaType}</td>
                            <td className="p-3">
                              {item.isFeatured ? (
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">Ya</span>
                              ) : (
                                <span className="text-slate-400">Tidak</span>
                              )}
                            </td>
                            <td className="p-3 text-right space-x-1.5">
                              <button
                                onClick={() => {
                                  setEditingId(item.id);
                                  setPortfolioForm({
                                    title: item.title,
                                    category: item.category,
                                    mediaType: item.mediaType,
                                    mediaUrl: item.mediaUrl,
                                    thumbnailUrl: item.thumbnailUrl || '',
                                    description: item.description || '',
                                    isFeatured: item.isFeatured,
                                  });
                                  setShowAddModal(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePortfolio(item.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: Orders Management */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Kode Resi</th>
                          <th className="p-3">Klien</th>
                          <th className="p-3">Judul Proyek</th>
                          <th className="p-3">Anggaran / Deadline</th>
                          <th className="p-3">Lampiran</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-blue-50/40">
                            <td className="p-3 font-mono font-black text-blue-600">{o.orderCode}</td>
                            <td className="p-3">
                              <p className="font-bold text-slate-900">{o.clientName}</p>
                              <p className="text-[11px] text-slate-500">{o.clientEmail}</p>
                            </td>
                            <td className="p-3">
                              <p className="font-semibold text-slate-900">{o.projectTitle}</p>
                              <p className="text-[11px] text-slate-500 line-clamp-1">{o.description}</p>
                            </td>
                            <td className="p-3">
                              <p className="font-bold text-slate-800">{o.budgetRange || '-'}</p>
                              <p className="text-[11px] text-slate-500">{o.deadline ? new Date(o.deadline).toLocaleDateString('id-ID') : 'Fleksibel'}</p>
                            </td>
                            <td className="p-3">
                              {o.referenceFileUrl ? (
                                <a
                                  href={o.referenceFileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Lihat</span>
                                </a>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="p-3">
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                              >
                                <option value="pending">Menunggu Antrean</option>
                                <option value="reviewed">Ditelaah</option>
                                <option value="in_progress">Sedang Dikerjakan</option>
                                <option value="completed">Selesai</option>
                                <option value="rejected">Ditolak</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {/* TAB 3: Keamanan & Ganti Password */}
              {activeTab === 'security' && (
                <div className="max-w-md mx-auto py-6">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Ubah Password Akun Admin</h4>
                        <p className="text-xs text-slate-500">Gunakan kata sandi kuat agar akun tidak mudah diretas.</p>
                      </div>
                    </div>

                    {pwStatus && (
                      <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                        pwStatus.type === 'success'
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                          : 'bg-red-50 border border-red-200 text-red-600'
                      }`}>
                        {pwStatus.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span>{pwStatus.message}</span>
                      </div>
                    )}

                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Password Saat Ini</label>
                        <input
                          type="password"
                          required
                          placeholder="Ketik password lama Anda..."
                          value={pwForm.currentPassword}
                          onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Password Baru (Minimal 6 karakter)</label>
                        <input
                          type="password"
                          required
                          placeholder="Ketik password baru..."
                          value={pwForm.newPassword}
                          onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Ulangi Password Baru</label>
                        <input
                          type="password"
                          required
                          placeholder="Konfirmasi password baru..."
                          value={pwForm.confirmPassword}
                          onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={pwLoading}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/20 disabled:opacity-50"
                      >
                        {pwLoading ? 'Memproses...' : 'Simpan Password Baru'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Portfolio Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-4">
              {editingId ? 'Edit Karya Portofolio' : 'Tambah Karya Portofolio Baru'}
            </h3>

            <form onSubmit={handleSavePortfolio} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Karya *</label>
                <input
                  type="text"
                  required
                  value={portfolioForm.title}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori *</label>
                  <select
                    value={portfolioForm.category}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value as CategoryType })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  >
                    <option value="illustration">Ilustrasi Digital</option>
                    <option value="video">Video Editing</option>
                    <option value="dataviz">Visualisasi Data</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipe Media *</label>
                  <select
                    value={portfolioForm.mediaType}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, mediaType: e.target.value as MediaType })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  >
                    <option value="image">Gambar (PNG / JPG / WebP)</option>
                    <option value="video">Video (MP4 / Direct)</option>
                    <option value="embed">Embed (YouTube / Vimeo)</option>
                    <option value="pdf">Dokumen PDF / Booklet</option>
                    <option value="link">Tautan Live Demo</option>
                  </select>
                </div>
              </div>

              {/* Upload File */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                <span className="text-xs font-bold text-blue-900">Unggah File Media Langsung (PNG, PDF, Video)</span>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>{uploadingFile ? 'Mengunggah...' : 'Pilih File'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Media atau Path Upload *</label>
                <input
                  type="text"
                  required
                  placeholder="https://... atau /uploads/..."
                  value={portfolioForm.mediaUrl}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, mediaUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Thumbnail Gambar (Opsional)</label>
                <input
                  type="text"
                  placeholder="https://... url thumbnail"
                  value={portfolioForm.thumbnailUrl}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, thumbnailUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Karya</label>
                <textarea
                  rows={3}
                  value={portfolioForm.description}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={portfolioForm.isFeatured}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featuredCheck" className="text-xs text-slate-700 font-bold cursor-pointer">
                  Tampilkan sebagai Karya Unggulan
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  Simpan Karya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
