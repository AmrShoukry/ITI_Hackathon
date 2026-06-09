'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { api } from '../../../lib/api';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const { language } = useLanguage();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }

    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('error');
      setMessage(
        language === 'en'
          ? 'Missing payment session. Please try paying again.'
          : 'جلسة الدفع مفقودة. يرجى المحاولة مرة أخرى.',
      );
      return;
    }

    const verifyPayment = async () => {
      let attempts = 0;
      const maxAttempts = 5;

      const check = async () => {
        try {
          const res = await api.get('/payments/verify-session', {
            params: { session_id: sessionId },
          });

          setBookingId(res.data.bookingId);
          setStatus('success');
          setMessage(
            language === 'en'
              ? 'Payment successful! Your booking payment has been confirmed.'
              : 'تم الدفع بنجاح! تم تأكيد دفع حجزك.',
          );

          setTimeout(() => {
            router.push(`/bookings/${res.data.bookingId}`);
          }, 1);
        } catch (err: any) {
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(check, 1);
          } else {
            setStatus('error');
            setMessage(
              err.response?.data?.message ||
                (language === 'en'
                  ? 'Payment verification failed. Please try again.'
                  : 'فشل التحقق من الدفع. يرجى المحاولة مرة أخرى.'),
            );
          }
        }
      };

      check();
    };

    verifyPayment();
  }, [token, searchParams, router, language]);

  return (
    <div className="max-w-lg mx-auto py-20">
      <div className="glass-panel p-8 rounded-2xl border border-gray-800 text-center space-y-6">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 mx-auto text-brand-400 animate-spin" />
            <h1 className="text-xl font-bold text-white">
              {language === 'en'
                ? 'Verifying payment...'
                : 'جاري التحقق من الدفع...'}
            </h1>
            <p className="text-gray-400 text-sm">
              {language === 'en'
                ? 'Please wait while we confirm your payment with Stripe.'
                : 'يرجى الانتظار بينما نؤكد دفعتك مع Stripe.'}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-400" />
            <h1 className="text-xl font-bold text-white">
              {language === 'en' ? 'Payment Successful' : 'تم الدفع بنجاح'}
            </h1>
            <p className="text-gray-400 text-sm">{message}</p>
            <p className="text-xs text-gray-500">
              {language === 'en'
                ? 'Redirecting to your booking...'
                : 'جاري التحويل إلى حجزك...'}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="h-12 w-12 mx-auto text-red-400" />
            <h1 className="text-xl font-bold text-white">
              {language === 'en'
                ? 'Payment Verification Failed'
                : 'فشل التحقق من الدفع'}
            </h1>
            <p className="text-gray-400 text-sm">{message}</p>
            <div className="flex flex-col gap-2 pt-2">
              {bookingId && (
                <button
                  onClick={() => router.push(`/bookings/${bookingId}`)}
                  className="rounded-xl bg-brand-600 hover:bg-brand-500 py-3 font-semibold text-white transition">
                  {language === 'en' ? 'Retry Payment' : 'إعادة محاولة الدفع'}
                </button>
              )}
              <button
                onClick={() => router.push('/dashboard')}
                className="rounded-xl bg-gray-800 hover:bg-gray-700 py-3 font-semibold text-white transition">
                {language === 'en'
                  ? 'Go to Dashboard'
                  : 'الذهاب إلى لوحة التحكم'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 text-gray-400">
          <Loader2 className="h-10 w-10 mx-auto animate-spin text-brand-400" />
        </div>
      }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

