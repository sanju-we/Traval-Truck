import { Star } from "lucide-react";
import { useState } from "react";
import { SHARED_API_METHODS } from "@/services/APIs/shared.api.service";
import toast from "react-hot-toast";

interface props{
  packageId:string,
  vendor:string
}

export default function RatingCard({packageId, vendor}:props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  async function handleSubmit(){
    const data = await SHARED_API_METHODS.rating({rating,comment,vendor},'user',packageId)
    if(data.success){
      toast.success('Rating submited successfully')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-100 px-6 py-4 border-b border-blue-200">
        <Star className="text-purple-600" size={22} />
        <h3 className="font-semibold text-gray-800 text-lg">Rate Your Experience</h3>
      </div>

      <div className="p-6 space-y-6">

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
      </div>
    </div>
  );
}
