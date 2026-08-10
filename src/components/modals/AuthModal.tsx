import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { X, Lock, Mail, User, ShieldCheck, UserCheck, AlertCircle, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
}) => {
  const { loginUser, registerUser, currentUser, logoutUser } = useCms();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    const res = loginUser(loginEmail, loginPassword);
    if (res.success && res.user) {
      setSuccessMsg(`Welcome back, ${res.user.name}!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    } else {
      setErrorMsg(res.message || 'Login failed.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMsg('Please fill in your full name and email address.');
      return;
    }

    const res = registerUser(regName, regEmail, regPassword);
    if (res.success && res.user) {
      setSuccessMsg(`Account created successfully! Default role: ${res.user.role.toUpperCase()}`);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1200);
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-purple-100">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-purple-950 font-display">
                {currentUser ? 'User Profile & Access' : tab === 'login' ? 'Staff & Member Login' : 'Register New Account'}
              </h3>
              <p className="text-xs text-gray-500">
                {currentUser
                  ? `Active session: ${currentUser.role.toUpperCase()}`
                  : 'Role-Based Access Control (RBAC) System'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user is already logged in, show current session view */}
        {currentUser ? (
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-900 font-extrabold text-2xl flex items-center justify-center mx-auto border-2 border-purple-300 shadow-sm">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-lg font-black text-purple-950">{currentUser.name}</h4>
              <p className="text-xs text-gray-500 font-medium">{currentUser.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Role: {currentUser.role}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 text-left border border-purple-100 space-y-1 text-xs text-purple-900">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Admin Access Status:</span>
              </div>
              {currentUser.email?.trim().toLowerCase() === 'mdanontosunny1068@mail.com' || currentUser.email?.trim().toLowerCase() === 'mdanontosunny1068@gmail.com' ? (
                <p className="text-gray-600">
                  Super Admin Account. You have full, permanent administrative access to the Admin Panel and Firestore controls.
                </p>
              ) : (
                <p className="text-gray-600">
                  Standard Account. Admin Panel access is strictly hidden and blocked unless your email is added to the approved admins list in Firestore by the Super Admin.
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setSuccessMsg('Logged out successfully.');
                  setTimeout(() => setSuccessMsg(''), 2000);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs uppercase tracking-wider border border-rose-200 transition-colors cursor-pointer"
              >
                Sign Out / Switch Account
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-purple-50 p-1 rounded-2xl border border-purple-100">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  tab === 'login'
                    ? 'bg-purple-900 text-white shadow-xs font-extrabold'
                    : 'text-purple-900 hover:bg-purple-100/60'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  tab === 'register'
                    ? 'bg-purple-900 text-white shadow-xs font-extrabold'
                    : 'text-purple-900 hover:bg-purple-100/60'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>

            {/* Error & Success Messages */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <UserCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {tab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="admin@spybangladesh.org"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ayesha Rahman"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="ayesha@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                  <strong>Access Control Note:</strong> Standard user registration does not grant admin access. The Admin Panel is strictly hidden and inaccessible unless your email is added to the approved admins list in Firestore by the Super Admin.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
