import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({ children, type = 'button', variant = 'primary', isLoading = false, className = '', ...props }) {
  const baseClasses = 'w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-dark transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'text-white bg-brand-600 hover:bg-brand-500 focus:ring-brand-500 shadow-[0_0_20px_rgba(2,132,199,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)]',
    secondary: 'text-slate-200 bg-surface-border hover:bg-slate-700 focus:ring-slate-500'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
