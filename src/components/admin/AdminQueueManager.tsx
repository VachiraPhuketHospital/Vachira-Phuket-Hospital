import React, { useState } from 'react';
import { QueueItem } from '../../types';
import {
  Clock,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Filter,
  UserCheck,
  Check,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface AdminQueueManagerProps {
  queues: QueueItem[];
  onUpdateQueues: (queues: QueueItem[]) => void;
  onResetQueuesToDefault: () => void;
}

export const AdminQueueManager: React.FC<AdminQueueManagerProps> = ({
  queues,
  onUpdateQueues,
  onResetQueuesToDefault,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | QueueItem['status']>('all');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQueue, setEditingQueue] = useState<QueueItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState<Partial<QueueItem>>({
    queueNumber: '',
    hn: '',
    patientName: '',
    room: 'ช่องจ่ายยา 1-2 (บัตรทอง 30 บาท)',
    status: 'waiting_check',
    statusText: 'เภสัชกรกำลังตรวจสอบใบสั่งยา',
    estimatedWaitMinutes: 5,
  });

  const roomsList = [
    'ช่องจ่ายยา 1-2 (บัตรทอง 30 บาท)',
    'ช่องจ่ายยา 3 (ประกันสังคม)',
    'ช่องจ่ายยา 4 (ข้าราชการ/ชำระเงิน)',
    'ช่องด่วน Fast Track (ยา 1-2 รายการ)',
    'คลินิกให้คำปรึกษาด้านยาวาร์ฟาริน',
    'คลินิกโรคหืดและปอดอุดกั้นเรื้อรัง',
    'ห้องจ่ายยาผู้ป่วยนอก ชั้น 2',
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Filter queues
  const filteredQueues = queues.filter((q) => {
    const matchesSearch =
      q.queueNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.hn.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesRoom = roomFilter === 'all' || q.room === roomFilter;
    return matchesSearch && matchesStatus && matchesRoom;
  });

  // Count stats
  const countWaiting = queues.filter((q) => q.status === 'waiting_check').length;
  const countDispensing = queues.filter((q) => q.status === 'dispensing').length;
  const countReady = queues.filter((q) => q.status === 'ready').length;
  const countCompleted = queues.filter((q) => q.status === 'completed').length;

  // Quick Status Transition
  const handleQuickNextStatus = (queueNumber: string) => {
    const target = queues.find((q) => q.queueNumber === queueNumber);
    if (!target) return;

    let nextStatus: QueueItem['status'] = 'waiting_check';
    let nextText = '';
    let waitMin = target.estimatedWaitMinutes;

    if (target.status === 'waiting_check') {
      nextStatus = 'dispensing';
      nextText = 'กำลังจัดและตรวจสอบยา';
      waitMin = Math.max(1, waitMin - 4);
    } else if (target.status === 'dispensing') {
      nextStatus = 'ready';
      nextText = 'พร้อมรับยา (เชิญที่ช่องบริการ)';
      waitMin = 0;
    } else if (target.status === 'ready') {
      nextStatus = 'completed';
      nextText = 'รับยาเรียบร้อยแล้ว';
      waitMin = 0;
    } else {
      nextStatus = 'waiting_check';
      nextText = 'เภสัชกรกำลังตรวจสอบใบสั่งยา';
      waitMin = 8;
    }

    const updated = queues.map((q) =>
      q.queueNumber === queueNumber
        ? {
            ...q,
            status: nextStatus,
            statusText: nextText,
            estimatedWaitMinutes: waitMin,
            updatedAt: `${new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`,
          }
        : q
    );

    onUpdateQueues(updated);
    showToast(`อัปเดตสถานะคิว ${queueNumber} เป็น "${nextText}" แล้ว`);
  };

  // Save Add / Edit
  const handleSaveQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.queueNumber?.trim() || !formData.patientName?.trim() || !formData.hn?.trim()) {
      alert('กรุณากรอกข้อมูล หมายเลขคิว, ชื่อคนไข้ และ HN ให้ครบถ้วน');
      return;
    }

    const nowStr = `${new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;

    if (editingQueue) {
      // Edit
      const updated = queues.map((q) =>
        q.queueNumber === editingQueue.queueNumber
          ? ({
              ...q,
              ...formData,
              queueNumber: formData.queueNumber?.trim().toUpperCase() || q.queueNumber,
              updatedAt: nowStr,
            } as QueueItem)
          : q
      );
      onUpdateQueues(updated);
      showToast(`บันทึกการแก้ไขคิว ${formData.queueNumber} เรียบร้อยแล้ว`);
      setEditingQueue(null);
    } else {
      // Add
      const exists = queues.some(
        (q) => q.queueNumber.toUpperCase() === formData.queueNumber?.trim().toUpperCase()
      );
      if (exists) {
        alert(`หมายเลขคิว ${formData.queueNumber} มีอยู่ในระบบแล้ว กรุณาใช้หมายเลขอื่น`);
        return;
      }

      const newQ: QueueItem = {
        queueNumber: formData.queueNumber?.trim().toUpperCase() || `A${Math.floor(100 + Math.random() * 900)}`,
        hn: formData.hn?.trim() || '0000000',
        patientName: formData.patientName?.trim() || '',
        room: formData.room || 'ช่องจ่ายยา 1-2 (บัตรทอง 30 บาท)',
        status: formData.status || 'waiting_check',
        statusText:
          formData.statusText ||
          (formData.status === 'ready'
            ? 'พร้อมรับยา (เชิญที่ช่องบริการ)'
            : formData.status === 'dispensing'
            ? 'กำลังจัดและตรวจสอบยา'
            : 'เภสัชกรกำลังตรวจสอบใบสั่งยา'),
        estimatedWaitMinutes: Number(formData.estimatedWaitMinutes) || 5,
        updatedAt: nowStr,
      };

      onUpdateQueues([newQ, ...queues]);
      showToast(`ออกคิวใหม่ ${newQ.queueNumber} ให้กับ ${newQ.patientName} เรียบร้อยแล้ว`);
      setIsAddModalOpen(false);
    }

    // reset form
    setFormData({
      queueNumber: '',
      hn: '',
      patientName: '',
      room: 'ช่องจ่ายยา 1-2 (บัตรทอง 30 บาท)',
      status: 'waiting_check',
      statusText: 'เภสัชกรกำลังตรวจสอบใบสั่งยา',
      estimatedWaitMinutes: 5,
    });
  };

  // Delete
  const handleDeleteQueue = (queueNumber: string) => {
    if (confirm(`คุณต้องการลบคิวหมายเลข ${queueNumber} ออกจากระบบใช่หรือไม่?`)) {
      const updated = queues.filter((q) => q.queueNumber !== queueNumber);
      onUpdateQueues(updated);
      showToast(`ลบคิว ${queueNumber} เรียบร้อยแล้ว`);
    }
  };

  // Open Edit
  const openEditModal = (q: QueueItem) => {
    setEditingQueue(q);
    setFormData({ ...q });
  };

  // Generate Next Queue Number Helper
  const generateNextNumber = () => {
    const nums = queues
      .map((q) => {
        const m = q.queueNumber.match(/^[A-Z]?(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxNum = nums.length > 0 ? Math.max(...nums) : 100;
    return `A${maxNum + 1}`;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              OPD Pharmacy Queue Management
            </span>
            <span className="text-xs text-slate-500">
              ทั้งหมด <strong>{queues.length}</strong> คิวในระบบ
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <span>จัดการคิวรับยาผู้ป่วยนอก</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            แอดมินและเภสัชกรสามารถออกคิวใหม่, อัปเดตสถานะการจัดยา, กำหนดช่องจ่ายยา, และบันทึกประวัติการรับยาแบบเรียลไทม์
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setFormData({
                queueNumber: generateNextNumber(),
                hn: `${Math.floor(5000000 + Math.random() * 4000000)}`,
                patientName: '',
                room: 'ช่องจ่ายยา 1-2 (บัตรทอง 30 บาท)',
                status: 'waiting_check',
                statusText: 'เภสัชกรกำลังตรวจสอบใบสั่งยา',
                estimatedWaitMinutes: 6,
              });
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer hover:scale-102 active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ออกคิวใหม่ (+ ใบสั่งยา)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('ต้องการรีเซ็ตคิวเป็นชุดข้อมูลตัวอย่างเริ่มต้นใช่หรือไม่?')) {
                onResetQueuesToDefault();
                showToast('รีเซ็ตคิวเป็นข้อมูลเริ่มต้นเรียบร้อยแล้ว');
              }
            }}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer"
            title="คืนค่าข้อมูลตัวอย่างเริ่มต้น"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่าเริ่มต้น</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div
          onClick={() => setStatusFilter(statusFilter === 'waiting_check' ? 'all' : 'waiting_check')}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
            statusFilter === 'waiting_check' ? 'border-amber-500 ring-2 ring-amber-200' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">1. รอตรวจใบสั่งยา</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{countWaiting}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">รอเภสัชกรคัดกรอง</p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'dispensing' ? 'all' : 'dispensing')}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
            statusFilter === 'dispensing' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">2. กำลังจัดยา</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </span>
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2">{countDispensing}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">จนท.ห้องยากำลังนับเม็ดยา</p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'ready' ? 'all' : 'ready')}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
            statusFilter === 'ready' ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">3. พร้อมรับยา</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{countReady}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">เชิญรับยาที่ช่องบริการ</p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
            statusFilter === 'completed' ? 'border-slate-400 ring-2 ring-slate-200' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">4. จ่ายยาเสร็จสิ้น</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-700 mt-2">{countCompleted}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">ผู้ป่วยรับยากลับบ้านแล้ว</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขคิว, ชื่อคนไข้ หรือ HN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">สถานะ:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="all">ทุกสถานะ ({queues.length})</option>
              <option value="waiting_check">รอตรวจใบสั่งยา ({countWaiting})</option>
              <option value="dispensing">กำลังจัดยา ({countDispensing})</option>
              <option value="ready">พร้อมเรียกรับยา ({countReady})</option>
              <option value="completed">เสร็จสิ้น ({countCompleted})</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">ช่องบริการ:</span>
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium max-w-[200px]"
            >
              <option value="all">ทุกช่องจ่ายยา</option>
              {roomsList.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || statusFilter !== 'all' || roomFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setRoomFilter('all');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-bold px-2 py-1 underline"
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      {/* Main Table of Queues */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">หมายเลขคิว</th>
                <th className="py-3.5 px-4">ผู้ป่วย / HN</th>
                <th className="py-3.5 px-4">ช่องจ่ายยา</th>
                <th className="py-3.5 px-4">สถานะปัจจุบัน</th>
                <th className="py-3.5 px-4">เวลารอโดยประมาณ</th>
                <th className="py-3.5 px-4">อัปเดตล่าสุด</th>
                <th className="py-3.5 px-4 text-center">เปลี่ยนสถานะถัดไป</th>
                <th className="py-3.5 px-4 text-right">เครื่องมือ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Clock className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">ไม่พบคิวตรงกับเงื่อนไขที่เลือก</p>
                    <p className="text-xs text-slate-400 mt-0.5">ลองเปลี่ยนคำค้นหา หรือกดปุ่ม "ออกคิวใหม่" ด้านบน</p>
                  </td>
                </tr>
              ) : (
                filteredQueues.map((q) => {
                  return (
                    <tr
                      key={q.queueNumber}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Queue Number Badge */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                            {q.queueNumber}
                          </span>
                          {q.status === 'ready' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" title="พร้อมรับยา" />
                          )}
                        </div>
                      </td>

                      {/* Patient / HN */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 text-sm">{q.patientName}</div>
                        <div className="text-[11px] text-slate-400">HN: {q.hn}</div>
                      </td>

                      {/* Room */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200/60 inline-block">
                          {q.room}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {q.status === 'waiting_check' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3.5 h-3.5" />
                            <span>1. รอตรวจใบสั่งยา</span>
                          </span>
                        )}
                        {q.status === 'dispensing' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>2. กำลังจัดยา</span>
                          </span>
                        )}
                        {q.status === 'ready' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>3. พร้อมรับยา</span>
                          </span>
                        )}
                        {q.status === 'completed' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>4. เสร็จสิ้น</span>
                          </span>
                        )}
                        <div className="text-[10px] text-slate-400 mt-1">{q.statusText}</div>
                      </td>

                      {/* Wait Time */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {q.status === 'ready' || q.status === 'completed' ? (
                          <span className="text-emerald-700 font-bold">0 นาที</span>
                        ) : (
                          <span>~{q.estimatedWaitMinutes} นาที</span>
                        )}
                      </td>

                      {/* Updated Time */}
                      <td className="py-3.5 px-4 text-slate-500">{q.updatedAt}</td>

                      {/* Quick Next Status Step Button */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleQuickNextStatus(q.queueNumber)}
                          className="px-2.5 py-1.5 rounded-lg font-bold text-xs bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 border border-slate-200 transition-all flex items-center gap-1 mx-auto cursor-pointer"
                          title="เลื่อนสถานะขั้นตอนถัดไป"
                        >
                          <span>
                            {q.status === 'waiting_check'
                              ? '➔ จัดยา'
                              : q.status === 'dispensing'
                              ? '➔ พร้อมรับยา'
                              : q.status === 'ready'
                              ? '➔ เสร็จสิ้น'
                              : '↺ ตรวจใหม่'}
                          </span>
                        </button>
                      </td>

                      {/* Action Tools */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => openEditModal(q)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                            title="แก้ไขข้อมูลคิว"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteQueue(q.queueNumber)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                            title="ลบคิวนี้"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add or Edit Queue */}
      {(isAddModalOpen || editingQueue) && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>{editingQueue ? `แก้ไขคิว ${editingQueue.queueNumber}` : 'ออกคิวรับยาผู้ป่วยนอกใหม่'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingQueue(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQueue} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    หมายเลขคิว <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.queueNumber || ''}
                    onChange={(e) => setFormData({ ...formData, queueNumber: e.target.value.toUpperCase() })}
                    placeholder="เช่น A105"
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 font-black text-sm uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    หมายเลข HN ผู้ป่วย <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hn || ''}
                    onChange={(e) => setFormData({ ...formData, hn: e.target.value })}
                    placeholder="เช่น 6251203"
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ชื่อ-นามสกุล ผู้รับบริการ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.patientName || ''}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="เช่น นายสมเกียรติ สว่างวงศ์"
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ช่องจ่ายยาที่กำหนด</label>
                  <select
                    value={formData.room || roomsList[0]}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 font-medium"
                  >
                    {roomsList.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">สถานะคิว</label>
                  <select
                    value={formData.status || 'waiting_check'}
                    onChange={(e) => {
                      const newStatus = e.target.value as QueueItem['status'];
                      let defaultTxt = 'เภสัชกรกำลังตรวจสอบใบสั่งยา';
                      let waitMin = 6;
                      if (newStatus === 'dispensing') {
                        defaultTxt = 'กำลังจัดและตรวจสอบยา';
                        waitMin = 3;
                      } else if (newStatus === 'ready') {
                        defaultTxt = 'พร้อมรับยา (เชิญที่ช่องบริการ)';
                        waitMin = 0;
                      } else if (newStatus === 'completed') {
                        defaultTxt = 'รับยาเรียบร้อยแล้ว';
                        waitMin = 0;
                      }
                      setFormData({
                        ...formData,
                        status: newStatus,
                        statusText: defaultTxt,
                        estimatedWaitMinutes: waitMin,
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 font-medium"
                  >
                    <option value="waiting_check">1. รอตรวจใบสั่งยา</option>
                    <option value="dispensing">2. กำลังจัดยา</option>
                    <option value="ready">3. พร้อมเรียกรับยา</option>
                    <option value="completed">4. เสร็จสิ้น</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ข้อความแจ้งสถานะ (แสดงในจอคนไข้)</label>
                  <input
                    type="text"
                    value={formData.statusText || ''}
                    onChange={(e) => setFormData({ ...formData, statusText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เวลารอโดยประมาณ (นาที)</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={formData.estimatedWaitMinutes ?? 5}
                    onChange={(e) => setFormData({ ...formData, estimatedWaitMinutes: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingQueue(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingQueue ? 'บันทึกการแก้ไข' : 'ยืนยันออกคิว'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
