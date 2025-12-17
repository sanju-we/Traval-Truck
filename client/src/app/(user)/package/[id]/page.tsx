'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import {
  Loader2,
  Clock,
  MapPin,
  Utensils,
  CalendarDays,
  Star,
  User,
  Image as ImageIcon,
  ArrowLeft,
  Check,
  ChevronRight,
  Tag,
  X,
  Ticket,
} from 'lucide-react';
import TermsModal from '@/components/shared/TermsModal';
import BookNowButton from '@/components/user/booking/bookNowButton';
import toast from 'react-hot-toast';

interface PackageData {
  _id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  discoveries: string[];
  availableFoods: string[];
  itinerary: {
    activities: string[];
    day: number;
    title: string;
  }[];
  reviews: {
    Comment: string;
    Date: string;
    Rating: number;
    UserName: string;
  }[];
  CreatedBy: string;
  images: string[];
  ownedBy: string;
}

export default function PackageDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pack, setPack] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountedPrice, setDiscountedPrice] = useState(pack?.price || 0);

  // Mock coupons data - replace with actual API call
  const availableCoupons = fetchCoupon()

  useEffect(() => {
    if (id) fetchPackageDetails(id as string);
  }, [id]);

  useEffect(() => {
    if (pack) {
      setDiscountedPrice(pack.price);
    }
  }, [pack]);

  if(!id) return (
    <div>
      <h1>Provided id is not valid</h1>
    </div>
  )

  async function fetchCoupon (){
    const coupons =  await USER_API_METHODS.GetAllCoupon()
    if( coupons ) return coupons
    return []
  }

  const applyCoupon = () => {
    const coupon = availableCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      let newPrice = pack!.price;
      if (coupon.type === 'percentage') {
        newPrice = pack!.price - (pack!.price * coupon.discount / 100);
      } else {
        newPrice = pack!.price - coupon.discount;
      }
      setDiscountedPrice(Math.max(0, newPrice));
      toast.success(`Coupon "${coupon.code}" applied successfully!`);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setDiscountedPrice(pack!.price);
    toast.success('Coupon removed');
  };

  const fetchPackageDetails = async (packageId: string) => {
    try {
      const res = await USER_API_METHODS.packageDetails(packageId);
      if (res.success) {
        setPack(res.data);
      } else {
        toast.error('Failed to load package details');
      }
    } catch (error) {
      console.error('Error fetching package details:', error);
      toast.error('An error occurred while loading package');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
          <Loader2 className="animate-spin w-12 h-12 text-emerald-500" />
          <p className="text-gray-600 font-medium">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <MapPin className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">Package not found</h3>
          <p className="text-gray-500 mt-2">The package you're looking for doesn't exist</p>
          <button
            onClick={() => router.push('/package')}
            className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Browse Packages
          </button>
        </div>
      </div>
    );
  }

  const averageRating = pack.reviews?.length > 0
    ? (pack.reviews.reduce((sum, r) => sum + r.Rating, 0) / pack.reviews?.length).toFixed(1)
    : 'No reviews';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Packages</span>
        </button>

        {/* Hero Section with Image Gallery */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              {pack.images && pack.images?.length > 0 ? (
                <img
                  src={pack.images[selectedImage]}
                  alt={pack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <ImageIcon className="w-24 h-24 text-white/50" />
                </div>
              )}
            </div>
            {pack.images && pack.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {pack.images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx
                        ? 'border-emerald-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Package Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{pack.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock size={16} className="text-emerald-600" />
                    {pack.duration}
                  </span>
                  {pack.reviews?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      {averageRating} ({pack.reviews?.length} reviews)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{pack.description}</p>

            <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Price per person</p>
                  {appliedCoupon ? (
                    <>
                      <p className="text-2xl font-bold text-gray-400 line-through">
                        ₹{pack.price.toLocaleString()}
                      </p>
                      <p className="text-4xl font-bold text-blue-600">
                        ₹{Math.round(discountedPrice).toLocaleString()}
                      </p>
                      <p className="text-sm text-green-600 font-medium mt-1">
                        You save ₹{Math.round(pack.price - discountedPrice).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-4xl font-bold text-blue-600">
                      ₹{pack.price.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <MapPin className="text-blue-600 mb-2" size={20} />
                <p className="text-xs text-gray-500">Destinations</p>
                <p className="font-semibold text-gray-800">{pack.discoveries?.length} places</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <Utensils className="text-orange-600 mb-2" size={20} />
                <p className="text-xs text-gray-500">Meals Included</p>
                <p className="font-semibold text-gray-800">{pack.availableFoods?.length} options</p>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="border-t pt-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 accent-emerald-600 cursor-pointer"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span className="text-sm text-gray-700">
                  I accept the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-emerald-600 underline hover:text-emerald-700 font-medium"
                  >
                    Terms & Conditions
                  </button>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Itinerary */}
            {pack.itinerary && pack.itinerary?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <CalendarDays className="text-emerald-600" size={28} />
                  Day-by-Day Itinerary
                </h2>
                <div className="space-y-6">
                  {pack.itinerary.map((item, idx) => (
                    <div key={idx} className="relative pl-8 pb-6 border-l-2 border-blue-200 last:border-0">
                      <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {item.day}
                      </div>
                      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                        <h3 className="font-bold text-lg text-gray-800 mb-3">{item.title}</h3>
                        <ul className="space-y-2">
                          {item.activities.map((activity, actIdx) => (
                            <li key={actIdx} className="flex items-start gap-2 text-gray-700">
                              <Check className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                              <span className="text-sm">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {pack.reviews && pack.reviews?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Star className="text-yellow-500 fill-yellow-500" size={28} />
                  Customer Reviews ({pack.reviews?.length})
                </h2>
                <div className="space-y-6">
                  {pack.reviews.map((review, idx) => (
                    <div key={idx} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{review.UserName}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.Date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < review.Rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.Comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Discoveries */}
            {pack.discoveries && pack.discoveries?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="text-blue-600" size={22} />
                  Places to Discover
                </h3>
                <ul className="space-y-3">
                  {pack.discoveries.map((place, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <ChevronRight className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm">{place}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Available Foods */}
            {pack.availableFoods && pack.availableFoods?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Utensils className="text-orange-600" size={22} />
                  Meals Included
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pack.availableFoods.map((food, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-100"
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Package Info */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Need Help?</h3>
              <p className="text-sm text-blue-50 mb-4">
                Have questions about this package? Our travel experts are here to help!
              </p>
              <button className="w-full bg-white text-blue-600 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition">
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Booking Section at Bottom */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Booking</h2>
          
          {/* Coupon Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Tag className="text-blue-600" size={20} />
                Apply Coupon
              </h3>
              <button
                onClick={() => setShowCoupons(!showCoupons)}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
              >
                <Ticket size={16} />
                {showCoupons ? 'Hide' : 'View'} Available Coupons
              </button>
            </div>

            {/* Available Coupons List */}
            {showCoupons && (
              <div className="mb-4 space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Available Coupons:</p>
                {availableCoupons.map((coupon, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-blue-600">{coupon.code}</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{coupon.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        setCouponCode(coupon.code);
                        applyCoupon();
                      }}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Coupon Input */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-sm text-green-600 font-medium">Applied</span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={applyCoupon}
                disabled={!couponCode || !!appliedCoupon}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>

            {appliedCoupon && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  🎉 Coupon "{appliedCoupon.code}" applied! You saved ₹{Math.round(pack.price - discountedPrice).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Package Price</span>
                <span className="font-semibold">₹{pack.price.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-semibold">- ₹{Math.round(pack.price - discountedPrice).toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-800">
                <span>Total Amount</span>
                <span className="text-blue-600">₹{Math.round(discountedPrice).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span className="text-sm text-gray-700">
                I accept the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-blue-600 underline hover:text-blue-700 font-medium"
                >
                  Terms & Conditions
                </button>
              </span>
            </label>
          </div>

          {/* Book Now Button */}
          <div className="flex justify-end">
            {acceptedTerms ? (
              <BookNowButton packageId={id} amount={Math.round(discountedPrice)} role="user" />
            ) : (
              <button
                disabled
                className="px-8 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
              >
                Accept Terms to Continue
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
}