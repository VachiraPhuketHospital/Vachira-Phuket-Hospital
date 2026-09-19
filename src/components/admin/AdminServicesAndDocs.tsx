import React, { useState, useEffect } from 'react';
import { DocumentDownload, AdminUser, AdminSection } from '../../types';
import {
  FileText,
  Users,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Check,
  Download,
  ShieldCheck,
  Phone,
  AlertTriangle,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Sliders,
  RotateCcw,
  KeyRound,
  Key,
  Pencil,
} from 'lucide-react';
import { CONTACT_INFO } from '../../data/initialData';
import { AdminDocumentManager } from './AdminDocumentManager';

interface AdminServicesAndDocsProps {
  section: AdminSection;
  documents: DocumentDownload[];
  users: AdminUser[];
  onUpdateDocuments: (docs: DocumentDownload[]) => void;
  onUpdateUsers: (users: AdminUser[]) => void;
}

export const AdminServicesAndDocs: React.FC<AdminServicesAndDocsProps> = ({
  section,
  documents,
  users,
  onUpdateDocuments,
  onUpdateUsers,
}) => {
  const [userList, setUserList] = useState<AdminUser[]>(users);

  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'pharmacist' | 'staff'>('pharmacist');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('1234');
  const [editingPasswordUser, setEditingPasswordUser] = useState<AdminUser | null>(null);
  const [editingPasswordVal, setEditingPasswordVal] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setUserList(users);
  }, [users]);

  const [settingsSaved, setSettingsSaved] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [hiddenMenus, setHiddenMenus] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vachira_admin_hidden_menus');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleToggleMenuVisibility = (menuId: string) => {
    let updated: string[];
    if (hiddenMenus.includes(menuId)) {
      updated = hiddenMenus.filter((id) => id !== menuId);
      showToast('เปิดการแสดงผลเมนูเรียบร้อย');
    } else {
      updated = [...hiddenMenus, menuId];
      showToast('ซ่อนเมนูจากแถบข้างเรียบร้อย');
    }
    setHiddenMenus(updated);
    try {
      localStorage.setItem('vachira_admin_hidden_menus', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('vachira_admin_menus_changed', { detail: updated }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetMenus = () => {
    setHiddenMenus([]);
    try {
      localStorage.removeItem('vachira_admin_hidden_menus');
      window.dispatchEvent(new CustomEvent('vachira_admin_menus_changed', { detail: [] }));
    } catch (e) {
      console.error(e);
    }
    showToast('คืนค่าการแสดงผลเมนูทั้งหมดเรียบร้อย');
  };

  // Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserUsername.trim()) return;
    const pwd = newUserPassword.trim() || '1234';
    const newUser: AdminUser = {
      id: `u_${Date.now()}`,
      name: newUserName.trim(),
      username: newUserUsername.trim(),
      role: newUserRole,
      department: 'กลุ่มงานเภสัชกรรม รพ.วชิระภูเก็ต',
      email: `${newUserUsername.trim()}@vachiraphuket.go.th`,
      lastLogin: 'เพิ่งสร้าง',
      password: pwd,
    };
    const updated = [newUser, ...userList];
    setUserList(updated);
    onUpdateUsers(updated);
    setNewUserName('');
    setNewUserUsername('');
    setNewUserPassword('1234');
    showToast(`เพิ่มผู้ใช้ "${newUser.name}" (รหัสผ่าน: ${pwd}) เรียบร้อยแล้ว`);
  };

  const handleOpenEditPassword = (user: AdminUser) => {
    setEditingPasswordUser(user);
    setEditingPasswordVal(user.password || (user.username === 'admin' ? 'vachira123' : '1234'));
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPasswordUser || !editingPasswordVal.trim()) return;
    const newPass = editingPasswordVal.trim();
    const updated = userList.map((u) =>
      u.id === editingPasswordUser.id ? { ...u, password: newPass } : u
    );
    setUserList(updated);
    onUpdateUsers(updated);
    showToast(`เปลี่ยนรหัสผ่านของ "${editingPasswordUser.name}" เป็น "${newPass}" สำเร็จ`);
    setEditingPasswordUser(null);
    setEditingPasswordVal('');
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleDeleteUser = (user: AdminUser) => {
    setDeleteConfirmUser(user);
  };

  const handleConfirmDeleteUser = () => {
    if (!deleteConfirmUser) return;
    const name = deleteConfirmUser.name;
    const updated = userList.filter((u) => u.id !== deleteConfirmUser.id);
    setUserList(updated);
    onUpdateUsers(updated);
    setDeleteConfirmUser(null);
    showToast(`ลบผู้ใช้ "${name}" ออกจากระบบเรียบร้อย`);
  };

  if (section === 'documents') {
    return (
      <AdminDocumentManager
        documents={documents}
        onUpdateDocuments={onUpdateDocuments}
      />
    );
  }

  if (section === 'users') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>จัดการผู้ใช้งาน & เภสัชกร (Users Management)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              กำหนดสิทธิ์การเข้าใช้งานระบบสำหรับเภสัชกรและเจ้าหน้าที่
            </p>
          </div>
        </div>

        {/* Add User */}
        <form onSubmit={handleAddUser} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-3">
          <div className="font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-purple-600" />
              <span>เพิ่มผู้ใช้ใหม่ในระบบ (เชื่อมโยงกับระบบล็อกอิน):</span>
            </span>
            <span className="text-[11px] text-slate-400 font-normal">รหัสผ่านนี้จะใช้ล็อกอินเข้าสู่ระบบจริง</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">ชื่อ - สกุล</label>
              <input
                type="text"
                placeholder="เช่น ภก.สมชาย นามสมมุติ"
                required
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Username</label>
              <input
                type="text"
                placeholder="เช่น somchai.s"
                required
                value={newUserUsername}
                onChange={(e) => setNewUserUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">รหัสผ่าน (Password)</label>
              <input
                type="text"
                placeholder="รหัสผ่านเข้าใช้งาน"
                required
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">ตำแหน่ง / สิทธิ์</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-xl border-slate-300 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              >
                <option value="pharmacist">เภสัชกร (Pharmacist)</option>
                <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                <option value="staff">เจ้าหน้าที่สนับสนุน (Staff)</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
              >
                + เพิ่มผู้ใช้
              </button>
            </div>
          </div>
        </form>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              รายชื่อผู้ใช้ที่สามารถล็อกอินเข้าสู่ระบบได้ทั้งหมด ({userList.length} บัญชี)
            </span>
            <span className="text-slate-500 text-[11px]">
              * รหัสผ่านที่ตั้งไว้ที่นี่จะถูกนำไปตรวจสอบในหน้าล็อกอินจริงทันที
            </span>
          </div>
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ชื่อ - นามสกุล</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">รหัสผ่าน (Password)</th>
                <th className="py-3 px-4">ตำแหน่ง / สิทธิ์</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">เข้าสู่ระบบล่าสุด</th>
                <th className="py-3 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userList.map((u) => {
                const effectivePassword = u.password || (u.username === 'admin' ? 'vachira123' : '1234');
                const isVisible = visiblePasswords[u.id];

                return (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-700 font-semibold">{u.username}</td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                        <Key className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-800 font-bold tracking-wider">
                          {isVisible ? effectivePassword : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(u.id)}
                          className="p-0.5 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                          title={isVisible ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditPassword(u)}
                          className="p-0.5 text-purple-600 hover:text-purple-800 rounded transition-colors ml-1 cursor-pointer"
                          title="เปลี่ยนรหัสผ่านผู้ใช้นี้"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {u.role === 'admin' ? 'ผู้ดูแลระบบ' : u.role === 'pharmacist' ? 'เภสัชกร' : 'เจ้าหน้าที่'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{u.email}</td>
                    <td className="py-3 px-4 text-slate-400">{u.lastLogin}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditPassword(u)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                          title="เปลี่ยนรหัสผ่าน"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        {u.username !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="ลบผู้ใช้นี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Edit Password Modal */}
        {editingPasswordUser && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setEditingPasswordUser(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-purple-700">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">เปลี่ยนรหัสผ่าน</h3>
                  <p className="text-xs text-slate-500">{editingPasswordUser.name} ({editingPasswordUser.username})</p>
                </div>
              </div>

              <form onSubmit={handleSaveNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    กำหนดรหัสผ่านใหม่:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPasswordVal}
                    onChange={(e) => setEditingPasswordVal(e.target.value)}
                    placeholder="กรอกรหัสผ่านใหม่"
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-slate-50/50"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    รหัสผ่านนี้จะอัปเดตและสามารถใช้ล็อกอินได้ทันที
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingPasswordUser(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>บันทึกรหัสผ่านใหม่</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete User In-App Confirmation Modal */}
        {deleteConfirmUser && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setDeleteConfirmUser(null)}
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
                  <h3 className="text-base font-extrabold text-slate-900">ยืนยันการลบผู้ใช้งาน</h3>
                  <p className="text-xs text-slate-500">บัญชีผู้ใช้นี้จะไม่สามารถเข้าถึงระบบแอดมินได้อีก</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">ชื่อ - สกุล:</span>
                  <span className="font-bold text-slate-900">{deleteConfirmUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Username:</span>
                  <span className="font-semibold text-slate-700">{deleteConfirmUser.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">บทบาท:</span>
                  <span className="font-semibold text-emerald-800">
                    {deleteConfirmUser.role === 'admin' ? 'ผู้ดูแลระบบ' : deleteConfirmUser.role === 'pharmacist' ? 'เภสัชกร' : 'เจ้าหน้าที่'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteUser}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ยืนยันลบผู้ใช้นี้</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-bounce text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-slate-400 hover:text-white ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (section === 'stats') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>สถิติการให้บริการ & การสืบค้นข้อมูลยา</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            รายงานตัวเลขการจ่ายยา คิวเฉลี่ย และยาที่มีการสืบค้นมากที่สุด
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-800 mb-3">ระยะเวลารอรับยาเฉลี่ย (นาที)</h4>
            <div className="text-3xl font-black text-emerald-700 mb-1">14.5 นาที</div>
            <p className="text-slate-500">เป้าหมายมาตรฐานโรงพยาบาล &lt; 25 นาที (ผ่านเกณฑ์ 98%)</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-800 mb-3">จำนวนใบสั่งยาวันนี้</h4>
            <div className="text-3xl font-black text-teal-700 mb-1">842 ใบ</div>
            <p className="text-slate-500">ส่งยาทางไปรษณีย์ 45 รายการ</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-800 mb-3">ความพึงพอใจของผู้รับบริการ</h4>
            <div className="text-3xl font-black text-blue-700 mb-1">94.8%</div>
            <p className="text-slate-500">ผลสำรวจดิจิทัล ณ จุดรับยา</p>
          </div>
        </div>
      </div>
    );
  }

  // Settings
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600" />
            <span>ตั้งค่าระบบ & ข้อมูลหน่วยงาน</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ข้อมูลโรงพยาบาล ที่ตั้ง หมายเลขโทรศัพท์ และเวลาเปิดทำการ
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">ชื่อหน่วยงาน</label>
          <input
            type="text"
            defaultValue={CONTACT_INFO.name}
            className="w-full px-3 py-2 border rounded-xl border-slate-300"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">ที่ตั้ง</label>
          <input
            type="text"
            defaultValue={CONTACT_INFO.address}
            className="w-full px-3 py-2 border rounded-xl border-slate-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">โทรศัพท์สายตรงห้องยา</label>
            <input
              type="text"
              defaultValue="076-361234 ต่อ 1234"
              className="w-full px-3 py-2 border rounded-xl border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email หน่วยงาน</label>
            <input
              type="email"
              defaultValue={CONTACT_INFO.email}
              className="w-full px-3 py-2 border rounded-xl border-slate-300"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              setSettingsSaved(true);
              setTimeout(() => setSettingsSaved(false), 2000);
            }}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
          >
            {settingsSaved ? <Check className="w-4 h-4" /> : null}
            <span>{settingsSaved ? 'บันทึกเรียบร้อย!' : 'บันทึกการตั้งค่า'}</span>
          </button>
        </div>
      </div>

      {/* Admin Sidebar Navigation Manager (Customize/Hide/Delete Menu Items) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>จัดการการแสดงผลเมนูแอดมิน (ซ่อน / ลบเมนูจากแถบนำทาง)</span>
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              คุณสามารถคลิกเพื่อซ่อน (ลบชั่วคราว) เมนูที่ไม่จำเป็นออกจากแถบเมนูด้านซ้ายได้ตามต้องการ
            </p>
          </div>
          {hiddenMenus.length > 0 && (
            <button
              onClick={handleResetMenus}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold flex items-center gap-1 text-[11px] shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>คืนค่าแสดงทุกเมนู ({hiddenMenus.length} เมนูที่ซ่อนอยู่)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'dashboard', label: 'Dashboard ภาพรวม', icon: '📊', desc: 'หน้าสรุปภาพรวมและสถิติหลัก' },
            { id: 'queues', label: 'จัดการคิวรับยาผู้ป่วยนอก', icon: '⏱️', desc: 'ออกคิวใหม่ อัปเดตสถานะ เรียกคิว และจัดลำดับ' },
            { id: 'consultations', label: 'ข้อความปรึกษาเภสัชกร', icon: '💬', desc: 'การจัดการแชทและติดต่อกลับผู้ป่วย' },
            { id: 'menu_topics', label: '📁 จัดการหัวข้อเมนู/เนื้อหา', icon: '📂', desc: 'เพิ่ม ลบ แก้ไขหัวข้อย่อยและเอกสารใน Sidebar' },
            { id: 'drugs', label: 'จัดการข้อมูลยา', icon: '💊', desc: 'ค้นหา เพิ่ม แก้ไข และลบรายการยา' },
            { id: 'infographics', label: 'จัดการขั้นตอนรับยา (3 รูป)', icon: '🖼️', desc: 'ภาพ Infographic แสดงขั้นตอนบริการ' },
            { id: 'banner', label: 'จัดการ Banner หน้าแรก', icon: '🎛️', desc: 'แบนเนอร์ประชาสัมพันธ์หน้าหลัก' },
            { id: 'news', label: 'จัดการข่าวสาร', icon: '📰', desc: 'ข่าวประชาสัมพันธ์ กิจกรรมกลุ่มงานเภสัชกรรม' },
            { id: 'knowledge', label: 'จัดการคลังความรู้', icon: '📚', desc: 'บทความสาระความรู้เรื่องยา' },
            { id: 'documents', label: 'จัดการเอกสารดาวน์โหลด', icon: '📄', desc: 'ไฟล์แบบฟอร์มและเอกสารดาวน์โหลด' },
            { id: 'users', label: 'จัดการผู้ใช้งาน', icon: '👥', desc: 'บัญชีผู้ใช้แอดมินและเภสัชกร' },
            { id: 'stats', label: 'สถิติระบบ', icon: '📈', desc: 'กราฟและรายงานการให้บริการ' },
          ].map((item) => {
            const isHidden = hiddenMenus.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isHidden
                    ? 'bg-slate-50 border-dashed border-slate-300 opacity-60'
                    : 'bg-white border-slate-200 shadow-2xs hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base">{item.icon}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 truncate flex items-center gap-1.5">
                      <span>{item.label}</span>
                      {isHidden && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-600 font-normal">
                          ซ่อนอยู่
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{item.desc}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleMenuVisibility(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                    isHidden
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                  title={isHidden ? 'คลิกเพื่อแสดงเมนูนี้' : 'คลิกเพื่อซ่อนเมนูนี้ออกจากแถบข้าง'}
                >
                  {isHidden ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>แสดงเมนู</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>ซ่อน / ลบออก</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-bounce text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
