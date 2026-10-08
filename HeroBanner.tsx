import React from 'react';
import { Pill, HeartPulse, ChevronRight, CheckCircle2, Target, MessageSquare, ClipboardCheck } from 'lucide-react';
import { BannerConfig, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeroBannerProps {
  bannerConfig: BannerConfig;
  onOpenDrugGuide: () => void;
  onOpenConsult?: () => void;
  onOpenDueEvaluation?: () => void;
  language?: Language;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  bannerConfig,
  onOpenDrugGuide,
  onOpenConsult,
  onOpenDueEvaluation,
  language = 'th',
}) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  const getDirectImageUrl = (url?: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1920&q=80';
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
    }
    return url;
  };

  const bannerImageUrl = getDirectImageUrl(bannerConfig.backgroundImageUrl);

  // Parse multi-line or numbered mission items
  const parseMissions = (text: string) => {
    if (!text) return [];
    const lines = text
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.toLowerCase().startsWith('พันธกิจ'));
    return lines.map(l => l.replace(/^\d+[\.\)]\s*/, ''));
  };

  const missions = parseMissions(bannerConfig.vision);

  return (
    <section 
      className="relative overflow-hidden rounded-3xl text-white shadow-xl my-4 sm:my-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.75)), url('${bannerImageUrl}')`
      }}
    >
      <div className="relative max-w-5xl mx-auto px-6 py-10 sm:py-14 md:py-16 text-center">
        {/* Hospital Branding Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm font-semibold mb-5 backdrop-blur-md shadow-sm">
          <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{isEn ? t.badgeText : (bannerConfig.badgeText || 'VACHIRA PHUKET HOSPITAL PHARMACY')}</span>
        </div>

        {/* Hero Headings */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight drop-shadow-md">
          {isEn ? t.headline : bannerConfig.headline}
        </h1>

        {/* ข้อความพาดหัวรอง / เข็มมุ่ง (แสดงผล 2 บรรทัดแยกเป็นบล็อกชัดเจน 100%) */}
        {(bannerConfig.subheadline || bannerConfig.subheadline2) && (
          <div className="inline-block mx-auto mb-6 px-6 py-4 rounded-2xl bg-emerald-950/85 border border-emerald-400/40 shadow-xl backdrop-blur-md max-w-2xl">
            {(() => {
              let line1 = (bannerConfig.subheadline || '').trim();
              let line2 = (bannerConfig.subheadline2 || '').trim();

              if (!line2) {
                // แปลงทั้ง \n จริง, \\n (ตัวอักษรแบ็กสแลชเอ็น), และ <br> ให้เป็นบรรทัดใหม่
                const normalized = line1
                  .replace(/\\n/g, '\n')
                  .replace(/<br\s*\/?>/gi, '\n');

                if (normalized.includes('\n')) {
                  const parts = normalized.split('\n').filter(p => p.trim().length > 0);
                  line1 = parts[0]?.trim() || '';
                  line2 = parts.slice(1).map(p => p.trim()).join(' ').trim();
                } else if (/3P\s*safety/i.test(normalized)) {
                  const match = normalized.match(/3P\s*safety/i);
                  if (match && match.index !== undefined && match.index > 0) {
                    line1 = normalized.slice(0, match.index).trim();
                    line2 = normalized.slice(match.index).trim();
                  }
                }
              }

              const cleanLine1 = line1.replace(/^(?:[0-9]+|[๑-๙]+)[\s.)\-–—]+\s*/, '').trim();
              const cleanLine2 = line2.replace(/^(?:[0-9]+|[๑-๙]+)[\s.)\-–—]+\s*/, '').trim();

              return (
                <div className="space-y-1.5 text-center">
                  <div className="text-white font-bold text-sm sm:text-base md:text-lg leading-snug drop-shadow-sm tracking-wide">
                    {cleanLine1}
                  </div>
                  {cleanLine2 && (
                    <div className="text-emerald-300 font-semibold text-xs sm:text-sm md:text-base leading-snug drop-shadow-sm">
                      {cleanLine2}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* พันธกิจ (Mission) Card */}
        {missions.length > 0 ? (
          <div className="max-w-2xl mx-auto mb-8 p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-emerald-500/30 text-left text-slate-100 shadow-xl">
            <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm sm:text-base mb-3 pb-2 border-b border-white/10">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>พันธกิจ (Mission)</span>
            </div>
            <ol className="space-y-2.5 text-xs sm:text-sm text-slate-100 font-normal leading-relaxed">
              {missions.map((mission, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-400/40 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{mission}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-2 mb-8">
            <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
              {bannerConfig.vision}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            id="hero-btn-drug-info"
            onClick={onOpenDrugGuide}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Pill className="w-5 h-5" />
            <span>{isEn ? t.primaryButtonText : bannerConfig.primaryButtonText}</span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          {onOpenConsult && (
            <button
              onClick={onOpenConsult}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>{isEn ? t.secondaryButtonText : bannerConfig.secondaryButtonText}</span>
            </button>
          )}

          {onOpenDueEvaluation && (
            <button
              id="hero-btn-due-eval"
              onClick={onOpenDueEvaluation}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-emerald-100 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-400/30 backdrop-blur-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4 text-emerald-300" />
              <span>ประเมินความเหมาะสมการใช้ยา (DUE)</span>
            </button>
          )}
        </div>

        {/* Key Hospital Highlights */}
        <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.highlight24h}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.highlightKiosk}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.highlightRider}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.highlightClinics}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

