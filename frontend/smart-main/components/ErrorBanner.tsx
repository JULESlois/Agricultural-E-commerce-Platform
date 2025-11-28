import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatMessage } from '../utils/errors';

export const ErrorBanner: React.FC<{
  code: string;
  onRetry?: () => void;
}> = ({ code, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AlertTriangle size={18} />
        <span className="text-sm">{formatMessage(code)}</span>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="text-sm text-red-700 hover:text-red-800 underline">重试</button>
      )}
    </div>
  );
};

