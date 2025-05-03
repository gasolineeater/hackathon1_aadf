'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface MicroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  tooltip?: string;
}

export default function MicroButton({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  tooltip,
}: MicroButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Get button styles based on variant and size
  const getButtonStyles = () => {
    let baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-200 ';
    
    // Size styles
    switch (size) {
      case 'sm':
        baseStyles += 'px-3 py-1.5 text-sm ';
        break;
      case 'lg':
        baseStyles += 'px-6 py-3 text-lg ';
        break;
      default: // md
        baseStyles += 'px-4 py-2 text-base ';
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyles += 'bg-white text-[#0056a4] border border-[#0056a4] hover:bg-[#f0f7ff] ';
        break;
      case 'outline':
        baseStyles += 'bg-transparent text-[#0056a4] border border-gray-300 hover:border-[#0056a4] hover:bg-[#f0f7ff] ';
        break;
      case 'ghost':
        baseStyles += 'bg-transparent text-[#0056a4] hover:bg-[#f0f7ff] ';
        break;
      case 'danger':
        baseStyles += 'bg-red-600 text-white hover:bg-red-700 ';
        break;
      default: // primary
        baseStyles += 'bg-[#0056a4] text-white hover:bg-[#004483] ';
    }
    
    // Disabled styles
    if (disabled || isLoading) {
      baseStyles += 'opacity-60 cursor-not-allowed ';
    }
    
    // Full width
    if (fullWidth) {
      baseStyles += 'w-full ';
    }
    
    return baseStyles + className;
  };

  // Button content
  const buttonContent = (
    <>
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-md">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {/* Button content with icon */}
      <span className={`flex items-center ${isLoading ? 'opacity-0' : ''}`}>
        {icon && iconPosition === 'left' && (
          <motion.span
            className="mr-2"
            animate={{ x: isHovered ? [-1, 1, -1] : 0 }}
            transition={{ duration: 0.3, repeat: isHovered ? Infinity : 0 }}
          >
            {icon}
          </motion.span>
        )}
        
        <span>{children}</span>
        
        {icon && iconPosition === 'right' && (
          <motion.span
            className="ml-2"
            animate={{ x: isHovered ? [1, -1, 1] : 0 }}
            transition={{ duration: 0.3, repeat: isHovered ? Infinity : 0 }}
          >
            {icon}
          </motion.span>
        )}
      </span>
      
      {/* Ripple effect */}
      {isPressed && !disabled && !isLoading && (
        <span className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
          <motion.span
            className="absolute rounded-full bg-white bg-opacity-30"
            initial={{ scale: 0, x: '-50%', y: '-50%' }}
            animate={{ scale: 5 }}
            transition={{ duration: 0.5 }}
            style={{
              left: '50%',
              top: '50%',
              width: 20,
              height: 20,
            }}
          />
        </span>
      )}
      
      {/* Tooltip */}
      {tooltip && showTooltip && (
        <motion.div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </motion.div>
      )}
    </>
  );

  // Event handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (tooltip) {
      setTimeout(() => setShowTooltip(true), 500);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
  };
  
  const handleMouseDown = () => {
    if (!disabled && !isLoading) {
      setIsPressed(true);
    }
  };
  
  const handleMouseUp = () => {
    setIsPressed(false);
  };

  // Render as link or button
  if (href && !disabled && !isLoading) {
    return (
      <Link
        href={href}
        className={getButtonStyles()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={onClick}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={getButtonStyles()}
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {buttonContent}
    </button>
  );
}
