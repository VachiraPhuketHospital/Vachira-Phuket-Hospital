import React, { useState } from "react";
import {
  FileText,
  Copy,
  Check,
  FolderOpen,
  ExternalLink,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Sparkles,
  Link as LinkIcon
} from "lucide-react";
import {
  DUE_DOCUMENT_DIRECTORY_DATA,
  DUE_GOOGLE_DRIVE_MAIN_URL,
  getDuePlainText,
  DueMainTopic,
  DueListItem
} from "../../../data/dueContentConfig";

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
      const textArea = document.createElement("textarea");
      textArea.value = getDuePlainText();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

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
              className="inline-flex items-center gap-1 text-fuchsia-600 hover:text-fuchsia-800 underline decoration-fuchsia-400 underline-offset-4 font-semibold transition-colors group cursor-pointer bg-fuchsia-50/60 hover:bg-fuchsia-100/80 px-1.5 py-0.5 rounded"
              title="เปิดดูเอกสารนี้ใน Google Drive"
            >
              <span>{link.docCode}</span>
              <ExternalLink className="w-3 h-3 inline text-fuchsia-500 group-hover:text-fuchsia-700 shrink-0" />
            </a>
            {link.suffixText && <span>{link.suffixText}</span>}
          </span>
        </li>
      );
    }

    if (item.url) {
      return (
        <li key={key} className="flex items-start gap-2.5 leading-relaxed text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
          <span className="text-sm">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-800 hover:text-emerald-700 hover:underline transition-colors cursor-pointer"
              title="เปิดลิงก์ Google Drive"
            >
              <span>{item.text}</span>
              <ExternalLink className="w-3 h-3 inline text-emerald-600 shrink-0" />
            </a>
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
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
              <FolderOpen className="w-3 h-3 text-blue-600" />
              เชื่อมโยง Google Drive แล้ว
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {DUE_DOCUMENT_DIRECTORY_DATA.pageTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            สามารถใส่หรือเปลี่ยนลิงก์ Google Drive (โฟลเดอร์หรือไฟล์เฉพาะ) ได้ที่ไฟล์{" "}
            <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">
              src/data/dueContentConfig.ts
            </code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shadow-xs ${
              copied
                ? "bg-emerald-500 text-white border-emerald-600"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
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
            title="เปิดโฟลเดอร์ Google Drive รวมเอกสาร DUE ทั้งหมด"
          >
            <FolderOpen className="w-4 h-4" />
            <span>คลัง Google Drive ทั้งหมด</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Topics 1 to 6 List */}
      <div className="space-y-6">
        {DUE_DOCUMENT_DIRECTORY_DATA.topics.map((topic: DueMainTopic) => {
          const driveUrl = topic.googleDriveUrl || DUE_GOOGLE_DRIVE_MAIN_URL;

          return (
            <div
              key={topic.id}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-5 sm:p-6 transition-all hover:bg-white hover:shadow-xs hover:border-slate-300"
            >
              {/* Topic Header with Drive Link & View Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {topic.number}
                  </span>
                  <span>{topic.title}</span>
                </h3>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  {/* Google Drive Link per Topic */}
                  {driveUrl && (
                    <a
                      href={driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200/70 transition-colors"
                      title={`เปิดโฟลเดอร์ Google Drive ของหัวข้อนี้: ${topic.title}`}
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Google Drive หมวดนี้</span>
                      <ExternalLink className="w-3 h-3 text-blue-500 opacity-80" />
                    </a>
                  )}

                  {/* View Details Button */}
                  {onSelectTopic && (
                    <button
                      type="button"
                      onClick={() => onSelectTopic(topic.id)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 transition-colors border border-emerald-200/60"
                    >
                      <span>ดูรายละเอียด</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
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
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{sg.subTitle}</span>
                        </h4>
                        {sg.googleDriveUrl && sg.googleDriveUrl !== topic.googleDriveUrl && (
                          <a
                            href={sg.googleDriveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            <FolderOpen className="w-3 h-3" />
                            <span>Drive ย่อย</span>
                          </a>
                        )}
                      </div>

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
          );
        })}
      </div>
    </div>
  );
};

export default DueDocumentDirectoryView;
