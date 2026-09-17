import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Pill,
  ClipboardList,
  BookOpen,
  Newspaper,
  FileText,
  Sliders,
  Image,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  UserCheck,
  MessageSquare,
  Bell,
  EyeOff,
  Eye,
  RotateCcw,
  Clock,
  FolderTree,
} from 'lucide-react';
import { AdminSection } from '../../types';

interface AdminLayoutProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  currentUser: string;
  onLogout: () => void;
  onViewPublicSite: () => void;
  unreadConsultCount?: number;
  pendingConsultCount?: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentSection,
  onSelectSection,
  currentUser,
  onLogout,
  onViewPublicSite,
  unreadConsultCount = 0,
  pendingConsultCount = 0,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [hiddenMenus, setHiddenMenus] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('huahin_admin_hidden_menus');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('huahin_admin_hidden_menus');
        setHiddenMenus(saved ? JSON.parse(saved) : []);
      } catch {
        setHiddenMenus([]);
      }
    };
    window.addEventListener('huahin_admin_menus_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('huahin_admin_menus_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleHideMenuDirectly = (e: React.MouseEvent, menuId: AdminSection) => {
    e.stopPropagation();
    const updated = [...hiddenMenus, menuId];
    setHiddenMenus(updated);
    try {
      localStorage.setItem('huahin_admin_hidden_menus', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('huahin_admin_menus_changed', { detail: updated }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestoreAllMenus = () => {
    setHiddenMenus([]);
    try {
      localStorage.removeItem('huahin_admin_hidden_menus');
      window.dispatchEvent(new CustomEvent('huahin_admin_menus_changed', { detail: [] }));
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems: {
    id: AdminSection;
    label: string;
    icon: any;
    badge?: string;
    badgeClass?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard ภาพรวม', icon: LayoutDashboard },
    {
      id: 'queues',
      label: 'จัดการคิวรับยาผู้ป่วยนอก',
      icon: Clock,
      badge: 'Real-time',
      badgeClass: 'bg-emerald-600 text-white font-bold',
    },
    {
      id: 'consultations',
      label: 'ข้อความปรึกษาเภสัชกร',
      icon: MessageSquare,
      badge: pendingConsultCount > 0 ? `${pendingConsultCount} รอตอบ` : undefined,
      badgeClass: 'bg-amber-500 text-white font-bold animate-pulse',
    },
    {
      id: 'menu_topics',
      label: '📁 จัดการหัวข้อเมนู/เนื้อหา',
      icon: FolderTree,
      badge: 'เมนูใหม่',
      badgeClass: 'bg-emerald-600 text-white font-bold',
    },
    { id: 'drugs', label: 'จัดการข้อมูลยา', icon: Pill },
    { id: 'infographics', label: 'จัดการขั้นตอนรับยา (3 รูป)', icon: Image },
    { id: 'banner', label: 'จัดการ Banner หน้าแรก', icon: Sliders },
    { id: 'news', label: 'จัดการข่าวสาร', icon: Newspaper },
    { id: 'knowledge', label: 'จัดการคลังความรู้', icon: BookOpen },
    { id: 'documents', label: 'จัดการเอกสารดาวน์โหลด', icon: FileText },
    { id: 'users', label: 'จัดการผู้ใช้งาน', icon: Users },
    { id: 'stats', label: 'สถิติระบบ', icon: BarChart3 },
    { id: 'settings', label: 'ตั้งค่าระบบ', icon: Settings },
  ];

  // Visible menu items: keep currently selected section always accessible
  const visibleMenuItems = menuItems.filter(
    (item) => !hiddenMenus.includes(item.id) || item.id === currentSection
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Admin Topbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-xl">💊</span>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-emerald-400">
                กลุ่มงานเภสัชกรรม • รพ.หัวหิน
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>ระบบจัดการหลังบ้าน (Admin Console)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Consultation Notification Bell */}
          <button
            onClick={() => onSelectSection('consultations')}
            className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            title={`ข้อความปรึกษาเภสัชกร (${pendingConsultCount} รายการรอดำเนินการ)`}
          >
            <Bell className="w-4 h-4 text-emerald-400" />
            {pendingConsultCount > 0 ? (
              <span className="flex items-center gap-1 bg-amber-500 text-slate-950 font-black text-[11px] px-1.5 py-0.2 rounded-full ring-2 ring-slate-900 animate-pulse">
                {pendingConsultCount}
              </span>
            ) : unreadConsultCount > 0 ? (
              <span className="flex items-center gap-1 bg-rose-500 text-white font-black text-[11px] px-1.5 py-0.2 rounded-full ring-2 ring-slate-900">
                {unreadConsultCount}
              </span>
            ) : null}
          </button>

          {/* Switch to Public View */}
          <button
            onClick={onViewPublicSite}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>ดูหน้าเว็บประชาชน</span>
          </button>

          {/* User Profile matching item 11 */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              👤
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-200">
                {currentUser || 'Admin'}
              </div>
              <div className="text-[10px] text-emerald-400">ผู้ดูแลระบบ</div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Admin Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between transition-transform duration-200 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-4 overflow-y-auto space-y-1">
            <div className="flex items-center justify-between px-3 mb-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                เมนูจัดการระบบ
              </div>
              {hiddenMenus.length > 0 && (
                <button
                  type="button"
                  onClick={handleRestoreAllMenus}
                  className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5"
                  title="คืนค่าแสดงทุกเมนู"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>คืนค่า ({hiddenMenus.length})</span>
                </button>
              )}
            </div>

            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <div
                  key={item.id}
                  className="group relative flex items-center"
                >
                  <button
                    onClick={() => {
                      onSelectSection(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ml-1 ${
                          item.badgeClass || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Quick hide button (available for non-settings menus) */}
                  {item.id !== 'settings' && (
                    <button
                      type="button"
                      onClick={(e) => handleHideMenuDirectly(e, item.id)}
                      className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-200/60 transition-all text-[10px]"
                      title={`ซ่อน/ลบเมนู "${item.label}" จากแถบข้าง`}
                    >
                      <EyeOff className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Admin Sidebar Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs space-y-2">
            <button
              onClick={onViewPublicSite}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>เปิดหน้าประชาชน</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-red-700 hover:bg-red-50 font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออกจากระบบ (Logout)</span>
            </button>
          </div>
        </aside>

        {/* Admin Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Urgent Consult Notification Banner */}
            {pendingConsultCount > 0 && currentSection !== 'consultations' && (
              <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-teal-500/10 border border-amber-300 rounded-2xl p-3.5 sm:px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 text-xs text-amber-950 font-medium">
                  <span className="flex h-3 w-3 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-600"></span>
                  </span>
                  <div>
                    <strong className="font-extrabold text-amber-900">
                      แจ้งเตือนข้อความปรึกษาเภสัชกรใหม่:
                    </strong>{' '}
                    มีข้อความจากผู้ป่วยเข้ามา{' '}
                    <span className="font-bold underline text-amber-950">
                      {pendingConsultCount} รายการ
                    </span>{' '}
                    ที่ยังรอดำเนินการติดต่อกลับ
                  </div>
                </div>

                <button
                  onClick={() => onSelectSection('consultations')}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs shrink-0 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>เปิดดูข้อความ ({pendingConsultCount})</span>
                </button>
              </div>
            )}

            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
