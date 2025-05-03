'use client';

import { useState, useEffect } from 'react';

interface AnimatedFormInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  success?: boolean;
  className?: string;
  autoComplete?: string;
}

export default function AnimatedFormInput({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  error,
  success = false,
  className = '',
  autoComplete,
}: AnimatedFormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update hasValue when value changes
  useEffect(() => {
    setHasValue(value.trim() !== '');
  }, [value]);

  // Handle error animation
  useEffect(() => {
    if (error) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className={`mb-4 ${className}`}>
      <div className="relative">
        {/* Label */}
        <label
          htmlFor={id}
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            isFocused || hasValue
              ? 'text-xs top-1 text-[#0056a4]'
              : 'text-gray-500 top-1/2 -translate-y-1/2'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Input */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-3 pt-5 pb-2 border rounded-md transition-all duration-200 outline-none ${
            isFocused
              ? 'border-[#0056a4] shadow-sm'
              : error
              ? 'border-red-500'
              : success
              ? 'border-green-500'
              : 'border-gray-300'
          } ${isAnimating ? 'animate-shake' : ''}`}
        />

        {/* Success icon */}
        {success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 fade-in">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-500 text-xs mt-1 fade-in">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
