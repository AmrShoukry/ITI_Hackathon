'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { Search, SlidersHorizontal, Tag, Image as ImageIcon } from 'lucide-react';
import { api } from '../lib/api';

interface Listing {
  id: string;
  title: string;
  description: string;
  condition: string;
  dailyPrice: string;
  depositAmount: string;
  photos: { photoUrl: string }[];
  category: { id: number; nameEn: string; nameAr: string };
  owner: { name: string };
}

interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
}

export default function LandingPage() {
  const { t, language } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchListings();
  }, [selectedCat, condition]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/listings/categories');
      setCategories(res.data);
    } catch (e) {
      console.error('Error fetching categories', e);
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (selectedCat) params.categoryId = selectedCat;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (condition) params.condition = condition;

      const res = await api.get('/listings', { params });
      setListings(res.data);
    } catch (e) {
      console.error('Error fetching listings', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900/60 to-purple-900/40 p-8 md:p-16 text-center shadow-xl border border-brand-500/20">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'en' ? 'Rent Anything, Save Everything.' : 'استأجر أي شيء، ووفر كل شيء.'}
          </h1>
          <p className="text-lg md:text-xl text-brand-100">
            {language === 'en'
              ? 'P2P platform where you can rent out items or borrow from locals instead of buying.'
              : 'منصة لمشاركة الأدوات والأجهزة، تتيح لك تأجير أغراضك أو استعارة ما تحتاجه من جيرانك.'}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto mt-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 rtl:right-4 rtl:left-auto" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl py-3.5 pl-12 pr-4 rtl:pr-12 rtl:pl-4 text-white bg-dark-900/80 border border-gray-700 focus:outline-none focus:border-brand-500 transition"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-7 py-3.5 font-semibold text-white hover:bg-brand-500 shadow-md transition"
            >
              {language === 'en' ? 'Search' : 'بحث'}
            </button>
          </form>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="glass-panel p-6 rounded-2xl h-fit space-y-6">
          <div className="flex items-center space-x-2 rtl:space-x-reverse border-b border-gray-800 pb-4">
            <SlidersHorizontal className="h-5 w-5 text-brand-400" />
            <h2 className="text-lg font-bold">{language === 'en' ? 'Filters' : 'تصفية النتائج'}</h2>
          </div>

          {/* Price Filters */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-300">
              {language === 'en' ? 'Price Range (Daily)' : 'نطاق السعر (يومي)'}
            </label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none focus:border-brand-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none focus:border-brand-500"
              />
            </div>
            <button
              onClick={fetchListings}
              className="w-full rounded-lg bg-gray-800 hover:bg-gray-700 py-2 text-xs font-semibold transition"
            >
              {language === 'en' ? 'Apply Price' : 'تطبيق السعر'}
            </button>
          </div>

          {/* Condition Filter */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-300">{t('condition')}</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm text-white bg-dark-800 border border-gray-700 focus:outline-none focus:border-brand-500"
            >
              <option value="">{language === 'en' ? 'Any Condition' : 'أي حالة'}</option>
              <option value="New">{language === 'en' ? 'New' : 'جديد'}</option>
              <option value="Good">{language === 'en' ? 'Good' : 'جيد'}</option>
              <option value="Acceptable">{language === 'en' ? 'Acceptable' : 'مقبول'}</option>
            </select>
          </div>
        </div>

        {/* Listings Display Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Category Badges */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCat(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCat === null ? 'bg-brand-600 text-white' : 'bg-dark-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {t('all_categories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCat === cat.id ? 'bg-brand-600 text-white' : 'bg-dark-900 text-gray-400 hover:bg-gray-800'
                }`}
              >
                {language === 'en' ? cat.nameEn : cat.nameAr}
              </button>
            ))}
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto mb-4" />
              <span>{language === 'en' ? 'Loading listings...' : 'جاري تحميل العروض...'}</span>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20 bg-dark-900/40 rounded-2xl border border-gray-800 text-gray-500">
              <Tag className="h-10 w-10 mx-auto mb-4 text-gray-600" />
              <p>{language === 'en' ? 'No active listings found matching filters.' : 'لم يتم العثور على عروض تطابق التصفية.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((item) => (
                <Link
                  key={item.id}
                  href={`/listings/${item.id}`}
                  className="glass-panel group rounded-2xl overflow-hidden hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-900/10 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Photo area */}
                  <div className="relative aspect-video w-full bg-gray-800 overflow-hidden">
                    {item.photos && item.photos.length > 0 ? (
                      <img
                        src={item.photos[0].photoUrl}
                        alt={item.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full text-gray-600">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 bg-brand-600/90 text-xs font-bold text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {item.condition}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
                        {language === 'en' ? item.category.nameEn : item.category.nameAr}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500 block">{t('daily_price')}</span>
                        <span className="text-lg font-extrabold text-white">${Number(item.dailyPrice)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">{t('deposit_amount')}</span>
                        <span className="text-sm font-semibold text-gray-300">${Number(item.depositAmount)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
