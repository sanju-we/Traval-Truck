'use client';

import { Star, User, ChevronLeft, ChevronRight, Filter, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userName?: string;
  createdAt: string;
  isReplayed?: boolean;
  reply?: {
    comment: string;
    replayer: string;
  };
}


interface VendorRatingsProps {
  title?: string;
  reviews: Review[];
  totalReviews: number;
  totalPages: number;
  averageRating: number;
  currentPage: number;
  filterRating: number | null;
  loading: boolean;
  onPageChange: (page: number) => void;
  onFilterChange: (rating: number | null) => void;
  onReplyClick: (review: Review) => void;
}

export default function VendorRatings({
  title = 'Ratings & Reviews',
  reviews,
  totalReviews,
  totalPages,
  averageRating,
  currentPage,
  filterRating,
  loading,
  onPageChange,
  onFilterChange,
  onReplyClick,
}: VendorRatingsProps) {

  // Calculate rating breakdown for filters
  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => r.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  // Generate page numbers for pagination
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-100 px-6 py-4 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Star className="text-purple-600" size={22} />
            {title}
          </h3>
          <span className="text-sm text-gray-600">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>

      {/* Summary & Filters */}
      <div className="p-6 border-b border-gray-100">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating Display */}
          <div className="flex items-center gap-4">
            <div className="inline-block bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-white mb-2">
                {averageRating}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i <= Math.round(averageRating)
                        ? 'fill-white text-white'
                        : 'text-white/40'
                    }
                  />
                ))}
              </div>
              <p className="text-white/90 text-xs font-medium">
                Average Rating
              </p>
            </div>
          </div>

          {/* Rating Breakdown & Filter */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Filter size={16} className="text-purple-600" />
              Filter by Rating
            </p>
            {ratingBreakdown.map(({ rating, count, percentage }) => (
              <button
                key={rating}
                onClick={() => onFilterChange(filterRating === rating ? null : rating)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition hover:bg-gray-50 ${filterRating === rating ? 'bg-purple-50 border-2 border-purple-200' : ''
                  }`}
              >
                <div className="flex items-center gap-1 min-w-[60px]">
                  <span className="text-sm font-semibold text-gray-700">{rating}</span>
                  <Star size={14} className="text-purple-600 fill-purple-600" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-300"
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

        {/* Active Filter Indicator */}
        {filterRating && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <Filter size={18} className="text-purple-600" />
            <span className="text-sm text-purple-800 font-medium">
              Showing reviews with {filterRating} stars
            </span>
            <button
              onClick={() => onFilterChange(null)}
              className="ml-auto text-sm text-purple-600 hover:text-purple-700 font-medium underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="divide-y">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-10 h-10 text-purple-500 mb-3" />
            <p className="text-gray-600 font-medium">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No reviews yet</p>
            <p className="text-gray-400 text-sm mt-2">
              {filterRating ? 'Try adjusting your filter' : 'Be the first to receive a review!'}
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="p-6 space-y-4 hover:bg-gray-50 transition">
              {/* Review Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-md">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {review.userName || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                    <Star size={14} className="fill-purple-600 text-purple-600" />
                    <span className="font-bold text-purple-700 text-sm">{review.rating}</span>
                  </div>
                  {review.isReplayed && (
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                      <CheckCircle size={14} className="text-green-600" />
                      <span className="text-xs font-medium text-green-700">Replied</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i <= review.rating
                        ? 'fill-purple-600 text-purple-600'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>

              {/* Review Comment */}
              {review.comment && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              )}

              {/* Reply Section */}
              {review.isReplayed ? (
                <div className="mt-4 ml-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">Your Reply</span>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {review.reply?.comment}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    — {review.reply?.replayer}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => onReplyClick(review)}
                  className="mt-2 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium shadow-sm"
                >
                  <MessageSquare size={16} />
                  Reply to Review
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-50 transition"
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
                    onClick={() => onPageChange(page as number)}
                    disabled={loading}
                    className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition ${currentPage === page
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'border border-gray-200 text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed'
                      }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-50 transition"
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