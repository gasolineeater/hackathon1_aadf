'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedStatsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  className?: string;
  isLoading?: boolean;
}

export default function AnimatedStatsCard({
  title,
  value,
  icon,
  prefix = '',
  suffix = '',
  change,
  color = '#0056a4',
  className = '',
  isLoading = false,
}: AnimatedStatsCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Set up intersection observer to trigger animation when card is visible
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

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Animate value when card becomes visible
  useEffect(() => {
    if (isVisible && !isLoading) {
      // Determine animation duration based on value size
      const animationDuration = Math.min(Math.max(value / 100, 0.5), 2) * 1000; // 0.5-2 seconds
      const steps = 30; // Number of animation steps
      const stepDuration = animationDuration / steps;
      
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        
        if (currentStep <= steps) {
          const progress = currentStep / steps;
          // Use easeOutQuart easing function for smoother animation
          const easedProgress = 1 - Math.pow(1 - progress, 4);
          setAnimatedValue(Math.round(value * easedProgress));
        } else {
          clearInterval(interval);
          // Ensure final value matches the actual value
          setAnimatedValue(value);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }
  }, [isVisible, isLoading, value]);

  // Format the displayed value with commas for thousands
  const formattedValue = animatedValue.toLocaleString();

  return (
    <motion.div 
      ref={cardRef} 
      className={`relative rounded-lg bg-white p-6 shadow-md ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 rounded-lg">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : null}
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-500">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold" style={{ color }}>
              {prefix}{formattedValue}{suffix}
            </p>
            
            {change && (
              <p className={`ml-2 text-sm font-medium ${
                change.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="flex items-center">
                  {change.isPositive ? (
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {change.value}%
                </span>
              </p>
            )}
          </div>
        </div>
        
        {icon && (
          <div 
            className="p-3 rounded-full" 
            style={{ backgroundColor: `${color}20` }} // 20% opacity of the color
          >
            <div style={{ color }}>{icon}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
