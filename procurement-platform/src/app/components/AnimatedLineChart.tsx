'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnimatedLineChartProps {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor?: string;
    fill?: boolean;
    tension?: number;
  }[];
  height?: number;
  className?: string;
  isLoading?: boolean;
}

export default function AnimatedLineChart({
  title,
  labels,
  datasets,
  height = 300,
  className = '',
  isLoading = false,
}: AnimatedLineChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
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
      // Animate the line drawing
      const animationDuration = 1500; // 1.5 seconds
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        setAnimationProgress(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isVisible, isLoading]);

  // Prepare chart data with animation
  const data = {
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      // For line charts, we'll use the segment drawing animation
      // by controlling the number of visible points
      data: dataset.data.map((value, index) => {
        const pointProgress = (index + 1) / dataset.data.length;
        return pointProgress <= animationProgress ? value : null;
      }),
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
            // Show the actual target value in tooltip
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
    elements: {
      line: {
        tension: 0.4, // Smooth curves
      },
      point: {
        radius: 3,
        hoverRadius: 7,
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
        <Line data={data} options={options} />
      </motion.div>
    </div>
  );
}
