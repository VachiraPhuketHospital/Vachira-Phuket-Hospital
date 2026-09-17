import React from 'react';
import {
  Pill,
  Newspaper,
  BookOpen,
  FileText,
  Users,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  MessageSquare,
  Phone,
  PhoneCall,
  Bell,
  AlertCircle
} from 'lucide-react';
import { DrugItem, NewsItem, KnowledgeArticle, DocumentDownload, AdminUser, PharmacistConsultationItem, QueueItem } from '../../types';

interface AdminDashboardOverviewProps {
  drugs: DrugItem[];
  news: NewsItem[];
  articles: KnowledgeArticle[];
  documents: DocumentDownload[];
  users: AdminUser[];
  consultations?: PharmacistConsultationItem[];
  queues?: QueueItem[];
  onNavigateSection: (sec: any) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  drugs,
  news,
  articles,
  documents,
  users,
  consultations = [],
  queues = [],
  onNavigateSection,
}) => {
  const pendingConsults = consultations.filter((c) => c.status === 'pending');
  const recentConsults = consultations.slice(0, 4);
  const activeQueues = queues.filter((q) => q.status !== 'completed');

  // Stat values matching prompt #11 + consultations card + queue management
  const stats = [
    {
      id: 'stat-queues',
      label: 'คิวรับยาผู้ป่วยนอก',
      count: `${activeQueues.length} คิวค้าง`,
      realCount: queues.length,
      icon: '⏱️',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-200',
      action: () => onNavigateSection('queues'),
      subtext: `${queues.filter((q) => q.status === 'ready').length} คิวพร้อมเรียกรับยา`,
      highlight: true,
    },
    {
      id: 'stat-consults',
      label: 'ปรึกษาเภสัชกร',
      count: pendingConsults.length > 0 ? `${pendingConsults.length} รอตอบ` : `${consultations.length}`,
      realCount: consultations.length,
      icon: '💬',
      bg: pendingConsults.length > 0
        ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-300/60 animate-pulse'
        : 'bg-teal-50 text-teal-800 border-teal-200',
      action: () => onNavigateSection('consultations'),
      subtext: pendingConsults.length > 0 ? '⚠️ มีข้อความคนไข้ใหม่' : `${consultations.length} ข้อความทั้งหมด`,
      highlight: pendingConsults.length > 0,
    },
    {
      id: 'stat-drugs',
      label: 'ยาในระบบ',
      count: '1,250',
      realCount: drugs.length,
      icon: '💊',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: () => onNavigateSection('drugs'),
      subtext: '+15 รายการเดือนนี้',
    },
    {
      id: 'stat-news',
      label: 'ข่าว / กิจกรรม',
      count: '48',
      realCount: news.length,
      icon: '📰',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      action: () => onNavigateSection('news'),
      subtext: 'เผยแพร่อยู่ 42 ข่าว',
    },
    {
      id: 'stat-knowledge',
      label: 'บทความความรู้',
      count: '120',
      realCount: articles.length,
      icon: '📚',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      action: () => onNavigateSection('knowledge'),
      subtext: 'ยอดอ่าน 35,400+ ครั้ง',
    },
    {
      id: 'stat-docs',
      label: 'เอกสารดาวน์โหลด',
      count: '85',
      realCount: documents.length,
      icon: '📄',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      action: () => onNavigateSection('documents'),
      subtext: 'ดาวน์โหลด 6,800 ครั้ง',
    },
    {
      id: 'stat-users',
      label: 'ผู้ใช้ / เภสัชกร',
      count: '12',
      realCount: users.length,
      icon: '👨‍⚕️',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      action: () => onNavigateSection('users'),
      subtext: 'ออนไลน์ขณะนี้ 4 ท่าน',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Bar */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            ระบบจัดการสารสนเทศกลุ่มงานเภสัชกรรม รพ.หัวหิน
          </span>
          <h1 className="text-2xl font-black mt-1">ภาพรวมระบบ (Dashboard Overview)</h1>
          <p className="text-xs text-emerald-100 mt-1 font-light">
            ยินดีต้อนรับ เภสัชกรผู้ดูแลระบบ • อัปเดตข้อมูลล่าสุด {new Date().toLocaleDateString('th-TH')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateSection('consultations')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>กล่องข้อความ ({pendingConsults.length})</span>
          </button>
          <button
            onClick={() => onNavigateSection('menu_topics')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>📁 จัดการหัวข้อเมนู/เนื้อหา</span>
          </button>
          <button
            onClick={() => onNavigateSection('drugs')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs shadow-xs transition-colors shrink-0"
          >
            + เพิ่มข้อมูลยาใหม่
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>สถิติรวมของระบบ</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.id}
              onClick={s.action}
              className={`bg-white p-4 sm:p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5 ${
                s.highlight ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center text-lg sm:text-xl ${s.bg}`}>
                  {s.icon}
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
              </div>

              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {s.count}
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                {s.label}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1">{s.subtext}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Consultations Widget (Prompt Request: Notification & Message to Admin) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>ข้อความปรึกษาเภสัชกรเข้ามาใหม่ (Pharmacist Inquiries)</span>
                {pendingConsults.length > 0 && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded-full animate-pulse">
                    {pendingConsults.length} รอดำเนินการ
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500">
                รายการคำถามเรื่องยาจากคนไข้ รพ.หัวหิน ที่ติดต่อผ่านระบบ
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateSection('consultations')}
            className="text-xs text-teal-800 hover:text-teal-950 font-bold flex items-center gap-1 self-start sm:self-auto bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200"
          >
            <span>จัดการกล่องข้อความทั้งหมด ({consultations.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentConsults.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            ยังไม่มีข้อความปรึกษาเภสัชกรเข้ามา
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentConsults.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigateSection('consultations')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:shadow-xs text-xs space-y-2 ${
                  c.status === 'pending'
                    ? 'bg-amber-50/40 border-amber-200 hover:bg-amber-50/70'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{c.patientName}</span>
                    <span className="text-slate-400 text-[11px]">({c.phone})</span>
                  </div>
                  {c.status === 'pending' ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold">
                      ⏳ รอตอบ
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      ✓ ตอบแล้ว
                    </span>
                  )}
                </div>

                {c.drugName && (
                  <div className="text-[11px] text-teal-800 font-semibold flex items-center gap-1">
                    <Pill className="w-3 h-3" />
                    <span>ยา: {c.drugName}</span>
                  </div>
                )}

                <p className="text-slate-700 line-clamp-2 leading-relaxed">
                  "{c.question}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                  <span>{c.createdAt}</span>
                  <span className="text-teal-700 font-semibold hover:underline">คลิกเพื่อดูและตอบกลับ →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Logs & Quick Service Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dispensing Station Queue Load */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>ปริมาณงานจ่ายยาผู้ป่วยนอกวันนี้ (OPD Workload)</span>
            </h3>
            <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-md">
              เปิดบริการปกติ
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>ช่องจ่ายยา 1-2 (บัตรทอง 30 บาท)</span>
                <span>380 / 450 ใบสั่งยา (84%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>ช่องจ่ายยา 3 (ประกันสังคม)</span>
                <span>210 / 280 ใบสั่งยา (75%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>ช่องจ่ายยา 4 (ข้าราชการ / ชำระเงิน)</span>
                <span>165 / 200 ใบสั่งยา (82%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>บริการเติมยาทางไปรษณีย์ (Hua Hin Med Post)</span>
                <span>45 กล่องพัสดุจัดส่งแล้ว</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent System Audit Logs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ประวัติการจัดการข้อมูลล่าสุด</span>
          </h3>

          <div className="mt-4 space-y-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-semibold text-slate-800">อัปเดต Infographic ขั้นตอนรับยา</div>
              <div className="text-[11px] text-slate-500">โดย ภก.ดำรงเกียรติ • 10 นาทีที่แล้ว</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-semibold text-slate-800">เพิ่มยา Warfarin 3mg ในบัญชียา</div>
              <div className="text-[11px] text-slate-500">โดย ภญ.จันทิมา • 2 ชั่วโมงที่แล้ว</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-semibold text-slate-800">เผยแพร่ข่าวสัปดาห์เภสัชกรรม 2568</div>
              <div className="text-[11px] text-slate-500">โดย ผู้ดูแลระบบ • เมื่อวานนี้</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-semibold text-slate-800">อัปเดตคู่มือเอกสารส่งยาไปรษณีย์</div>
              <div className="text-[11px] text-slate-500">โดย เจ้าหน้าที่คลังยา • 3 วันที่แล้ว</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
