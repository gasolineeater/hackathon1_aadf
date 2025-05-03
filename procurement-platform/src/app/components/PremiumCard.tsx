'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'tilt' | 'lift' | 'glow' | 'none';
  onClick?: () => void;
  variant?: 'default' | 'outlined' | 'filled' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function PremiumCard({
  children,
  className = '',
  hoverEffect = 'tilt',
  onClick,
  variant = 'default',
  padding = 'md',
}: PremiumCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Update mouse position relative to card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setMousePosition({ x, y });
  };

  // Get card styles based on variant and padding
  const getCardStyles = () => {
    let styles = 'rounded-lg overflow-hidden transition-all duration-300 ';
    
    // Padding styles
    switch (padding) {
      case 'none':
        styles += '';
        break;
      case 'sm':
        styles += 'p-3 ';
        break;
      case 'lg':
        styles += 'p-8 ';
        break;
      default: // md
        styles += 'p-6 ';
    }
    
    // Variant styles
    switch (variant) {
      case 'outlined':
        styles += 'border border-gray-200 bg-white ';
        break;
      case 'filled':
        styles += 'bg-[#f0f7ff] ';
        break;
      case 'gradient':
        styles += 'bg-gradient-to-br from-white to-[#f0f7ff] ';
        break;
      default: // default
        styles += 'bg-white shadow-md ';
    }
    
    // Cursor style if clickable
    if (onClick) {
      styles += 'cursor-pointer ';
    }
    
    return styles + className;
  };

  // Get transform style based on hover effect and mouse position
  const getTransformStyle = () => {
    if (!isHovered) return {};
    
    switch (hoverEffect) {
      case 'tilt':
        return {
          transform: `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${-mousePosition.x * 10}deg)`,
        };
      case 'lift':
        return {
          transform: 'translateY(-8px)',
        };
      default:
        return {};
    }
  };

  // Get shadow style based on hover effect
  const getShadowStyle = () => {
    if (!isHovered) return {};
    
    switch (hoverEffect) {
      case 'glow':
        return {
          boxShadow: '0 0 20px rgba(0, 86, 164, 0.3)',
        };
      case 'tilt':
      case 'lift':
        return {
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={getCardStyles()}
      style={{
        ...getTransformStyle(),
        ...getShadowStyle(),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Highlight effect on top edge */}
      {isHovered && hoverEffect !== 'none' && (
        <div 
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0056a4] to-[#3a7ab9]"
          style={{
            opacity: hoverEffect === 'tilt' ? 0.7 : 0.5,
          }}
        />
      )}
      
      {children}
    </motion.div>
  );
}
