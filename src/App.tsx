/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  PublicNavSection,
  AdminSection,
  DrugItem,
  NewsItem,
  KnowledgeArticle,
  DocumentDownload,
  AdminUser,
  StepInfographic,
  BannerConfig,
  PharmacistConsultationItem,
  QueueItem,
  Language,
} from './types';
import {
  INITIAL_DRUGS,
  INITIAL_STEP_INFOGRAPHICS,
  INITIAL_BANNER,
  INITIAL_NEWS,
  INITIAL_KNOWLEDGE,
  INITIAL_DOCUMENTS,
  INITIAL_USERS,
  INITIAL_QUEUES,
  INITIAL_CONSULTATIONS,
} from './data/initialData';

// Public Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { QuickCards } from './components/QuickCards';
import { DispensingSteps } from './components/DispensingSteps';
import { NewsSection } from './components/NewsSection';
import { DrugKnowledgeSection } from './components/DrugKnowledgeSection';
import { ContactFooter } from './components/ContactFooter';
import { PublicSubViews } from './components/PublicSubViews';

// Public Modals
import { DrugSearchModal } from './components/DrugSearchModal';
import { QueueCheckModal } from './components/QueueCheckModal';
import { PharmacistConsultModal } from './components/PharmacistConsultModal';
import {
  DrugDetailModal,
  ArticleDetailModal,
  NewsDetailModal,
} from './components/DetailModals';
import { Bell, Phone, MessageSquare, X, ExternalLink } from 'lucide-react';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardOverview } from './components/admin/AdminDashboardOverview';
import { AdminInfographicsManager } from './components/admin/AdminInfographicsManager';
import { AdminDrugManager } from './components/admin/AdminDrugManager';
import { AdminBannerManager } from './components/admin/AdminBannerManager';
import { AdminNewsAndKnowledge } from './components/admin/AdminNewsAndKnowledge';
import { AdminServicesAndDocs } from './components/admin/AdminServicesAndDocs';
import { AdminConsultationsManager } from './components/admin/AdminConsultationsManager';
import { AdminQueueManager } from './components/admin/AdminQueueManager';
import { AdminMenuTopicsManager } from './components/admin/AdminMenuTopicsManager';

