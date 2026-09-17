import React, { useState } from 'react';
import {
  Home,
  Building2,
  Network,
  Pill,
  FileCheck,
  Newspaper,
  GraduationCap,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  Lock,
  X,
} from 'lucide-react';
import { PublicNavSection, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { NEW_SIDEBAR_MENU } from '../data/sidebarMenuData';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: PublicNavSection;
  onNavigate: (section: PublicNavSection) => void;
  onOpenAdminLogin: () => void;
  language?: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeSection,
  onNavigate,
  onOpenAdminLogin,
  language = 'th',
}) => {
  const t = TRANSLATIONS[language];

  // Map category icons
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'Network':
        return <Network className="w-5 h-5 text-teal-600 shrink-0" />;
      case 'Pill':
        return <Pill className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'Newspaper':
        return <Newspaper className="w-5 h-5 text-blue-600 shrink-0" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-purple-600 shrink-0" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-5 h-5 text-rose-600 shrink-0" />;
      default:
        return <Pill className="w-5 h-5 text-emerald-600 shrink-0" />;
    }
  };

  // State to track which categories and nested groups are expanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    about: false,
    structure: false,
    drug_info: true, // open by default
    policies_guidelines: false,
    news_pr: false,
    academic: false,
    activities: false,
  });

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    group_amr: true,
    group_warfarin: false,
    group_cannabis: false,
    group_cpg: true,
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const toggleGroup = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleSelect = (sectionId: string) => {
    onNavigate(sectionId as PublicNavSection);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity animate-in fade-in"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        id="main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-84 max-w-[88vw] bg-white border-r border-slate-200 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-800 to-teal-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center p-1.5 shadow-inner overflow-hidden">
              <img
                src="https://upload.wikimedia.org/wikipedia/th/1/12/Logo_of_Vachira_Phuket_Hospital.jpg"
                alt="Logo of Hospital"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight leading-tight">
                {t.hospitalName}
              </h2>
              <p className="text-xs text-emerald-200 font-medium mt-0.5">
                {t.pharmacyDept}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:bg-white/10 transition-colors"
            aria-label="ปิดเมนู"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-sm scrollbar-thin">
          {/* 🏠 หน้าแรก */}
          <button
            id="nav-home"
            onClick={() => handleSelect('home')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
              activeSection === 'home'
                ? 'bg-emerald-50 text-emerald-800 font-semibold border-l-4 border-emerald-600 shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Home className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold">{t.home}</span>
          </button>

          {/* New Dynamic Menu Sections */}
          {NEW_SIDEBAR_MENU.map((category) => {
            const isCatExpanded = !!expandedCategories[category.id];

            return (
              <div key={category.id} className="pt-1 border-t border-slate-100/80">
                {/* Category Header Button */}
                <button
                  id={`menu-toggle-${category.id}`}
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isCatExpanded
                      ? 'text-slate-900 bg-slate-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {getCategoryIcon(category.iconName)}
                    <span className="truncate">{category.title}</span>
                  </div>
                  {isCatExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {/* Category Children */}
                {isCatExpanded && (
                  <div className="ml-4 pl-2.5 border-l-2 border-emerald-100 my-1 space-y-0.5">
                    {/* Direct Sub-items */}
                    {category.items?.map((item) => {
                      const isItemActive = activeSection === item.id;

                      return (
                        <button
                          key={item.id}
                          id={`nav-${item.id}`}
                          onClick={() => handleSelect(item.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-start gap-1.5 ${
                            isItemActive
                              ? 'text-emerald-800 bg-emerald-50 font-semibold shadow-2xs'
                              : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-slate-400 select-none">├─</span>
                          <span className="flex-1 leading-snug">{item.title}</span>
                          {item.badge && (
                            <span className="shrink-0 text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-normal">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {/* Nested Subgroups (e.g. AMR, Warfarin, Cannabis, CPG) */}
                    {category.groups?.map((group) => {
                      const isGroupExpanded = !!expandedGroups[group.id];

                      return (
                        <div key={group.id} className="pt-1">
                          <button
                            onClick={(e) => toggleGroup(group.id, e)}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors"
                          >
                            <span className="truncate pr-1 text-left font-bold">
                              • {group.title}
                            </span>
                            {isGroupExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                          </button>

                          {isGroupExpanded && (
                            <div className="ml-3 pl-2 border-l border-emerald-200 mt-1 space-y-0.5">
                              {group.items.map((subItem) => {
                                const isSubActive = activeSection === subItem.id;
                                return (
                                  <button
                                    key={subItem.id}
                                    id={`nav-${subItem.id}`}
                                    onClick={() => handleSelect(subItem.id)}
                                    className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] transition-colors flex items-start gap-1.5 ${
                                      isSubActive
                                        ? 'text-emerald-800 bg-emerald-100/60 font-semibold'
                                        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span className="text-slate-400 select-none">└</span>
                                    <span className="flex-1 leading-snug">{subItem.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 🔐 Footer ปุ่ม Admin */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          <div className="text-[11px] text-slate-400 px-2 pb-1.5 flex items-center justify-between">
            <span>สำหรับบุคลากร</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <button
            id="admin-login-sidebar-btn"
            onClick={onOpenAdminLogin}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all shadow-2xs"
            title="เข้าสู่ระบบจัดการข้อมูลเจ้าหน้าที่ (Admin Login)"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>🔐 เข้าสู่ระบบเจ้าหน้าที่ (Admin)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
