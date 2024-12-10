export function LoadingSpinner() {
  return (
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      <div className="text-gray-900">AI Assistant is thinking...</div>
    </div>
  );
} 