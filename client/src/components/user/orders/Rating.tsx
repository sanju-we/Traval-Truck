import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { SHARED_API_METHODS } from "@/services/APIs/shared.api.service";
import toast from "react-hot-toast";

interface props{
  orderId:string,
  vendor:{
    _id:number
  }
}

export default function RatingCard({orderId, vendor}:props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [review, setReview] = useState<{
    rate:number,
    comment:string
  }|null>(null)

  useEffect(()=>{
    fetchReview()
  },[])
  
  async function fetchReview(){
    const review = await SHARED_API_METHODS.getRating('user',orderId);
    if(review.success){
      setReview(review.data)
      setRating(review.data.rate)
    }
  }

  async function handleSubmit(){
    const data = await SHARED_API_METHODS.rating({rating,comment,vendor:vendor._id.toString()},'user',orderId)
    if(data.success){
      toast.success('Rating submited successfully');
      setReview(data.data)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-100 px-6 py-4 border-b border-blue-200">
        <Star className="text-purple-600" size={22} />
        <h3 className="font-semibold text-gray-800 text-lg">Rate Your Experience</h3>
      </div>

      {!review ? (<div className="p-6 space-y-6">

        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={30}
                className={`transition-colors ${
                  value <= (hovered || rating)
                    ? "fill-purple-600 text-purple-600"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-sm font-medium text-purple-700">
            You rated this {rating} / 5
          </p>
        )}

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share your feedback
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <button
          disabled={rating === 0}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
        >
          Submit Rating
        </button>
      </div>) : (<div className="p-6 space-y-6">

        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              // onClick={() => setRating(value)}
              // onMouseEnter={() => setHovered(value)}
              // onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={30}
                className={`transition-colors ${
                  value <= (hovered || rating)
                    ? "fill-purple-600 text-purple-600"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-sm font-medium text-purple-700">
            You rated this {rating} / 5
          </p>
        )}

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share your feedback
          </label>
          <textarea
            value={review.comment}
            disabled
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
          />
        </div>
      </div>)}
    </div>
  );
}
