'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // General
    logo: 'ShareRental',
    search: 'Search items...',
    search_placeholder: 'Search listings by title or description...',
    all_categories: 'All Categories',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    dashboard: 'Dashboard',
    language_toggle: 'العربية',
    condition: 'Condition',
    daily_price: 'Daily Price',
    deposit_amount: 'Deposit Amount',
    view_details: 'View Details',
    owner: 'Owner',
    renter: 'Renter',
    status: 'Status',
    actions: 'Actions',

    // Listings
    listings_title: 'Explore Listings',
    create_listing: 'Create Listing',
    edit_listing: 'Edit Listing',
    title_label: 'Title',
    desc_label: 'Description',
    category_label: 'Category',
    condition_label: 'Condition',
    price_label: 'Daily Rental Price ($)',
    deposit_label: 'Security Deposit ($)',
    photos_label: 'Photo URLs (comma separated)',
    submit_listing: 'Submit Listing',

    // Bookings
    rent_now: 'Rent Now',
    start_date: 'Start Date',
    end_date: 'End Date',
    payment_method: 'Payment Method',
    online_payment: 'Online Payment',
    cash_payment: 'Cash On Pickup',
    booking_conflict: 'Booking overlap detected! Select another date range.',
    booking_success: 'Booking request sent successfully!',
    total_price: 'Total Price',
    status_pending: 'Pending',
    status_approved: 'Approved',
    status_active: 'Active',
    status_returned: 'Returned',
    status_cancelled: 'Cancelled',
    status_rejected: 'Rejected',

    // Damage & Review
    report_damage: 'Report Damage',
    damage_desc: 'Damage Description',
    deduction_amount: 'Deduction Amount ($)',
    submit_damage: 'Submit Damage Report',
    reviews_title: 'Reviews',
    leave_review: 'Leave a Review',
    rating: 'Rating (1-5 Stars)',
    comment: 'Comment',
    submit_review: 'Submit Review',

    // Verifications
    owner_verif: 'Owner Verification',
    national_id: 'National ID Image URL',
    verif_status: 'Verification Status',
    unverified_msg: 'Please verify your ID to upload listings.',

    // Dashboards
    welcome: 'Welcome back',
    my_listings: 'My Listings',
    my_bookings: 'My Bookings',
    booking_requests: 'Booking Requests',
    admin_governance: 'Admin Governance',
    pending_verifications: 'Pending Owner Verifications',
    approve_btn: 'Approve',
    reject_btn: 'Reject',
    start_rental: 'Mark Active (Picked Up)',
    confirm_return: 'Mark Returned (Confirm Return)',
  },
  ar: {
    // General
    logo: 'تأجير مشترك',
    search: 'ابحث عن أشياء...',
    search_placeholder: 'ابحث في العروض حسب العنوان أو الوصف...',
    all_categories: 'كل الفئات',
    login: 'تسجيل الدخول',
    register: 'تسجيل جديد',
    logout: 'تسجيل الخروج',
    dashboard: 'لوحة التحكم',
    language_toggle: 'English',
    condition: 'الحالة',
    daily_price: 'السعر اليومي',
    deposit_amount: 'مبلغ التأمين',
    view_details: 'عرض التفاصيل',
    owner: 'المالك',
    renter: 'المستأجر',
    status: 'الحالة',
    actions: 'الإجراءات',

    // Listings
    listings_title: 'استكشف العروض',
    create_listing: 'إنشاء عرض جديد',
    edit_listing: 'تعديل العرض',
    title_label: 'العنوان',
    desc_label: 'الوصف',
    category_label: 'الفئة',
    condition_label: 'الحالة',
    price_label: 'سعر الإيجار اليومي ($)',
    deposit_label: 'مبلغ التأمين ($)',
    photos_label: 'روابط الصور (مفصولة بفاصلة)',
    submit_listing: 'إرسال العرض',

    // Bookings
    rent_now: 'استأجر الآن',
    start_date: 'تاريخ البدء',
    end_date: 'تاريخ الانتهاء',
    payment_method: 'طريقة الدفع',
    online_payment: 'دفع إلكتروني',
    cash_payment: 'نقداً عند الاستلام',
    booking_conflict: 'تم اكتشاف تداخل في التواريخ! الرجاء اختيار تواريخ أخرى.',
    booking_success: 'تم إرسال طلب الحجز بنجاح!',
    total_price: 'السعر الإجمالي',
    status_pending: 'معلق',
    status_approved: 'مقبول',
    status_active: 'نشط',
    status_returned: 'تم الإرجاع',
    status_cancelled: 'ملغي',
    status_rejected: 'مرفوض',

    // Damage & Review
    report_damage: 'الإبلاغ عن ضرر',
    damage_desc: 'وصف الضرر',
    deduction_amount: 'المبلغ المخصوم ($)',
    submit_damage: 'إرسال تقرير الضرر',
    reviews_title: 'التقييمات',
    leave_review: 'أضف تقييمًا',
    rating: 'التقييم (١-٥ نجوم)',
    comment: 'التعليق',
    submit_review: 'إرسال التقييم',

    // Verifications
    owner_verif: 'توثيق المالك',
    national_id: 'رابط صورة الهوية الوطنية',
    verif_status: 'حالة التوثيق',
    unverified_msg: 'يرجى توثيق هويتك لتتمكن من إضافة عروض.',

    // Dashboards
    welcome: 'مرحباً بعودتك',
    my_listings: 'عروضي',
    my_bookings: 'حجوزاتي',
    booking_requests: 'طلبات الحجز الواردة',
    admin_governance: 'لوحة التحكم الإدارية',
    pending_verifications: 'طلبات توثيق المالك المعلقة',
    approve_btn: 'موافقة',
    reject_btn: 'رفض',
    start_rental: 'تفعيل الإيجار (بدء الاستلام)',
    confirm_return: 'تأكيد الإرجاع',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang === 'en' || savedLang === 'ar') {
      setLanguageState(savedLang);
      setDirection(savedLang === 'ar' ? 'rtl' : 'ltr');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
