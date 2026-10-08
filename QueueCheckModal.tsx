import React, { useState } from 'react';
import { QueueItem } from '../types';
import {
  Clock,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Truck,
  Building,
  HelpCircle,
  QrCode
} from 'lucide-react';

interface QueueCheckModalProps {
  queues: QueueItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const QueueCheckModal: React.FC<QueueCheckModalProps> = ({
  queues = [],
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'real_hospital' | 'health_rider'>('demo');
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<QueueItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanQuery = query.trim().toUpperCase();
    const found = (queues || []).find(
      (q) => q.queueNumber.toUpperCase() === cleanQuery || q.hn.includes(cleanQuery)
    );
    setSearchResult(found || null);
  };

  const getStatusBadge = (status: QueueItem['status']) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>พร้อมรับยา (เชิญที่ช่องบริการ)</span>
          </span>
        );
      case 'dispensing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>กำลังจัดและตรวจสอบยา</span>
          </span>
        );
      case 'waiting_check':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-4 h-4" />
            <span>รอเภสัชกรตรวจสอบใบสั่งยา</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            เสร็จสิ้น
          </span>
        );
    }
  };

  return (
    <div
      id="queue-check-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                ตรวจสอบคิวรับยาผู้ป่วยนอก
              </h3>
              <p className="text-xs text-emerald-200">
                กลุ่มงานเภสัชกรรม โรงพยาบาลวชิระภูเก็ต
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:bg-white/10 transition-colors"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'demo'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>กระดานคิวจำลอง (Demo)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('real_hospital')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'real_hospital'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>เช็กคิวจริงผ่าน "หมอพร้อม"</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full">ทางการ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('health_rider')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'health_rider'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-teal-600" />
            <span>ส่งยาถึงบ้าน (Health Rider)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* TAB 1: DEMO QUEUE BOARD */}
          {activeTab === 'demo' && (
            <>
              {/* Notice Banner */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <p className="font-bold">ระบบตรวจสอบคิวรับยาผู้ป่วยนอก โรงพยาบาลวชิระภูเก็ต</p>
                  <p className="text-slate-600">
                    ข้อมูลคิวอัปเดตแบบเรียลไทม์โดยห้องจ่ายยาและเภสัชกรผู้ดูแลระบบ ท่านสามารถค้นหาด้วยหมายเลขคิวบนบัตร หรือหมายเลข HN ได้ทันที หรือสลับไปแท็บ <strong>'เช็กคิวจริงผ่าน "หมอพร้อม"'</strong> ด้านบน
                  </p>
                </div>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  กรอกหมายเลขคิว (เช่น A101, A102) หรือ หมายเลขบัตรโรงพยาบาล (HN):
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="queue-search-input"
                      type="text"
                      placeholder="เช่น A102 หรือ 5812934"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pl-3.5 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>ค้นหาคิว</span>
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span>คลิกเพื่อลองสุ่มคิวตัวอย่าง:</span>
                  {queues.slice(0, 3).map((q) => (
                    <button
                      type="button"
                      key={q.queueNumber}
                      onClick={() => {
                        setQuery(q.queueNumber);
                        setSearchResult(q);
                        setHasSearched(true);
                      }}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 text-emerald-800 font-bold border border-slate-200 text-[11px] cursor-pointer"
                    >
                      {q.queueNumber}
                    </button>
                  ))}
                </div>
              </form>

              {/* Search Result Card */}
              {hasSearched && (
                <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50">
                  {searchResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div>
                          <span className="text-xs text-slate-500">หมายเลขคิวของคุณ</span>
                          <div className="text-3xl font-black text-slate-900 tracking-tight">
                            {searchResult.queueNumber}
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(searchResult.status)}
                          <div className="text-[11px] text-slate-500 mt-1">
                            อัปเดตเมื่อ {searchResult.updatedAt}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500">ผู้รับบริการ:</span>
                          <div className="font-bold text-slate-800 mt-0.5">
                            {searchResult.patientName}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500">ช่องรับยาที่กำหนด:</span>
                          <div className="font-bold text-emerald-800 mt-0.5">
                            {searchResult.room}
                          </div>
                        </div>
                      </div>

                      {/* Progress steps */}
                      <div className="pt-2">
                        <div className="text-xs font-semibold text-slate-700 mb-2">
                          ความคืบหน้าขั้นตอนบริการ:
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                          <div
                            className={`p-2 rounded-lg font-medium ${
                              searchResult.status === 'waiting_check'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            1. ตรวจสอบใบสั่งยา
                          </div>
                          <div
                            className={`p-2 rounded-lg font-medium ${
                              searchResult.status === 'dispensing'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300 font-bold'
                                : searchResult.status === 'ready'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            2. จัดและตรวจสอบยา
                          </div>
                          <div
                            className={`p-2 rounded-lg font-medium ${
                              searchResult.status === 'ready'
                                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            3. รับยาที่ช่องบริการ
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5 text-slate-500">
                      <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                      <p className="font-semibold text-sm">ไม่พบคิวทดสอบ "{query}"</p>
                      <p className="text-xs text-slate-400 mt-1">
                        กรุณาลองคลิกหมายเลขคิวตัวอย่างด้านบน หรือสลับไปแท็บ "เช็กคิวจริงผ่านหมอพร้อม"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Current Hospital Live Board */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>กระดานจำลองคิวห้องจ่ายยาผู้ป่วยนอก (ห้องจ่ายยา 1-2)</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">อัปเดตอัตโนมัติ</span>
                </div>

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
                  {(queues || []).map((q) => (
                    <div key={q.queueNumber} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                          {q.queueNumber}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-800">{q.room}</div>
                          <div className="text-[11px] text-slate-400">{q.patientName} (HN: {q.hn})</div>
                        </div>
                      </div>
                      <div>
                        {getStatusBadge(q.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: REAL MOHPROM QUEUE */}
          {activeTab === 'real_hospital' && (
            <div className="space-y-5">
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-base">
                      วิธีตรวจสอบคิวตรวจและคิวรับยาจริง รพ.วชิระภูเก็ต
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      โรงพยาบาลวชิระภูเก็ตเชื่อมโยงระบบการนัดหมายและลำดับคิวผู้ป่วยกับแอปพลิเคชันและ LINE <strong>"หมอพร้อม"</strong> เพื่อให้ท่านตรวจสอบคิวได้จากโทรศัพท์มือถือแบบเรียลไทม์
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-200/80 grid sm:grid-cols-2 gap-3">
                  <a
                    href="https://line.me/R/ti/p/@mophconnect"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                  >
                    <span>เปิด LINE หมอพร้อม</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://mohpromt.moph.go.th/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                  >
                    <span>เว็บไซต์หมอพร้อม สธ.</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Steps Guide */}
              <div className="space-y-3">
                <h5 className="font-bold text-sm text-slate-900">
                  ขั้นตอนการรับคิวจริงเมื่อมาถึงโรงพยาบาล:
                </h5>
                <div className="grid gap-2.5 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-slate-800 block">เสียบบัตรประชาชนที่ตู้ Kiosk:</strong>
                      <p className="text-slate-500 mt-0.5">ตู้คีออสตั้งอยู่บริเวณโถงชั้น 1 หน้าห้องบัตร หรือหน้าลิฟต์ประจำชั้นตรวจ เพื่อพิมพ์ใบนำทางและลำดับคิว</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-slate-800 block">ยื่นใบนำทางที่หน้าห้องตรวจ / การเงิน:</strong>
                      <p className="text-slate-500 mt-0.5">หลังพบแพทย์ ให้ชำระเงินที่ห้องการเงิน 12-13 (กรณีมีค่าใช้จ่าย) และนำเอกสารยื่นจุดบัตรคิวหน้าห้องจ่ายยาผู้ป่วยนอก ชั้น 1</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-slate-800 block">รอเรียกคิวรับยาและรับคำแนะนำ:</strong>
                      <p className="text-slate-500 mt-0.5">สังเกตหมายเลขบนจอทีวี หรือรอฟังเสียงเรียกเข้าช่องจ่ายยา 1-10 พร้อมรับคำอธิบายวิธีใช้ยาจากเภสัชกร</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HEALTH RIDER DELIVERY */}
          {activeTab === 'health_rider' && (
            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
                <div className="flex items-center gap-2.5 text-teal-900 mb-2">
                  <Truck className="w-5 h-5 text-teal-700" />
                  <h4 className="font-bold text-base">บริการจัดส่งยาถึงบ้าน (HEALTH RIDER วชิระภูเก็ต)</h4>
                </div>
                <p className="text-xs text-teal-800 leading-relaxed">
                  บริการพิเศษสำหรับผู้ป่วยที่ไม่สะดวกรอรับยาที่โรงพยาบาล หลังพบแพทย์แล้วสามารถแจ้งความประสงค์ให้เภสัชกรจัดส่งยาไปยังที่พักหรือที่ทำงานได้สะดวกรวดเร็ว
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <strong className="text-slate-900 block font-bold">📍 จุดลงทะเบียนรับยาที่บ้าน:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>โต๊ะหมายเลข 41</strong> (ตั้งอยู่บริเวณตรงข้ามห้องจ่ายยาผู้ป่วยนอก ชั้น 1)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    ยื่นใบนัดและแจ้งที่อยู่จัดส่งกับเจ้าหน้าที่หลังเสร็จสิ้นการตรวจ
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <strong className="text-slate-900 block font-bold">⏱️ ระยะเวลาจัดส่ง:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    • ภายในเขตอำเภอเมืองภูเก็ต: ภายในวันเดียวกัน หรือวันถัดไป<br />
                    • ต่างอำเภอ/ต่างจังหวัด: จัดส่งผ่านพัสดุด่วน EMS (2-3 วันทำการ)
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">📞 สอบถามคิวส่งยาทางไปรษณีย์ / Health Rider:</span>
                <p>โทร. <strong>076-361234 ต่อ 1183 หรือ 1184</strong> (กลุ่มงานเภสัชกรรม รพ.วชิระภูเก็ต)</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            ห้องจ่ายยาผู้ป่วยนอก ชั้น 1 รพ.วชิระภูเก็ต โทร. 076-361234 ต่อ 1183
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors ml-auto cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

