'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', mouseMove);

    // Add event listeners for cursor variants
    const links = document.querySelectorAll('a, button');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', () => setCursorVariant('link'));
      link.addEventListener('mouseleave', () => setCursorVariant('default'));
    });

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      
      links.forEach(link => {
        link.removeEventListener('mouseenter', () => setCursorVariant('link'));
        link.removeEventListener('mouseleave', () => setCursorVariant('default'));
      });
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: 'rgba(0, 86, 164, 0)',
      border: '2px solid rgba(0, 86, 164, 0.5)',
      transition: {
        type: 'spring',
        mass: 0.6
      }
    },
    link: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      height: 40,
      width: 40,
      backgroundColor: 'rgba(0, 86, 164, 0.1)',
      border: '2px solid rgba(0, 86, 164, 0.8)',
      transition: {
        type: 'spring',
        mass: 0.6
      }
    }
  };

  // Only show custom cursor on desktop
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-50 hidden md:block"
      variants={variants}
      animate={cursorVariant}
    />
  );
}
