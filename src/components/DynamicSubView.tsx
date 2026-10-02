import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  FileText, 
  Pill, 
  ShieldCheck, 
  BookOpen, 
  ExternalLink,
  Download,
  AlertCircle,
  Calendar,
  Users,
  CheckCircle,
  ArrowRight,
  Image as ImageIcon,
  Target,
  HeartPulse
} from 'lucide-react';
import { NEW_SIDEBAR_MENU, getStoredSidebarMenu, SubMenuItem } from '../data/sidebarMenuData';

interface DynamicSubViewProps {
  sectionId: string;
}

export const DynamicSubView: React.FC<DynamicSubViewProps> = ({ sectionId }) => {
  const [categories, setCategories] = useState(() => getStoredSidebarMenu());

  useEffect(() => {
    const handleUpdate = () => {
      setCategories(getStoredSidebarMenu());
    };
    window.addEventListener('vachira_sidebar_menu_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('vachira_sidebar_menu_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Find title, description, content, file from categories
  let foundTitle = '';
  let foundCategory = '';
  let foundDesc = '';
  let foundBadge = '';
  let foundItem: SubMenuItem | null = null;

  for (const cat of categories) {
    if (cat.items) {
      const match = cat.items.find(i => i.id === sectionId);
      if (match) {
        foundTitle = match.title;
        foundCategory = cat.title;
        foundDesc = match.description || '';
        foundBadge = match.badge || '';
        foundItem = match;
        break;
      }
    }
    if (cat.groups) {
      for (const grp of cat.groups) {
        const match = grp.items.find(i => i.id === sectionId);
        if (match) {
          foundTitle = match.title;
          foundCategory = `${cat.title} ❯ ${grp.title}`;
          foundDesc = match.description || '';
          foundBadge = match.badge || '';
          foundItem = match;
          break;
        }
      }
    }
  }

  if (!foundTitle) {
    foundTitle = sectionId;
    foundCategory = 'กลุ่มงานเภสัชกรรม';
  }

  // Fallback to initial preset if item in storage doesn't have imageUrl yet
  let effectiveImageUrl = foundItem?.imageUrl;
  if (!effectiveImageUrl) {
    for (const cat of NEW_SIDEBAR_MENU) {
      const match = cat.items?.find(i => i.id === sectionId) || 
        cat.groups?.flatMap(g => g.items).find(i => i.id === sectionId);
      if (match?.imageUrl) {
        effectiveImageUrl = match.imageUrl;
        break;
      }
    }
  }

  const [toast, setToast] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownload = () => {
    if (foundItem?.fileUrl) {
      if (foundItem.fileUrl.startsWith('http://') || foundItem.fileUrl.startsWith('https://')) {
        window.open(foundItem.fileUrl, '_blank', 'noopener,noreferrer');
        showFeedback(foundItem.fileUrl.includes('drive.google.com') ? 'กำลังเปิด Google Drive ในแท็บใหม่...' : 'กำลังเปิดดูเอกสาร...');
        return;
      }
      const link = document.createElement('a');
      link.href = foundItem.fileUrl;
      link.download = foundItem.fileName || `${foundTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showFeedback(`กำลังดาวน์โหลด: ${foundItem.fileName || foundTitle}`);
    } else {
      showFeedback(`กำลังเปิดดูเอกสาร: ${foundTitle} (กลุ่มงานเภสัชกรรม)`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 relative">
      {/* Floating feedback toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <ExternalLink className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            {foundCategory}
          </span>
          {foundBadge && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {foundBadge}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
          {foundTitle}
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl">
          {foundDesc || `เอกสาร คู่มือ และแนวทางปฏิบัติงานกลุ่มงานเภสัชกรรม ข้อมูลอัปเดตสำหรับบุคลากรทางการแพทย์และผู้รับบริการ`}
        </p>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>สถานะ: ข้อมูลประกาศทางการ กลุ่มงานเภสัชกรรม</span>
          </div>
          <div className="text-xs text-slate-400">
            ปรับปรุงล่าสุด: พ.ศ. 2568
          </div>
        </div>

        {/* Featured Image if uploaded/provided by Admin */}
        {effectiveImageUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xs group">
            <div className="relative aspect-16/9 sm:aspect-21/9 max-h-84 w-full overflow-hidden bg-slate-100">
              <img
                src={effectiveImageUrl}
                alt={foundTitle}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-900/15 to-transparent flex items-end justify-between p-4 sm:p-5">
                <span className="text-white text-xs font-semibold bg-slate-900/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ภาพประกอบ: {foundTitle}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Special Render for about_vision (เข็มมุ่ง & พันธกิจ) */}
        {sectionId === 'about_vision' ? (
          <div className="space-y-6">
            {/* เข็มมุ่ง Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white border border-emerald-500/40 shadow-lg">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3 backdrop-blur-md">
                <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>VACHIRA PHUKET HOSPITAL PHARMACY</span>
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-emerald-300 mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                เข็มมุ่งสอดคล้องกับ รพ.
              </h3>
              <p className="text-white text-xl sm:text-2xl font-extrabold tracking-wide">
                3P safety และ Smart pharmacy
              </p>
            </div>

            {/* พันธกิจ (Mission) Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                พันธกิจ (Mission)
              </h3>
              <ul className="space-y-3.5 text-sm sm:text-base text-slate-800">
                <li className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    1
                  </span>
                  <span className="leading-relaxed font-medium pt-0.5">
                    พัฒนางานเภสัชกรรมตามมาตรฐานวิชาชีพเภสัชกรรม
                  </span>
                </li>
                <li className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    2
                  </span>
                  <span className="leading-relaxed font-medium pt-0.5">
                    พัฒนาระบบงานบริการให้สอดคล้องกับ Smart Hospital และ 3P safety
                  </span>
                </li>
                <li className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    3
                  </span>
                  <span className="leading-relaxed font-medium pt-0.5">
                    ส่งเสริมการบริการทางเภสัชกรรม และพัฒนาสมรรถนะของบุคลากร ตามนโยบาย Service Excellence
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          foundItem?.content && (
            <div className="p-6 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                รายละเอียดและคำแนะนำ (Content Details)
              </h3>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                {foundItem.content}
              </div>
            </div>
          )
        )}

        {sectionId.startsWith('struct_') && !foundItem?.content && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-sm text-teal-950">
              <h4 className="font-bold mb-1">ขอบเขตภาระหน้าที่ความรับผิดชอบ:</h4>
              <p className="leading-relaxed text-teal-900">
                หน่วยงานรับผิดชอบการดำเนินงานตามมาตรฐานวิชาชีพเภสัชกรรมโรงพยาบาล ควบคุมคุณภาพความถูกต้อง รวดเร็ว และความปลอดภัยสูงสุดแก่ผู้ป่วย
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 text-sm block mb-1">บุคลากรประจำหน่วยงาน</span>
                <p className="text-slate-600">เภสัชกรชำนาญการ, เภสัชกรประจำจุดบริการ และเจ้าพนักงานเภสัชกรรม</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 text-sm block mb-1">มาตรฐานการให้บริการ</span>
                <p className="text-slate-600">มาตรฐาน HA (Hospital Accreditation) และ RDU Country มาตรฐานสากล</p>
              </div>
            </div>
          </div>
        )}

        {/* Resource Card with Attachment or Download Link */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                {foundItem?.fileUrl?.includes('drive.google.com') ? (
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                ) : (
                  <FileText className="w-4 h-4 text-emerald-600" />
                )}
                <span>
                  {foundItem?.fileName ? `เอกสารแนบ: ${foundItem.fileName}` : 'เอกสารและแนวทางปฏิบัติฉบับสมบูรณ์ (PDF / Guidelines)'}
                </span>
              </h4>
              <p className="text-xs text-slate-500">
                {foundItem?.fileUrl?.includes('drive.google.com')
                  ? 'เอกสารและภาพประกอบเชื่อมโยงผ่าน Google Drive (เปิดดูและดาวน์โหลดได้จากทุกอุปกรณ์)'
                  : 'ไฟล์เอกสารทางการ สำหรับบุคลากรทางการแพทย์ แพทย์ พยาบาล และเภสัชกร'}
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              {foundItem?.fileUrl?.includes('drive.google.com') ? (
                <>
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>เปิด Google Drive</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{foundItem?.fileName ? `ดาวน์โหลด (${foundItem.fileName})` : 'เปิดดู / ดาวน์โหลดเอกสาร'}</span>
                </>
              )}
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-700 border-b border-slate-200">
              หัวข้อสำคัญและเกณฑ์การดำเนินงาน
            </div>
            <div className="divide-y divide-slate-100 bg-white">
              <div className="p-3 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">วัตถุประสงค์และขอบเขต:</span>
                  <p className="text-slate-500 mt-0.5">กำหนดแนวทางการปฏิบัติงานและระเบียบปฏิบัติเพื่อความปลอดภัยสูงสุดของผู้ป่วย</p>
                </div>
              </div>
              <div className="p-3 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">เกณฑ์การพิจารณาและการติดตาม:</span>
                  <p className="text-slate-500 mt-0.5">การประเมินความปลอดภัย ข้อห้ามใช้ และข้อควรระวังสำคัญ</p>
                </div>
              </div>
              <div className="p-3 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">ขั้นตอนการรายงานและประสานงาน:</span>
                  <p className="text-slate-500 mt-0.5">การส่งต่อข้อมูลระหว่างทีมสหสาขาวิชาชีพและระบบสารสนเทศโรงพยาบาล</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Footer Note */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>กลุ่มงานเภสัชกรรม สอบถามข้อมูลเพิ่มเติม โทร. 1183</span>
          <span className="text-emerald-700 font-medium">Pharmacy Information System</span>
        </div>
      </div>
    </div>
  );
};
