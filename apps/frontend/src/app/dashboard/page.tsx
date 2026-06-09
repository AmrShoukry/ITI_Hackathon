'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import {
  Calendar, Check, X, Shield, PlusCircle, AlertOctagon, Star, HelpCircle, UserCheck, Eye
} from 'lucide-react';

export default function DashboardPage() {
  const { user, token, refreshProfile } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  // Active tab inside dashboards
  const [activeTab, setActiveTab] = useState<'bookings' | 'listings' | 'requests' | 'admin'>('bookings');

  // Common listing creation state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState('New');
  const [dailyPrice, setDailyPrice] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [photoUrls, setPhotoUrls] = useState('');

  // Loaded data
  const [categories, setCategories] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [allVerifications, setAllVerifications] = useState<any[]>([]);

  // Dialog / action states
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [damageBookingId, setDamageBookingId] = useState<string | null>(null);
  const [damageDesc, setDamageDesc] = useState('');
  const [damageDeduction, setDamageDeduction] = useState('');

  const [uiError, setUiError] = useState('');
  const [uiSuccess, setUiSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }

    // Load appropriate data
    fetchCategories();
    fetchDashboardData();
  }, [user, token]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/listings/categories`);
      setCategories(res.data);
      if (res.data.length > 0) setCategoryId(res.data[0].id.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDashboardData = async () => {
    if (!user) return;
    setUiError('');
    setUiSuccess('');

    try {
      if (user.role === 'RENTER') {
        setActiveTab('bookings');
        const res = await axios.get(`${API_URL}/bookings`);
        setMyBookings(res.data);
      } else if (user.role === 'OWNER') {
        setActiveTab('listings');
        const bookingsRes = await axios.get(`${API_URL}/bookings`);
        setMyBookings(bookingsRes.data.filter((b: any) => b.renterId === user.id));
        setIncomingRequests(bookingsRes.data.filter((b: any) => b.listing.ownerId === user.id));

        const listingsRes = await axios.get(`${API_URL}/listings?ownerId=${user.id}`);
        setMyListings(listingsRes.data);
      } else if (user.role === 'ADMIN') {
        setActiveTab('admin');
        const bookingsRes = await axios.get(`${API_URL}/bookings`);
        setIncomingRequests(bookingsRes.data);
        const verificationsRes = await axios.get(`${API_URL}/auth/admin/verifications`);
        setAllVerifications(verificationsRes.data);
      }
    } catch (e: any) {
      setUiError(e.response?.data?.message || 'Error loading dashboard data');
    }
  };

  const handleVerificationAction = async (verificationId: string, action: 'approve' | 'reject') => {
    setUiError('');
    setUiSuccess('');
    try {
      await axios.patch(`${API_URL}/auth/admin/verifications/${verificationId}/${action}`);
      setUiSuccess(
        action === 'approve'
          ? language === 'en'
            ? 'Owner approved successfully!'
            : 'تمت الموافقة على المالك بنجاح!'
          : language === 'en'
            ? 'Owner rejected successfully!'
            : 'تم رفض المالك بنجاح!'
      );
      fetchDashboardData();
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to update verification status');
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setUiError('');
    setUiSuccess('');
    setFormLoading(true);

    try {
      const urls = photoUrls ? photoUrls.split(',').map((u) => u.trim()) : [];
      await axios.post(`${API_URL}/listings`, {
        title,
        description,
        categoryId: parseInt(categoryId, 10),
        condition,
        dailyPrice: parseFloat(dailyPrice),
        depositAmount: parseFloat(depositAmount),
        photoUrls: urls,
      });

      setUiSuccess(language === 'en' ? 'Listing created successfully!' : 'تم إنشاء العرض بنجاح!');
      setTitle('');
      setDescription('');
      setDailyPrice('');
      setDepositAmount('');
      setPhotoUrls('');
      fetchDashboardData();
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setFormLoading(false);
    }
  };

  const handleResolveBooking = async (bookingId: string, status: 'Approved' | 'Rejected') => {
    setUiError('');
    setUiSuccess('');
    try {
      await axios.post(`${API_URL}/bookings/${bookingId}/resolve`, { status });
      setUiSuccess(
        status === 'Approved'
          ? language === 'en' ? 'Booking approved successfully!' : 'تمت الموافقة على الحجز!'
          : language === 'en' ? 'Booking rejected successfully!' : 'تم رفض الحجز!'
      );
      fetchDashboardData();
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to resolve booking request');
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    setUiError('');
    setUiSuccess('');
    try {
      await axios.post(`${API_URL}/bookings/${bookingId}/status`, { status });
      setUiSuccess(language === 'en' ? `Booking marked as ${status}!` : `تم تحديث حالة الحجز إلى ${status}!`);
      fetchDashboardData();
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBookingId) return;

    setUiError('');
    setUiSuccess('');
    try {
      await axios.post(`${API_URL}/bookings/${reviewBookingId}/reviews`, {
        rating: parseInt(rating, 10),
        comment,
      });

      setUiSuccess(language === 'en' ? 'Review submitted successfully!' : 'تم إرسال التقييم بنجاح!');
      setReviewBookingId(null);
      setComment('');
      fetchDashboardData();
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleDamageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!damageBookingId) return;

    setUiError('');
    setUiSuccess('');
    try {
      await axios.post(`${API_URL}/bookings/${damageBookingId}/damage`, {
        description: damageDesc,
        deductionAmount: parseFloat(damageDeduction),
      });

      setUiSuccess(language === 'en' ? 'Damage report submitted and deposit deducted!' : 'تم إرسال تقرير الضرر وخصم التأمين!');
      setDamageBookingId(null);
      setDamageDesc('');
      setDamageDeduction('');
      fetchDashboardData();
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to submit damage report');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="glass-panel p-8 rounded-3xl border border-brand-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            {t('welcome')}, {user.name}!
          </h1>
          <p className="text-gray-400 mt-1">
            {language === 'en'
              ? `You are logged in as a ${user.role}.`
              : `أنت مسجل كـ ${user.role === 'OWNER' ? 'مالك' : user.role === 'ADMIN' ? 'مدير' : 'مستأجر'}.`}
          </p>
        </div>

        {user.role === 'OWNER' && (
          <div className="flex items-center space-x-2 bg-brand-500/10 px-4 py-2 rounded-xl border border-brand-500/20 rtl:space-x-reverse">
            <Shield className="h-5 w-5 text-brand-400" />
            <span className="text-sm font-semibold">
              {language === 'en' ? 'Identity Status: VERIFIED' : 'حالة الهوية: موثقة'}
            </span>
          </div>
        )}
      </div>

      {uiError && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          {uiError}
        </div>
      )}

      {uiSuccess && (
        <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-400">
          {uiSuccess}
        </div>
      )}

      {/* Role Tabs Nav */}
      <div className="flex border-b border-gray-800 gap-6">
        {user.role === 'RENTER' && (
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 font-bold text-sm transition ${
              activeTab === 'bookings' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t('my_bookings')}
          </button>
        )}

        {user.role === 'OWNER' && (
          <>
            <button
              onClick={() => setActiveTab('listings')}
              className={`pb-4 font-bold text-sm transition ${
                activeTab === 'listings' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t('my_listings')}
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-4 font-bold text-sm transition ${
                activeTab === 'requests' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t('booking_requests')}
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-4 font-bold text-sm transition ${
                activeTab === 'bookings' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t('my_bookings')}
            </button>
          </>
        )}

        {user.role === 'ADMIN' && (
          <>
            <button
              onClick={() => setActiveTab('admin')}
              className={`pb-4 font-bold text-sm transition ${
                activeTab === 'admin' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t('admin_governance')}
            </button>
          </>
        )}
      </div>

      {/* TAB CONTENT */}

      {/* 1. Renter My Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">{t('my_bookings')}</h2>
          {myBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-10">{language === 'en' ? 'No bookings found.' : 'لا توجد حجوزات.'}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myBookings.map((b) => (
                <div key={b.id} className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row justify-between gap-4 border border-gray-800">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">{b.listing.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-brand-400" /> {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</span>
                      <span>{t('total_price')}: <b className="text-white">${b.payments[0]?.amount}</b></span>
                      <span>{t('deposit_amount')}: <b className="text-white">${b.deposit?.amount}</b></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      b.status === 'Approved' ? 'bg-green-500/20 text-green-300' :
                      b.status === 'Active' ? 'bg-blue-500/20 text-blue-300' :
                      b.status === 'Returned' ? 'bg-purple-500/20 text-purple-300' :
                      b.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {t(`status_${b.status.toLowerCase()}`)}
                    </span>

                    {/* Actions: Cancel if Pending, Review if Returned */}
                    {b.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'Cancelled')}
                        className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition"
                      >
                        {t('status_cancelled')}
                      </button>
                    )}

                    {b.status === 'Returned' && (
                      <button
                        onClick={() => setReviewBookingId(b.id)}
                        className="rounded-lg bg-brand-500/10 border border-brand-500/20 px-4 py-1.5 text-xs text-brand-300 hover:bg-brand-500/20 transition"
                      >
                        {t('leave_review')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leave Review Dialog Overlay */}
          {reviewBookingId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
              <form onSubmit={handleReviewSubmit} className="glass-panel p-6 rounded-2xl w-full max-w-md space-y-4 border border-brand-500/30">
                <h3 className="text-lg font-bold text-white">{t('leave_review')}</h3>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase">{t('rating')}</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full rounded-xl py-2 px-3 bg-dark-800 text-white border border-gray-700 focus:outline-none"
                  >
                    <option value="5">5 {language === 'en' ? 'Stars (Excellent)' : 'نجوم (ممتاز)'}</option>
                    <option value="4">4 {language === 'en' ? 'Stars (Good)' : 'نجوم (جيد)'}</option>
                    <option value="3">3 {language === 'en' ? 'Stars (Average)' : 'نجوم (متوسط)'}</option>
                    <option value="2">2 {language === 'en' ? 'Stars (Poor)' : 'نجوم (ضعيف)'}</option>
                    <option value="1">1 {language === 'en' ? 'Star (Terrible)' : 'نجمة واحدة (سيء جداً)'}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase">{t('comment')}</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter comments..."
                    className="w-full rounded-xl p-3 bg-dark-800 text-white border border-gray-700 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewBookingId(null)}
                    className="rounded-lg bg-gray-800 hover:bg-gray-700 px-4 py-2 text-xs font-semibold"
                  >
                    {language === 'en' ? 'Close' : 'إغلاق'}
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-brand-600 hover:bg-brand-500 px-4 py-2 text-xs font-semibold text-white"
                  >
                    {t('submit_review')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 2. Owner listings management */}
      {activeTab === 'listings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List of my listings */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white">{t('my_listings')}</h2>
            {myListings.length === 0 ? (
              <p className="text-gray-500 text-center py-10">{language === 'en' ? 'You have no listings.' : 'لا توجد عروض لديك.'}</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myListings.map((item) => (
                  <div key={item.id} className="glass-panel p-5 rounded-2xl flex justify-between items-center border border-gray-800">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.category.nameEn} | Daily Price: ${Number(item.dailyPrice)}</p>
                    </div>
                    <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create Listing Form */}
          <div className="glass-panel p-6 rounded-2xl border border-brand-500/20 h-fit space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
              <PlusCircle className="h-5 w-5 text-brand-400" />
              <span>{t('create_listing')}</span>
            </h2>

            <form onSubmit={handleCreateListing} className="space-y-3">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">{t('title_label')}</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">{t('desc_label')}</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg p-3 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">{t('category_label')}</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{language === 'en' ? c.nameEn : c.nameAr}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">{t('condition_label')}</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Acceptable">Acceptable</option>
                </select>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">{t('price_label')}</label>
                  <input
                    type="number"
                    required
                    value={dailyPrice}
                    onChange={(e) => setDailyPrice(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">{t('deposit_label')}</label>
                  <input
                    type="number"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Photos */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">{t('photos_label')}</label>
                <input
                  type="text"
                  value={photoUrls}
                  onChange={(e) => setPhotoUrls(e.target.value)}
                  placeholder="https://example.com/p1.jpg, https://example.com/p2.jpg"
                  className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-3 font-semibold text-white transition disabled:opacity-50 mt-2"
              >
                {formLoading ? 'Submitting...' : t('submit_listing')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Owner Incoming Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">{t('booking_requests')}</h2>
          {incomingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-10">{language === 'en' ? 'No incoming booking requests.' : 'لا توجد طلبات حجز واردة.'}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {incomingRequests.map((b) => (
                <div key={b.id} className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row justify-between gap-4 border border-gray-800">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{b.listing.title}</h3>
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">Renter: {b.renter.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-brand-400" /> {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</span>
                      <span>Total Earnings: <b className="text-white">${b.payments[0]?.amount}</b></span>
                      <span>Deposit Amount: <b className="text-white">${b.deposit?.amount}</b></span>
                      <span>Status: <b className="text-brand-300">{b.status}</b></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-between md:justify-end">
                    {/* Resolve actions */}
                    {b.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleResolveBooking(b.id, 'Approved')}
                          className="rounded-lg bg-green-600 hover:bg-green-500 px-3.5 py-1.5 text-xs font-bold text-white flex items-center gap-1"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>{t('approve_btn')}</span>
                        </button>
                        <button
                          onClick={() => handleResolveBooking(b.id, 'Rejected')}
                          className="rounded-lg bg-red-600 hover:bg-red-500 px-3.5 py-1.5 text-xs font-bold text-white flex items-center gap-1"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>{t('reject_btn')}</span>
                        </button>
                      </>
                    )}

                    {/* Manage active rental states */}
                    {b.status === 'Approved' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'Active')}
                        className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white"
                      >
                        {t('start_rental')}
                      </button>
                    )}

                    {b.status === 'Active' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'Returned')}
                        className="rounded-lg bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white"
                      >
                        {t('confirm_return')}
                      </button>
                    )}

                    {/* Mark damage if returned */}
                    {b.status === 'Returned' && !b.damageReports?.length && (
                      <button
                        onClick={() => setDamageBookingId(b.id)}
                        className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition flex items-center gap-1"
                      >
                        <AlertOctagon className="h-4 w-4" />
                        <span>{t('report_damage')}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Report Damage Overlay Dialog */}
          {damageBookingId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
              <form onSubmit={handleDamageSubmit} className="glass-panel p-6 rounded-2xl w-full max-w-md space-y-4 border border-red-500/30">
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  <AlertOctagon className="h-5 w-5 text-red-500" />
                  <span>{t('report_damage')}</span>
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase">{t('damage_desc')}</label>
                  <textarea
                    required
                    rows={3}
                    value={damageDesc}
                    onChange={(e) => setDamageDesc(e.target.value)}
                    placeholder="Enter description of the damage..."
                    className="w-full rounded-xl p-3 bg-dark-800 text-white border border-gray-700 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase">{t('deduction_amount')}</label>
                  <input
                    type="number"
                    required
                    value={damageDeduction}
                    onChange={(e) => setDamageDeduction(e.target.value)}
                    placeholder="100.00"
                    className="w-full rounded-xl py-2 px-3 bg-dark-800 text-white border border-gray-700 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDamageBookingId(null)}
                    className="rounded-lg bg-gray-800 hover:bg-gray-700 px-4 py-2 text-xs font-semibold"
                  >
                    {language === 'en' ? 'Close' : 'إغلاق'}
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-semibold text-white"
                  >
                    {t('submit_damage')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 4. Admin Governance Portal */}
      {activeTab === 'admin' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">{t('pending_verifications')}</h2>
          {allVerifications.length === 0 ? (
            <p className="text-gray-500 text-center py-10">{language === 'en' ? 'No verifications pending review.' : 'لا توجد طلبات توثيق معلقة.'}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {allVerifications.map((v) => (
                <div key={v.id} className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gray-800">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">{v.owner.name}</h3>
                    <p className="text-sm text-gray-400">Email: {v.owner.email}</p>
                    <a
                      href={v.nationalIdUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-400 hover:underline flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Uploaded ID</span>
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerificationAction(v.id, 'approve')}
                      className="rounded-lg bg-green-600 hover:bg-green-500 px-4 py-2 text-xs font-bold text-white flex items-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      <span>{t('approve_btn')}</span>
                    </button>
                    <button
                      onClick={() => handleVerificationAction(v.id, 'reject')}
                      className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-bold text-white flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      <span>{t('reject_btn')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
