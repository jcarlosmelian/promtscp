
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-sky-600 hover:bg-sky-500 text-white focus:ring-sky-500';
      break;
    case 'secondary':
      variantStyle = 'bg-slate-600 hover:bg-slate-500 text-slate-100 focus:ring-slate-500';
      break;
    case 'danger':
      variantStyle = 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500';
      break;
  }

  let sizeStyle = '';
  switch (size) {
    case 'sm':
      sizeStyle = 'px-3 py-1.5 text-xs';
      break;
    case 'md':
      sizeStyle = 'px-4 py-2 text-sm';
      break;
    // Fix: Removed extra colon from 'case: 'lg':'
    case 'lg':
      sizeStyle = 'px-6 py-3 text-base';
      break;
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;