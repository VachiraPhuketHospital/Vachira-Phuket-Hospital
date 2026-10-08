import React from 'react';
import { Phone, Mail, MapPin, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO } from '../data/initialData';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ContactFooterProps {
  onOpenConsult?: () => void;
  onOpenAdminLogin?: () => void;
  language?: Language;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({
  onOpenConsult,
  onOpenAdminLogin,
  language = 'th',
}) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  return (
    <footer id="section-contact-footer" className="mt-16 bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Contact Highlight Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-700/50">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              {isEn ? 'Pharmacy & Medication Hotline' : 'สายด่วนสุขภาพ & การใช้ยา'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              {isEn ? 'Have medication questions? Consult our pharmacists now' : 'มีข้อสงสัยเรื่องยา ปรึกษาเภสัชกรวชิระภูเก็ตได้ทันที'}
            </h3>
            <p className="text-sm text-emerald-100/90 font-light">
              {isEn ? 'Offering expert medication counseling, patient safety advice, and Med-Post delivery assistance.' : 'ให้บริการคำปรึกษา แนะนำการใช้ยาอย่างปลอดภัย พร้อมบริการจัดส่งยาทางไปรษณีย์'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              id="footer-call-btn"
              href="tel:076361234"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 shadow-md hover:scale-105 transition-all"
            >
              <Phone className="w-4 h-4 text-emerald-700 animate-bounce" />
              <span>{isEn ? 'Call +66 76 361234 ext. 1183' : 'โทร 076-361234 ต่อ 1183'}</span>
            </a>

            {onOpenConsult && (
              <button
                id="footer-consult-btn"
                onClick={onOpenConsult}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white font-medium text-sm border border-emerald-500/50 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isEn ? 'Online Consultation' : 'ปรึกษาออนไลน์'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Columns Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-sm">
          {/* Col 1: About Hospital */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="text-2xl">💊</span>
              <div>
                <div>{t.pharmacyDept}</div>
                <div className="text-xs text-emerald-400 font-normal">
                  {t.hospitalName}
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isEn ? 'Dedicated to standardizing medication systems, safety protocols, and health promotion for Phuket residents and global visitors.' : 'มุ่งมั่นพัฒนาระบบยาที่ได้มาตรฐาน ปลอดภัย และสร้างเสริมสุขภาพของประชาชนชาวภูเก็ตและอันดามัน'}
            </p>
            <div className="text-xs text-emerald-400">
              {isEn ? 'Hospital Accreditation (HA) & Pharmacy Professional Standards' : 'มาตรฐานคุณภาพโรงพยาบาล (HA) & มาตรฐานวิชาชีพเภสัชกรรม'}
            </div>
          </div>

          {/* Col 2: 📞 โทรศัพท์ */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? '📞 Telephones & Hotlines' : '📞 โทรศัพท์และสายด่วน'}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {CONTACT_INFO.phones.map((p, idx) => (
                <li key={idx} className="flex flex-col">
                  <span className="text-slate-300 font-medium">{p.label}:</span>
                  <a href={`tel:${p.number}`} className="text-emerald-400 hover:underline">
                    {p.number}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: 📍 ที่ตั้ง & 📧 Email */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? '📍 Location & Email' : '📍 ที่ตั้ง & 📧 Email'}</span>
            </h4>
            <div className="text-xs text-slate-400 space-y-2">
              <p className="leading-relaxed">
                {isEn ? '453 Yaowarat Road, Talad Yai Sub-district, Mueang Phuket District, Phuket 83000' : CONTACT_INFO.address}
              </p>
              <div className="pt-1">
                <span className="text-slate-300 font-medium">Email:</span>
                <p className="text-emerald-400">{CONTACT_INFO.email}</p>
              </div>
              <div>
                <span className="text-slate-300 font-medium">Line Official:</span>
                <p className="text-emerald-400">{CONTACT_INFO.line}</p>
              </div>
            </div>
          </div>

          {/* Col 4: 🕐 เวลาทำการ */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? '🕐 Operating Hours' : '🕐 เวลาทำการ'}</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              {CONTACT_INFO.hours.map((h, i) => (
                <div key={i} className="bg-slate-800/60 p-2 rounded-lg border border-slate-800">
                  <div className="font-semibold text-slate-200">
                    {isEn && h.day.includes('จันทร์ - ศุกร์') ? 'Mon - Fri (Official Hours)' : isEn && h.day.includes('เสาร์') ? 'Sat - Sun & Public Holidays' : isEn && h.day.includes('ฉุกเฉิน') ? 'Emergency Room / Inpatient' : h.day}
                  </div>
                  <div className="text-emerald-400 text-[11px]">{h.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar with subtle admin link */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} {isEn ? 'Pharmacy Department, Vachira Phuket Hospital. All rights reserved.' : 'กลุ่มงานเภสัชกรรม โรงพยาบาลวชิระภูเก็ต. สงวนลิขสิทธิ์ทั้งหมด.'}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.vachiraphuket.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>{isEn ? 'Vachira Phuket Hospital Main Portal' : 'เว็บไซต์หลัก รพ.วชิระภูเก็ต'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {onOpenAdminLogin && (
              <button
                id="footer-admin-link"
                onClick={onOpenAdminLogin}
                className="text-slate-400 hover:text-emerald-400 text-xs flex items-center gap-1 border-l border-slate-700 pl-3 transition-colors"
                title="เข้าสู่ระบบจัดการข้อมูลเจ้าหน้าที่"
              >
                <span>⚙️ {isEn ? 'Staff Portal' : 'สำหรับเจ้าหน้าที่'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
