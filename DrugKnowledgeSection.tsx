import React, { useState } from 'react';
import { KnowledgeArticle } from '../types';
import { BookOpen, ArrowRight, X, Clock, UserCheck } from 'lucide-react';

interface DrugKnowledgeSectionProps {
  articles: KnowledgeArticle[];
  onViewAll?: () => void;
}

export const DrugKnowledgeSection: React.FC<DrugKnowledgeSectionProps> = ({
  articles,
  onViewAll,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  return (
    <section className="my-10" id="section-drug-knowledge">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>คลังความรู้สำหรับประชาชน</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>📚 ความรู้เรื่องยา</span>
          </h2>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="mt-2 sm:mt-0 text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center group"
          >
            <span>บทความทั้งหมด</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            id={`knowledge-card-${article.id}`}
            onClick={() => setSelectedArticle(article)}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
          >
            <div>
              {/* Card Icon */}
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
                {article.icon}
              </div>

              {/* Category Badge */}
              <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-0.5 rounded-full mb-2">
                {article.category}
              </span>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                {article.title}
              </h3>

              {/* Short summary */}
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* Bottom button / action */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span className="flex items-center gap-1 text-slate-400 font-normal">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                อ่านเพิ่มเติม →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedArticle && (
        <div
          id="knowledge-detail-modal"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-2xl shadow-xs">
                  {selectedArticle.icon}
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                    {selectedArticle.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {selectedArticle.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="ปิด"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  โดย: {selectedArticle.author}
                </span>
                <span>{selectedArticle.date}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium text-slate-800">
                💡 สรุปใจความสำคัญ: {selectedArticle.summary}
              </div>

              <div className="space-y-3 whitespace-pre-line text-slate-700">
                {selectedArticle.content}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <span>⚠️</span>
                <span>
                  ข้อแนะนำ: หากมีอาการผิดปกติจากการใช้ยา หรือมีข้อสงสัยเกี่ยวกับยาประจำตัว กรุณานำยาทั้งหมดมาปรึกษาเภสัชกรที่โรงพยาบาลวชิระภูเก็ต
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                เข้าใจแล้ว / ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
