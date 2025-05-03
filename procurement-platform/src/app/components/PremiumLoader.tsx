'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumLoaderProps {
  onLoadComplete?: () => void;
}

export default function PremiumLoader({ onLoadComplete }: PremiumLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Slow down progress as it approaches 100%
        const increment = Math.max(1, 10 * (1 - prev / 100));
        const newProgress = Math.min(100, prev + increment);
        
        if (newProgress === 100) {
          clearInterval(interval);
          
          // Add a small delay before completing
          setTimeout(() => {
            setIsComplete(true);
            if (onLoadComplete) onLoadComplete();
          }, 500);
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.45, 0, 0.55, 1] }
          }}
        >
          <div className="relative w-64 mb-8">
            {/* AADF Logo */}
            <motion.div
              className="w-20 h-20 mx-auto mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg width="80" height="80" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 0C10.0736 0 0 10.0736 0 22.5C0 34.9264 10.0736 45 22.5 45C34.9264 45 45 34.9264 45 22.5C45 10.0736 34.9264 0 22.5 0Z" fill="white"/>
                <path d="M22.5 0C19.1842 0 15.9366 0.879735 13.0554 2.53237C10.1742 4.18501 7.7519 6.55032 6.00962 9.40061C4.26734 12.2509 3.26696 15.4913 3.1084 18.8354C2.94983 22.1795 3.63783 25.5005 5.11286 28.4662L22.5 22.5L22.5 0Z" fill="#0072CE"/>
                <path d="M22.5 0C25.8158 0 29.0634 0.879735 31.9446 2.53237C34.8258 4.18501 37.2481 6.55032 38.9904 9.40061C40.7327 12.2509 41.733 15.4913 41.8916 18.8354C42.0502 22.1795 41.3622 25.5005 39.8871 28.4662L22.5 22.5L22.5 0Z" fill="#DB3E6F"/>
                <path d="M39.8871 28.4662C38.4121 31.4319 36.1324 33.9358 33.3031 35.7134C30.4738 37.4909 27.1926 38.4699 23.8406 38.5457C20.4886 38.6215 17.1663 37.7913 14.2611 36.1382C11.3558 34.4851 8.9696 32.0848 7.37134 29.1848L22.5 22.5L39.8871 28.4662Z" fill="#672D87"/>
                <path d="M7.37135 29.1848C5.77309 26.2848 5.00291 22.9566 5.1488 19.6066C5.29469 16.2566 6.35078 13.0275 8.20991 10.2731L22.5 22.5L7.37135 29.1848Z" fill="#0DB14B"/>
              </svg>
            </motion.div>
            
            {/* Loading text */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-[#0056a4] mb-1">AADF Smart Procurement</h2>
              <p className="text-gray-500 text-sm">Loading experience...</p>
            </motion.div>
            
            {/* Progress bar background */}
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              {/* Progress bar fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-[#0056a4] to-[#3a7ab9]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            
            {/* Progress percentage */}
            <motion.div
              className="mt-2 text-right text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.round(progress)}%
            </motion.div>
          </div>
          
          {/* Animated elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#0056a4] opacity-10"
                style={{
                  width: Math.random() * 100 + 20,
                  height: Math.random() * 100 + 20,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 50 - 25, 0],
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
