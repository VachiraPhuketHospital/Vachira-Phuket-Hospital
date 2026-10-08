import React, { useState } from 'react';
import { DrugItem } from '../types';
import { Search, X, Pill, AlertCircle, Info, ShieldAlert, Check } from 'lucide-react';

interface DrugSearchModalProps {
  drugs: DrugItem[];
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const DrugSearchModal: React.FC<DrugSearchModalProps> = ({
  drugs,
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDrug, setSelectedDrug] = useState<DrugItem | null>(null);

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(drugs.map((d) => d.category)))];

  const filteredDrugs = drugs.filter((drug) => {
    const matchesSearch =
      drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.indications.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || drug.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div
      id="drug-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                ค้นหาข้อมูลยา & วิธีใช้ยา
              </h3>
              <p className="text-xs text-slate-500">
                ฐานข้อมูลยา กลุ่มงานเภสัชกรรม โรงพยาบาลวชิระภูเก็ต
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Filter */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="drug-search-input"
              type="text"
              placeholder="พิมพ์ชื่อยาสามัญ, ชื่อการค้า, หรืออาการ เช่น Paracetamol, เบาหวาน, ความดัน, ยาแก้ปวด..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-slate-50/50"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categories Pill Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-slate-400 shrink-0 mr-1">หมวดหมู่:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white font-medium shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'ทั้งหมด' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Body: List + Detail Split View */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 min-h-[300px]">
          {/* Left Column: Drug Results List */}
          <div className="md:col-span-5 p-3 space-y-2 overflow-y-auto max-h-[60vh]">
            <div className="text-xs text-slate-400 px-1 pb-1 font-medium">
              พบ {filteredDrugs.length} รายการ
            </div>

            {filteredDrugs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Pill className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                <p className="text-sm font-medium">ไม่พบข้อมูลยาที่ค้นหา</p>
                <p className="text-xs text-slate-500 mt-1">
                  ลองค้นหาด้วยคำอื่น หรือสอบถามเภสัชกรโดยตรง
                </p>
              </div>
            ) : (
              filteredDrugs.map((drug) => {
                const isSelected = selectedDrug?.id === drug.id;
                return (
                  <div
                    key={drug.id}
                    onClick={() => setSelectedDrug(drug)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {drug.genericName}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium shrink-0">
                        {drug.strength}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      ชื่อการค้า: {drug.tradeName}
                    </div>

                    <div className="text-xs text-emerald-700 font-medium mt-1">
                      {drug.category}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                      สรรพคุณ: {drug.indications}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Drug Monograph */}
          <div className="md:col-span-7 p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
            {selectedDrug ? (
              <div className="space-y-4 text-sm">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      ยาในบัญชียา รพ.วชิระภูเก็ต
                    </span>
                    <span className="text-xs text-slate-500">{selectedDrug.dosageForm}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    {selectedDrug.genericName} ({selectedDrug.strength})
                  </h2>
                  <p className="text-xs text-slate-500">
                    ชื่อการค้าที่เป็นที่รู้จัก: <span className="text-slate-700 font-medium">{selectedDrug.tradeName}</span>
                  </p>
                </div>

                {/* สรรพคุณ */}
                <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-900 text-xs uppercase flex items-center gap-1.5 mb-1">
                    <Info className="w-3.5 h-3.5 text-emerald-700" />
                    <span>สรรพคุณ / ข้อบ่งใช้:</span>
                  </h4>
                  <p className="text-slate-800 text-xs leading-relaxed">
                    {selectedDrug.indications}
                  </p>
                </div>

                {/* วิธีใช้ยา */}
                <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 text-xs uppercase flex items-center gap-1.5 mb-1">
                    <Check className="w-3.5 h-3.5 text-blue-700" />
                    <span>วิธีใช้และขนาดยาที่แนะนำ:</span>
                  </h4>
                  <p className="text-slate-800 text-xs leading-relaxed">
                    {selectedDrug.usageInstructions}
                  </p>
                </div>

                {/* คำเตือนและข้อควรระวัง */}
                <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-900 text-xs uppercase flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>คำเตือน & ข้อควรระวัง:</span>
                  </h4>
                  <p className="text-slate-800 text-xs leading-relaxed">
                    {selectedDrug.precautions}
                  </p>
                </div>

                {/* ข้อห้ามใช้ */}
                {selectedDrug.contraindications && (
                  <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200">
                    <h4 className="font-bold text-rose-900 text-xs uppercase flex items-center gap-1.5 mb-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                      <span>ข้อห้ามใช้ (ห้ามรับประทานเด็ดขาด):</span>
                    </h4>
                    <p className="text-rose-900 text-xs leading-relaxed font-medium">
                      {selectedDrug.contraindications}
                    </p>
                  </div>
                )}

                {/* ปฏิกิริยาระหว่างยา & การเก็บรักษา */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">⚡ ปฏิกิริยาระหว่างยา:</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {selectedDrug.interactions}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">❄️ การเก็บรักษา:</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {selectedDrug.storage}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Pill className="w-12 h-12 text-slate-300 mb-2 stroke-1" />
                <p className="font-medium text-slate-600">เลือกรายการยาทางด้านซ้าย</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  เพื่อดูรายละเอียดวิธีใช้ยา คำเตือน และปฏิกิริยาระหว่างยาฉบับเต็ม
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>* ข้อมูลนี้ใช้เป็นคำแนะนำเบื้องต้น การใช้ยาควรอยู่ภายใต้คำสั่งแพทย์หรือคำแนะนำของเภสัชกร</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
