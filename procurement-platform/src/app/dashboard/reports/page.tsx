'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimatedBarChart from '../../components/AnimatedBarChart';
import AnimatedLineChart from '../../components/AnimatedLineChart';
import AnimatedDonutChart from '../../components/AnimatedDonutChart';
import AnimatedProgressBar from '../../components/AnimatedProgressBar';
import AnimatedCircularProgress from '../../components/AnimatedCircularProgress';
import AnimatedStatsCard from '../../components/AnimatedStatsCard';

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Sample data for charts
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Tenders Published',
        data: [12, 19, 15, 22, 28, 25],
        backgroundColor: '#0056a4',
      },
      {
        label: 'Proposals Received',
        data: [8, 15, 12, 17, 22, 30],
        backgroundColor: '#5a2d81',
      },
    ],
  };

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Evaluation Score',
        data: [65, 68, 72, 75, 82, 85],
        borderColor: '#0056a4',
        backgroundColor: 'rgba(0, 86, 164, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Winning Proposal Score',
        data: [78, 82, 85, 89, 92, 95],
        borderColor: '#e74011',
        backgroundColor: 'rgba(231, 64, 17, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const donutChartData = {
    labels: ['IT Services', 'Consulting', 'Construction', 'Supplies', 'Other'],
    data: [35, 25, 20, 15, 5],
    backgroundColor: [
      '#0056a4',
      '#5a2d81',
      '#e74011',
      '#0db14b',
      '#f7941d',
    ],
  };

  // Icons for stats cards
  const tenderIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const proposalIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );

  const vendorIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const completionIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Procurement Analytics</h1>
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedStatsCard
            title="Active Tenders"
            value={24}
            icon={tenderIcon}
            change={{ value: 12, isPositive: true }}
            color="#0056a4"
            isLoading={isLoading}
          />
          
          <AnimatedStatsCard
            title="Proposals Received"
            value={187}
            icon={proposalIcon}
            change={{ value: 8, isPositive: true }}
            color="#5a2d81"
            isLoading={isLoading}
          />
          
          <AnimatedStatsCard
            title="Registered Vendors"
            value={342}
            icon={vendorIcon}
            change={{ value: 5, isPositive: true }}
            color="#e74011"
            isLoading={isLoading}
          />
          
          <AnimatedStatsCard
            title="Completion Rate"
            value={92}
            suffix="%"
            icon={completionIcon}
            change={{ value: 3, isPositive: true }}
            color="#0db14b"
            isLoading={isLoading}
          />
        </div>
        
        {/* Charts - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnimatedBarChart
            title="Tender Activity"
            labels={barChartData.labels}
            datasets={barChartData.datasets}
            height={350}
            isLoading={isLoading}
          />
          
          <AnimatedLineChart
            title="Evaluation Scores Trend"
            labels={lineChartData.labels}
            datasets={lineChartData.datasets}
            height={350}
            isLoading={isLoading}
          />
        </div>
        
        {/* Charts - Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <AnimatedDonutChart
            title="Tender Categories"
            labels={donutChartData.labels}
            data={donutChartData.data}
            backgroundColor={donutChartData.backgroundColor}
            height={300}
            centerText="2023"
            isLoading={isLoading}
          />
          
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-center">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Procurement Process Efficiency</h3>
            
            <div className="space-y-6">
              <AnimatedProgressBar
                label="Tender Publication"
                value={95}
                color="#0056a4"
                isLoading={isLoading}
              />
              
              <AnimatedProgressBar
                label="Proposal Evaluation"
                value={82}
                color="#5a2d81"
                isLoading={isLoading}
              />
              
              <AnimatedProgressBar
                label="Contract Award"
                value={78}
                color="#e74011"
                isLoading={isLoading}
              />
              
              <AnimatedProgressBar
                label="Documentation"
                value={65}
                color="#0db14b"
                isLoading={isLoading}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Overall Completion</h3>
            
            <div className="flex flex-wrap justify-center gap-6">
              <AnimatedCircularProgress
                value={78}
                label="Q1 2023"
                color="#0056a4"
                isLoading={isLoading}
              />
              
              <AnimatedCircularProgress
                value={92}
                label="Q2 2023"
                color="#5a2d81"
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
        
        {/* Additional Analytics Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Procurement Performance Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Time Efficiency</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Average Tender Duration</span>
                    <span className="text-sm font-medium text-gray-500">45 days</span>
                  </div>
                  <AnimatedProgressBar
                    value={75}
                    height={6}
                    color="#0056a4"
                    showPercentage={false}
                    isLoading={isLoading}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Evaluation Turnaround</span>
                    <span className="text-sm font-medium text-gray-500">12 days</span>
                  </div>
                  <AnimatedProgressBar
                    value={85}
                    height={6}
                    color="#5a2d81"
                    showPercentage={false}
                    isLoading={isLoading}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Contract Finalization</span>
                    <span className="text-sm font-medium text-gray-500">8 days</span>
                  </div>
                  <AnimatedProgressBar
                    value={92}
                    height={6}
                    color="#e74011"
                    showPercentage={false}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Quality Metrics</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Proposal Quality Score</span>
                    <span className="text-sm font-medium text-gray-500">82/100</span>
                  </div>
                  <AnimatedProgressBar
                    value={82}
                    height={6}
                    color="#0db14b"
                    showPercentage={false}
                    isLoading={isLoading}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Vendor Satisfaction</span>
                    <span className="text-sm font-medium text-gray-500">88%</span>
                  </div>
                  <AnimatedProgressBar
                    value={88}
                    height={6}
                    color="#f7941d"
                    showPercentage={false}
                    isLoading={isLoading}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Compliance Rate</span>
                    <span className="text-sm font-medium text-gray-500">95%</span>
                  </div>
                  <AnimatedProgressBar
                    value={95}
                    height={6}
                    color="#0056a4"
                    showPercentage={false}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Export Options */}
        <div className="flex justify-end mb-8">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
          >
            <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export as PDF
          </button>
          
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as Excel
          </button>
        </div>
      </div>
    </div>
  );
}
