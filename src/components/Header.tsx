import React from 'react';
import { Menu, Phone, Clock, Search, Globe } from 'lucide-react';
import { PublicNavSection, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  activeSection: PublicNavSection;
  onNavigate: (section: PublicNavSection) => void;
  onOpenQueueModal: () => void;
  onOpenSearchModal: () => void;
  onOpenConsultModal?: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onNavigate,
  onOpenQueueModal,
  onOpenSearchModal,
  onOpenConsultModal,
  language,
  onSelectLanguage,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger & Brand Info */}
          <div className="flex items-center gap-3">
            <button
              id="sidebar-toggle-btn"
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
              aria-label={isSidebarOpen ? 'หุบเมนูด้านซ้าย' : 'ขยายเมนูด้านซ้าย'}
              title="เปิด/ปิด แถบเมนูด้านข้าง"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden group"
            >
<div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center p-1.5 shadow-inner overflow-hidden">
  <img 
    src="https://upload.wikimedia.org/wikipedia/th/1/12/Logo_of_Vachira_Phuket_Hospital.jpg" 
    alt="Logo of Vachira Phuket Hospital" 
    className="w-full h-full object-contain rounded-lg"
  />
</div>
              <div className="leading-tight">
                <div className="font-semibold text-slate-800 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                  {t.hospitalName}
                </div>
                <div className="text-xs text-emerald-700 font-medium">
                  {t.pharmacyDept}
                </div>
              </div>
            </button>
          </div>

          {/* Center/Right: Action Buttons & Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              id="header-nav-home"
              onClick={() => onNavigate('home')}
              className="hidden md:inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              {t.home}
            </button>

            <button
              id="header-quick-search-btn"
              onClick={onOpenSearchModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span>{t.searchDrug}</span>
            </button>

            <button
              id="header-quick-queue-btn"
              onClick={onOpenQueueModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{t.checkQueue}</span>
            </button>

            <button
              id="header-nav-contact"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">{t.contactStaff}</span>
            </button>

            {/* Clickable Interactive Language Switcher for TH / EN */}
            <div
              id="language-switcher"
              className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs"
              role="group"
              aria-label="เลือกภาษา / Select Language"
            >
              <button
                id="btn-lang-th"
                type="button"
                onClick={() => onSelectLanguage('th')}
                aria-pressed={language === 'th'}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  language === 'th'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-white/60'
                }`}
                title="เปลี่ยนเป็นภาษาไทย"
              >
                <span>TH</span>
              </button>
              <button
                id="btn-lang-en"
                type="button"
                onClick={() => onSelectLanguage('en')}
                aria-pressed={language === 'en'}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-white/60'
                }`}
                title="Switch to English"
              >
                <Globe className="w-3 h-3" />
                <span>EN</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
