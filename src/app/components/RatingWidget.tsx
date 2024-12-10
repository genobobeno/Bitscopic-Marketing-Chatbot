'use client';

import { useState } from 'react';
import { Message } from 'ai';
import { StarIcon } from '@heroicons/react/24/solid';
import { Dialog } from '@headlessui/react';

interface RatingWidgetProps {
  userMessage: Message;
  assistantMessage: Message;
  onRatingComplete: () => void;
}

export function RatingWidget({ userMessage, assistantMessage, onRatingComplete }: RatingWidgetProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = async (value: number) => {
    setRating(value);
    setIsCommentOpen(true);
  };

  const handleSubmit = async () => {
    if (!rating) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_message: userMessage.content,
          ai_response: assistantMessage.content,
          user_rating: rating,
          user_comments: comment || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save rating');
      }

      setIsCommentOpen(false);
      onRatingComplete();
    } catch (error) {
      console.error('Error saving rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Rate this response</h3>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingClick(star)}
            className="focus:outline-none"
          >
            <StarIcon
              className={`w-8 h-8 ${
                (rating ?? 0) >= star ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      <Dialog
        open={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Please suggest any necessary improvements:
            </Dialog.Title>
            
            <textarea
              className="w-full p-2 border rounded-md text-gray-900"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional feedback..."
            />
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsCommentOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 