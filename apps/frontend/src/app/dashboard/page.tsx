'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Check,
  X,
  Shield,
  PlusCircle,
  AlertOctagon,
  Star,
  HelpCircle,
  UserCheck,
  Eye,
  BadgeCheck,
  ListChecks,
  BarChart3,
  Coins,
  TrendingUp,
} from 'lucide-react';
import { api } from '../../lib/api';

export default function DashboardPage() {
  const { user, token, refreshProfile } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  // Active tab inside dashboards
  const [activeTab, setActiveTab] = useState<
    'bookings' | 'listings' | 'requests' | 'admin'
  >('bookings');

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
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminRoles, setAdminRoles] = useState<any[]>([]);
  const [adminCategories, setAdminCategories] = useState<any[]>([]);
  const [adminSettings, setAdminSettings] = useState<any[]>([]);
  const [adminAnalytics, setAdminAnalytics] = useState<any | null>(null);

  // Dialog / action states
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [damageBookingId, setDamageBookingId] = useState<string | null>(null);
  const [damageDesc, setDamageDesc] = useState('');
  const [damageDeduction, setDamageDeduction] = useState('');
  const [adminSection, setAdminSection] = useState<
    | 'overview'
    | 'users'
    | 'listings'
    | 'verifications'
    | 'categories'
    | 'settings'
  >('overview');
  const [newCategory, setNewCategory] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
  });
  const [userRoleDrafts, setUserRoleDrafts] = useState<Record<string, string>>(
    {},
  );
  const [userStatusDrafts, setUserStatusDrafts] = useState<
    Record<string, string>
  >({});
  const [categoryDrafts, setCategoryDrafts] = useState<Record<number, any>>({});
  const [settingDrafts, setSettingDrafts] = useState<Record<string, string>>(
    {},
  );

  // Listing editing states
  const [editListingId, setEditListingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editCondition, setEditCondition] = useState('New');
  const [editDailyPrice, setEditDailyPrice] = useState('');
  const [editDepositAmount, setEditDepositAmount] = useState('');
  const [editPhotoUrls, setEditPhotoUrls] = useState('');

  const [uiError, setUiError] = useState('');
  const [uiSuccess, setUiSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [payLoadingId, setPayLoadingId] = useState<string | null>(null);

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
      const res = await api.get('/listings/categories');
      setCategories(res.data);
      if (res.data.length > 0) setCategoryId(res.data[0].id.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDashboardData = async (keepMessages = false) => {
    if (!user) return;
    setUiError('');
    if (!keepMessages) {
      setUiSuccess('');
    }

    try {
      if (user.role === 'RENTER') {
        setActiveTab('bookings');
        const res = await api.get('/bookings');
        setMyBookings(res.data);
      } else if (user.role === 'OWNER') {
        setActiveTab('listings');
        const bookingsRes = await api.get('/bookings');
        setMyBookings(
          bookingsRes.data.filter((b: any) => b.renterId === user.id),
        );
        setIncomingRequests(
          bookingsRes.data.filter((b: any) => b.listing.ownerId === user.id),
        );

        const listingsRes = await api.get('/listings', {
          params: { ownerId: user.id },
        });
        setMyListings(listingsRes.data);
      } else if (user.role === 'ADMIN') {
        setActiveTab('admin');
        const [
          bookingsRes,
          verificationsRes,
          listingsRes,
          usersRes,
          rolesRes,
          categoriesRes,
          settingsRes,
          analyticsRes,
        ] = await Promise.all([
          api.get('/bookings'),
          api.get('/admin/verifications'),
          api.get('/admin/listings', {
            params: { status: 'Pending Approval' },
          }),
          api.get('/admin/users'),
          api.get('/admin/roles'),
          api.get('/admin/categories'),
          api.get('/admin/settings'),
          api.get('/admin/analytics'),
        ]);

        setIncomingRequests(bookingsRes.data);
        setAllVerifications(verificationsRes.data);
        setPendingListings(listingsRes.data);
        setAdminUsers(usersRes.data);
        setAdminRoles(rolesRes.data);
        setAdminCategories(categoriesRes.data);
        setAdminSettings(settingsRes.data);
        setAdminAnalytics(analyticsRes.data);
        setUserRoleDrafts(
          Object.fromEntries(
            usersRes.data.map((userItem: any) => [
              userItem.id,
              userItem.role?.name || 'RENTER',
            ]),
          ),
        );
        setUserStatusDrafts(
          Object.fromEntries(
            usersRes.data.map((userItem: any) => [
              userItem.id,
              userItem.status || 'Active',
            ]),
          ),
        );
        setCategoryDrafts(
          Object.fromEntries(
            categoriesRes.data.map((category: any) => [
              category.id,
              { ...category },
            ]),
          ),
        );
        setSettingDrafts(
          Object.fromEntries(
            settingsRes.data.map((setting: any) => [
              setting.settingKey,
              setting.settingValue,
            ]),
          ),
        );
      }
    } catch (e: any) {
      setUiError(e.response?.data?.message || 'Error loading dashboard data');
    }
  };

  const handleVerificationAction = async (
    verificationId: string,
    action: 'approve' | 'reject',
  ) => {
    setUiError('');
    setUiSuccess('');
    try {
      await api.patch(`/admin/verifications/${verificationId}/${action}`);
      setUiSuccess(
        action === 'approve'
          ? language === 'en'
            ? 'Owner approved successfully!'
            : 'تمت الموافقة على المالك بنجاح!'
          : language === 'en'
            ? 'Owner rejected successfully!'
            : 'تم رفض المالك بنجاح!',
      );
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(
        err.response?.data?.message || 'Failed to update verification status',
      );
    }
  };

  const handleListingAction = async (
    listingId: string,
    action: 'approve' | 'reject',
  ) => {
    setUiError('');
    setUiSuccess('');
    try {
      await api.post(`/admin/listings/${listingId}/${action}`);
      setUiSuccess(
        action === 'approve'
          ? language === 'en'
            ? 'Listing approved successfully!'
            : 'تمت الموافقة على العرض بنجاح!'
          : language === 'en'
            ? 'Listing rejected successfully!'
            : 'تم رفض العرض بنجاح!',
      );
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(
        err.response?.data?.message || 'Failed to update listing status',
      );
    }
  };

  const handleUserRoleSave = async (userId: string) => {
    const roleName = userRoleDrafts[userId];
    if (!roleName) return;
    setUiError('');
    setUiSuccess('');
    try {
      await api.patch(`/admin/users/${userId}/role`, { roleName });
      setUiSuccess(
        language === 'en'
          ? 'User role updated successfully!'
          : 'تم تحديث دور المستخدم بنجاح!',
      );
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleUserStatusSave = async (userId: string) => {
    const status = userStatusDrafts[userId];
    if (!status) return;
    setUiError('');
    setUiSuccess('');
    try {
      await api.patch(`/admin/users/${userId}/status`, { status });
      setUiSuccess(
        language === 'en'
          ? 'User status updated successfully!'
          : 'تم تحديث حالة المستخدم بنجاح!',
      );
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleCategoryCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUiError('');
    setUiSuccess('');
    try {
      await api.post('/admin/categories', newCategory);
      setUiSuccess(
        language === 'en'
          ? 'Category created successfully!'
          : 'تم إنشاء الفئة بنجاح!',
      );
      setNewCategory({
        nameEn: '',
        nameAr: '',
        descriptionEn: '',
        descriptionAr: '',
      });
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleCategorySave = async (categoryId: number) => {
    const draft = categoryDrafts[categoryId];
    if (!draft) return;
    setUiError('');
    setUiSuccess('');
    try {
      await api.patch(`/admin/categories/${categoryId}`, draft);
      setUiSuccess(
        language === 'en'
          ? 'Category updated successfully!'
          : 'تم تحديث الفئة بنجاح!',
      );
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleCategoryDelete = async (categoryId: number) => {
    setUiError('');
    setUiSuccess('');
    try {
      await api.delete(`/admin/categories/${categoryId}`);
      setUiSuccess(
        language === 'en'
          ? 'Category deleted successfully!'
          : 'تم حذف الفئة بنجاح!',
      );
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleSettingSave = async (settingKey: string) => {
    setUiError('');
    setUiSuccess('');
    try {
      await api.patch(`/admin/settings/${settingKey}`, {
        settingValue: settingDrafts[settingKey] || '',
        description: adminSettings.find(
          (setting) => setting.settingKey === settingKey,
        )?.description,
      });
      setUiSuccess(
        language === 'en'
          ? 'Platform setting saved successfully!'
          : 'تم حفظ إعدادات المنصة بنجاح!',
      );
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to update setting');
    }
  };

  const handlePayNow = async (bookingId: string) => {
    setUiError('');
    setPayLoadingId(bookingId);
    try {
      const res = await api.post('/payments/create-checkout-session', {
        bookingId,
      });
      window.location.href = res.data.url;
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to start payment');
      setPayLoadingId(null);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setUiError('');
    setUiSuccess('');
    setFormLoading(true);

    try {
      const urls = photoUrls ? photoUrls.split(',').map((u) => u.trim()) : [];
      await api.post('/listings', {
        title,
        description,
        categoryId: parseInt(categoryId, 10),
        condition,
        dailyPrice: parseFloat(dailyPrice),
        depositAmount: parseFloat(depositAmount),
        photoUrls: urls,
      });

      setUiSuccess(
        language === 'en'
          ? 'Listing created successfully!'
          : 'تم إنشاء العرض بنجاح!',
      );
      setTitle('');
      setDescription('');
      setDailyPrice('');
      setDepositAmount('');
      setPhotoUrls('');
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditListingClick = (item: any) => {
    setEditListingId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditCategoryId(item.categoryId.toString());
    setEditCondition(item.condition);
    setEditDailyPrice(item.dailyPrice.toString());
    setEditDepositAmount(item.depositAmount.toString());
    setEditPhotoUrls(item.photos?.map((p: any) => p.photoUrl).join(', ') || '');
  };

  const handleEditListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editListingId) return;
    setUiError('');
    setUiSuccess('');
    setFormLoading(true);

    try {
      const urls = editPhotoUrls
        ? editPhotoUrls.split(',').map((u) => u.trim())
        : [];
      await api.put(`/listings/${editListingId}`, {
        title: editTitle,
        description: editDescription,
        categoryId: parseInt(editCategoryId, 10),
        condition: editCondition,
        dailyPrice: parseFloat(editDailyPrice),
        depositAmount: parseFloat(editDepositAmount),
        photoUrls: urls,
      });

      setUiSuccess(
        language === 'en'
          ? 'Listing updated successfully!'
          : 'تم تحديث العرض بنجاح!',
      );
      setEditListingId(null);
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to update listing');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    const confirmDelete = window.confirm(
      language === 'en'
        ? 'Are you sure you want to delete this listing?'
        : 'هل أنت متأكد من حذف هذا العرض؟',
    );
    if (!confirmDelete) return;

    setUiError('');
    setUiSuccess('');
    try {
      await api.delete(`/listings/${listingId}`);
      setUiSuccess(
        language === 'en'
          ? 'Listing deleted successfully!'
          : 'تم حذف العرض بنجاح!',
      );
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  const handleResolveBooking = async (
    bookingId: string,
    status: 'Approved' | 'Rejected',
  ) => {
    setUiError('');
    setUiSuccess('');
    try {
      await api.post(`/bookings/${bookingId}/resolve`, { status });
      setUiSuccess(
        status === 'Approved'
          ? language === 'en'
            ? 'Booking approved successfully!'
            : 'تمت الموافقة على الحجز!'
          : language === 'en'
            ? 'Booking rejected successfully!'
            : 'تم رفض الحجز!',
      );
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(
        err.response?.data?.message || 'Failed to resolve booking request',
      );
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    setUiError('');
    setUiSuccess('');
    try {
      await api.post(`/bookings/${bookingId}/status`, { status });
      setUiSuccess(
        language === 'en'
          ? `Booking marked as ${status}!`
          : `تم تحديث حالة الحجز إلى ${status}!`,
      );
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(
        err.response?.data?.message || 'Failed to update booking status',
      );
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBookingId) return;

    setUiError('');
    setUiSuccess('');
    try {
      await api.post(`/bookings/${reviewBookingId}/reviews`, {
        rating: parseInt(rating, 10),
        comment,
      });

      setUiSuccess(
        language === 'en'
          ? 'Review submitted successfully!'
          : 'تم إرسال التقييم بنجاح!',
      );
      setReviewBookingId(null);
      setComment('');
      fetchDashboardData(true);
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
      await api.post(`/bookings/${damageBookingId}/damage`, {
        description: damageDesc,
        deductionAmount: parseFloat(damageDeduction),
      });

      setUiSuccess(
        language === 'en'
          ? 'Damage report submitted and deposit deducted!'
          : 'تم إرسال تقرير الضرر وخصم التأمين!',
      );
      setDamageBookingId(null);
      setDamageDesc('');
      setDamageDeduction('');
      fetchDashboardData(true);
    } catch (err: any) {
      setUiError(
        err.response?.data?.message || 'Failed to submit damage report',
      );
    }
  };

  const activeRentalsCount = adminAnalytics?.activeRentals ?? 0;
  const pendingBookingsCount = incomingRequests.filter(
    (booking) => booking.status === 'Pending',
  ).length;
  const estimatedRevenue = adminAnalytics?.revenue ?? 0;
  const topItemEntries = (adminAnalytics?.topItems ?? []).slice(0, 3);

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
              {language === 'en'
                ? 'Identity Status: VERIFIED'
                : 'حالة الهوية: موثقة'}
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
              activeTab === 'bookings'
                ? 'text-brand-400 border-b-2 border-brand-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}>
            {t('my_bookings')}
          </button>
        )}

        {user.role === 'OWNER' && (
          <>
            <button
              onClick={() => setActiveTab('listings')}
              className={`pb-4 font-bold text-sm transition ${
                activeTab === 'listings'
                  ? 'text-brand-400 border-b-2 border-brand-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
              {t('my_listings')}
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-4 font-bold text-sm transition ${
                activeTab === 'requests'
                  ? 'text-brand-400 border-b-2 border-brand-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
              {t('booking_requests')}
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-4 font-bold text-sm transition ${
                activeTab === 'bookings'
                  ? 'text-brand-400 border-b-2 border-brand-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
              {t('my_bookings')}
            </button>
          </>
        )}

        {user.role === 'ADMIN' && (
          <>
            <button
              onClick={() => setActiveTab('admin')}
              className={`pb-4 font-bold text-sm transition ${
                activeTab === 'admin'
                  ? 'text-brand-400 border-b-2 border-brand-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
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
            <p className="text-gray-500 text-center py-10">
              {language === 'en' ? 'No bookings found.' : 'لا توجد حجوزات.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row justify-between gap-4 border border-gray-800">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">
                      {b.listing.title}
                    </h3>
                    {b.listing.owner && (
                      <p className="text-xs text-gray-500">
                        {language === 'en' ? 'Owner' : 'المالك'}:{' '}
                        <span
                          onClick={() =>
                            router.push(`/profile/${b.listing.owner.id}`)
                          }
                          className="text-brand-400 hover:underline cursor-pointer font-semibold">
                          {b.listing.owner.name}
                        </span>
                      </p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-brand-400" />{' '}
                        {new Date(b.startDate).toLocaleDateString()} -{' '}
                        {new Date(b.endDate).toLocaleDateString()}
                      </span>
                      <span>
                        {t('total_price')}:{' '}
                        <b className="text-white">${b.payments[0]?.amount}</b>
                      </span>
                      <span>
                        {t('deposit_amount')}:{' '}
                        <b className="text-white">${b.deposit?.amount}</b>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === 'Approved'
                          ? 'bg-green-500/20 text-green-300'
                          : b.status === 'Active'
                            ? 'bg-blue-500/20 text-blue-300'
                            : b.status === 'Returned'
                              ? 'bg-purple-500/20 text-purple-300'
                              : b.status === 'Pending'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-red-500/20 text-red-300'
                      }`}>
                      {t(`status_${b.status.toLowerCase()}`)}
                    </span>

                    {/* Actions: Cancel if Pending, Pay if online payment pending, Review if Returned */}
                    {b.status === 'Pending' &&
                      b.payments?.some(
                        (p: any) =>
                          p.paymentMethod === 'Online Payment' &&
                          p.status !== 'Paid',
                      ) && (
                        <button
                          onClick={() => handlePayNow(b.id)}
                          disabled={payLoadingId === b.id}
                          className="rounded-lg bg-brand-600 hover:bg-brand-500 px-4 py-1.5 text-xs font-bold text-white transition disabled:opacity-50">
                          {payLoadingId === b.id
                            ? language === 'en'
                              ? 'Redirecting...'
                              : 'جاري التحويل...'
                            : language === 'en'
                              ? 'Pay Now'
                              : 'ادفع الآن'}
                        </button>
                      )}

                    {b.status === 'Pending' && (
                      <button
                        onClick={() => router.push(`/bookings/${b.id}`)}
                        className="rounded-lg bg-gray-800 hover:bg-gray-700 px-3 py-1.5 text-xs text-gray-300 transition">
                        {language === 'en' ? 'View' : 'عرض'}
                      </button>
                    )}

                    {b.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'Cancelled')}
                        className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition">
                        {t('status_cancelled')}
                      </button>
                    )}

                    {/* Cancel approved bookings (with refund for online payments) */}
                    {b.status === 'Approved' && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              language === 'en'
                                ? 'Cancel this booking? If paid by card, you will receive a full refund.'
                                : 'إلغاء هذا الحجز؟ إذا تم الدفع بالبطاقة، ستسترد المبلغ كاملاً.',
                            )
                          ) {
                            handleUpdateStatus(b.id, 'Cancelled');
                          }
                        }}
                        className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition">
                        {language === 'en' ? 'Cancel Booking' : 'إلغاء الحجز'}
                      </button>
                    )}

                    {b.status === 'Returned' &&
                      !b.reviews?.some(
                        (r: any) => r.reviewerRole === 'Renter',
                      ) && (
                        <button
                          onClick={() => setReviewBookingId(b.id)}
                          className="rounded-lg bg-brand-500/10 border border-brand-500/20 px-4 py-1.5 text-xs text-brand-300 hover:bg-brand-500/20 transition">
                          {t('leave_review')}
                        </button>
                      )}
                  </div>
                </div>
              ))}
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
              <p className="text-gray-500 text-center py-10">
                {language === 'en'
                  ? 'You have no listings.'
                  : 'لا توجد عروض لديك.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myListings.map((item) => (
                  <div
                    key={item.id}
                    className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-gray-800">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {language === 'en'
                          ? item.category.nameEn
                          : item.category.nameAr}{' '}
                        | {t('daily_price') || 'Daily Price'}: $
                        {Number(item.dailyPrice)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
                          item.status === 'Active'
                            ? 'bg-green-500/10 text-green-300 border-green-500/20'
                            : item.status === 'Pending Approval'
                              ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
                              : 'bg-red-500/10 text-red-300 border-red-500/20'
                        }`}>
                        {item.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditListingClick(item)}
                          className="rounded-lg bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 text-xs text-brand-300 hover:bg-brand-500/20 transition font-semibold">
                          {language === 'en' ? 'Edit' : 'تعديل'}
                        </button>
                        <button
                          onClick={() => handleDeleteListing(item.id)}
                          className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition font-semibold">
                          {language === 'en' ? 'Delete' : 'حذف'}
                        </button>
                      </div>
                    </div>
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
                <label className="text-xs text-gray-400">
                  {t('title_label')}
                </label>
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
                <label className="text-xs text-gray-400">
                  {t('desc_label')}
                </label>
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
                <label className="text-xs text-gray-400">
                  {t('category_label')}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {language === 'en' ? c.nameEn : c.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">
                  {t('condition_label')}
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none">
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Acceptable">Acceptable</option>
                </select>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">
                    {t('price_label')}
                  </label>
                  <input
                    type="number"
                    required
                    value={dailyPrice}
                    onChange={(e) => setDailyPrice(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">
                    {t('deposit_label')}
                  </label>
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
                <label className="text-xs text-gray-400">
                  {t('photos_label')}
                </label>
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
                className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-3 font-semibold text-white transition disabled:opacity-50 mt-2">
                {formLoading ? 'Submitting...' : t('submit_listing')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Listing Overlay Dialog */}
      {editListingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <form
            onSubmit={handleEditListingSubmit}
            className="glass-panel p-6 rounded-2xl w-full max-w-lg space-y-4 border border-brand-500/30 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              <span>{language === 'en' ? 'Edit Listing' : 'تعديل العرض'}</span>
            </h3>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">
                {t('title_label')}
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">{t('desc_label')}</label>
              <textarea
                required
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full rounded-lg p-3 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">
                {t('category_label')}
              </label>
              <select
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none">
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'en' ? c.nameEn : c.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">
                {t('condition_label')}
              </label>
              <select
                value={editCondition}
                onChange={(e) => setEditCondition(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none">
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Acceptable">Acceptable</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-gray-400">
                  {t('price_label')}
                </label>
                <input
                  type="number"
                  required
                  value={editDailyPrice}
                  onChange={(e) => setEditDailyPrice(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">
                  {t('deposit_label')}
                </label>
                <input
                  type="number"
                  required
                  value={editDepositAmount}
                  onChange={(e) => setEditDepositAmount(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">
                {t('photos_label')}
              </label>
              <input
                type="text"
                value={editPhotoUrls}
                onChange={(e) => setEditPhotoUrls(e.target.value)}
                placeholder="https://example.com/p1.jpg, https://example.com/p2.jpg"
                className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditListingId(null)}
                className="rounded-lg bg-gray-800 hover:bg-gray-700 px-4 py-2 text-xs font-semibold">
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="rounded-lg bg-brand-600 hover:bg-brand-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">
                {formLoading
                  ? language === 'en'
                    ? 'Saving...'
                    : 'جاري الحفظ...'
                  : language === 'en'
                    ? 'Save Changes'
                    : 'حفظ التغييرات'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Owner Incoming Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">
            {t('booking_requests')}
          </h2>
          {incomingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              {language === 'en'
                ? 'No incoming booking requests.'
                : 'لا توجد طلبات حجز واردة.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {incomingRequests.map((b) => (
                <div
                  key={b.id}
                  className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row justify-between gap-4 border border-gray-800">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">
                        {b.listing.title}
                      </h3>
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                        Renter: {b.renter.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-brand-400" />{' '}
                        {new Date(b.startDate).toLocaleDateString()} -{' '}
                        {new Date(b.endDate).toLocaleDateString()}
                      </span>
                      <span>
                        Total Earnings:{' '}
                        <b className="text-white">${b.payments[0]?.amount}</b>
                      </span>
                      <span>
                        Deposit Amount:{' '}
                        <b className="text-white">${b.deposit?.amount}</b>
                      </span>
                      <span>
                        Status: <b className="text-brand-300">{b.status}</b>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-between md:justify-end">
                    {/* Resolve actions */}
                    {b.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleResolveBooking(b.id, 'Approved')}
                          className="rounded-lg bg-green-600 hover:bg-green-500 px-3.5 py-1.5 text-xs font-bold text-white flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" />
                          <span>{t('approve_btn')}</span>
                        </button>
                        <button
                          onClick={() => handleResolveBooking(b.id, 'Rejected')}
                          className="rounded-lg bg-red-600 hover:bg-red-500 px-3.5 py-1.5 text-xs font-bold text-white flex items-center gap-1">
                          <X className="h-3.5 w-3.5" />
                          <span>{t('reject_btn')}</span>
                        </button>
                      </>
                    )}

                    {/* Manage active rental states */}
                    {b.status === 'Approved' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'Active')}
                          className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white">
                          {t('start_rental')}
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                language === 'en'
                                  ? 'Cancel this approved booking? The renter will be fully refunded if paid by card.'
                                  : 'إلغاء هذا الحجز المعتمد؟ سيتم رد المبلغ بالكامل للمستأجر إذا كان قد دفع بالبطاقة.',
                              )
                            ) {
                              handleUpdateStatus(b.id, 'Cancelled');
                            }
                          }}
                          className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition">
                          {language === 'en' ? 'Cancel Booking' : 'إلغاء الحجز'}
                        </button>
                      </div>
                    )}

                    {b.status === 'Active' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'Returned')}
                        className="rounded-lg bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white">
                        {t('confirm_return')}
                      </button>
                    )}

                    {/* Mark damage if returned */}
                    {b.status === 'Returned' && !b.damageReports?.length && (
                      <button
                        onClick={() => setDamageBookingId(b.id)}
                        className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition flex items-center gap-1">
                        <AlertOctagon className="h-4 w-4" />
                        <span>{t('report_damage')}</span>
                      </button>
                    )}

                    {/* Review renter if returned and not yet reviewed */}
                    {b.status === 'Returned' &&
                      !b.reviews?.some(
                        (r: any) => r.reviewerRole === 'Owner',
                      ) && (
                        <button
                          onClick={() => setReviewBookingId(b.id)}
                          className="rounded-lg bg-purple-500/10 border border-purple-500/20 px-4 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span>
                            {language === 'en'
                              ? 'Review Renter'
                              : 'تقييم المستأجر'}
                          </span>
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
              <form
                onSubmit={handleDamageSubmit}
                className="glass-panel p-6 rounded-2xl w-full max-w-md space-y-4 border border-red-500/30">
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  <AlertOctagon className="h-5 w-5 text-red-500" />
                  <span>{t('report_damage')}</span>
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase">
                    {t('damage_desc')}
                  </label>
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
                  <label className="text-xs font-semibold text-gray-400 uppercase">
                    {t('deduction_amount')}
                  </label>
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
                    className="rounded-lg bg-gray-800 hover:bg-gray-700 px-4 py-2 text-xs font-semibold">
                    {language === 'en' ? 'Close' : 'إغلاق'}
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-semibold text-white">
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
          <div className="flex flex-wrap gap-2">
            {[
              ['overview', t('admin_overview')],
              ['users', t('admin_users')],
              ['listings', t('admin_listings')],
              ['verifications', t('pending_verifications')],
              ['categories', t('admin_categories')],
              ['settings', t('admin_settings')],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setAdminSection(key as any)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  adminSection === key
                    ? 'bg-brand-600 text-white'
                    : 'bg-dark-900 text-gray-400 hover:bg-gray-800'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {adminSection === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-gray-800">
                  <p className="text-xs uppercase tracking-widest text-gray-500">
                    {t('active_rentals')}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-white">
                    {activeRentalsCount}
                  </p>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-gray-800">
                  <p className="text-xs uppercase tracking-widest text-gray-500">
                    {t('revenue_summary')}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-white">
                    ${Number(estimatedRevenue).toFixed(2)}
                  </p>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-gray-800">
                  <p className="text-xs uppercase tracking-widest text-gray-500">
                    {t('pending_verifications')}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-white">
                    {allVerifications.length}
                  </p>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-gray-800">
                  <p className="text-xs uppercase tracking-widest text-gray-500">
                    {t('pending_listings')}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-white">
                    {pendingListings.length}
                  </p>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-brand-400" />
                  <h2 className="text-lg font-bold text-white">
                    {t('platform_analytics')}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                  <div className="rounded-xl border border-gray-800 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      {language === 'en'
                        ? 'Pending bookings'
                        : 'طلبات الحجز المعلقة'}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {pendingBookingsCount}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-800 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      {t('top_items')}
                    </p>
                    <div className="mt-2 space-y-1">
                      {topItemEntries.length === 0 ? (
                        <p className="text-gray-500">
                          {language === 'en'
                            ? 'No booking activity yet.'
                            : 'لا توجد حركة حجز بعد.'}
                        </p>
                      ) : (
                        topItemEntries.map((item: any) => (
                          <p
                            key={item.listingId}
                            className="flex items-center justify-between gap-2">
                            <span className="truncate">{item.title}</span>
                            <span className="font-semibold text-white">
                              {item.count}
                            </span>
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-800 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      {language === 'en'
                        ? 'Registered users'
                        : 'المستخدمون المسجلون'}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {adminUsers.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminSection === 'users' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                {t('manage_users')}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {adminUsers.map((adminUser) => (
                  <div
                    key={adminUser.id}
                    className="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {adminUser.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {adminUser.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {adminUser.phone}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                        <span className="rounded-full bg-gray-800 px-3 py-1">
                          {adminUser._count?.listings || 0} listings
                        </span>
                        <span className="rounded-full bg-gray-800 px-3 py-1">
                          {adminUser._count?.bookings || 0} bookings
                        </span>
                        <span className="rounded-full bg-gray-800 px-3 py-1">
                          {adminUser.verifications?.[0]?.status ||
                            'Not Submitted'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-gray-500">
                          {t('role')}
                        </label>
                        <select
                          value={
                            userRoleDrafts[adminUser.id] ||
                            adminUser.role?.name ||
                            'RENTER'
                          }
                          onChange={(e) =>
                            setUserRoleDrafts((prev) => ({
                              ...prev,
                              [adminUser.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700">
                          {adminRoles.map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-gray-500">
                          {t('account_status')}
                        </label>
                        <select
                          value={
                            userStatusDrafts[adminUser.id] ||
                            adminUser.status ||
                            'Active'
                          }
                          onChange={(e) =>
                            setUserStatusDrafts((prev) => ({
                              ...prev,
                              [adminUser.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700">
                          <option value="Active">Active</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                      <div className="flex items-end gap-2">
                        <button
                          onClick={() => handleUserRoleSave(adminUser.id)}
                          className="rounded-lg bg-brand-600 hover:bg-brand-500 px-4 py-2 text-xs font-bold text-white">
                          {t('save_changes')}
                        </button>
                        <button
                          onClick={() => handleUserStatusSave(adminUser.id)}
                          className="rounded-lg bg-gray-800 hover:bg-gray-700 px-4 py-2 text-xs font-bold text-white">
                          {t('save_changes')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminSection === 'listings' && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white">
                {t('pending_listings')}
              </h2>
              {pendingListings.length === 0 ? (
                <p className="text-gray-500 text-center py-10">
                  {t('no_pending_listings')}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pendingListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gray-800">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {listing.owner?.name} · {listing.category?.nameEn}
                        </p>
                        <p className="text-sm text-gray-400">
                          ${Number(listing.dailyPrice)} /{' '}
                          {language === 'en' ? 'day' : 'يوم'} · $
                          {Number(listing.depositAmount)}{' '}
                          {language === 'en' ? 'deposit' : 'تأمين'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleListingAction(listing.id, 'approve')
                          }
                          className="rounded-lg bg-green-600 hover:bg-green-500 px-4 py-2 text-xs font-bold text-white flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          <span>{t('approve_btn')}</span>
                        </button>
                        <button
                          onClick={() =>
                            handleListingAction(listing.id, 'reject')
                          }
                          className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-bold text-white flex items-center gap-1">
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

          {adminSection === 'verifications' && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white">
                {t('pending_verifications')}
              </h2>
              {allVerifications.length === 0 ? (
                <p className="text-gray-500 text-center py-10">
                  {language === 'en'
                    ? 'No verifications pending review.'
                    : 'لا توجد طلبات توثيق معلقة.'}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {allVerifications.map((v) => (
                    <div
                      key={v.id}
                      className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gray-800">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">
                          {v.owner.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Email: {v.owner.email}
                        </p>
                        <p className="text-xs uppercase tracking-widest text-gray-500">
                          {t('status')}: {v.status}
                        </p>
                        <a
                          href={v.nationalIdUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brand-400 hover:underline flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{t('view_uploaded_id')}</span>
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleVerificationAction(v.id, 'approve')
                          }
                          className="rounded-lg bg-green-600 hover:bg-green-500 px-4 py-2 text-xs font-bold text-white flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          <span>{t('approve_btn')}</span>
                        </button>
                        <button
                          onClick={() =>
                            handleVerificationAction(v.id, 'reject')
                          }
                          className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-bold text-white flex items-center gap-1">
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

          {adminSection === 'categories' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                {t('manage_categories')}
              </h2>
              <form
                onSubmit={handleCategoryCreate}
                className="glass-panel p-5 rounded-2xl border border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gray-500">
                    English Name
                  </label>
                  <input
                    value={newCategory.nameEn}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        nameEn: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gray-500">
                    Arabic Name
                  </label>
                  <input
                    value={newCategory.nameAr}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        nameAr: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gray-500">
                    English Description
                  </label>
                  <textarea
                    value={newCategory.descriptionEn}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        descriptionEn: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gray-500">
                    Arabic Description
                  </label>
                  <textarea
                    value={newCategory.descriptionAr}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        descriptionAr: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="rounded-lg bg-brand-600 hover:bg-brand-500 px-4 py-2 text-xs font-bold text-white">
                    {t('create_category')}
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 gap-4">
                {adminCategories.map((category) => (
                  <div
                    key={category.id}
                    className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        value={
                          categoryDrafts[category.id]?.nameEn ?? category.nameEn
                        }
                        onChange={(e) =>
                          setCategoryDrafts((prev) => ({
                            ...prev,
                            [category.id]: {
                              ...prev[category.id],
                              nameEn: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700"
                      />
                      <input
                        value={
                          categoryDrafts[category.id]?.nameAr ?? category.nameAr
                        }
                        onChange={(e) =>
                          setCategoryDrafts((prev) => ({
                            ...prev,
                            [category.id]: {
                              ...prev[category.id],
                              nameAr: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700"
                      />
                      <textarea
                        value={
                          categoryDrafts[category.id]?.descriptionEn ??
                          category.descriptionEn ??
                          ''
                        }
                        onChange={(e) =>
                          setCategoryDrafts((prev) => ({
                            ...prev,
                            [category.id]: {
                              ...prev[category.id],
                              descriptionEn: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700"
                      />
                      <textarea
                        value={
                          categoryDrafts[category.id]?.descriptionAr ??
                          category.descriptionAr ??
                          ''
                        }
                        onChange={(e) =>
                          setCategoryDrafts((prev) => ({
                            ...prev,
                            [category.id]: {
                              ...prev[category.id],
                              descriptionAr: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleCategoryDelete(category.id)}
                        className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-bold text-white">
                        {t('reject_btn')}
                      </button>
                      <button
                        onClick={() => handleCategorySave(category.id)}
                        className="rounded-lg bg-brand-600 hover:bg-brand-500 px-4 py-2 text-xs font-bold text-white">
                        {t('save_changes')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminSection === 'settings' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                {t('manage_settings')}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {adminSettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {setting.settingKey}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {setting.description || ''}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {setting.updater ? `${setting.updater.name}` : 'System'}
                      </span>
                    </div>
                    <textarea
                      value={
                        settingDrafts[setting.settingKey] ??
                        setting.settingValue
                      }
                      onChange={(e) =>
                        setSettingDrafts((prev) => ({
                          ...prev,
                          [setting.settingKey]: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSettingSave(setting.settingKey)}
                        className="rounded-lg bg-brand-600 hover:bg-brand-500 px-4 py-2 text-xs font-bold text-white">
                        {t('save_changes')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

