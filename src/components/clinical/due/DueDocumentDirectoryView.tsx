import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  FolderOpen,
  ExternalLink,
  ChevronRight,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import {
  DUE_DOCUMENT_DIRECTORY_DATA,
  DUE_GOOGLE_DRIVE_MAIN_URL,
  getDuePlainText,
  DueMainTopic,
  DueListItem
} from '../../../data/dueContentConfig';

interface DueDocumentDirectoryViewProps {
  onSelectTopic?: (topicId: string) => void;
}

export const DueDocumentDirectoryView: React.FC<DueDocumentDirectoryViewProps> = ({
  onSelectTopic
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyText = async () => {
    try {
      const text = getDuePlainText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API not available
      const textArea = document.createElement('textarea');
      textArea.value = getDuePlainText();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Helper render item
  const renderListItem = (item: DueListItem, key: string | number) => {
    if (item.docLink) {
      const link = item.docLink;
      const targetUrl = link.url || DUE_GOOGLE_DRIVE_MAIN_URL;
      return (
        <li key={key} className="flex items-start gap-2.5 leading-relaxed text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
          <span className="text-sm">
            {link.prefixText && <span>{link.prefixText}</span>}
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline text-fuchsia-600 hover:text-fuchsia-800 underline decoration-fuchsia-400 underline-offset-4 font-medium transition-colors group cursor-pointer"
              title="เปิดลิงก์เอกสาร"
            >
              <span>{link.docCode}</span>
              <ExternalLink className="w-3 h-3 ml-1 inline text-fuchsia-400 group-hover:text-fuchsia-600" />
            </a>
            {link.suffixText && <span>{link.suffixText}</span>}
          </span>
        </li>
      );
    }

    return (
      <li key={key} className="flex items-start gap-2.5 leading-relaxed text-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
        <span className="text-sm">{item.text}</span>
      </li>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-7 font-sans">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>หมวดเอกสารและรายการยา</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {DUE_DOCUMENT_DIRECTORY_DATA.pageTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            สามารถแก้ไขข้อความ รหัสเอกสาร และลิงก์ได้โดยตรงที่ไฟล์{' '}
            <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">
              src/data/dueContentConfig.ts
            </code>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shadow-xs ${
              copied
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>คัดลอกสำเร็จ!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>คัดลอกข้อความ</span>
              </>
            )}
          </button>

          <a
            href={DUE_GOOGLE_DRIVE_MAIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
          >
            <FolderOpen className="w-4 h-4" />
            <span>คลัง Google Drive</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Topics 1 to 6 List */}
      <div className="space-y-6">
        {DUE_DOCUMENT_DIRECTORY_DATA.topics.map((topic: DueMainTopic) => (
          <div
            key={topic.id}
            className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-5 sm:p-6 transition-all hover:bg-white hover:shadow-xs hover:border-slate-300"
          >
            {/* Topic Header */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                  {topic.number}
                </span>
                <span>{topic.title}</span>
              </h3>

              {onSelectTopic && (
                <button
                  type="button"
                  onClick={() => onSelectTopic(topic.id)}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <span>ดูรายละเอียด</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Direct items (if any, like Albumin) */}
            {topic.items && topic.items.length > 0 && (
              <ul className="ml-2 sm:ml-4 space-y-1.5 mt-2">
                {topic.items.map((it, idx) => renderListItem(it, idx))}
              </ul>
            )}

            {/* Subgroups (like NOAC 2.1 and 2.2) */}
            {topic.subGroups && topic.subGroups.length > 0 && (
              <div className="space-y-4 mt-3 ml-1 sm:ml-4">
                {topic.subGroups.map((sg, sgIdx) => (
                  <div key={sgIdx} className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{sg.subTitle}</span>
                    </h4>

                    {sg.items && sg.items.length > 0 && (
                      <ul className="ml-4 space-y-1.5">
                        {sg.items.map((it, idx) => renderListItem(it, `sg-${sgIdx}-${idx}`))}
                      </ul>
                    )}

                    {sg.subSections && sg.subSections.length > 0 && (
                      <div className="space-y-3 ml-4 mt-2">
                        {sg.subSections.map((sec, secIdx) => (
                          <div key={secIdx} className="space-y-1.5">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              {sec.header}
                            </p>
                            <ul className="ml-3 space-y-1">
                              {sec.items.map((it, idx) =>
                                renderListItem(it, `sec-${sgIdx}-${secIdx}-${idx}`)
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default DueDocumentDirectoryView;
