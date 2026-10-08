import React, { useState } from 'react';
import { StepInfographic } from '../types';
import { Layers, Maximize2, X, CheckCircle, Info } from 'lucide-react';

interface DispensingStepsProps {
  infographics: StepInfographic[];
}

export const DispensingSteps: React.FC<DispensingStepsProps> = ({ infographics }) => {
  const [selectedInfographic, setSelectedInfographic] = useState<StepInfographic | null>(null);

  return (
    <section className="my-10" id="section-dispensing-steps">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>กระบวนการบริการจ่ายยา</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ขั้นตอนการรับยา
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-3 mb-3 rounded-full" />
        <p className="text-sm text-slate-600">
          ขั้นตอนมาตรฐานในการรับยา เพื่อความปลอดภัย ถูกต้อง และลดระยะเวลารอคอยของผู้รับบริการ
        </p>
      </div>

      {/* 3 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {infographics.map((item, idx) => (
          <div
            key={item.id}
            id={`dispensing-step-${item.id}`}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            {/* Card Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  ช่องทางที่ {idx + 1}
                </span>
                <span className="text-[11px] text-slate-400">กลุ่มงานเภสัชกรรม</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
            </div>

            {/* Infographic Image Box */}
            <div className="relative bg-slate-100 overflow-hidden aspect-16/10 cursor-pointer" onClick={() => setSelectedInfographic(item)}>
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-800 text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>คลิกเพื่อดูภาพขยาย</span>
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-slate-900/70 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                Infographic
              </div>
            </div>

            {/* Steps Sequence List */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-3">
                  {item.description}
                </p>

                <div className="space-y-2">
                  {item.steps.map((step, sIndex) => (
                    <div
                      key={sIndex}
                      className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Info className="w-3 h-3 text-emerald-600" />
                  <span>ข้อมูลปรับปรุงล่าสุดโดยเจ้าหน้าที่</span>
                </span>
                <button
                  onClick={() => setSelectedInfographic(item)}
                  className="text-emerald-700 font-medium hover:underline flex items-center gap-1"
                >
                  ดูผังแบบเต็ม
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal Preview */}
      {selectedInfographic && (
        <div
          id="infographic-modal"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedInfographic(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  {selectedInfographic.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedInfographic.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedInfographic(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="ปิด"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={selectedInfographic.imageUrl}
                  alt={selectedInfographic.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[60vh] object-contain mx-auto"
                />
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 text-sm mb-2">
                  สรุปรายละเอียดขั้นตอน:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedInfographic.steps.map((st, idx) => (
                    <div key={idx} className="text-xs text-emerald-950 flex items-start gap-1.5">
                      <span className="font-bold text-emerald-700">•</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedInfographic(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
