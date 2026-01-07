import { useState, useEffect } from 'react';
import { Star, User, ChevronLeft, ChevronRight, Filter, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { SHARED_API_METHODS } from '@/services/APIs/shared.api.service';

interface Review {
  Comment: string;
  Date: string;
  Rating: number;
  UserName: string;
}

interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalReviews: number;
      hasMore: boolean;
    };
    stats: {
      averageRating: number;
      ratingCounts: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
      };
    };
  };
}

interface PackageReviewsProps {
  packageId: string;
  reviewsPerPage?: number;
}

export default function PackageReviews({ packageId, reviewsPerPage = 5 }: PackageReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, [currentPage, filterRating, packageId]);

  async function fetchReviews() {
    try {
      setLoading(true);

      // Call your API method with pagination and filter params
      const response = await SHARED_API_METHODS.getPackageReviews(
        {
          packageId,
          currentPage,
          reviewPerPage: reviewsPerPage,
          filterRating: filterRating ? filterRating : 0,
        },
        'user'
      );
      console.log(response)
      if (response.success) {
        setReviews(response.data.data);
        setTotalPages(response.data.pagination.totalPage);
        setTotalReviews(response.data.pagination.totalReviews);
        setAverageRating(response.data.stats.averageRating);
        setRatingCounts(response.data.stats.ratingCounts);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page);
    document.getElementById('reviews-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleFilterChange = (rating: number | null) => {
    setFilterRating(rating);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: ratingCounts[rating as keyof typeof ratingCounts] || 0,
    percentage: totalReviews > 0
      ? ((ratingCounts[rating as keyof typeof ratingCounts] || 0) / totalReviews) * 100
      : 0
  }));

  // Loading State
  if (loading && currentPage === 1) {
    return (
      <div id="reviews-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Star className="text-yellow-500 fill-yellow-500" size={28} />
          Customer Reviews
        </h2>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin w-12 h-12 text-blue-500 mb-4" />
          <p className="text-gray-600 font-medium">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!loading && totalReviews === 0) {
    return (
      <div id="reviews-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Star className="text-yellow-500 fill-yellow-500" size={28} />
          Customer Reviews
        </h2>
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No reviews yet</p>
          <p className="text-gray-400 text-sm mt-2">Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviews.length;

  return (
    <div id="reviews-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Star className="text-yellow-500 fill-yellow-500" size={28} />
          Customer Reviews
        </h2>
        <p className="text-gray-600">
          {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          {filterRating && ` with ${filterRating} stars`}
        </p>
      </div>

      {/* Rating Summary */}
      <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-lg">
            <div className="text-5xl font-bold text-white mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < Math.round(averageRating)
                      ? 'text-white fill-white'
                      : 'text-white/40'
                  }
                />
              ))}
            </div>
            <p className="text-white/90 text-sm font-medium">
              Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-3">
          {ratingBreakdown.map(({ rating, count, percentage }) => (
            <button
              key={rating}
              onClick={() => handleFilterChange(filterRating === rating ? null : rating)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition hover:bg-gray-50 ${filterRating === rating ? 'bg-blue-50 border-2 border-blue-200' : ''
                }`}
            >
              <div className="flex items-center gap-1 min-w-[60px]">
                <span className="text-sm font-semibold text-gray-700">{rating}</span>
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 font-medium min-w-[40px] text-right">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Indicator */}
      {filterRating && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Filter size={20} className="text-blue-600" />
          <span className="text-sm text-blue-800 font-medium">
            Showing reviews with {filterRating} stars
          </span>
          <button
            onClick={() => handleFilterChange(null)}
            className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium underline"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin w-10 h-10 text-blue-500 mb-3" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="border-b border-gray-100 last:border-0 pb-6 last:pb-0 hover:bg-gray-50 rounded-lg p-4 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <User className="text-white" size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{review.UserName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.Date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-yellow-700">{review.Rating}</span>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < review.Rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed">{review.Comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{endIndex} of {totalReviews} reviews
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition"
              aria-label="Previous page"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    disabled={loading}
                    className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition ${currentPage === page
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed'
                      }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition"
              aria-label="Next page"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}