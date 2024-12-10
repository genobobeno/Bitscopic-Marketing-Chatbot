'use client';

import { useAssistant } from 'ai/react';
import { useState } from 'react';
import { MessageList } from './MessageList';
import { RatingWidget } from './RatingWidget';
import { LoadingSpinner } from './LoadingSpinner';

export function AIChatInterface() {
  const {
    messages,
    input,
    handleInputChange,
    setMessages,
    status
  } = useAssistant({
    api: '/api/assistant/chat',
    body: {
      threadId: null,
      messages: []
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ratedMessages, setRatedMessages] = useState<Set<string>>(new Set());

  const handleRatingComplete = (messageId: string) => {
    setRatedMessages(prev => new Set([...prev, messageId]));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      
      const userMessage = {
        id: Date.now().toString(),
        content: input,
        role: 'user' as const
      };

      // Add the user message to the messages array
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      // Make the API call
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add the assistant's response to messages
      setMessages([...newMessages, {
        id: data.id,
        content: data.content,
        role: 'assistant' as const
      }]);

      // Clear the input field by simulating an input change event
      handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error submitting message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="text-gray-900 text-center mt-8">
              Start a conversation by typing a message below.
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
          {isLoading && (
            <div className="p-4 flex justify-start">
              <LoadingSpinner />
            </div>
          )}
          {error && (
            <div className="text-red-600 p-2">
              Error: {error}
            </div>
          )}
        </div>
        <div className="border-t p-4 bg-white">
          <form onSubmit={onSubmit} className="flex space-x-4">
            <input
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 min-w-[100px] justify-center ${
                isLoading ? 'cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Rating sidebar */}
      <div className="w-72 border-l bg-gray-50 p-4">
        {messages.length > 0 && 
         messages[messages.length - 1].role === 'assistant' && 
         !ratedMessages.has(messages[messages.length - 1].id) && (
          <RatingWidget
            userMessage={messages[messages.length - 2]}
            assistantMessage={messages[messages.length - 1]}
            onRatingComplete={() => handleRatingComplete(messages[messages.length - 1].id)}
          />
        )}
      </div>
    </div>
  );
} 