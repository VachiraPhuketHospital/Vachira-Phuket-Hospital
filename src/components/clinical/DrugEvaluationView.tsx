import { DueDocumentDirectoryView } from './due/DueDocumentDirectoryView';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Droplet,
  HeartPulse,
  ShieldAlert,
  Activity,
  Bone,
  Zap,
  FileText,
  ExternalLink,
  Printer,
  CheckCircle2,
  FolderOpen,
  ArrowLeft,
  Search,
  ChevronRight,
  AlertTriangle,
  Pill,
  Download,
  Sparkles
} from 'lucide-react';
import {
  DUE_SECTIONS,
  OFFICIAL_DUE_DRIVE_FOLDER,
  DueCategorySection,
  DueDocumentItem,
  DueDrugItem,
  DueAntidoteItem
} from '../../data/dueData';

interface DrugEvaluationViewProps {
  initialSectionId?: string;
  onNavigateToDocumentCenter?: () => void;
}

export const DrugEvaluationView: React.FC<DrugEvaluationViewProps> = ({
  initialSectionId
}) => {
  // 'overview' = หน้าภาพรวมทั้ง 6 กลุ่ม, หรือ id เฉพาะ เช่น 'due_albumin'
  const [activeSectionId, setActiveSectionId] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'document'>('cards');

  useEffect(() => {
    if (initialSectionId && initialSectionId !== 'due_evaluation' && initialSectionId !== 'due_all') {
      const match = DUE_SECTIONS.find(s => s.id === initialSectionId);
      if (match) {
        setActiveSectionId(initialSectionId);
      } else {
        setActiveSectionId('overview');
      }
    } else {
      setActiveSectionId('overview');
    }
  }, [initialSectionId]);

  const handlePrint = () => {
    window.print();
  };

  // Helper สำหรับดึง Icon ประจำหมวด
  const getSectionIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Droplet':
        return <Droplet className={className} />;
      case 'HeartPulse':
        return <HeartPulse className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'Bone':
        return <Bone className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      default:
        return <Pill className={className} />;
    }
  };

  // กรองหัวข้อสำหรับการค้นหาในหน้าภาพรวม
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return DUE_SECTIONS;
    const term = searchTerm.toLowerCase();
    return DUE_SECTIONS.filter(section => {
      const matchTitle = section.title.toLowerCase().includes(term);
      const matchSub = section.subtitle.toLowerCase().includes(term);
      const matchDesc = section.description.toLowerCase().includes(term);
      const matchDrugs = section.drugs?.some(d =>
        d.genericName.toLowerCase().includes(term) ||
        (d.tradeName && d.tradeName.toLowerCase().includes(term))
      );
      const matchDocs = section.documents?.some(doc =>
        doc.fileCode.toLowerCase().includes(term) ||
        doc.title.toLowerCase().includes(term)
      );
      return matchTitle || matchSub || matchDesc || matchDrugs || matchDocs;
    });
  }, [searchTerm]);

  const selectedSection = useMemo(() => {
    return DUE_SECTIONS.find(s => s.id === activeSectionId);
  }, [activeSectionId]);

  return (
    <div className="max-w-7xl mx-auto py-2 px-2 sm:px-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <FileText className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Drug Use Evaluation (DUE) Guidelines</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              การประเมินความเหมาะสมการใช้ยา (DUE)
            </h1>
            <p className="text-sm text-emerald-100 max-w-2xl font-light">
              กลุ่มงานเภสัชกรรม โรงพยาบาลวชิระภูเก็ต — เกณฑ์การประเมิน แบบฟอร์มขออนุมัติ และแนวทางการสั่งใช้ยากลุ่มควบคุมพิเศษ 6 กลุ่ม
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 print:hidden">
            <a
              href={OFFICIAL_DUE_DRIVE_FOLDER}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-800 hover:bg-emerald-50 font-semibold text-xs transition-all shadow-sm hover:shadow"
            >
              <FolderOpen className="w-4 h-4 text-emerald-600" />
              <span>คลังแบบประเมิน Drive</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium text-xs border border-white/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์</span>
            </button>
          </div>
        </div>

        {/* Status update indicator */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ฉบับปรับปรุง พ.ศ. 2568 - 2569 ครอบคลุม 6 กลุ่มยาควบคุม</span>
          </div>
          {activeSectionId !== 'overview' && (
            <button
              type="button"
              onClick={() => setActiveSectionId('overview')}
              className="text-white hover:text-emerald-200 underline font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่ภาพรวม</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OVERVIEW: การแสดงรายการหัวข้อทั้ง 6 รายการเป็น Card Grid                    */}
      {/* ========================================================================= */}
      {activeSectionId === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* View Switcher Tabs: การ์ด 6 กลุ่ม vs รายการเอกสารตามประกาศ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "cards"
                    ? "bg-white text-emerald-800 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🗂️ การ์ด 6 หมวด (ภาพรวม & รายละเอียดยา)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("document")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "document"
                    ? "bg-white text-emerald-800 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>📋 รายการยา & รหัสเอกสารตามประกาศ (แยกโค้ดแก้ไขง่าย)</span>
              </button>
            </div>
            <div className="text-xs text-slate-500 px-2 flex items-center gap-1">
              <span>แก้ไขรายการยาได้ที่:</span>
              <code className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono text-[11px] font-semibold border border-emerald-200">
                src/data/dueContentConfig.ts
              </code>
            </div>
          </div>

          {/* Conditional rendering depending on viewMode */}
          {viewMode === "document" ? (
            <DueDocumentDirectoryView onSelectTopic={(id) => setActiveSectionId(id)} />
          ) : (
            <>
          {/* Quick Filter & Search Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อยา, รหัสแบบฟอร์ม DUE, หรือข้อบ่งชี้..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50/50"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ล้าง
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs text-slate-600">
              <span className="font-semibold text-slate-700 shrink-0">ทางลัด:</span>
              {DUE_SECTIONS.map(sec => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSectionId(sec.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 whitespace-nowrap text-xs font-medium transition-colors shrink-0"
                >
                  {sec.sectionNumber}. {sec.shortTitle}
                </button>
              ))}
            </div>
          </div>

          {/* Grid 6 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSections.map(sec => {
              const mainDoc = sec.documents[0];
              const drugCount = sec.drugs?.length || 0;
              const antidoteCount = sec.antidotes?.length || 0;

              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-emerald-300 cursor-pointer"
                >
                  <div className="p-6 space-y-4">
                    {/* Top Row: Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        {getSectionIcon(sec.iconName, 'w-6 h-6')}
                      </div>
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                        {sec.badge}
                      </span>
                    </div>

                    {/* Section Number & Title */}
                    <div>
                      <span className="text-xs font-extrabold tracking-wider text-emerald-700 uppercase">
                        หัวข้อที่ {sec.sectionNumber}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                        {sec.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                        {sec.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {sec.description}
                    </p>

                    {/* Meta stats */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {drugCount > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                          💊 ยา {drugCount} รายการ
                        </span>
                      )}
                      {antidoteCount > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-medium">
                          🛡️ ยาต้านพิษ {antidoteCount} รายการ
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[11px] font-medium">
                        📄 เอกสาร {sec.documents.length} ฉบับ
                      </span>
                    </div>

                    {/* Main Document Code */}
                    {mainDoc && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="font-semibold text-slate-700 truncate">
                            {mainDoc.fileCode}
                          </span>
                        </div>
                        <a
                          href={mainDoc.url || OFFICIAL_DUE_DRIVE_FOLDER}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline shrink-0 ml-2"
                        >
                          เปิด Drive
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Button */}
                  <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      เกณฑ์ & ขนาดยา
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSectionId(sec.id);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>ดูรายละเอียด</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSections.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-700">ไม่พบหัวข้อที่ตรงกับคำค้นหา "{searchTerm}"</p>
              <p className="text-xs text-slate-400 mt-1">ลองค้นหาด้วยชื่อสามัญยา เช่น Albumin, Apixaban, Meropenem หรือ Wegovy</p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                ล้างคำค้นหา
              </button>
            </div>
          )}
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAIL VIEW: แสดงรายละเอียดของหัวข้อที่เลือก (เกณฑ์, ยา, Antidote, แบบฟอร์ม) */}
      {/* ========================================================================= */}
      {selectedSection && activeSectionId !== 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Breadcrumb Navigation & Topic Switcher */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setActiveSectionId('overview')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← กลับหน้าภาพรวม DUE ทั้ง 6 กลุ่ม</span>
            </button>

            {/* Quick jump tabs 1-6 */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {DUE_SECTIONS.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSectionId(s.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
                    s.id === selectedSection.id
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s.sectionNumber}. {s.shortTitle}
                </button>
              ))}
            </div>
          </div>

          {/* Section Hero Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  {getSectionIcon(selectedSection.iconName, 'w-7 h-7')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                      หัวข้อที่ {selectedSection.sectionNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {selectedSection.badge}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    {selectedSection.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {selectedSection.subtitle}
                  </p>
                </div>
              </div>

              <a
                href={OFFICIAL_DUE_DRIVE_FOLDER}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#e11d48] font-bold text-xs border border-rose-200 transition-colors shrink-0"
              >
                <FolderOpen className="w-4 h-4" />
                <span>เปิดโฟลเดอร์ Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
              {selectedSection.description}
            </p>
          </div>

          {/* Documents Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-500" />
                <span>แบบฟอร์ม DUE และเอกสารที่เกี่ยวข้อง ({selectedSection.documents.length} ฉบับ)</span>
              </h3>
              <span className="text-xs text-slate-400">คลิกเพื่อเปิดเอกสารใน Google Drive</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSection.documents.map((doc: DueDocumentItem) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-slate-200/90 hover:border-rose-300 hover:shadow-xs transition-all bg-gradient-to-br from-white to-slate-50/50 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                        {doc.fileCode}
                      </span>
                      {doc.statusTag && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
                          {doc.statusTag}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{doc.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      {doc.fileType} • {doc.date}
                    </span>
                    <a
                      href={doc.url || OFFICIAL_DUE_DRIVE_FOLDER}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#e11d48] font-bold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>เปิดเอกสาร</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Criteria & Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* เกณฑ์การประเมินความเหมาะสม */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>เกณฑ์การประเมินข้อบ่งใช้ (Evaluation Criteria)</span>
              </h3>
              <ul className="space-y-3">
                {selectedSection.evaluationCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ข้อควรระวังและแนวทางทางคลินิก */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>ข้อควรระวัง & แนวทางทางคลินิก (Clinical Highlights)</span>
              </h3>
              <ul className="space-y-3">
                {selectedSection.clinicalHighlights.map((hl, idx) => (
                  <li key={idx} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs sm:text-sm text-amber-950 leading-relaxed">
                    {hl}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Specific / Non-specific Antidotes Section (กรณี NOAC) */}
          {selectedSection.antidotes && selectedSection.antidotes.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                    <span>คำแนะนำการเตรียมและบริหารยาต้านพิษ (NOAC Antidotes)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    แนวทางกรณีเกิดภาวะเลือดออกรุนแรงคุกคามชีวิต หรือต้องทำหัตถการฉุกเฉิน
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSection.antidotes.map((ant: DueAntidoteItem, idx: number) => {
                  const isAvailable = ant.availability === 'available';
                  return (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border ${
                        isAvailable
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-slate-200 bg-slate-50/50'
                      } space-y-3`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            ant.type === 'specific'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {ant.type === 'specific' ? 'Specific Antidote' : 'Non-specific Antidote'}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{ant.name}</h4>
                          {ant.brandName && (
                            <p className="text-xs text-slate-500 font-medium">{ant.brandName}</p>
                          )}
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {ant.availabilityText}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="font-semibold text-slate-900">เป้าหมายยา: </span>
                          <span className="text-slate-600">{ant.targetDrug}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">ขนาดยา: </span>
                          <span className="text-slate-600">{ant.dosageGuidelines}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">การเตรียม: </span>
                          <span className="text-slate-600">{ant.preparation}</span>
                        </div>
                      </div>

                      {ant.fileCode && (
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-500 text-[11px]">เอกสารคู่มือ: {ant.fileCode}</span>
                          <a
                            href={OFFICIAL_DUE_DRIVE_FOLDER}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-rose-600 hover:text-rose-800 underline inline-flex items-center gap-1"
                          >
                            <span>เปิดคู่มือ</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Drug List Section */}
          {selectedSection.drugs && selectedSection.drugs.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-600" />
                <span>รายการยาและแนวทางการสั่งใช้ ({selectedSection.drugs.length} รายการ)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSection.drugs.map((drug: DueDrugItem, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-3 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {drug.genericName}
                        </h4>
                        {drug.tradeName && (
                          <p className="text-xs text-emerald-700 font-semibold">{drug.tradeName}</p>
                        )}
                        {drug.strength && (
                          <p className="text-[11px] text-slate-500">{drug.strength} • {drug.dosageForm}</p>
                        )}
                      </div>
                      {drug.statusBadge && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                          {drug.statusBadge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900">ข้อบ่งใช้: </span>
                        <span>{drug.indications}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">ขนาดยา: </span>
                        <span>{drug.dosage}</span>
                      </div>
                      {drug.precautions && (
                        <div>
                          <span className="font-bold text-amber-700">ข้อควรระวัง: </span>
                          <span className="text-amber-900">{drug.precautions}</span>
                        </div>
                      )}
                    </div>

                    {drug.fileCode && (
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-500 text-[11px]">แบบประเมิน: {drug.fileCode}</span>
                        <a
                          href={OFFICIAL_DUE_DRIVE_FOLDER}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-rose-600 hover:text-rose-800 underline inline-flex items-center gap-1"
                        >
                          <span>ดาวน์โหลดแบบฟอร์ม</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setActiveSectionId('overview')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← กลับหน้าภาพรวม 6 หัวข้อ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugEvaluationView;
