import React, { useState, useRef } from 'react';
import { DocumentDownload } from '../../types';
import {
  FileText,
  UploadCloud,
  Link as LinkIcon,
  Search,
  Trash2,
  Edit3,
  Download,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  Plus,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Copy,
  Check,
  HelpCircle,
  Info,
  Sparkles,
  Share2,
} from 'lucide-react';
import { formatBytes, getFileTypeBadge, downloadDocumentFile } from '../../utils/fileHelpers';

interface AdminDocumentManagerProps {
  documents: DocumentDownload[];
  onUpdateDocuments: (docs: DocumentDownload[]) => void;
}

const CATEGORIES = [
  'บริการผู้ป่วย',
  'คู่มือการใช้ยา',
  'โครงการลดความแออัด',
  'สำหรับบุคลากรทางการแพทย์',
  'แบบฟอร์มขอประวัติยา',
  'ระเบียบปฏิบัติและมาตรฐาน',
];

export const AdminDocumentManager: React.FC<AdminDocumentManagerProps> = ({
  documents,
  onUpdateDocuments,
}) => {
  // Modal / Form state
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentDownload | null>(null);
  const [uploadMode, setUploadMode] = useState<'upload' | 'link'>('upload');

  // New Document fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('บริการผู้ป่วย');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  // Selected file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState<string>('');
  const [fileTypeStr, setFileTypeStr] = useState<string>('PDF');
  const [isDragging, setIsDragging] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ทั้งหมด');

  // Success Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<DocumentDownload | null>(null);

  const [isSyncGuideOpen, setIsSyncGuideOpen] = useState(false);
  const [copiedCodeSuccess, setCopiedCodeSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const generateInitialDataCode = () => {
    // Sanitize documents for clean initialData.ts format
    const cleanDocs = documents.map(d => ({
      id: d.id,
      title: d.title,
      description: d.description || '',
      category: d.category,
      fileSize: d.fileSize,
      fileType: d.fileType,
      downloads: d.downloads || 0,
      date: d.date,
      url: d.url,
      fileName: d.fileName,
      isExternalLink: d.isExternalLink,
    }));
    return `export const INITIAL_DOCUMENTS: DocumentDownload[] = ${JSON.stringify(cleanDocs, null, 2)};`;
  };

  const handleCopyCodeForGithub = () => {
    const code = generateInitialDataCode();
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCodeSuccess(true);
      showToast('คัดลอกโค้ด INITIAL_DOCUMENTS เรียบร้อยแล้ว!');
      setTimeout(() => setCopiedCodeSuccess(false), 3000);
    }).catch(() => {
      showToast('ไม่สามารถคัดลอกอัตโนมัติได้ โปรดคัดลอกด้วยตนเองจากหน้าต่าง');
    });
  };

  // Helper to format today's Thai date
  const getTodayThaiDate = () => {
    const months = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
    ];
    const now = new Date();
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  // Handle File Selection
  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    const sizeFormatted = formatBytes(file.size);
    setFileSizeStr(sizeFormatted);

    // Extract extension
    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
    setFileTypeStr(ext);

    // Auto set title if empty
    if (!title.trim()) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setTitle(nameWithoutExt);
    }

    // Convert file to Base64 data URL
    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Save new document
  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('กรุณาระบุชื่อเอกสารหรือแบบฟอร์ม');
      return;
    }

    if (uploadMode === 'upload' && !selectedFile && !fileBase64) {
      showToast('กรุณาเลือกไฟล์เอกสารที่ต้องการอัปโหลด');
      return;
    }

    if (uploadMode === 'link' && !externalUrl.trim()) {
      showToast('กรุณากรอกลิงก์ดาวน์โหลดเอกสาร');
      return;
    }

    const finalCategory = category === 'อื่นๆ' && customCategory.trim() ? customCategory.trim() : category;

    const newDoc: DocumentDownload = {
      id: `doc_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category: finalCategory,
      fileSize: uploadMode === 'upload' ? fileSizeStr : 'ลิงก์ภายนอก',
      fileType: uploadMode === 'upload' ? fileTypeStr : 'LINK',
      downloads: 0,
      date: getTodayThaiDate(),
      url: uploadMode === 'link' ? externalUrl.trim() : '#',
      fileName: selectedFile?.name || `${title.trim()}.${fileTypeStr.toLowerCase()}`,
      fileData: uploadMode === 'upload' ? fileBase64 : undefined,
      isExternalLink: uploadMode === 'link',
    };

    const updated = [newDoc, ...documents];
    onUpdateDocuments(updated);
    showToast(`เพิ่มเอกสาร "${newDoc.title}" สำเร็จแล้ว`);
    resetForm();
    setIsAddFormOpen(false);
  };

  // Update existing document
  const handleUpdateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    const finalCategory = category === 'อื่นๆ' && customCategory.trim() ? customCategory.trim() : category;

    const updatedDoc: DocumentDownload = {
      ...editingDoc,
      title: title.trim(),
      description: description.trim(),
      category: finalCategory,
      // If a new file was uploaded during edit
      ...(selectedFile && fileBase64
        ? {
            fileName: selectedFile.name,
            fileData: fileBase64,
            fileSize: fileSizeStr,
            fileType: fileTypeStr,
            isExternalLink: false,
            url: '#',
          }
        : {}),
      ...(uploadMode === 'link' && externalUrl.trim()
        ? {
            url: externalUrl.trim(),
            fileSize: 'ลิงก์ภายนอก',
            fileType: 'LINK',
            isExternalLink: true,
          }
        : {}),
    };

    const updated = documents.map((d) => (d.id === editingDoc.id ? updatedDoc : d));
    onUpdateDocuments(updated);
    showToast(`อัปเดตเอกสาร "${updatedDoc.title}" เรียบร้อยแล้ว`);
    resetForm();
    setEditingDoc(null);
  };

  // Open edit modal
  const openEditModal = (doc: DocumentDownload) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setDescription(doc.description || '');
    if (CATEGORIES.includes(doc.category)) {
      setCategory(doc.category);
      setCustomCategory('');
    } else {
      setCategory('อื่นๆ');
      setCustomCategory(doc.category);
    }
    setExternalUrl(doc.isExternalLink ? doc.url : '');
    setUploadMode(doc.isExternalLink ? 'link' : 'upload');
    setSelectedFile(null);
    setFileBase64(doc.fileData || '');
    setFileSizeStr(doc.fileSize);
    setFileTypeStr(doc.fileType);
  };

  // Delete document
  const handleDeleteDoc = (doc: DocumentDownload) => {
    setDeleteConfirmDoc(doc);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmDoc) return;
    const title = deleteConfirmDoc.title;
    const updated = documents.filter((d) => d.id !== deleteConfirmDoc.id);
    onUpdateDocuments(updated);
    showToast(`ลบเอกสาร "${title}" เรียบร้อย`);
    setDeleteConfirmDoc(null);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('บริการผู้ป่วย');
    setCustomCategory('');
    setExternalUrl('');
    setSelectedFile(null);
    setFileBase64('');
    setFileSizeStr('');
    setFileTypeStr('PDF');
    setUploadMode('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'ทั้งหมด' || doc.category === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalDownloads = documents.reduce((sum, d) => sum + (d.downloads || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-600 transition-all animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                จัดการเอกสารดาวน์โหลด & แบบฟอร์ม
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                อัปโหลดไฟล์แบบฟอร์ม คำขอรับบริการ คู่มือยา หรือแนบลิงก์ Google Drive สำหรับประชาชนและบุคลากร
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsSyncGuideOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-xs transition-colors"
            title="คลิกดูคำแนะนำ: วิธีทำให้เอกสารปรากฏในมือถือและเครื่องอื่น"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>วิธีทำให้มือถือเห็นเอกสาร</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCodeForGithub}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-xs transition-colors"
            title="คัดลอกโค้ดเอกสารทั้งหมด เพื่อนำไปใส่ในไฟล์ initialData.ts บน GitHub"
          >
            {copiedCodeSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">คัดลอกโค้ดแล้ว!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>คัดลอกโค้ดสำหรับ GitHub</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsAddFormOpen(!isAddFormOpen);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ อัปโหลดไฟล์ / เพิ่มแบบฟอร์ม</span>
          </button>
        </div>
      </div>

      {/* Info Notice: Why files might not appear on other devices */}
      <div className="bg-gradient-to-r from-amber-50 via-amber-50/70 to-emerald-50/40 p-4 rounded-2xl border border-amber-200 text-xs text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-amber-900 text-sm">
              💡 ทำไมเอกสารที่เพิ่มในคอม ถึงไม่ไปโผล่ในมือถือหรือเครื่องอื่น?
            </div>
            <p className="text-amber-800 text-xs mt-0.5">
              เว็บอยู่บน GitHub Pages ข้อมูลที่เพิ่มในหน้านี้จะเก็บในหน่วยความจำของคอมเครื่องนี้เท่านั้น หากต้องการให้มือถือและทุกคนเปิดดูได้:
              <span className="font-semibold text-amber-950 ml-1">
                แนะนำให้ใช้การ &ldquo;แนบด้วยลิงก์ Google Drive&rdquo; และกดปุ่ม &ldquo;คัดลอกโค้ดสำหรับ GitHub&rdquo; นำไปวางใน GitHub
              </span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsSyncGuideOpen(true)}
          className="shrink-0 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-end md:self-center"
        >
          <span>ดูขั้นตอนอย่างละเอียด</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-500 font-medium">เอกสารทั้งหมดในระบบ</div>
            <div className="text-xl font-black text-slate-900">{documents.length} รายการ</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-500 font-medium">ยอดดาวน์โหลดรวม</div>
            <div className="text-xl font-black text-blue-700">{totalDownloads.toLocaleString()} ครั้ง</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-500 font-medium">หมวดหมู่เอกสาร</div>
            <div className="text-xl font-black text-purple-700">{CATEGORIES.length} หมวดหมู่</div>
          </div>
        </div>
      </div>

      {/* Add / Upload Form (Accordion / Collapsible) */}
      {isAddFormOpen && (
        <form
          onSubmit={handleCreateDocument}
          className="bg-white p-6 rounded-2xl border-2 border-emerald-200 shadow-md space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-base text-slate-900">
                อัปโหลดไฟล์เอกสาร / แบบฟอร์มใหม่
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAddFormOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded-md"
            >
              ปิดหน้าต่าง ✕
            </button>
          </div>

          {/* Mode Selector: File Upload vs External Link */}
          <div className="flex rounded-xl bg-slate-100 p-1 w-fit text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUploadMode('upload')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                uploadMode === 'upload'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>อัปโหลดไฟล์จากเครื่อง (PDF / Word / Excel / ภาพ)</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('link')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                uploadMode === 'link'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>ใส่ลิงก์ดาวน์โหลด (Google Drive / OneDrive / Cloud)</span>
            </button>
          </div>

          {/* Upload Area or Link Input */}
          {uploadMode === 'upload' ? (
            <div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : selectedFile
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.zip"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-sm text-slate-800">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>ขนาด: {fileSizeStr}</span>
                      <span>ประเภท: {fileTypeStr}</span>
                      <span className="text-emerald-700 font-semibold">พร้อมอัปโหลด ✓</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-2 text-xs text-emerald-700 hover:underline font-semibold"
                    >
                      เปลี่ยนไฟล์อื่น
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-sm text-slate-700">
                      ลากไฟล์มาวางที่นี่ หรือ <span className="text-emerald-700">คลิกเพื่อเลือกไฟล์</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      รองรับไฟล์ PDF, Word (.docx), Excel (.xlsx), รูปภาพ (.png, .jpg)
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL ลิงก์ดาวน์โหลด (Google Drive / OneDrive / เว็บไซต์โรงพยาบาล) *
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/... หรือ https://vachiraphuket.go.th/docs/..."
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500 mt-1">
                <span>เคล็ดลับ: ตรวจสอบให้แน่ใจว่าได้เปิดสิทธิ์การเข้าถึงเป็น &quot;ทุกคนที่มีลิงก์มีสิทธิ์อ่าน&quot;</span>
                <button
                  type="button"
                  onClick={() => {
                    setExternalUrl('https://drive.google.com/drive/folders/1PZs5h3ADWSp-KEzNUTol4M_8qvBFyxpd?usp=sharing');
                    if (!title) setTitle('คลังเอกสารและรูปภาพ (Google Drive)');
                  }}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold underline inline-flex items-center gap-1"
                >
                  + ใส่ลิงก์ Google Drive (โฟลเดอร์ 11)
                </button>
              </div>
            </div>
          )}

          {/* Metadata Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                ชื่อเอกสาร / แบบฟอร์ม *
              </label>
              <input
                type="text"
                required
                placeholder="เช่น แบบฟอร์มขอรับบริการส่งยาทางไปรษณีย์ หรือ คู่มือการใช้ยาวาร์ฟาริน"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 border rounded-xl border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">หมวดหมู่เอกสาร</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 border rounded-xl border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="อื่นๆ">อื่นๆ (ระบุเอง)</option>
              </select>
            </div>

            {category === 'อื่นๆ' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">ระบุหมวดหมู่ใหม่</label>
                <input
                  type="text"
                  placeholder="เช่น เอกสารวิชาการเภสัชกรรม"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-xl border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                คำอธิบายย่อ / คำแนะนำการใช้งาน (ทางเลือก)
              </label>
              <textarea
                rows={2}
                placeholder="อธิบายว่าแบบฟอร์มนี้ใช้สำหรับขั้นตอนใด ใครเป็นผู้ใช้ หรือต้องแนบเอกสารอะไรบ้าง"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsAddFormOpen(false);
              }}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>บันทึกและเผยแพร่เอกสาร</span>
            </button>
          </div>
        </form>
      )}

      {/* Edit Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateDocument}
            className="bg-white max-w-xl w-full rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 text-xs animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-base text-slate-900">แก้ไขข้อมูลเอกสาร</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingDoc(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ชื่อเอกสาร / แบบฟอร์ม *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">หมวดหมู่</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="อื่นๆ">อื่นๆ (ระบุเอง)</option>
                </select>
              </div>

              {category === 'อื่นๆ' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ระบุหมวดหมู่</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">คำอธิบายย่อ</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl border-slate-300"
              />
            </div>

            {/* Replace File or URL */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block font-bold text-slate-800 mb-1.5">
                ไฟล์ปัจจุบัน: <span className="font-normal text-slate-600">{editingDoc.fileName || editingDoc.title} ({editingDoc.fileSize})</span>
              </label>

              {editingDoc.isExternalLink ? (
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">แก้ไข URL:</label>
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg border-slate-300 bg-white text-xs"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">เลือกไฟล์ใหม่เพื่อแทนที่ (ถ้าต้องการ):</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.zip"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                    className="w-full text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const docToDelete = editingDoc;
                  setEditingDoc(null);
                  setDeleteConfirmDoc(docToDelete);
                }}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors text-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>ลบเอกสารนี้ออกจากระบบ</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="ค้นหาชื่อเอกสาร หรือหมวดหมู่..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-xl border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="text-xs text-slate-500 self-start sm:self-center">
            พบ {filteredDocs.length} จาก {documents.length} เอกสาร
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategoryFilter('ทั้งหมด')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors ${
              selectedCategoryFilter === 'ทั้งหมด'
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทั้งหมด
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors ${
                selectedCategoryFilter === cat
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <div className="font-bold text-slate-600 text-sm">ไม่พบเอกสารที่ค้นหา</div>
            <p className="mt-1 text-slate-400">
              ลองเปลี่ยนคำค้นหา หรือกดปุ่ม &quot;+ อัปโหลดไฟล์ / เพิ่มแบบฟอร์ม&quot; ด้านบน
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">ชนิด</th>
                  <th className="py-3 px-4">ชื่อเอกสาร & รายละเอียด</th>
                  <th className="py-3 px-4">หมวดหมู่</th>
                  <th className="py-3 px-4">ขนาดไฟล์</th>
                  <th className="py-3 px-4">วันที่เผยแพร่</th>
                  <th className="py-3 px-4 text-center">ดาวน์โหลด</th>
                  <th className="py-3 px-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => {
                  const style = getFileTypeBadge(doc.fileType);
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Type Badge */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${style.badge}`}
                        >
                          {doc.fileType}
                        </span>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{doc.title}</div>
                        {doc.description && (
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {doc.description}
                          </div>
                        )}
                        {doc.fileName && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            ไฟล์: {doc.fileName}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {doc.category}
                        </span>
                      </td>

                      {/* File Size */}
                      <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                        {doc.fileSize}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {doc.date}
                      </td>

                      {/* Downloads */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[11px]">
                          {doc.downloads.toLocaleString()} ครั้ง
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          {/* Test Download / View */}
                          <button
                            title="ทดสอบดาวน์โหลดไฟล์"
                            onClick={() => downloadDocumentFile(doc)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            title="แก้ไขเอกสาร"
                            onClick={() => openEditModal(doc)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            title="ลบเอกสาร"
                            onClick={() => handleDeleteDoc(doc)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* In-App Delete Confirmation Modal */}
      {deleteConfirmDoc && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmDoc(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">ยืนยันการลบเอกสาร</h3>
                <p className="text-xs text-slate-500">เอกสารนี้จะถูกลบออกจากระบบและไม่สามารถดาวน์โหลดได้อีก</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">ชื่อเอกสาร:</span>
                <span className="font-bold text-slate-900 line-clamp-1">{deleteConfirmDoc.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">หมวดหมู่:</span>
                <span className="font-semibold text-emerald-800">{deleteConfirmDoc.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ประเภทไฟล์:</span>
                <span className="font-semibold text-slate-700">{deleteConfirmDoc.fileType} ({deleteConfirmDoc.fileSize})</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmDoc(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ยืนยันลบเอกสารนี้</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Guide & GitHub Code Modal */}
      {isSyncGuideOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsSyncGuideOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    วิธีทำให้เอกสารและข้อมูลปรากฏบนมือถือและทุกเครื่อง (100%)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ขั้นตอนง่ายๆ สำหรับเว็บไซต์ที่ทำงานบน GitHub Pages
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncGuideOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              {/* Step 1 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">1</span>
                  <span>ฝากไฟล์เอกสารไว้บน Google Drive (เพื่อให้ดาวน์โหลดได้จากทุกเครื่อง)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-2">
                  <li>นำไฟล์ PDF หรือแบบฟอร์มไปอัปโหลดไว้ใน <strong>Google Drive</strong> หรือ <strong>OneDrive</strong></li>
                  <li>คลิกขวาที่ไฟล์ เลือก <strong>แชร์ (Share)</strong></li>
                  <li>ปรับตรง <em>การเข้าถึงทั่วไป</em> ให้เป็น <strong>&quot;ทุกคนที่มีลิงก์มีสิทธิ์อ่าน&quot; (Anyone with the link can view)</strong></li>
                  <li>กด <strong>คัดลอกลิงก์ (Copy Link)</strong> แล้วนำมาวางในช่อง <em>&quot;ใส่ลิงก์ดาวน์โหลด (URL)&quot;</em> ในหน้าแอดมินนี้</li>
                </ol>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">2</span>
                  <span>คัดลอกโค้ดข้อมูลเอกสารล่าสุด</span>
                </div>
                <p className="text-slate-600 mb-2">
                  ระบบได้รวมรายการเอกสารทั้งหมด {documents.length} รายการ (รวมรายการที่คุณเพิ่งเพิ่มหรือแก้ไข) พร้อมให้นำไปใส่ในโปรเจกต์:
                </p>
                <div className="relative">
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl overflow-x-auto text-[11px] max-h-40 font-mono">
                    {generateInitialDataCode()}
                  </pre>
                  <button
                    type="button"
                    onClick={handleCopyCodeForGithub}
                    className="absolute top-2 right-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    {copiedCodeSuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeSuccess ? 'คัดลอกสำเร็จแล้ว!' : 'กดคัดลอกโค้ด'}</span>
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="font-bold text-emerald-950 text-sm flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">3</span>
                  <span>นำโค้ดไปวางใน GitHub (ทำครั้งเดียว แสดงผลถาวรทุกอุปกรณ์)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-emerald-900 pl-2">
                  <li>เปิด GitHub ไปที่ Repository ของคุณ</li>
                  <li>เข้าไปที่ไฟล์ <code>src/data/initialData.ts</code></li>
                  <li>กดไอคอนรูป <strong>ดินสอ (Edit this file)</strong> ที่มุมขวาบน</li>
                  <li>ค้นหาท่อน <code>export const INITIAL_DOCUMENTS: DocumentDownload[] = ...</code> แล้ววางโค้ดที่คัดลอกไว้ทับลงไป</li>
                  <li>กดปุ่มสีเขียว <strong>Commit changes...</strong> ด้านบนขวา</li>
                  <li>รอประมาณ 1-2 นาที เมื่อเปิดดูเว็บผ่านมือถือ เอกสารจะแสดงขึ้นมาตรงกัน 100% ครับ</li>
                </ol>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSyncGuideOpen(false)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                เข้าใจแล้ว / ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
