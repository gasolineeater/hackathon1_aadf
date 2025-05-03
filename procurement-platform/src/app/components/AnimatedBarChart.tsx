'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnimatedBarChartProps {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
  height?: number;
  className?: string;
  isLoading?: boolean;
}

export default function AnimatedBarChart({
  title,
  labels,
  datasets,
  height = 300,
  className = '',
  isLoading = false,
}: AnimatedBarChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedData, setAnimatedData] = useState<number[][]>(
    datasets.map(dataset => Array(dataset.data.length).fill(0))
  );
  const chartRef = useRef<HTMLDivElement>(null);

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
      // Animate each dataset's data points
      const animationDuration = 1000; // 1 second
      const steps = 20; // Number of animation steps
      const stepDuration = animationDuration / steps;
      
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        
        if (currentStep <= steps) {
          const progress = currentStep / steps;
          
          // Calculate the current value for each data point based on animation progress
          const newAnimatedData = datasets.map((dataset, datasetIndex) => 
            dataset.data.map((value, index) => {
              return value * progress;
            })
          );
          
          setAnimatedData(newAnimatedData);
        } else {
          clearInterval(interval);
          // Ensure final values match the actual data
          setAnimatedData(datasets.map(dataset => [...dataset.data]));
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }
  }, [isVisible, isLoading, datasets]);

  // Prepare chart data with animated values
  const data = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      data: animatedData[index] || Array(dataset.data.length).fill(0),
    })),
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
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
            const datasetIndex = context.datasetIndex;
            const index = context.dataIndex;
            const actualValue = datasets[datasetIndex].data[index];
            return `${context.dataset.label}: ${actualValue.toLocaleString()}`;
          }
        }
      }
    },
    animation: {
      duration: 0, // Disable default animations as we're handling them manually
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        style={{ height: `${height}px` }}
      >
        <Bar data={data} options={options} />
      </motion.div>
    </div>
  );
}
