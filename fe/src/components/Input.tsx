import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  error?: string;
}

export function Input({ icon, rightIcon, label, id, error, className = '', ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-mono font-medium text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-outline flex items-center justify-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full h-11 bg-white border ${
            error ? 'border-red-500 ring-1 ring-red-500' : 'border-outline-variant'
          } rounded-md text-on-surface text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-outline/70 ${icon ? 'pl-10' : 'pl-3'} ${rightIcon ? 'pr-10' : 'pr-3'}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-outline flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <span className="text-[11px] text-red-600 mt-0.5">{error}</span>}
    </div>
  );
}
