import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioGallery } from './components/PortfolioGallery';
import { DataVizShowcase } from './components/DataVizShowcase';
import { CommissionForm } from './components/CommissionForm';
import { Footer } from './components/Footer';
import { PortfolioModal } from './components/PortfolioModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminDashboard } from './components/AdminDashboard';
import type { PortfolioItem } from './types';

export function App() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/portfolios');
      const json = await res.json();
      setPortfolios(json.data || []);
    } catch (err) {
      console.error('Failed to load portfolios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        activeSection="showcase"
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Sections */}
      <main className="flex-1">
        <Hero />
        <PortfolioGallery
          items={portfolios}
          loading={loading}
          onSelectItem={(item) => setSelectedPortfolio(item)}
        />
        <DataVizShowcase />
        <CommissionForm />
      </main>

      {/* Footer */}
      <Footer />

      {/* Popups & Modals */}
      <PortfolioModal
        item={selectedPortfolio}
        onClose={() => setSelectedPortfolio(null)}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshData={fetchPortfolios}
      />
    </div>
  );
}

export default App;
