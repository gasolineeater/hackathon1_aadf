'use client';

import { useState, useEffect } from 'react';

interface AnalysisAnimationProps {
  isAnalyzing: boolean;
  onComplete?: () => void;
  duration?: number;
}

export default function AnalysisAnimation({ 
  isAnalyzing, 
  onComplete,
  duration = 5000
}: AnalysisAnimationProps) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const stages = [
    'Extracting requirements...',
    'Analyzing compliance...',
    'Evaluating quality factors...',
    'Calculating scores...',
    'Generating recommendations...',
    'Finalizing analysis...'
  ];
  
  useEffect(() => {
    if (!isAnalyzing) {
      setStage(0);
      setProgress(0);
      return;
    }
    
    const stageTime = duration / stages.length;
    const progressInterval = 50; // Update progress every 50ms
    const progressStep = 100 / (stageTime / progressInterval);
    
    let currentStage = 0;
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += progressStep;
      
      if (currentProgress >= 100) {
        currentProgress = 0;
        currentStage += 1;
        
        if (currentStage >= stages.length) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return;
        }
        
        setStage(currentStage);
      }
      
      setProgress(currentProgress);
    }, progressInterval);
    
    return () => clearInterval(interval);
  }, [isAnalyzing, onComplete, duration, stages.length]);
  
  if (!isAnalyzing) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
        <h3 className="text-lg font-medium text-gray-900">AI Analysis in Progress</h3>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">{stages[stage]}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        <p>Using advanced AI algorithms to analyze the proposal...</p>
        <p className="mt-1">This typically takes less than 10 seconds</p>
      </div>
    </div>
  );
}
