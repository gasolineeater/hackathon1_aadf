'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface AnimatedDonutChartProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColor: string[];
  borderColor?: string[];
  height?: number;
  className?: string;
  isLoading?: boolean;
  centerText?: string;
}

export default function AnimatedDonutChart({
  title,
  labels,
  data,
  backgroundColor,
  borderColor,
  height = 300,
  className = '',
  isLoading = false,
  centerText,
}: AnimatedDonutChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedData, setAnimatedData] = useState<number[]>(Array(data.length).fill(0));
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  // Set up intersection observer to trigger animation when chart is visible
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

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Animate data when chart becomes visible
  useEffect(() => {
    if (isVisible && !isLoading) {
      // Animate each data point
      const animationDuration = 1200; // 1.2 seconds
      const steps = 25; // Number of animation steps
      const stepDuration = animationDuration / steps;
      
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        
        if (currentStep <= steps) {
          const progress = currentStep / steps;
          
          // Calculate the current value for each data point based on animation progress
          const newAnimatedData = data.map(value => value * progress);
          
          setAnimatedData(newAnimatedData);
        } else {
          clearInterval(interval);
          // Ensure final values match the actual data
          setAnimatedData([...data]);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }
  }, [isVisible, isLoading, data]);

  // Prepare chart data with animated values
  const chartData = {
    labels,
    datasets: [
      {
        data: animatedData,
        backgroundColor,
        borderColor: borderColor || backgroundColor,
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            // Show the actual target value in tooltip, not the animated value
            const index = context.dataIndex;
            const actualValue = data[index];
            const total = data.reduce((sum, val) => sum + val, 0);
            const percentage = Math.round((actualValue / total) * 100);
            return `${context.label}: ${actualValue.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      duration: 0, // Disable default animations as we're handling them manually
    },
    cutout: '70%',
  };

  // Plugin to display text in the center of the donut
  const plugins = centerText ? [{
    id: 'centerText',
    beforeDraw: function(chart: any) {
      const width = chart.width;
      const height = chart.height;
      const ctx = chart.ctx;
      
      ctx.restore();
      const fontSize = (height / 114).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = 'middle';
      
      const text = centerText;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;
      
      ctx.fillStyle = '#333';
      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  }] : [];

  return (
    <div 
      ref={chartRef} 
      className={`relative rounded-lg bg-white p-4 shadow-md ${className}`}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#0056a4] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-gray-600">Loading data...</p>
          </div>
        </div>
      ) : null}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
        transition={{ duration: 0.5 }}
        style={{ height: `${height}px` }}
      >
        <Doughnut 
          data={chartData} 
          options={options} 
          plugins={plugins}
          ref={(ref) => {
            chartInstance.current = ref;
          }}
        />
      </motion.div>
    </div>
  );
}
