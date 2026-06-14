'use client';

import { useState, useEffect } from 'react';
import { Star, User, ChevronLeft, ChevronRight, Filter, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { SHARED_API_METHODS } from '@/services/APIs/shared.api.service';
import { ApiResponse } from '@/services/api.service';

/* ---------------- Types ---------------- */

interface Review {
  _id: string;
  comment: string;
  createdAt: string;
  rating: number;
  UserName: string;
  reply?: {
    comment: string;
    replayer: string;
  };
}

interface ReviewsProps {
  packageId: string;
  reviewsPerPage?: number;
}

/* ---------------- Component ---------------- */

export default function Reviews({
  packageId,
  reviewsPerPage = 5,
}: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [ratingCounts, setRatingCounts] = useState({
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0,
  });

  /* ---------------- Fetch Reviews ---------------- */

  useEffect(() => {
    fetchReviews();
  }, [currentPage, filterRating, packageId]);

  async function fetchReviews() {
    try {
      setLoading(true);

      const res = await SHARED_API_METHODS.getPackageReviews(
        {
          packageId,
          currentPage,
          reviewPerPage: reviewsPerPage,
          filterRating: filterRating ?? 0,
        },
        'user'
      ) as ApiResponse<{ data: Review[], totalPage: number, totalCount: number, averageRating: number }>;

      if (!res || !res.success) return;

      const reviewsData = res.data.data;

      const replyRes = await SHARED_API_METHODS.getReplayUser('user', packageId) as ApiResponse<{ reviewId: string; comment: string; replayer: string }[]>;
      const replies = replyRes?.data || [];

      const merged = reviewsData.map((review: Review) => {
        const reply = replies.find((r: { reviewId: string; comment: string; replayer: string }) => r.reviewId === review._id);
        return reply
          ? { ...review, reply: { comment: reply.comment, replayer: reply.replayer } }
          : review;
      });

      setReviews(merged);
      setTotalPages(res.data.totalPage);
      setTotalReviews(res.data.totalCount);
      setAverageRating(res.data.averageRating);

      const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviewsData.forEach((rev: Review) => {
        const r = Math.round(rev.rating) as 5 | 4 | 3 | 2 | 1;
        if (counts[r] !== undefined) counts[r]++;
      });
      setRatingCounts(counts);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- Helpers ---------------- */

  const goToPage = (page: number) => setCurrentPage(page);

  const ratingBreakdown = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: ratingCounts[r as keyof typeof ratingCounts] || 0,
    percentage: totalReviews
      ? (ratingCounts[r as keyof typeof ratingCounts] / totalReviews) * 100
      : 0,
  }));

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-8">

      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Star className="text-yellow-500 fill-yellow-500" />
        Customer Reviews ({totalReviews})
      </h2>

      {/* Rating Summary */}
      <div className="grid md:grid-cols-2 gap-8 mb-8 border-b pb-8">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-2xl text-white text-center">
          <p className="text-5xl font-bold">{averageRating}</p>
          <div className="flex justify-center gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={i < Math.round(averageRating)
                  ? 'fill-white text-white'
                  : 'text-white/40'}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {ratingBreakdown.map(({ rating, count, percentage }) => (
            <button
              key={rating}
              onClick={() => setFilterRating(filterRating === rating ? null : rating)}
              className="flex items-center gap-3 w-full"
            >
              <span className="w-10">{rating}★</span>
              <div className="flex-1 bg-gray-200 h-2 rounded">
                <div className="bg-yellow-500 h-full rounded" style={{ width: `${percentage}%` }} />
              </div>
              <span>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reviews */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-blue-500" size={36} />
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review._id} className="border-b pb-6">
              <div className="flex justify-between mb-2">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{review.UserName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toDateString()}
                    </p>
                  </div>
                </div>
                <span className="bg-yellow-50 px-3 py-1 rounded-full font-bold">
                  {review.rating}★
                </span>
              </div>

              <p className="text-gray-700">{review.comment}</p>

              {/* Vendor Reply */}
              {review.reply && (
                <div className="mt-4 ml-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-blue-600">
                    Reply from {review.reply.replayer}
                  </p>
                  <p className="text-sm text-blue-800">
                    {review.reply.comment}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            <ChevronLeft />
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
