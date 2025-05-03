'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface FormFeedbackProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  isVisible: boolean;
  className?: string;
}

export default function FormFeedback({
  type,
  message,
  isVisible,
  className = '',
}: FormFeedbackProps) {
  // Get styles based on feedback type
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          iconColor: 'text-green-500',
          borderColor: 'border-green-200',
        };
      case 'error':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          iconColor: 'text-red-500',
          borderColor: 'border-red-200',
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-500',
          borderColor: 'border-yellow-200',
        };
      default: // info
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-500',
          borderColor: 'border-blue-200',
        };
    }
  };

  const styles = getStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`rounded-md border ${styles.bgColor} ${styles.borderColor} p-3 ${className}`}
          initial={{ opacity: 0, y: -10, height: 0, marginTop: 0, marginBottom: 0, padding: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 8, marginBottom: 8, padding: 12 }}
          exit={{ opacity: 0, y: -10, height: 0, marginTop: 0, marginBottom: 0, padding: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex">
            <div className={`flex-shrink-0 ${styles.iconColor}`}>
              {styles.icon}
            </div>
            <div className="ml-3">
              <p className={`text-sm ${styles.textColor}`}>{message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
