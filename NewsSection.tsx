import React, { useState } from 'react';
import { NewsItem } from '../types';
import { Newspaper, Calendar, Eye, ArrowRight, X, Tag } from 'lucide-react';

interface NewsSectionProps {
  news: NewsItem[];
  onViewAllNews?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news, onViewAllNews }) => {
  const [activeNews, setActiveNews] = useState<NewsItem | null>(null);
  const publishedNews = news.filter((item) => item.published !== false);

  return (
    <section className="my-10" id="section-news">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Newspaper className="w-4 h-4" />
            <span>ประชาสัมพันธ์ & อัปเดต</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ข่าวสารและกิจกรรมกลุ่มงานเภสัชกรรม
          </h2>
        </div>
        {onViewAllNews && (
          <button
            id="view-all-news-btn"
            onClick={onViewAllNews}
            className="mt-2 sm:mt-0 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 group"
          >
            <span>ดูข่าวสารทั้งหมด ({publishedNews.length})</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {publishedNews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
          ยังไม่มีรายการข่าวสารหรือกิจกรรมในขณะนี้
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedNews.slice(0, 6).map((item) => (
            <article
              key={item.id}
              id={`news-card-${item.id}`}
              onClick={() => setActiveNews(item)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col group hover:-translate-y-0.5"
            >
              <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-900/80 text-emerald-200 backdrop-blur-xs">
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {item.views.toLocaleString()} อ่าน
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>อ่านรายละเอียดข่าว</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* News Full Modal */}
      {activeNews && (
        <div
          id="news-detail-modal"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveNews(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/9 bg-slate-900">
              <img
                src={activeNews.imageUrl}
                alt={activeNews.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90"
              />
              <button
                onClick={() => setActiveNews(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors"
                aria-label="ปิด"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                  {activeNews.category}
                </span>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  {activeNews.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  {activeNews.views.toLocaleString()} ผู้เข้าชม
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {activeNews.title}
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100 font-normal">
                {activeNews.content || activeNews.summary}
              </p>

              <div className="pt-2 text-xs text-slate-500">
                ที่มา: กลุ่มงานเภสัชกรรม โรงพยาบาลวชิระภูเก็ต
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setActiveNews(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
