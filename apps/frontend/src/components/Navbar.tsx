'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Globe, LogOut, User as UserIcon, LayoutDashboard, Share2 } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 w-full px-6 py-4 shadow-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight text-white hover:opacity-90">
          <Share2 className="h-7 w-7 text-brand-500" />
          <span>{t('logo')}</span>
        </Link>

        {/* Action Items */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 rounded-full bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-300 transition hover:bg-brand-500/20"
          >
            <Globe className="h-4 w-4" />
            <span>{t('language_toggle')}</span>
          </button>

          {user ? (
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Dashboard Link */}
              <Link
                href="/dashboard"
                className="flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{t('dashboard')}</span>
              </Link>

              {/* User badge — clickable to profile */}
              <Link
                href={`/profile/${user.id}`}
                className="flex items-center space-x-2 rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 transition"
              >
                <UserIcon className="h-3.5 w-3.5 text-gray-400" />
                <span>{user.name}</span>
                <span className="rounded bg-brand-500/20 px-1.5 py-0.5 text-xs font-bold text-brand-300">
                  {user.role}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-sm font-medium text-red-400 hover:text-red-300 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-500 transition-all duration-200"
            >
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
