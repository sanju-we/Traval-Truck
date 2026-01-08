import { useState } from 'react';
import { X, MessageSquare, Sparkles, Send } from 'lucide-react';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userName?: string;
  createdAt: string;
}

interface ReplyModalProps {
  review: Review;
  onClose: () => void;
  onSubmit: (reviewId: string, reply: string) => Promise<void>;
}

const REPLY_TEMPLATES = [
  {
    id: 'positive-5',
    label: 'Excellent Experience (5 stars)',
    condition: (rating: number) => rating === 5,
    template: "Thank you so much for your wonderful 5-star review! We're thrilled to hear that you had such a positive experience with us. Your satisfaction is our top priority, and we look forward to serving you again soon!"
  },
  {
    id: 'positive-4',
    label: 'Great Experience (4 stars)',
    condition: (rating: number) => rating === 4,
    template: "Thank you for your 4-star review! We're glad you had a great experience with us. We're always looking to improve, so if there's anything we could do better, please don't hesitate to let us know. We hope to see you again!"
  },
  {
    id: 'neutral-3',
    label: 'Average Experience (3 stars)',
    condition: (rating: number) => rating === 3,
    template: "Thank you for taking the time to share your feedback. We appreciate your 3-star review and would love to know more about how we can improve your experience. Please feel free to reach out to us directly so we can make things right."
  },
  {
    id: 'negative-2',
    label: 'Below Average (2 stars)',
    condition: (rating: number) => rating === 2,
    template: "We're sorry to hear that your experience didn't meet your expectations. Your feedback is valuable to us, and we'd like to understand what went wrong. Please contact us directly so we can address your concerns and work to improve our service."
  },
  {
    id: 'negative-1',
    label: 'Poor Experience (1 star)',
    condition: (rating: number) => rating === 1,
    template: "We sincerely apologize for your disappointing experience. This is not the level of service we strive to provide. We take your feedback very seriously and would appreciate the opportunity to make this right. Please contact us at your earliest convenience so we can discuss how to resolve this matter."
  },
  {
    id: 'thank-general',
    label: 'General Thank You',
    condition: () => true,
    template: "Thank you for sharing your feedback with us! We truly appreciate you taking the time to review our service. Your input helps us continue to improve and provide the best experience possible."
  },
  {
    id: 'follow-up',
    label: 'Follow-up Request',
    condition: () => true,
    template: "Thank you for your review! We'd love to learn more about your experience. If you have any additional feedback or suggestions, please don't hesitate to reach out to us directly. We're here to help!"
  }
];

export default function ReplyModal({ review, onClose, onSubmit }: ReplyModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customReply, setCustomReply] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const relevantTemplates = REPLY_TEMPLATES.filter(t => t.condition(review.rating));

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === 'custom') {
      setIsCustom(true);
      setSelectedTemplate('custom');
      setCustomReply('');
    } else {
      setIsCustom(false);
      setSelectedTemplate(templateId);
      const template = REPLY_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        setCustomReply(template.template);
      }
    }
  };

  const handleSubmit = async () => {
    if (!customReply.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      console.log('review:',review)
      await onSubmit(review._id, customReply);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-white" size={24} />
            <h2 className="text-xl font-bold text-white">Reply to Review</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Original Review */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-800">
                {review.userName || 'Anonymous'}
              </p>
              <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                <span className="text-purple-700 font-bold text-sm">{review.rating} ⭐</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Template Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-purple-600" size={20} />
              <h3 className="font-semibold text-gray-800">Choose a Reply Template</h3>
            </div>
            
            <div className="space-y-2 mb-3">
              {relevantTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition ${
                    selectedTemplate === template.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium text-gray-800 text-sm">{template.label}</p>
                </button>
              ))}
              
              {/* Custom Option */}
              <button
                onClick={() => handleTemplateSelect('custom')}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  selectedTemplate === 'custom'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <p className="font-medium text-gray-800 text-sm">✏️ Write Custom Reply</p>
              </button>
            </div>
          </div>

          {/* Reply Text Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Reply {isCustom && '(Custom)'}
            </label>
            <textarea
              value={customReply}
              onChange={(e) => setCustomReply(e.target.value)}
              placeholder={isCustom ? "Type your custom reply here..." : "Select a template above to preview"}
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              disabled={!selectedTemplate}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {customReply.length} characters
              </p>
              {selectedTemplate && !isCustom && (
                <p className="text-xs text-purple-600 font-medium">
                  You can edit this template before sending
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!customReply.trim() || submitting}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Sending...
              </>
            ) : (
              <>
                <Send size={18} />
                Send Reply
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}