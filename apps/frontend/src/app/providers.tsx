'use client';

import React, { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { Navbar } from '../components/Navbar';

const DirectionManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, direction } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  return <>{children}</>;
};

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      <DirectionManager>
        <AuthProvider>
          <div className="flex min-h-screen flex-col bg-dark-950">
            <Navbar />
            <main className="flex-1 px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
            <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} ShareRental MVP. All rights reserved.
            </footer>
          </div>
        </AuthProvider>
      </DirectionManager>
    </LanguageProvider>
  );
};
