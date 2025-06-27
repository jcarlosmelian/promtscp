import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g., text-sky-500
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'text-sky-400' }) => {
  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'w-4 h-4 border-2';
      break;
    case 'md':
      sizeClasses = 'w-8 h-8 border-4';
      break;
    case 'lg':
      sizeClasses = 'w-12 h-12 border-4';
      break;
  }

  return (
    <div className={`animate-spin rounded-full ${sizeClasses} border-t-transparent ${color} border-solid`} role="status">
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default LoadingSpinner;