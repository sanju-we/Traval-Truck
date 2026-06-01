'use client'
import { useEffect, useState } from "react";
import VendorRatings from "@/components/shared/VendorReviews";
import ReplyModal from "@/components/shared/ReplayModal";
import { SHARED_API_METHODS } from "@/services/APIs/shared.api.service";
import toast from "react-hot-toast";
import { ReviewType } from "@/types/agency";
import VendorFooter from "@/components/shared/Footer";

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewType[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  // Reply Modal State
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null)
  const [replays, setReplays] = useState([])

  useEffect(() => {
    fetchReviews(currentPage, filterRating)
  }, [currentPage, filterRating])

  async function fetchReviews(page: number, rating: number | null) {
    try {
      setLoading(true)
      const data = await SHARED_API_METHODS.getAllReviews('agency', page, 5, rating)
      console.log('review:', data)

      if (data.success) {
        setReviews(data.data.data)
        setTotalPages(data.data.totalPages)
        setTotalReviews(data.data.totalReviews)
        setAverageRating(data.data.averageRating)
        const replies = await SHARED_API_METHODS.getReplays(
          'agency',
          data.data.vendor
        );

        const mergedReviews = data.data.data.map((review: ReviewType) => {
          const reply = replies.data.find(
            (r: any) => r.reviewId === review._id
          );

          if (reply) {
            return {
              ...review,
              isReplayed: true,
              reply: {
                comment: reply.comment,
                replayer: reply.replayer,
              },
            };
          }

          return review;
        });

        setReviews(mergedReviews);
      } else {
        toast.error('Failed to load reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('An error occurred while loading reviews')
    } finally {
      setLoading(false)
    }
  }
  console.log(replays)
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleFilterChange = (rating: number | null) => {
    setFilterRating(rating)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleReplyClick = (review: ReviewType) => {
    setSelectedReview(review)
    setShowReplyModal(true)
  }

  const handleReplySubmit = async (reviewId: string, replyMessage: string) => {
    try {
      const response = await SHARED_API_METHODS.replyToReview('agency', reviewId, replyMessage)

      if (response.success) {
        toast.success('Reply sent successfully!')

        setReviews(prev =>
          prev.map(r =>
            r._id === reviewId
              ? {
                ...r,
                isReplayed: true,
                reply: {
                  comment: replyMessage,
                  replayer: 'You',
                },
              }
              : r
          )
        );

        setShowReplyModal(false)
        setSelectedReview(null)
      } else {
        toast.error('Failed to send reply')
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('An error occurred while sending reply')
    }
  }

  return (
    <div className="flex-1 flex flex-col p-8">
      <VendorRatings
        title="Customer Feedback"
        totalPages={totalPages}
        totalReviews={totalReviews}
        averageRating={averageRating}
        reviews={reviews}
        currentPage={currentPage}
        filterRating={filterRating}
        loading={loading}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
        onReplyClick={handleReplyClick}
      />
      <VendorFooter/>

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <ReplyModal
          review={selectedReview}
          onClose={() => {
            setShowReplyModal(false)
            setSelectedReview(null)
          }}
          onSubmit={handleReplySubmit}
        />
      )}
    </div>
  )
}