'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Observer } from 'gsap/Observer';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Observer);
}

interface AnimationProviderProps {
  children: React.ReactNode;
}

export default function AnimationProvider({ children }: AnimationProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Prevent animation flashes by delaying initialization
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Initialize AOS with optimized settings
    AOS.init({
      duration: 800,
      once: true, // Changed to true to prevent re-animation on scroll up
      mirror: false, // Changed to false to prevent re-animation on scroll up
      offset: 50,
      easing: 'ease-out',
      disable: 'mobile', // Disable on mobile for better performance
      throttleDelay: 99, // Add throttle delay to improve performance
    });

    // Create smooth scrolling for desktop only
    let smoother: any = null;

    if (window.innerWidth > 1024) {
      // Create a wrapper for smooth scrolling
      const wrapper = document.createElement('div');
      wrapper.id = 'smooth-wrapper';

      const content = document.createElement('div');
      content.id = 'smooth-content';

      // Move body children to content div
      while (document.body.firstChild) {
        content.appendChild(document.body.firstChild);
      }

      wrapper.appendChild(content);
      document.body.appendChild(wrapper);

      // Initialize smooth scrolling
      smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.5, // Adjust the smoothness (higher = smoother)
        effects: true,
        normalizeScroll: true,
        ignoreMobileResize: true,
      });
    }

    // Optimize GSAP animations
    gsap.config({
      autoSleep: 60,
      force3D: true,
      nullTargetWarn: false,
    });

    // Optimize ScrollTrigger
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
    });

    // Clean up
    return () => {
      AOS.refresh();
      if (smoother) smoother.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoaded]);

  // Apply a loading state to prevent FOUC (Flash of Unstyled Content)
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#0056a4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
