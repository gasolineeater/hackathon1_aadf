'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PremiumButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
}

export default function PremiumButton({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  type = 'button',
}: PremiumButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  // Update mouse position relative to button
  const updateMousePosition = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Get button styles based on variant and size
  const getButtonStyles = () => {
    // Base styles
    let styles = 'relative overflow-hidden rounded-md font-medium transition-all duration-300 flex items-center justify-center ';
    
    // Size styles
    switch (size) {
      case 'sm':
        styles += 'text-sm px-3 py-1.5 ';
        break;
      case 'lg':
        styles += 'text-lg px-6 py-3 ';
        break;
      default: // md
        styles += 'text-base px-5 py-2.5 ';
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        styles += 'bg-white text-[#0056a4] border border-[#0056a4] hover:bg-[#f0f7ff] ';
        break;
      case 'outline':
        styles += 'bg-transparent text-[#0056a4] border border-[#0056a4] hover:bg-[#f0f7ff] ';
        break;
      case 'ghost':
        styles += 'bg-transparent text-[#0056a4] hover:bg-[#f0f7ff] ';
        break;
      default: // primary
        styles += 'bg-[#0056a4] text-white hover:bg-[#004483] ';
    }
    
    // Width style
    if (fullWidth) {
      styles += 'w-full ';
    }
    
    // Disabled style
    if (disabled) {
      styles += 'opacity-50 cursor-not-allowed ';
    }
    
    return styles + className;
  };

  // Button content with icon
  const buttonContent = (
    <>
      {/* Hover effect */}
      {isHovered && variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-[#004483] rounded-md"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ 
            scale: 2.5, 
            opacity: 0,
            x: mousePosition.x - buttonRef.current?.offsetWidth! / 2,
            y: mousePosition.y - buttonRef.current?.offsetHeight! / 2,
          }}
          transition={{ duration: 0.6 }}
        />
      )}
      
      {/* Icon and text */}
      <span className="relative flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && (
          <motion.span
            animate={{ x: isHovered ? [0, -4, 0] : 0 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.span>
        )}
        
        <motion.span
          animate={{ scale: isHovered ? 1.03 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        
        {icon && iconPosition === 'right' && (
          <motion.span
            animate={{ x: isHovered ? [0, 4, 0] : 0 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.span>
        )}
      </span>
    </>
  );

  // Render as link or button
  if (href) {
    return (
      <Link
        href={href}
        className={getButtonStyles()}
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={updateMousePosition}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        aria-disabled={disabled}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={getButtonStyles()}
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={updateMousePosition}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonContent}
    </button>
  );
}
