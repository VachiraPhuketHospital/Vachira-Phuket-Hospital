import React from 'react';
import { DrugItem, NewsItem, KnowledgeArticle } from '../types';
import { X, Pill, BookOpen, Newspaper, Calendar, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

interface DrugDetailModalProps {
  drug: DrugItem | null;
  onClose: () => void;
}

export const DrugDetailModal: React.FC<DrugDetailModalProps> = ({ drug, onClose }) => {
  if (!drug) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
              💊
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">{drug.genericName}</h3>
              <p className="text-xs text-emerald-200">ชื่อการค้า: {drug.tradeName} • หมวดหมู่: {drug.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-emerald-200 hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block mb-0.5">รูปแบบยา</span>
              <span className="font-semibold text-slate-800">{drug.dosageForm}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">ขนาดความแรง</span>
              <span className="font-semibold text-slate-800">{drug.strength}</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">สรรพคุณ / ข้อบ่งใช้</h4>
            <p className="text-slate-600 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              {drug.indications}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">วิธีใช้ยาและขนาดยาที่แนะนำ</h4>
            <p className="text-slate-600 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-200">
              {drug.usageInstructions}
            </p>
          </div>

          {drug.precautions && (
            <div>
              <h4 className="font-bold text-amber-800 mb-1">คำเตือนและข้อควรระวัง</h4>
              <p className="text-amber-900 leading-relaxed p-3 bg-amber-50 rounded-xl border border-amber-200">
                {drug.precautions}
              </p>
            </div>
          )}

          {drug.contraindications && (
            <div>
              <h4 className="font-bold text-red-800 mb-1">ข้อห้ามใช้</h4>
              <p className="text-red-900 leading-relaxed p-3 bg-red-50 rounded-xl border border-red-200">
                {drug.contraindications}
              </p>
            </div>
          )}

          {drug.storage && (
            <div>
              <h4 className="font-bold text-slate-800 mb-1">การเก็บรักษา</h4>
              <p className="text-slate-600 p-2.5 bg-slate-50 rounded-lg">
                {drug.storage}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ArticleDetailModalProps {
  article: KnowledgeArticle | null;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-indigo-900 text-white">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{article.icon}</span>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-700/70 text-indigo-200">
                {article.category}
              </span>
              <h3 className="font-bold text-base mt-1">{article.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-indigo-200 hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="flex items-center gap-4 text-slate-400 text-[11px] pb-3 border-b border-slate-100">
            <span>ผู้เขียน: {article.author}</span>
            <span>วันที่: {article.date}</span>
            <span>เวลาอ่าน: {article.readTime}</span>
          </div>

          <div className="text-sm font-semibold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {article.summary}
          </div>

          <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {article.content}
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-xs">
            <strong>หมายเหตุ:</strong> ข้อมูลนี้จัดทำขึ้นเพื่อการศึกษาและการดูแลสุขภาพเบื้องต้น ไม่สามารถทดแทนการวินิจฉัยหรือสั่งยาโดยแพทย์ หากมีข้อสงสัยโปรดปรึกษาแพทย์หรือเภสัชกรประจำโรงพยาบาลวชิระภูเก็ต
          </div>
        </div>
      </div>
    </div>
  );
};

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, onClose }) => {
  if (!news) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-blue-900 text-white">
          <span className="font-bold text-sm">ข่าวสารกลุ่มงานเภสัชกรรม</span>
          <button onClick={onClose} className="p-1.5 rounded-lg text-blue-200 hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="aspect-16/9 bg-slate-100 w-full overflow-hidden">
            <img src={news.imageUrl} alt={news.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>

          <div className="p-6 space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">{news.category}</span>
              <span className="text-slate-400">{news.date}</span>
            </div>

            <h3 className="font-bold text-lg text-slate-900">{news.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{news.summary}</p>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line pt-2">{news.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
