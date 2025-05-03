'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCircularProgressProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
  isLoading?: boolean;
}

export default function AnimatedCircularProgress({
  value,
  maxValue = 100,
  size = 120,
  strokeWidth = 10,
  color = '#0056a4',
  backgroundColor = '#e6e6e6',
  label,
  showValue = true,
  valueFormatter,
  className = '',
  isLoading = false,
}: AnimatedCircularProgressProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  // Calculate percentage and circle properties
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  // Set up intersection observer to trigger animation when progress is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Animate value when progress becomes visible
  useEffect(() => {
    if (isVisible && !isLoading) {
      // Animate the progress value
      const animationDuration = 1500; // 1.5 seconds
      const steps = 60; // Number of animation steps (60fps for 1 second)
      const stepDuration = animationDuration / steps;
      
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        
        if (currentStep <= steps) {
          const progress = currentStep / steps;
          // Use easeOutElastic easing function for bouncy animation
          const easedProgress = 1 - Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * (2 * Math.PI) / 3);
          setAnimatedValue(percentage * easedProgress);
        } else {
          clearInterval(interval);
          // Ensure final value matches the actual percentage
          setAnimatedValue(percentage);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }
  }, [isVisible, isLoading, percentage]);

  // Format the displayed value
  const formattedValue = valueFormatter 
    ? valueFormatter(value) 
    : `${Math.round(animatedValue)}%`;

  return (
    <div 
      ref={progressRef} 
      className={`relative flex flex-col items-center ${className}`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#0056a4] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Background circle */}
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={backgroundColor}
                strokeWidth={strokeWidth}
              />
            </svg>
            
            {/* Progress circle */}
            <svg 
              className="absolute top-0 left-0 w-full h-full -rotate-90"
              viewBox={`0 0 ${size} ${size}`}
            >
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                }}
              />
            </svg>
            
            {/* Center text */}
            {showValue && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">
                  {formattedValue}
                </span>
                {label && (
                  <span className="text-xs text-gray-500 mt-1">{label}</span>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Label below (if not shown in center) */}
      {label && !showValue && (
        <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>
      )}
    </div>
  );
}
