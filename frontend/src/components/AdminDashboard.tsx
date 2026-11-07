import React, { useState, useEffect } from 'react';
import { X, Lock, Plus, Trash2, Edit3, Upload, RefreshCw, FileText, LogOut, Shield } from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState<'portfolios' | 'orders'>('portfolios');
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);

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

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('cf_token', data.token);
      localStorage.setItem('cf_user', JSON.stringify(data.user));

      setAuth({ token: data.token, user: data.user });
      setLoginForm({ username: '', password: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
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
      setErrorMsg(err.message || 'Failed to fetch data');
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
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      setPortfolioForm((prev) => ({
        ...prev,
        mediaUrl: json.url,
        thumbnailUrl: json.type.startsWith('image') ? json.url : prev.thumbnailUrl,
      }));
    } catch (err: any) {
      alert('Upload error: ' + err.message);
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
      if (!res.ok) throw new Error(json.error || 'Failed to save portfolio');

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
      alert('Save failed: ' + err.message);
    }
  };

  const handleDeletePortfolio = async (id: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    try {
      const res = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
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
      if (!res.ok) throw new Error('Failed to update status');
      fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">Creator Studio Admin</h3>
            {auth.token && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium">
                @{auth.user?.username}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {auth.token && (
              <button
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white mb-1">Admin Access Required</h4>
              <p className="text-xs text-slate-400 mb-6">Default credentials: <span className="text-slate-200 font-mono">admin</span> / <span className="text-slate-200 font-mono">admin123</span></p>

              {errorMsg && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-left">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  {loginLoading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard View */
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('portfolios')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'portfolios'
                        ? 'bg-brand-600 text-white shadow'
                        : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
                    }`}
                  >
                    Manage Portfolios ({portfolios.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'orders'
                        ? 'bg-brand-600 text-white shadow'
                        : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
                    }`}
                  >
                    Commission Orders ({orders.length})
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={fetchAdminData}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Refresh data"
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload New Work</span>
                    </button>
                  )}
                </div>
              </div>

              {/* TAB 1: Portfolios Management */}
              {activeTab === 'portfolios' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950/60">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Thumbnail</th>
                          <th className="p-3">Title</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Featured</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {portfolios.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-900/40">
                            <td className="p-3">
                              <img
                                src={item.thumbnailUrl || item.mediaUrl}
                                alt={item.title}
                                className="w-12 h-10 object-cover rounded-lg bg-slate-900 border border-slate-800"
                              />
                            </td>
                            <td className="p-3 font-semibold text-white max-w-xs truncate">{item.title}</td>
                            <td className="p-3 capitalize">{item.category}</td>
                            <td className="p-3 uppercase font-mono text-[11px] text-brand-400">{item.mediaType}</td>
                            <td className="p-3">
                              {item.isFeatured ? (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Yes</span>
                              ) : (
                                <span className="text-slate-500">No</span>
                              )}
                            </td>
                            <td className="p-3 text-right space-x-2">
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
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePortfolio(item.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                                title="Delete"
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
                  <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950/60">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Order Code</th>
                          <th className="p-3">Client</th>
                          <th className="p-3">Project Title</th>
                          <th className="p-3">Budget / Deadline</th>
                          <th className="p-3">Attachment</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-900/40">
                            <td className="p-3 font-mono font-bold text-brand-400">{o.orderCode}</td>
                            <td className="p-3">
                              <p className="font-semibold text-white">{o.clientName}</p>
                              <p className="text-[11px] text-slate-400">{o.clientEmail}</p>
                            </td>
                            <td className="p-3">
                              <p className="font-medium text-white">{o.projectTitle}</p>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{o.description}</p>
                            </td>
                            <td className="p-3">
                              <p className="text-white">{o.budgetRange || '-'}</p>
                              <p className="text-[11px] text-slate-500">{o.deadline ? new Date(o.deadline).toLocaleDateString() : 'Flexible'}</p>
                            </td>
                            <td className="p-3">
                              {o.referenceFileUrl ? (
                                <a
                                  href={o.referenceFileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-brand-400 hover:underline flex items-center gap-1"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>View</span>
                                </a>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                            <td className="p-3">
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Portfolio Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingId ? 'Edit Portfolio Work' : 'Add New Portfolio Work'}
            </h3>

            <form onSubmit={handleSavePortfolio} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={portfolioForm.title}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category *</label>
                  <select
                    value={portfolioForm.category}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value as CategoryType })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="illustration">Illustration</option>
                    <option value="video">Video Editing</option>
                    <option value="dataviz">Data Visualization</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Media Type *</label>
                  <select
                    value={portfolioForm.mediaType}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, mediaType: e.target.value as MediaType })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="image">Image (PNG / JPG / WebP)</option>
                    <option value="video">Video (MP4 / Local)</option>
                    <option value="embed">Embed (YouTube / Vimeo)</option>
                    <option value="pdf">PDF Document / Booklet</option>
                    <option value="link">External Live Link</option>
                  </select>
                </div>
              </div>

              {/* Upload Direct File Option */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300">Upload Media File (PNG, PDF, Video)</span>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors">
                    <Upload className="w-3.5 h-3.5 text-brand-400" />
                    <span>{uploadingFile ? 'Uploading...' : 'Choose File to Upload'}</span>
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
                <label className="block text-xs font-medium text-slate-300 mb-1">Media URL or Upload Path *</label>
                <input
                  type="text"
                  required
                  placeholder="https://... or /uploads/..."
                  value={portfolioForm.mediaUrl}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, mediaUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Thumbnail URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://... image thumbnail"
                  value={portfolioForm.thumbnailUrl}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, thumbnailUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={portfolioForm.description}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={portfolioForm.isFeatured}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-brand-600 focus:ring-0"
                />
                <label htmlFor="featuredCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Highlight as Featured Work
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
                >
                  Save Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
