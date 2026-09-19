import React, { useState } from 'react';
import { Lock, User, KeyRound, ArrowLeft, CheckCircle2, Eye, EyeOff, ShieldAlert, Users, Sparkles } from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminLoginProps {
  users?: AdminUser[];
  onUpdateUsers?: (users: AdminUser[]) => void;
  onLoginSuccess: (user: AdminUser | string) => void;
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  users = [],
  onUpdateUsers,
  onLoginSuccess,
  onBackToPublic,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const inputUser = username.trim();
    const inputPass = password;

    setTimeout(() => {
      // Find matching user in the registered Users list from Users Management
      const foundUser = users.find(
        (u) => u.username.trim().toLowerCase() === inputUser.toLowerCase()
      );

      if (!foundUser) {
        setErrorMsg(`ไม่พบชื่อผู้ใช้ "${inputUser}" ในระบบจัดการผู้ใช้งาน & เภสัชกร`);
        setIsLoading(false);
        return;
      }

      // Check password matching
      const expectedPassword =
        foundUser.password || (foundUser.username === 'admin' ? 'vachira123' : '1234');

      if (inputPass !== expectedPassword) {
        setErrorMsg('รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านที่ตั้งไว้ในระบบ');
        setIsLoading(false);
        return;
      }

      // Update last login timestamp
      const now = new Date();
      const dateStr = now.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
      });
      const timeStr = now.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const lastLoginStr = `${dateStr}, ${timeStr} น.`;

      if (onUpdateUsers) {
        const updatedUsers = users.map((u) =>
          u.id === foundUser.id ? { ...u, lastLogin: lastLoginStr } : u
        );
        onUpdateUsers(updatedUsers);
      }

      onLoginSuccess(foundUser);
    }, 350);
  };

  const handleQuickFill = (user: AdminUser) => {
    setUsername(user.username);
    const pwd = user.password || (user.username === 'admin' ? 'vachira123' : '1234');
    setPassword(pwd);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Public Portal Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าหลักประชาชน</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-9 shadow-2xl rounded-3xl border border-slate-200 text-center relative">
          {/* Logo & Header */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl shadow-xs mb-3">
            💊
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            กลุ่มงานเภสัชกรรม
          </h2>
          <p className="text-sm font-semibold text-emerald-700 mt-0.5">
            โรงพยาบาลวชิระภูเก็ต
          </p>
          <p className="text-xs text-slate-400 mt-1 pb-4 border-b border-slate-100">
            ระบบตรวจสอบสิทธิ์เข้าใช้งาน (Authentication) เชื่อมต่อฐานข้อมูลผู้ใช้งาน
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 text-left space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                ชื่อผู้ใช้ (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="เช่น admin หรือ username เภสัชกร"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="กรอกรหัสผ่านที่ตั้งไว้ในระบบ"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="admin-login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-900/20 active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{isLoading ? 'กำลังตรวจสอบสิทธิ์...' : 'เข้าสู่ระบบเจ้าหน้าที่'}</span>
              </button>
            </div>
          </form>

          {/* Registered Users from Users Management */}
          {users.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>บัญชีที่ลงทะเบียนในระบบ ({users.length} บัญชี):</span>
                </span>
                <span className="text-[10px] text-slate-400">คลิกเพื่อกรอก</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {users.map((u) => {
                  const pwd = u.password || (u.username === 'admin' ? 'vachira123' : '1234');
                  const isCurrent = username.trim().toLowerCase() === u.username.toLowerCase();
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickFill(u)}
                      className={`w-full text-left p-2 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-300'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-bold text-slate-800 truncate flex items-center gap-1.5">
                          <span>{u.name}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              u.role === 'admin'
                                ? 'bg-rose-100 text-rose-700'
                                : u.role === 'pharmacist'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {u.role === 'admin' ? 'Admin' : u.role === 'pharmacist' ? 'เภสัชกร' : 'เจ้าหน้าที่'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          User: <strong className="text-slate-700">{u.username}</strong> | รหัสผ่าน: <strong className="text-slate-700">{pwd}</strong>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 shrink-0 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                        เลือก
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                * เพิ่ม/แก้ไขผู้ใช้และรหัสผ่านได้ที่เมนู "จัดการผู้ใช้งาน" ในระบบแอดมิน
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

