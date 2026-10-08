import React, { useState } from 'react';
import {
  ShieldCheck,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
  X,
  Clock,
  HelpCircle,
  Bell,
  Check
} from 'lucide-react';
import { CONTACT_INFO } from '../data/initialData';
import { PharmacistConsultationItem } from '../types';

interface PharmacistConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddConsultation?: (newConsult: PharmacistConsultationItem) => void;
}

export const PharmacistConsultModal: React.FC<PharmacistConsultModalProps> = ({
  isOpen,
  onClose,
  onAddConsultation,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string>('');
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    drugName: '',
    category: 'ข้อสงสัยการใช้ยาทั่วไป',
    question: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName.trim() || !formData.phone.trim() || !formData.question.trim()) {
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const newConsultId = `consult-${Date.now()}`;

    const newConsult: PharmacistConsultationItem = {
      id: newConsultId,
      patientName: formData.patientName.trim(),
      phone: formData.phone.trim(),
      drugName: formData.drugName.trim() || undefined,
      category: formData.category,
      question: formData.question.trim(),
      status: 'pending',
      createdAt: `วันนี้, ${timeStr} น.`,
      isRead: false,
    };

    if (onAddConsultation) {
      onAddConsultation(newConsult);
    } else {
      // Fallback direct storage sync
      try {
        const stored = localStorage.getItem('vachira_phuket_consultations');
        const list = stored ? JSON.parse(stored) : [];
        localStorage.setItem('vachira_phuket_consultations', JSON.stringify([newConsult, ...list]));
      } catch (err) {
        console.warn('Failed to save consultation', err);
      }
    }

    setLastSubmittedId(newConsultId);
    setSubmitted(true);
  };

  return (
    <div
      id="pharmacist-consult-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-teal-800 to-emerald-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                ปรึกษาเภสัชกร รพ.วชิระภูเก็ต
              </h3>
              <p className="text-xs text-teal-200">
                บริการให้คำปรึกษาปัญหาเรื่องยาและสุขภาพโดยเภสัชกรวิชาชีพ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-200 hover:bg-white/10"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:076361234"
              className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 block">โทรสายตรงห้องยา</span>
                <span className="text-xs text-emerald-700 font-semibold">076-361234 ต่อ 1234</span>
                <span className="text-[10px] text-slate-500 block">จันทร์-ศุกร์ 08:00 - 20:00 น.</span>
              </div>
            </a>

            <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/70 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-950 block">Line Official ห้องยา</span>
                <span className="text-xs text-teal-700 font-semibold">{CONTACT_INFO.line}</span>
                <span className="text-[10px] text-slate-500 block">ตอบกลับภายในเวลาทำการ</span>
              </div>
            </div>
          </div>

          {/* Form */}
          {submitted ? (
            <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200 space-y-4">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                  <Bell className="w-3.5 h-3.5 text-emerald-600" />
                  ส่งแจ้งเตือนถึงเภสัชกรและแอดมินห้องยาแล้ว
                </span>
                <h4 className="text-xl font-extrabold text-emerald-950">
                  ส่งคำปรึกษาถึงเภสัชกรเรียบร้อยแล้ว
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                  ข้อความของท่านถูกส่งเข้าสู่กล่องข้อความของผู้ดูแลระบบและเภสัชกรเวร รพ.วชิระภูเก็ต
                  รหัสอ้างอิง <strong className="text-emerald-800">#{lastSubmittedId ? lastSubmittedId.slice(-6) : 'NEW'}</strong>
                </p>
              </div>

              {/* Consultation Summary Card */}
              <div className="bg-white p-4 rounded-xl border border-emerald-200/80 text-left text-xs space-y-1.5 max-w-md mx-auto shadow-2xs">
                <div className="flex justify-between text-slate-500">
                  <span>ผู้ขอรับคำปรึกษา:</span>
                  <span className="font-bold text-slate-800">{formData.patientName}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>เบอร์ติดต่อกลับ:</span>
                  <span className="font-bold text-emerald-700">{formData.phone}</span>
                </div>
                {formData.drugName && (
                  <div className="flex justify-between text-slate-500">
                    <span>ยาที่มีข้อสงสัย:</span>
                    <span className="font-bold text-slate-800">{formData.drugName}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>หมวดหมู่:</span>
                  <span className="font-semibold text-slate-700">{formData.category}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 text-slate-600">
                  <span className="font-semibold text-slate-700">ข้อความ: </span>
                  <span className="italic line-clamp-2">"{formData.question}"</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  เสร็จสิ้นและปิดหน้าต่าง
                </button>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      patientName: '',
                      phone: '',
                      drugName: '',
                      category: 'ข้อสงสัยการใช้ยาทั่วไป',
                      question: '',
                    });
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  ส่งข้อความใหม่อีกรายการ
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-slate-800">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>ฝากข้อความให้เภสัชกร รพ.วชิระภูเก็ต ตรวจสอบและติดต่อกลับ:</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md hidden sm:inline-block">
                  💬 แจ้งตรงเข้าแอดมินห้องยา
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ชื่อ-นามสกุล ผู้ขอรับคำปรึกษา *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น นายสมบูรณ์ มีสุข"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    เบอร์โทรศัพท์ติดต่อกลับ *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="เช่น 081-234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ชื่อยาที่มีข้อสงสัย (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ยาลดความดันเม็ดสีเหลือง, Warfarin..."
                    value={formData.drugName}
                    onChange={(e) => setFormData({ ...formData, drugName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    หมวดหมู่ข้อสงสัย
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50/50 focus:bg-white"
                  >
                    <option value="ข้อสงสัยการใช้ยาทั่วไป">ข้อสงสัยการใช้ยาทั่วไป</option>
                    <option value="วิธีรับประทานยาและเวลาที่เหมาะสม">วิธีรับประทานยาและเวลาที่เหมาะสม</option>
                    <option value="อาการข้างเคียงหรือสงสัยแพ้ยา">อาการข้างเคียงหรือสงสัยแพ้ยา</option>
                    <option value="ลืมทานยาหรือทานยาผิดขนาด">ลืมทานยาหรือทานยาผิดขนาด</option>
                    <option value="ยาตีกันหรืออันตรกิริยา">ยาตีกันหรืออันตรกิริยา (Drug Interaction)</option>
                    <option value="การเก็บรักษายา">การเก็บรักษายา</option>
                    <option value="ยาในสตรีมีครรภ์/ให้นมบุตร">ยาในสตรีมีครรภ์ / ให้นมบุตร</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  รายละเอียดข้อสงสัยหรืออาการที่พบ *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="ระบุอาการ ข้อสงสัย หรือปัญหาการใช้ยา เช่น ลืมทานยาต้องทำอย่างไร, มีผื่นขึ้นหลังทานยา..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  กรณีมีอาการแพ้ยารุนแรง เช่น แน่นหน้าอก หายใจไม่ออก หน้าบวม ปากบวม กรุณามาพบแพทย์ที่ห้องฉุกเฉิน (ER) ทันทีตลอด 24 ชั่วโมง
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all hover:shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งคำปรึกษาถึงเภสัชกร</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
