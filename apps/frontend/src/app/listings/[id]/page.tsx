'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { Calendar, Tag, Shield, Star, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  description: string;
  condition: string;
  dailyPrice: string;
  depositAmount: string;
  photos: { photoUrl: string }[];
  category: { id: number; nameEn: string; nameAr: string };
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
    reviewsReceived?: { rating: number }[];
  };
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking fields
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Online Payment' | 'Cash On Pickup'>('Online Payment');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const res = await axios.get(`${API_URL}/listings/${params.id}`);
      setListing(res.data);
    } catch (e) {
      console.error('Error fetching listing details', e);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess(false);

    if (!user) {
      router.push('/auth');
      return;
    }

    if (!startDate || !endDate) {
      setBookingError(language === 'en' ? 'Please select both start and end dates' : 'يرجى تحديد تاريخ البدء والانتهاء');
      return;
    }

    setBookingLoading(true);
    try {
      await axios.post(`${API_URL}/bookings`, {
        listingId: params.id,
        startDate,
        endDate,
        paymentMethod,
      });

      setBookingSuccess(true);
      setStartDate('');
      setEndDate('');
    } catch (err: any) {
      setBookingError(err.response?.data?.message || t('booking_conflict'));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto mb-4" />
        <span>{language === 'en' ? 'Loading listing details...' : 'جاري تحميل تفاصيل العرض...'}</span>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-20 text-gray-400">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p>{language === 'en' ? 'Listing not found' : 'العرض غير موجود'}</p>
      </div>
    );
  }

  // Calculate Trust Rating
  const reviews = listing.owner.reviewsReceived || [];
  const trustScore = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Listing details column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Images banner */}
        <div className="relative aspect-video w-full rounded-2xl bg-gray-900 overflow-hidden border border-gray-800">
          {listing.photos && listing.photos.length > 0 ? (
            <img
              src={listing.photos[0].photoUrl}
              alt={listing.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-gray-600">
              <ImageIcon className="h-16 w-16" />
            </div>
          )}
          <span className="absolute top-4 right-4 bg-brand-600 text-xs font-bold text-white px-3 py-1.5 rounded-full uppercase tracking-widest">
            {listing.condition}
          </span>
        </div>

        {/* Content details */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-bold text-brand-400 uppercase tracking-widest">
            <Tag className="h-4 w-4" />
            <span>{language === 'en' ? listing.category.nameEn : listing.category.nameAr}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white leading-tight">{listing.title}</h1>

          <div className="border-t border-gray-800 pt-4 mt-4">
            <h3 className="text-lg font-bold text-white mb-2">{language === 'en' ? 'Description' : 'الوصف'}</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
          </div>
        </div>

        {/* Owner Trust Box */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-brand-500/10">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 uppercase tracking-wider block">{t('owner')}</span>
            <span className="text-lg font-bold text-white">{listing.owner.name}</span>
            <span className="text-sm text-gray-400 block">{listing.owner.email}</span>
          </div>
          {trustScore ? (
            <div className="flex items-center space-x-2 bg-brand-500/10 px-4 py-2 rounded-xl border border-brand-500/20 rtl:space-x-reverse">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="text-xl font-bold text-white">{trustScore}</span>
              <span className="text-xs text-gray-400">({reviews.length} {language === 'en' ? 'reviews' : 'تقييمات'})</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">{language === 'en' ? 'No reviews yet' : 'لا توجد تقييمات بعد'}</span>
          )}
        </div>
      </div>

      {/* Booking Widget column */}
      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-brand-500/20 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <div>
              <span className="text-xs text-gray-500 block">{t('daily_price')}</span>
              <span className="text-2xl font-extrabold text-white">${Number(listing.dailyPrice)}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">{t('deposit_amount')}</span>
              <span className="text-lg font-bold text-brand-300">${Number(listing.depositAmount)}</span>
            </div>
          </div>

          {bookingSuccess && (
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-400 flex items-start space-x-2 rtl:space-x-reverse">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
              <span>{t('booking_success')}</span>
            </div>
          )}

          {bookingError && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex items-start space-x-2 rtl:space-x-reverse">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
              <span>{bookingError}</span>
            </div>
          )}

          <form onSubmit={handleBooking} className="space-y-4">
            {/* Start Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('start_date')}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl py-3 pl-10 pr-4 text-white bg-dark-800 border border-gray-700 focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('end_date')}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl py-3 pl-10 pr-4 text-white bg-dark-800 border border-gray-700 focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('payment_method')}</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center space-x-2 rtl:space-x-reverse bg-dark-900 border border-gray-800 p-3 rounded-xl cursor-pointer hover:bg-dark-800 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment"
                    checked={paymentMethod === 'Online Payment'}
                    onChange={() => setPaymentMethod('Online Payment')}
                    className="text-brand-500 focus:ring-brand-500"
                  />
                  <span className="text-sm">{t('online_payment')}</span>
                </label>
                <label className="flex items-center space-x-2 rtl:space-x-reverse bg-dark-900 border border-gray-800 p-3 rounded-xl cursor-pointer hover:bg-dark-800 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash On Pickup"
                    checked={paymentMethod === 'Cash On Pickup'}
                    onChange={() => setPaymentMethod('Cash On Pickup')}
                    className="text-brand-500 focus:ring-brand-500"
                  />
                  <span className="text-sm">{t('cash_payment')}</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={bookingLoading || listing.ownerId === user?.id}
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-3.5 font-bold text-white shadow-lg shadow-brand-600/20 transition disabled:opacity-50 mt-4 uppercase tracking-wider text-sm flex items-center justify-center gap-2"
            >
              {bookingLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>{language === 'en' ? 'Processing...' : 'جاري المعالجة...'}</span>
                </>
              ) : listing.ownerId === user?.id ? (
                <span>{language === 'en' ? 'Your Listing' : 'عرضك الخاص'}</span>
              ) : (
                <span>{t('rent_now')}</span>
              )}
            </button>
          </form>

          {/* Secure Deposit Guarantee */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse bg-dark-900/50 p-4 rounded-xl border border-gray-800">
            <Shield className="h-8 w-8 text-brand-400 flex-shrink-0" />
            <p className="text-xs text-gray-400">
              {language === 'en'
                ? 'Deposits are held safely and only deducted if damage is reported by the owner within 48h after return.'
                : 'يتم الاحتفاظ بمبالغ التأمين بشكل آمن، ولا يتم خصمها إلا إذا أبلغ المالك عن حدوث ضرر خلال ٤٨ ساعة من الإرجاع.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
