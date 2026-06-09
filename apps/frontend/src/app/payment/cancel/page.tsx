'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import { XCircle, Loader2 } from 'lucide-react';

function PaymentCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const bookingId = searchParams.get('booking_id');

  return (
    <div className="max-w-lg mx-auto py-20">
      <div className="glass-panel p-8 rounded-2xl border border-gray-800 text-center space-y-6">
        <XCircle className="h-12 w-12 mx-auto text-yellow-400" />
        <h1 className="text-xl font-bold text-white">
          {language === 'en' ? 'Payment Canceled' : 'تم إلغاء الدفع'}
        </h1>
        <p className="text-gray-400 text-sm">
          {language === 'en'
            ? 'Your payment was canceled. Your booking remains pending payment and awaiting owner approval.'
            : 'تم إلغاء الدفع. يظل حجزك في حالة انتظار الدفع وبانتظار موافقة المالك.'}
        </p>
        <div className="flex flex-col gap-2 pt-2">
          {bookingId && (
            <button
              onClick={() => router.push(`/bookings/${bookingId}`)}
              className="rounded-xl bg-brand-600 hover:bg-brand-500 py-3 font-semibold text-white transition"
            >
              {language === 'en' ? 'Retry Payment' : 'إعادة محاولة الدفع'}
            </button>
          )}
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-xl bg-gray-800 hover:bg-gray-700 py-3 font-semibold text-white transition"
          >
            {language === 'en' ? 'Go to Dashboard' : 'الذهاب إلى لوحة التحكم'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 text-gray-400">
          <Loader2 className="h-10 w-10 mx-auto animate-spin text-brand-400" />
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
