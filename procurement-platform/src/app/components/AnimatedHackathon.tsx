'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

export default function AnimatedHackathon() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const cards = sectionRef.current.querySelectorAll('.gsap-card');
    
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-[#0056a4] mb-4 inline-block relative">
            Smart Procurement Platform
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#0056a4]"></span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Our innovative solution for the AADF Hackathon Challenge
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="gsap-card">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h3>
                <p className="text-gray-600 mb-6">
                  AADF's procurement process involves several steps: Call for Tenders, Receiving Offers, 
                  Evaluation of Offers, Decision-Making, Winner Announcement, and Documenting processes and decisions. 
                  There's a clear need for a tech-powered solution that automates and digitizes this end-to-end 
                  procurement process while ensuring transparency, compliance, and efficiency.
                </p>
                <motion.div 
                  className="flex flex-wrap gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {['Transparency', 'Efficiency', 'Compliance', 'Automation'].map((tag, i) => (
                    <motion.span 
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, backgroundColor: '#dbeafe' }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          <div className="gsap-card">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="p-1 bg-gradient-to-r from-green-500 to-teal-600"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
                <p className="text-gray-600 mb-6">
                  We've developed a comprehensive digital platform that streamlines AADF's procurement process 
                  with AI-powered features that enhance decision-making, reduce manual work, and ensure 
                  transparency throughout the entire process.
                </p>
                <motion.ul 
                  className="space-y-3"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {[
                    'AI-powered proposal analysis and scoring suggestions',
                    'Automatic detection of missing information in proposals',
                    'Digital workflow for the entire procurement process',
                    'Transparent evaluation system with audit trails'
                  ].map((feature, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start"
                      variants={itemVariants}
                    >
                      <motion.svg 
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, 15, 0] }}
                        transition={{ delay: 0.5 + (i * 0.1), duration: 0.5, type: "spring" }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </motion.svg>
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden gsap-card">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  {
                    step: 1,
                    title: 'Tender Creation',
                    description: 'AADF staff create and publish tenders with detailed requirements and evaluation criteria'
                  },
                  {
                    step: 2,
                    title: 'Proposal Submission',
                    description: 'Vendors submit proposals through the platform with all required documentation'
                  },
                  {
                    step: 3,
                    title: 'AI Analysis',
                    description: 'Our AI analyzes proposals, detects missing information, and suggests evaluation scores'
                  },
                  {
                    step: 4,
                    title: 'Decision & Award',
                    description: 'Committee evaluates proposals with AI assistance and selects the winning vendor'
                  }
                ].map((step, i) => (
                  <motion.div 
                    key={i} 
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <motion.div 
                      className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, backgroundColor: '#dbeafe' }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <span className="text-2xl font-bold text-blue-600">{step.step}</span>
                    </motion.div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-gray-600 text-sm">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center" data-aos="fade-up">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 rounded-md bg-[#0056a4] text-white hover:bg-[#004483] transition-colors font-medium"
            >
              Explore the Platform
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
