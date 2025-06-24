import React from 'react';
import { RefreshCw } from 'lucide-react';

interface BlockActionButtonProps {
  onClick: () => void;
  isLoading: boolean;
  label: string;
  loadingLabel?: string;
  className?: string;
  colorClass?: string;
}

const BlockActionButton: React.FC<BlockActionButtonProps> = ({
  onClick,
  isLoading,
  label,
  loadingLabel = 'Loading...',
  className = '',
  colorClass = '',
}) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`inline-flex items-center justify-center text-center w-full py-3 px-6 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50
    ${
      isLoading
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : colorClass
    } ${className}`}
    aria-label={isLoading ? loadingLabel : label}
  >
    {isLoading ? (
      <>
        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
        {loadingLabel}
      </>
    ) : (
      <>{label}</>
    )}
  </button>
);

export default BlockActionButton;
