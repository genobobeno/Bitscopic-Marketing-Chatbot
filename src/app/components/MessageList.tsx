'use client';

import { Message } from 'ai';
import ReactMarkdown from 'react-markdown';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, messageId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start space-x-4 p-4 rounded-lg ${
            message.role === 'assistant' ? 'bg-gray-100' : 'bg-blue-50'
          }`}
        >
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium capitalize text-gray-900">
                {message.role === 'assistant' ? 'AI Assistant' : 'You'}
              </span>
              <button
                onClick={() => copyToClipboard(message.content, message.id)}
                className="text-gray-600 hover:text-gray-900"
                title="Copy to clipboard"
              >
                {copiedId === message.id ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <ClipboardIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="prose max-w-none dark:prose-invert text-gray-900">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 