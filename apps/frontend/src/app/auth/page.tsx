'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Phone, User as UserIcon, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const { login, register, user } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roleName, setRoleName] = useState('RENTER');
  const [nationalIdUrl, setNationalIdUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (user) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const payload: any = { name, email, phone, password, roleName };
        if (roleName === 'OWNER') {
          payload.nationalIdUrl = nationalIdUrl || 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
        }
        await register(payload);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-8 md:p-10 shadow-2xl space-y-8 border border-white/5">
        {/* Toggle Headings */}
        <div className="flex justify-center border-b border-gray-800 pb-4">
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 text-center py-2 font-bold text-lg transition ${
              isLogin ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t('login')}
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 text-center py-2 font-bold text-lg transition ${
              !isLogin ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t('register')}
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Registration Fields */}
          {!isLogin && (
            <>
              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-300">{language === 'en' ? 'Full Name' : 'الاسم الكامل'}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500 rtl:right-3.5 rtl:left-auto" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'en' ? 'John Doe' : 'جون دو'}
                    className="w-full rounded-xl py-3 pl-10 pr-4 rtl:pr-10 rtl:pl-4 text-white bg-dark-800/80 border border-gray-700 focus:outline-none focus:border-brand-500 transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-300">{language === 'en' ? 'Phone Number' : 'رقم الهاتف'}</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500 rtl:right-3.5 rtl:left-auto" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full rounded-xl py-3 pl-10 pr-4 rtl:pr-10 rtl:pl-4 text-white bg-dark-800/80 border border-gray-700 focus:outline-none focus:border-brand-500 transition"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">{language === 'en' ? 'Register As' : 'التسجيل كـ'}</label>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center justify-center p-3 rounded-xl border border-gray-700 cursor-pointer hover:bg-dark-800 bg-dark-900 transition gap-2 text-sm font-bold">
                    <input
                      type="radio"
                      name="roleName"
                      value="RENTER"
                      checked={roleName === 'RENTER'}
                      onChange={() => setRoleName('RENTER')}
                      className="text-brand-500 focus:ring-brand-500"
                    />
                    <span>{t('renter')}</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center p-3 rounded-xl border border-gray-700 cursor-pointer hover:bg-dark-800 bg-dark-900 transition gap-2 text-sm font-bold">
                    <input
                      type="radio"
                      name="roleName"
                      value="OWNER"
                      checked={roleName === 'OWNER'}
                      onChange={() => setRoleName('OWNER')}
                      className="text-brand-500 focus:ring-brand-500"
                    />
                    <span>{t('owner')}</span>
                  </label>
                </div>
              </div>

              {/* Owner National ID Upload */}
              {roleName === 'OWNER' && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-brand-400" />
                    <span>{t('national_id')}</span>
                  </label>
                  <input
                    type="url"
                    value={nationalIdUrl}
                    onChange={(e) => setNationalIdUrl(e.target.value)}
                    placeholder="https://example.com/national-id.jpg"
                    className="w-full rounded-xl py-3 px-4 text-white bg-dark-800/80 border border-gray-700 focus:outline-none focus:border-brand-500 transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'en'
                      ? 'Upload your National ID image and enter the URL (Cloudinary mock provided by default).'
                      : 'يرجى تحميل صورة هويتك الوطنية وإدخال الرابط (رابط افتراضي متوفر تلقائياً).'}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300">{language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500 rtl:right-3.5 rtl:left-auto" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl py-3 pl-10 pr-4 rtl:pr-10 rtl:pl-4 text-white bg-dark-800/80 border border-gray-700 focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300">{language === 'en' ? 'Password' : 'كلمة المرور'}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500 rtl:right-3.5 rtl:left-auto" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl py-3 pl-10 pr-4 rtl:pr-10 rtl:pl-4 text-white bg-dark-800/80 border border-gray-700 focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-3.5 font-bold text-white shadow-lg shadow-brand-600/20 transition disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>{language === 'en' ? 'Authenticating...' : 'جاري التحقق...'}</span>
              </span>
            ) : isLogin ? (
              t('login')
            ) : (
              t('register')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
