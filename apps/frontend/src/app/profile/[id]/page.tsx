'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { api } from '../../../lib/api';
import { Star, Mail, Phone, Calendar, User, ArrowLeft, Loader2, Package } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerRole: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
  };
  booking: {
    listing: {
      id: string;
      title: string;
    };
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  preferredLanguage: string;
  reviews: Review[];
  averageRating: number;
}

interface Listing {
  id: string;
  title: string;
  dailyPrice: string;
  condition: string;
  photos: { photoUrl: string }[];
  category: { nameEn: string; nameAr: string };
  status: string;
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfileAndListings();
  }, [params.id]);

  const fetchProfileAndListings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch profile details (including reviews)
      const profileRes = await api.get(`/auth/profile/${params.id}`);
      setProfile(profileRes.data);

      // Fetch user's listings (only active ones for public profile, or all if it is current user)
      const listingParams: any = { ownerId: params.id };
      if (user?.id !== params.id) {
        listingParams.status = 'Active';
      }
      const listingsRes = await api.get('/listings', { params: listingParams });
      setListings(listingsRes.data);
    } catch (err: any) {
      console.error('Error fetching user profile', err);
      setError(
        language === 'en'
          ? 'Failed to load user profile. Please try again.'
          : 'فشل تحميل ملف المستخدم. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 text-brand-400 animate-spin" />
        <p className="text-gray-400 text-sm">
          {language === 'en' ? 'Loading profile...' : 'جاري تحميل الملف الشخصي...'}
        </p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="glass-panel p-8 rounded-2xl border border-red-500/20 text-center space-y-4">
          <p className="text-red-400 font-semibold">{error || 'Profile not found'}</p>
          <button
            onClick={() => router.back()}
            className="rounded-xl bg-gray-800 hover:bg-gray-700 px-6 py-2.5 text-sm font-semibold text-white transition flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{language === 'en' ? 'Go Back' : 'العودة'}</span>
          </button>
        </div>
      </div>
    );
  }

  const averageRating = profile.averageRating || 0;
  const reviewsCount = profile.reviews?.length || 0;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="rounded-xl bg-gray-900/60 hover:bg-gray-800 border border-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 transition flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{language === 'en' ? 'Back' : 'رجوع'}</span>
      </button>

      {/* Profile Header card */}
      <div className="glass-panel p-8 rounded-3xl border border-brand-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left rtl:md:text-right">
          <div className="h-24 w-24 rounded-full bg-brand-600/20 border-2 border-brand-500 flex items-center justify-center text-brand-400 shadow-lg shadow-brand-500/10">
            <User className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
              <h1 className="text-3xl font-extrabold text-white">{profile.name}</h1>
              <span className="bg-brand-500/20 text-brand-300 border border-brand-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {profile.role}
              </span>
            </div>
            
            {/* Rating Stars Summary */}
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-yellow-400">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-bold text-white text-lg">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500">
                ({reviewsCount} {language === 'en' ? 'reviews' : 'تقييمات'})
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-brand-400" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-brand-400" />
                {profile.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-brand-400" />
                {language === 'en' ? 'Member since' : 'عضو منذ'}: {new Date(profile.createdAt).toLocaleDateString(language)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Listings & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Listings Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="h-6 w-6 text-brand-400" />
            <span>{language === 'en' ? `${profile.name}'s Listings` : `عروض ${profile.name}`}</span>
          </h2>

          {listings.length === 0 ? (
            <div className="glass-panel p-10 rounded-2xl border border-gray-800 text-center text-gray-500">
              {language === 'en' ? 'No listings available.' : 'لا توجد عروض متوفرة.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/listings/${item.id}`)}
                  className="glass-panel p-4 rounded-2xl border border-gray-800 hover:border-brand-500/30 transition cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className="relative aspect-video rounded-xl bg-dark-800 overflow-hidden border border-gray-700 flex items-center justify-center">
                      {item.photos?.[0]?.photoUrl ? (
                        <img
                          src={item.photos[0].photoUrl}
                          alt={item.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-brand-400 transition truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {language === 'en' ? item.category.nameEn : item.category.nameAr}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-850">
                    <span className="text-sm font-bold text-white">
                      ${Number(item.dailyPrice)}
                      <span className="text-xs font-normal text-gray-400">
                        /{language === 'en' ? 'day' : 'يوم'}
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      {user?.id === params.id && item.status !== 'Active' && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          item.status === 'Pending Approval' ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20' :
                          item.status === 'Rejected' ? 'bg-red-500/10 text-red-300 border border-red-500/20' :
                          'bg-gray-500/10 text-gray-300 border border-gray-500/20'
                        }`}>
                          {item.status}
                        </span>
                      )}
                      <span className="text-xs bg-brand-500/10 text-brand-300 border border-brand-500/20 px-2 py-0.5 rounded capitalize">
                        {item.condition}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-400 fill-current" />
            <span>{language === 'en' ? 'Ratings & Reviews' : 'التقييمات والآراء'}</span>
          </h2>

          {profile.reviews.length === 0 ? (
            <div className="glass-panel p-10 rounded-2xl border border-gray-800 text-center text-gray-500">
              {language === 'en' ? 'No reviews yet.' : 'لا توجد تقييمات بعد.'}
            </div>
          ) : (
            <div className="space-y-4">
              {profile.reviews.map((review) => (
                <div key={review.id} className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4
                        onClick={() => router.push(`/profile/${review.reviewer.id}`)}
                        className="font-bold text-white hover:text-brand-400 transition cursor-pointer"
                      >
                        {review.reviewer.name}
                      </h4>
                      <span className="text-xs text-gray-500 capitalize">
                        {review.reviewerRole} · {new Date(review.createdAt).toLocaleDateString(language)}
                      </span>
                    </div>
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating ? 'fill-current' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 italic">"{review.comment}"</p>

                  <div className="text-xs text-gray-500 border-t border-gray-850 pt-2 flex items-center gap-1">
                    <span>{language === 'en' ? 'Booking item:' : 'العنصر المحجوز:'}</span>
                    <span
                      onClick={() => router.push(`/listings/${review.booking.listing.id}`)}
                      className="text-brand-400 hover:underline cursor-pointer truncate max-w-[200px]"
                    >
                      {review.booking.listing.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
