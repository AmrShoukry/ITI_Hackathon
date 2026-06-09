'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { api } from '../../../lib/api';
import {
  Calendar,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Shield,
} from 'lucide-react';

export default function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user, token } = useAuth();
  const { t, language } = useLanguage();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }

    fetchBooking();
  }, [token, params.id]);

  const fetchBooking = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/bookings/${params.id}`);
      setBooking(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  const onlinePayment = booking?.payments?.find(
    (payment: any) => payment.paymentMethod === 'Online Payment',
  );

  const needsPayment =
    booking?.status === 'Pending' &&
    onlinePayment &&
    onlinePayment.status !== 'Paid';

  const handlePayNow = async () => {
    setPayLoading(true);
    setError('');
    try {
      const res = await api.post('/payments/create-checkout-session', {
        bookingId: params.id,
      });

      window.location.href = res.data.url;
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (language === 'en'
            ? 'Failed to start payment. Please try again.'
            : 'فشل بدء الدفع. يرجى المحاولة مرة أخرى.'),
      );
      setPayLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Loader2 className="h-10 w-10 mx-auto animate-spin text-brand-400 mb-4" />
        <span>
          {language === 'en' ? 'Loading booking...' : 'جاري تحميل الحجز...'}
        </span>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-20 text-gray-400">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p>{error || (language === 'en' ? 'Booking not found' : 'الحجز غير موجود')}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 text-brand-400 hover:underline text-sm"
        >
          {language === 'en' ? 'Back to Dashboard' : 'العودة إلى لوحة التحكم'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <button
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{language === 'en' ? 'Back to Dashboard' : 'العودة إلى لوحة التحكم'}</span>
      </button>

      <div className="glass-panel p-8 rounded-2xl border border-gray-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white">
              {booking.listing.title}
            </h1>
            <p className="text-sm text-gray-400">
              {language === 'en' ? 'Booking ID' : 'رقم الحجز'}: {booking.id}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
              booking.status === 'Approved'
                ? 'bg-green-500/20 text-green-300'
                : booking.status === 'Active'
                  ? 'bg-blue-500/20 text-blue-300'
                  : booking.status === 'Returned'
                    ? 'bg-purple-500/20 text-purple-300'
                    : booking.status === 'Pending'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
            }`}
          >
            {t(`status_${booking.status.toLowerCase()}`)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-gray-800 p-4 space-y-2">
            <span className="text-xs uppercase tracking-widest text-gray-500">
              {language === 'en' ? 'Rental Period' : 'فترة الإيجار'}
            </span>
            <p className="flex items-center gap-2 text-white">
              <Calendar className="h-4 w-4 text-brand-400" />
              {new Date(booking.startDate).toLocaleDateString()} –{' '}
              {new Date(booking.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 p-4 space-y-2">
            <span className="text-xs uppercase tracking-widest text-gray-500">
              {t('total_price')}
            </span>
            <p className="text-xl font-bold text-white">
              ${Number(onlinePayment?.amount || booking.payments[0]?.amount || 0).toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 p-4 space-y-2">
            <span className="text-xs uppercase tracking-widest text-gray-500">
              {t('deposit_amount')}
            </span>
            <p className="text-lg font-semibold text-brand-300">
              ${Number(booking.deposit?.amount || 0).toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 p-4 space-y-2">
            <span className="text-xs uppercase tracking-widest text-gray-500">
              {language === 'en' ? 'Payment Status' : 'حالة الدفع'}
            </span>
            <p className="text-lg font-semibold text-white capitalize">
              {onlinePayment?.status || booking.payments[0]?.status || 'N/A'}
            </p>
            {onlinePayment?.paidAt && (
              <p className="text-xs text-gray-500">
                {language === 'en' ? 'Paid at' : 'تم الدفع في'}{' '}
                {new Date(onlinePayment.paidAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {needsPayment && booking.renterId === user?.id && (
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-300">
                  {language === 'en'
                    ? 'Payment required to confirm booking'
                    : 'الدفع مطلوب لتأكيد الحجز'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {language === 'en'
                    ? 'Complete your online payment before the owner can approve this booking.'
                    : 'أكمل الدفع الإلكتروني قبل أن يتمكن المالك من الموافقة على هذا الحجز.'}
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handlePayNow}
              disabled={payLoading}
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-3.5 font-bold text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {payLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {language === 'en' ? 'Redirecting to Stripe...' : 'جاري التحويل إلى Stripe...'}
                  </span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>{language === 'en' ? 'Pay Now' : 'ادفع الآن'}</span>
                </>
              )}
            </button>
          </div>
        )}

        {onlinePayment?.status === 'Paid' && (
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-400">
            {language === 'en'
              ? 'Payment confirmed. Waiting for owner approval.'
              : 'تم تأكيد الدفع. في انتظار موافقة المالك.'}
          </div>
        )}
      </div>
    </div>
  );
}
