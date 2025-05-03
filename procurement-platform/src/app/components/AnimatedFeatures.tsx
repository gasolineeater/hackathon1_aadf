'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

export default function AnimatedFeatures() {
  const featuresRef = useRef<HTMLDivElement>(null);

  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -15 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <section className="py-16 bg-white" ref={featuresRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-[#0056a4] mb-4 inline-block relative">
            AADF Smart Procurement
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#0056a4]"></span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            A non-profit organization working to promote social and economic development in Albania
            through transparent and efficient procurement processes.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#0056a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              title: "Transparent Process",
              description: "Our platform ensures complete transparency in the procurement process, from tender publication to winner selection."
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#0056a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
              title: "Digital Efficiency",
              description: "Replacing paper-heavy processes with digital workflows that save time and reduce errors."
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#0056a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: "AI-Powered Analysis",
              description: "Advanced AI tools to analyze proposals, detect missing information, and suggest evaluation scores."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              variants={featureVariants}
            >
              <motion.div 
                className="flex justify-center mb-6"
                variants={iconVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-[#0056a4] mb-3">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20" data-aos="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-[#0056a4] mb-2">
                <CountUp end={83} suffix="+" duration={2.5} enableScrollSpy scrollSpyOnce />
              </div>
              <div className="text-gray-600 font-medium">Tenders Processed</div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-[#0056a4] mb-2">
                <CountUp end={100} suffix="%" duration={2.5} enableScrollSpy scrollSpyOnce />
              </div>
              <div className="text-gray-600 font-medium">Transparent Evaluation</div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-[#0056a4] mb-2">
                <CountUp end={50} suffix="%" duration={2.5} enableScrollSpy scrollSpyOnce />
              </div>
              <div className="text-gray-600 font-medium">Time Saved in Processing</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
