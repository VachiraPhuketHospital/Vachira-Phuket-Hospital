import React, { useState } from 'react';
import { DocumentDownload, AdminUser, AdminSection } from '../../types';
import {
  FileText,
  Users,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Edit2,
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

  const [settingsSaved, setSettingsSaved] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUser | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [hiddenMenus, setHiddenMenus] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('huahin_admin_hidden_menus');
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
      localStorage.setItem('huahin_admin_hidden_menus', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('huahin_admin_menus_changed', { detail: updated }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetMenus = () => {
    setHiddenMenus([]);
    try {
      localStorage.removeItem('huahin_admin_hidden_menus');
      window.dispatchEvent(new CustomEvent('huahin_admin_menus_changed', { detail: [] }));
    } catch (e) {
      console.error(e);
    }
    showToast('คืนค่าการแสดงผลเมนูทั้งหมดเรียบร้อย');
  };

  // Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserUsername.trim()) return;
    const newUser: AdminUser = {
      id: `u_${Date.now()}`,
      name: newUserName.trim(),
      username: newUserUsername.trim(),
      role: newUserRole,
      department: 'กลุ่มงานเภสัชกรรม รพ.หัวหิน',
      email: `${newUserUsername.trim()}@huahinhospital.go.th`,
      lastLogin: 'เพิ่งสร้าง',
    };
    const updated = [newUser, ...userList];
    setUserList(updated);
    onUpdateUsers(updated);
    setNewUserName('');
    setNewUserUsername('');
    showToast(`เพิ่มผู้ใช้ "${newUser.name}" เรียบร้อยแล้ว`);
  };

  const handleDeleteUser = (user: AdminUser) => {
    setDeleteConfirmUser(user);
  };

  const handleOpenEditUser = (user: AdminUser) => {
    setEditingUser({ ...user });
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const updated = userList.map((u) => (u.id === editingUser.id ? editingUser : u));
    setUserList(updated);
    onUpdateUsers(updated);
    showToast(`แก้ไขข้อมูลผู้ใช้ "${editingUser.name}" เรียบร้อย`);
    setEditingUser(null);
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
          <div className="font-bold text-slate-800">เพิ่มผู้ใช้ใหม่ในระบบ:</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <input
                type="text"
                placeholder="ชื่อ-สกุล (เช่น ภก.สมชาย)"
                required
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl border-slate-300"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Username (เช่น somchai.s)"
                required
                value={newUserUsername}
                onChange={(e) => setNewUserUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl border-slate-300"
              />
            </div>
            <div>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-xl border-slate-300 bg-white"
              >
                <option value="pharmacist">เภสัชกร (Pharmacist)</option>
                <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                <option value="staff">เจ้าหน้าที่สนับสนุน (Staff)</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs"
              >
                + เพิ่มผู้ใช้
              </button>
            </div>
          </div>
        </form>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ชื่อ - นามสกุล</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">ตำแหน่ง / สิทธิ์</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">เข้าสู่ระบบล่าสุด</th>
                <th className="py-3 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-4 text-slate-600">{u.username}</td>
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
                        onClick={() => handleOpenEditUser(u)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="แก้ไขข้อมูลผู้ใช้"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {u.username !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="ลบผู้ใช้นี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

        {/* Edit User Modal */}
        {editingUser && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setEditingUser(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-blue-600" />
                  <span>แก้ไขข้อมูลผู้ใช้งาน</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อ - สกุล</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    disabled={editingUser.username === 'admin'}
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl border-slate-300 ${
                      editingUser.username === 'admin' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ตำแหน่ง / สิทธิ์</label>
                  <select
                    value={editingUser.role}
                    disabled={editingUser.username === 'admin'}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 bg-white"
                  >
                    <option value="pharmacist">เภสัชกร (Pharmacist)</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                    <option value="staff">เจ้าหน้าที่สนับสนุน (Staff)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">กลุ่มงาน / แผนก</label>
                  <input
                    type="text"
                    value={editingUser.department || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>บันทึกการแก้ไข</span>
                  </button>
                </div>
              </form>
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
              defaultValue="032-523000 ต่อ 1121"
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