export default function App() {
  // Application Mode: 'public' | 'admin_login' | 'admin_dashboard'
  const [appMode, setAppMode] = useState<'public' | 'admin_login' | 'admin_dashboard'>('public');

  // Public Navigation State
  const [activeSection, setActiveSection] = useState<PublicNavSection>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Language State: 'th' (Thai default)
  const [language, setLanguage] = useState<Language>('th');

  // Persist language change
  const handleSelectLanguage = (newLang: Language) => {
    setLanguage(newLang);
  };

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<DrugItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Admin State
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');
  const [currentAdminUser, setCurrentAdminUser] = useState<string>('ภก.อดิศักดิ์ (Admin)');

  // Dynamic Data Store (persisted to localStorage when edited, changes reflect instantly)
  function getStoredData<T>(key: string, fallback: T): T {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn(`Could not read ${key} from localStorage`, e);
    }
    return fallback;
  }

  const [drugs, setDrugs] = useState<DrugItem[]>(() =>
    getStoredData('huahin_rx_drugs', INITIAL_DRUGS)
  );
  const [infographics, setInfographics] = useState<StepInfographic[]>(() =>
    getStoredData('huahin_rx_infographics', INITIAL_STEP_INFOGRAPHICS)
  );
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>(() =>
    getStoredData('huahin_rx_banner', INITIAL_BANNER)
  );
  const [news, setNews] = useState<NewsItem[]>(() =>
    getStoredData('huahin_rx_news', INITIAL_NEWS)
  );
  const [articles, setArticles] = useState<KnowledgeArticle[]>(() =>
    getStoredData('huahin_rx_articles', INITIAL_KNOWLEDGE)
  );
  const [documents, setDocuments] = useState<DocumentDownload[]>(() =>
    getStoredData('huahin_rx_documents', INITIAL_DOCUMENTS)
  );
  const [users, setUsers] = useState<AdminUser[]>(() =>
    getStoredData('huahin_rx_users', INITIAL_USERS)
  );
  const [consultations, setConsultations] = useState<PharmacistConsultationItem[]>(() =>
    getStoredData('huahin_rx_consultations', INITIAL_CONSULTATIONS)
  );
  const [queues, setQueues] = useState<QueueItem[]>(() =>
    getStoredData('huahin_rx_queues', INITIAL_QUEUES)
  );

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('huahin_rx_news', JSON.stringify(news));
    } catch (e) {
      console.warn('Could not persist news to localStorage', e);
    }
  }, [news]);

  useEffect(() => {
    try {
      localStorage.setItem('huahin_rx_articles', JSON.stringify(articles));
    } catch (e) {
      console.warn('Could not persist articles to localStorage', e);
    }
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('huahin_rx_drugs', JSON.stringify(drugs));
    } catch (e) {
      console.warn('Could not persist drugs to localStorage', e);
    }
  }, [drugs]);

  useEffect(() => {
    try {
      localStorage.setItem('huahin_rx_banner', JSON.stringify(bannerConfig));
    } catch (e) {
      console.warn('Could not persist banner to localStorage', e);
    }
  }, [bannerConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('huahin_rx_infographics', JSON.stringify(infographics));
    } catch (e) {
      console.warn('Could not persist infographics to localStorage', e);
    }
  }, [infographics]);

  useEffect(() => {
    try {
      localStorage.setItem('huahin_rx_documents', JSON.stringify(documents));
    } catch (e) {
      console.warn('Could not persist documents to localStorage', e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem('huahin_rx_users', JSON.stringify(users));
    } catch (e) {
      console.warn('Could not persist users to localStorage', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('huahin_rx_consultations', JSON.stringify(consultations));
    } catch (e) {
      console.warn('Could not persist consultations to localStorage', e);
    }
  }, [consultations]);

  useEffect(() => {
    try {
      localStorage.setItem('huahin_rx_queues', JSON.stringify(queues));
    } catch (e) {
      console.warn('Could not persist queues to localStorage', e);
    }
  }, [queues]);

  const handleDownloadDocument = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, downloads: (doc.downloads || 0) + 1 } : doc))
    );
  };

  // Consultation notification counts
  const unreadConsultCount = consultations.filter((c) => !c.isRead).length;
  const pendingConsultCount = consultations.filter((c) => c.status === 'pending').length;

  // Sound chime when a consultation message is added
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Audio context may not be allowed before interaction
    }
  };

  const [newConsultAlert, setNewConsultAlert] = useState<PharmacistConsultationItem | null>(null);

  useEffect(() => {
    if (newConsultAlert) {
      const timer = setTimeout(() => {
        setNewConsultAlert(null);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [newConsultAlert]);

  const handleAddConsultation = (newConsult: PharmacistConsultationItem) => {
    setConsultations((prev) => [newConsult, ...prev]);
    playChime();
    setNewConsultAlert(newConsult);
  };

  const handleUpdateConsultation = (updated: PharmacistConsultationItem) => {
    setConsultations((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteConsultation = (id: string) => {
    setConsultations((prev) => prev.filter((c) => c.id !== id));
  };

  const handleMarkAllConsultationsAsRead = () => {
    setConsultations((prev) => prev.map((c) => ({ ...c, isRead: true })));
  };

  const handleClearAnsweredConsultations = () => {
    setConsultations((prev) => prev.filter((c) => c.status !== 'answered'));
  };

  // Quick Handlers
  const handleSelectPublicSection = (section: PublicNavSection) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = (username: string) => {
    setCurrentAdminUser(username);
    setAppMode('admin_dashboard');
    setAdminSection('dashboard');
  };

  const renderNewConsultAlert = () => {
    if (!newConsultAlert) return null;
    return (
      <aside
        role="alert"
        aria-live="assertive"
        className="fixed top-4 right-4 z-50 max-w-md w-[calc(100vw-2rem)] bg-white border-2 border-emerald-500 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300 ring-4 ring-emerald-500/20"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs animate-bounce">
              <Bell className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wide">
                  มีข้อความปรึกษาเภสัชกรใหม่!
                </span>
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {newConsultAlert.patientName} ({newConsultAlert.phone})
              </h4>
              {newConsultAlert.drugName && (
                <p className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md inline-block">
                  ยา: {newConsultAlert.drugName}
                </p>
              )}
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                "{newConsultAlert.question}"
              </p>
            </div>
          </div>
          <button
            onClick={() => setNewConsultAlert(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="ปิดการแจ้งเตือน"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={() => setNewConsultAlert(null)}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            รับทราบ
          </button>
          <button
            onClick={() => {
              setAppMode('admin_dashboard');
              setAdminSection('consultations');
              setNewConsultAlert(null);
            }}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>เปิดดูในระบบแอดมิน</span>
          </button>
        </div>
      </aside>
    );
  };

  // =========================================================================
  // VIEW: ADMIN LOGIN
  // =========================================================================
  if (appMode === 'admin_login') {
    return (
      <AdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToPublic={() => setAppMode('public')}
      />
    );
  }

  // =========================================================================
  // VIEW: ADMIN DASHBOARD & MANAGEMENT CONSOLE
  // =========================================================================
  if (appMode === 'admin_dashboard') {
    return (
      <>
        {renderNewConsultAlert()}
        <AdminLayout
        currentSection={adminSection}
        onSelectSection={setAdminSection}
        currentUser={currentAdminUser}
        unreadConsultCount={unreadConsultCount}
        pendingConsultCount={pendingConsultCount}
        onLogout={() => setAppMode('public')}
        onViewPublicSite={() => {
          setAppMode('public');
          setActiveSection('home');
        }}
      >
        {adminSection === 'dashboard' && (
          <AdminDashboardOverview
            drugs={drugs}
            news={news}
            articles={articles}
            documents={documents}
            users={users}
            consultations={consultations}
            queues={queues}
            onNavigateSection={(sec) => setAdminSection(sec)}
          />
        )}

        {adminSection === 'queues' && (
          <AdminQueueManager
            queues={queues}
            onUpdateQueues={setQueues}
            onResetQueuesToDefault={() => setQueues(INITIAL_QUEUES)}
          />
        )}

        {adminSection === 'consultations' && (
          <AdminConsultationsManager
            consultations={consultations}
            currentUser={currentAdminUser}
            onUpdateConsultation={handleUpdateConsultation}
            onDeleteConsultation={handleDeleteConsultation}
            onAddConsultation={handleAddConsultation}
            onMarkAllAsRead={handleMarkAllConsultationsAsRead}
            onClearAnsweredConsultations={handleClearAnsweredConsultations}
          />
        )}

        {adminSection === 'menu_topics' && (
          <AdminMenuTopicsManager />
        )}

        {adminSection === 'infographics' && (
          <AdminInfographicsManager
            infographics={infographics}
            onUpdateInfographics={setInfographics}
          />
        )}

        {adminSection === 'drugs' && (
          <AdminDrugManager drugs={drugs} onUpdateDrugs={setDrugs} />
        )}

        {adminSection === 'banner' && (
          <AdminBannerManager
            bannerConfig={bannerConfig}
            onUpdateBanner={setBannerConfig}
          />
        )}

        {adminSection === 'news' && (
          <AdminNewsAndKnowledge
            type="news"
            news={news}
            articles={articles}
            onUpdateNews={setNews}
            onUpdateArticles={setArticles}
            onResetNewsToDefault={() => {
              localStorage.removeItem('huahin_rx_news');
              setNews(INITIAL_NEWS);
            }}
          />
        )}

        {adminSection === 'knowledge' && (
          <AdminNewsAndKnowledge
            type="knowledge"
            news={news}
            articles={articles}
            onUpdateNews={setNews}
            onUpdateArticles={setArticles}
          />
        )}

        {(adminSection === 'documents' ||
          adminSection === 'users' ||
          adminSection === 'stats' ||
          adminSection === 'settings') && (
          <AdminServicesAndDocs
            section={adminSection}
            documents={documents}
            users={users}
            onUpdateDocuments={setDocuments}
            onUpdateUsers={setUsers}
          />
        )}
      </AdminLayout>
      </>
    );
  }

  // =========================================================================
  // VIEW: PUBLIC PORTAL (โรงพยาบาลหัวหิน - กลุ่มงานเภสัชกรรม)
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        activeSection={activeSection}
        onNavigate={handleSelectPublicSection}
        onOpenQueueModal={() => setIsQueueOpen(true)}
        onOpenSearchModal={() => setIsSearchOpen(true)}
        onOpenConsultModal={() => setIsConsultOpen(true)}
        language={language}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeSection={activeSection}
        onNavigate={handleSelectPublicSection}
        language={language}
        onOpenAdminLogin={() => {
          setIsSidebarOpen(false);
          setAppMode('admin_login');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeSection === 'home' ? (
          <>
            {/* 2. Hero Banner */}
            <HeroBanner
              bannerConfig={bannerConfig}
              language={language}
              onOpenDrugGuide={() => handleSelectPublicSection('drugs_usage')}
              onOpenConsult={() => setIsConsultOpen(true)}
            />

            {/* 3. Quick Action Cards (6 Cards) */}
            <QuickCards
              language={language}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenQueue={() => setIsQueueOpen(true)}
              onOpenConsult={() => setIsConsultOpen(true)}
              onNavigate={handleSelectPublicSection}
            />

            {/* 5. 3-Column Dispensing Step Infographics (Admin editable!) */}
            <DispensingSteps infographics={infographics} />

            {/* 6. News & Announcements Section */}
            <NewsSection
              news={news}
              onViewAllNews={() => handleSelectPublicSection('news')}
            />

            {/* 7. Drug & Health Knowledge Section */}
            <DrugKnowledgeSection
              articles={articles}
              onViewAll={() => handleSelectPublicSection('knowledge')}
            />
          </>
        ) : (
          /* Sub-Pages for specific menu items */
          <PublicSubViews
            section={activeSection}
            onBackHome={() => handleSelectPublicSection('home')}
            drugs={drugs}
            news={news}
            articles={articles}
            documents={documents}
            onOpenDrugDetail={(drug) => setSelectedDrug(drug)}
            onOpenArticleDetail={(art) => setSelectedArticle(art)}
            onOpenNewsDetail={(n) => setSelectedNews(n)}
            onDownloadDocument={handleDownloadDocument}
            onOpenConsultModal={() => setIsConsultOpen(true)}
            onOpenQueueModal={() => setIsQueueOpen(true)}
          />
        )}
      </main>

      {/* 8. Footer with Contact & discreet Admin Access */}
      <ContactFooter
        language={language}
        onOpenConsult={() => setIsConsultOpen(true)}
        onOpenAdminLogin={() => setAppMode('admin_login')}
      />

      {/* Modals */}
      <DrugSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        drugs={drugs}
      />

      <QueueCheckModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        queues={queues}
      />

      <PharmacistConsultModal
        isOpen={isConsultOpen}
        onClose={() => setIsConsultOpen(false)}
        onAddConsultation={handleAddConsultation}
      />

      <DrugDetailModal
        drug={selectedDrug}
        onClose={() => setSelectedDrug(null)}
      />

      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <NewsDetailModal
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
      />

      {/* Real-time Consult Alert in Public Mode */}
      {renderNewConsultAlert()}
    </div>
  );
}

