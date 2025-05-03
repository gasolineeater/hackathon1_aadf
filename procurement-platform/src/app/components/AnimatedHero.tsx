'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

export default function AnimatedHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline for the hero animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      // Animate the hero background
      tl.fromTo(
        heroRef.current,
        { backgroundPosition: '0% 100%' },
        { backgroundPosition: '0% 0%', duration: 2.5, ease: 'power2.out' }
      );
      
      // Animate the text
      tl.fromTo(
        textRef.current?.querySelectorAll('p, h1'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 0.8 },
        '-=2'
      );
      
      // Animate the buttons
      tl.fromTo(
        buttonRef.current?.querySelectorAll('a'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.6 },
        '-=1'
      );
      
      // Animate the card
      tl.fromTo(
        cardRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        '-=1'
      );
    });
    
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative bg-gradient-to-b from-[#0056a4] to-[#003b70] text-white overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.5, 0],
                scale: [0, 1, 1.5],
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="md:flex md:items-center md:justify-between">
          {/* Left side - Text and buttons */}
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
            <div ref={textRef}>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                A Digital Solution for AADF's Procurement Process
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-100 mb-8 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Streamlining the end-to-end procurement workflow with 
                transparency, compliance, and efficiency at its core.
              </motion.p>
            </div>
            <div ref={buttonRef} className="flex flex-col sm:flex-row gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/procurement"
                  className="px-6 py-3 rounded-md bg-white text-[#0056a4] hover:bg-gray-100 transition-colors text-lg font-medium inline-block"
                >
                  View Tenders
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/procurement/1/submit"
                  className="px-6 py-3 rounded-md border border-white text-white hover:bg-[#0067c5] transition-colors text-lg font-medium inline-block"
                >
                  Submit a Proposal
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right side - Login card */}
          <div ref={cardRef} className="md:w-1/2 flex justify-center">
            <motion.div
              className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <div className="p-6 bg-[#f8f9fa]">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-[#0056a4] rounded-full flex items-center justify-center text-white font-bold">
                    <Image
                      src="/images/aadf-logo.svg"
                      alt="AADF"
                      width={20}
                      height={20}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#0056a4]">AADF Procurement</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Login to access the procurement platform or submit a proposal as a vendor.
                </p>
              </div>
              <div className="p-6">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/login"
                    className="w-full block text-center px-6 py-3 rounded-md bg-[#0056a4] text-white hover:bg-[#004483] transition-colors text-lg font-medium"
                  >
                    Log In
                  </Link>
                </motion.div>
                <div className="mt-4 text-center">
                  <Link href="/register" className="text-[#0056a4] hover:underline text-sm">
                    Register as a new vendor
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Animated wave at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-[50px] md:h-[70px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="#ffffff"
            opacity="0.25"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            fill="#ffffff"
            opacity="0.5"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="#ffffff"
          ></path>
        </svg>
      </div>
    </section>
  );
}
