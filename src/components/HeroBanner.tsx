import React from 'react';
import { Pill, HeartPulse, ChevronRight, CheckCircle2 } from 'lucide-react';
import { BannerConfig, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeroBannerProps {
  bannerConfig: BannerConfig;
  onOpenDrugGuide: () => void;
  onOpenConsult?: () => void;
  language?: Language;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  bannerConfig,
  onOpenDrugGuide,
  language = 'th',
}) => {
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  const bannerImageUrl = bannerConfig.backgroundImageUrl || 
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1920&q=80';

  return (
    <section 
      className="relative overflow-hidden rounded-3xl text-white shadow-xl my-4 sm:my-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(6, 78, 59, 0.85), rgba(15, 23, 42, 0.90)), url('${bannerImageUrl}')`
      }}
    >
      {/* Background Decorative Healthcare Elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-12 sm:py-16 md:py-20 text-center">
        {/* Hospital Branding Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
          <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{isEn ? t.badgeText : bannerConfig.badgeText}</span>
        </div>

        {/* Hero Headings */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-2 leading-tight drop-shadow-sm">
          {isEn ? t.headline : bannerConfig.headline}
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-300 tracking-tight mb-6 drop-shadow-sm">
          {isEn ? t.subheadline : bannerConfig.subheadline}
        </h2>

        {/* Department & Vision text */}
        <div className="max-w-2xl mx-auto space-y-2 mb-8">
          <p className="text-base sm:text-lg font-medium text-slate-100">
            {isEn ? t.hospitalName : bannerConfig.hospitalName}
          </p>
          <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
            {isEn ? 'Delivering patient-centered, evidence-based medication safety and hospital clinical excellence.' : bannerConfig.vision}
          </p>
        </div>

        {/* Action Button: [ข้อมูลการใช้ยา] */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            id="hero-btn-drug-info"
            onClick={onOpenDrugGuide}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Pill className="w-5 h-5" />
            <span>{isEn ? t.primaryButtonText : bannerConfig.primaryButtonText}</span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>
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


