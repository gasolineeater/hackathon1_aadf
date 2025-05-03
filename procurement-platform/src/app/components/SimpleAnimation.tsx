'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface SimpleAnimationProps {
  children: ReactNode;
  animation: 'fade-in' | 'fade-in-up' | 'fade-in-left' | 'fade-in-right';
  delay?: 'delay-100' | 'delay-200' | 'delay-300' | 'delay-400' | 'delay-500';
  className?: string;
  threshold?: number;
}

export default function SimpleAnimation({
  children,
  animation,
  delay,
  className = '',
  threshold = 0.1,
}: SimpleAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add the animation class when the element is visible
            const element = entry.target as HTMLElement;
            element.classList.add(animation);
            if (delay) {
              element.classList.add(delay);
            }
            // Unobserve after animation is applied
            observer.unobserve(element);
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: threshold, // trigger when 10% of the element is visible
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [animation, delay, threshold]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
