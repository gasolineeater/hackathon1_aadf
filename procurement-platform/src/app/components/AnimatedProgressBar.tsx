'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedProgressBarProps {
  value: number;
  maxValue?: number;
  label?: string;
  color?: string;
  height?: number;
  showPercentage?: boolean;
  className?: string;
  isLoading?: boolean;
}

export default function AnimatedProgressBar({
  value,
  maxValue = 100,
  label,
  color = '#0056a4',
  height = 8,
  showPercentage = true,
  className = '',
  isLoading = false,
}: AnimatedProgressBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  // Calculate percentage
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);

  // Set up intersection observer to trigger animation when progress bar is visible
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

  // Animate value when progress bar becomes visible
  useEffect(() => {
    if (isVisible && !isLoading) {
      // Animate the progress value
      const animationDuration = 1000; // 1 second
      const steps = 60; // Number of animation steps (60fps for 1 second)
      const stepDuration = animationDuration / steps;
      
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        
        if (currentStep <= steps) {
          const progress = currentStep / steps;
          // Use easeOutQuad easing function for smoother animation
          const easedProgress = 1 - (1 - progress) * (1 - progress);
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

  return (
    <div 
      ref={progressRef} 
      className={`relative ${className}`}
    >
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-500">
              {isLoading ? '...' : `${Math.round(animatedValue)}%`}
            </span>
          )}
        </div>
      )}
      
      <div 
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        {isLoading ? (
          <div className="h-full w-full bg-gray-300 animate-pulse"></div>
        ) : (
          <motion.div
            className="h-full rounded-full"
            style={{ 
              backgroundColor: color,
              width: `${animatedValue}%`,
              transition: 'width 0.3s ease-out'
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${animatedValue}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </div>
    </div>
  );
}
