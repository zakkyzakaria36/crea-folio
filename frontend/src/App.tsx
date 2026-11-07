import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioGallery } from './components/PortfolioGallery';
import { CommissionForm } from './components/CommissionForm';
import { IdentitySection } from './components/IdentitySection';
import { Footer } from './components/Footer';
import { PortfolioModal } from './components/PortfolioModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { fallbackPortfolios } from './mockData';
import type { PortfolioItem } from './types';
import { apiUrl } from './api';

export function App() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>(fallbackPortfolios);
  const [loading, setLoading] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('/api/portfolios'));
      if (!res.ok) throw new Error('API unavailable');
      const json = await res.json();
      if (json.data && json.data.length > 0) setPortfolios(json.data);
    } catch {
      // Backend offline: fallback portfolio remains visible.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPortfolios(); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar activeSection="showcase" onOpenTracker={() => setIsTrackerOpen(true)} onOpenAdmin={() => setIsAdminOpen(true)} />
      <main className="flex-1">
        <Hero />
        <PortfolioGallery items={portfolios} loading={loading} onSelectItem={setSelectedPortfolio} />
        <CommissionForm />
        <IdentitySection />
      </main>
      <Footer />
      <PortfolioModal item={selectedPortfolio} onClose={() => setSelectedPortfolio(null)} />
      <OrderTrackerModal isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />
      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} onRefreshData={fetchPortfolios} />
    </div>
  );
}

export default App;
