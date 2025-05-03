'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function JudgeHelper() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  // Only show in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, []);

  const handleAdminLogin = async () => {
    try {
      await signIn('admin@aadf.org', 'admin123');
      router.push('/admin');
    } catch (error) {
      console.error('Failed to sign in:', error);
      alert('Failed to sign in as admin. Please try manually.');
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {isExpanded ? (
          <div className="w-72">
            <div className="bg-[#0056a4] text-white px-4 py-2 flex justify-between items-center">
              <h3 className="text-sm font-medium">Hackathon Judge Helper</h3>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-white hover:text-gray-200"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-gray-500">Quick access to admin features:</p>
              
              <button
                onClick={handleAdminLogin}
                className="w-full text-sm bg-[#0056a4] text-white py-2 px-4 rounded hover:bg-[#004483] transition-colors"
              >
                Login as Admin
              </button>
              
              <div className="space-y-2 pt-2">
                <p className="text-xs font-medium text-gray-700">Navigate to:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigateTo('/admin')}
                    className="text-xs bg-gray-100 text-gray-800 py-1 px-2 rounded hover:bg-gray-200 transition-colors"
                  >
                    Admin Dashboard
                  </button>
                  <button
                    onClick={() => navigateTo('/admin/document-validation')}
                    className="text-xs bg-gray-100 text-gray-800 py-1 px-2 rounded hover:bg-gray-200 transition-colors"
                  >
                    Document Validation
                  </button>
                  <button
                    onClick={() => navigateTo('/admin/compatibility')}
                    className="text-xs bg-gray-100 text-gray-800 py-1 px-2 rounded hover:bg-gray-200 transition-colors"
                  >
                    AI Compatibility
                  </button>
                  <button
                    onClick={() => navigateTo('/admin/evaluation')}
                    className="text-xs bg-gray-100 text-gray-800 py-1 px-2 rounded hover:bg-gray-200 transition-colors"
                  >
                    Tender Evaluation
                  </button>
                </div>
              </div>
              
              <div className="pt-2 text-xs text-gray-500">
                <p>Admin credentials:</p>
                <p>Email: admin@aadf.org</p>
                <p>Password: admin123</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="bg-[#0056a4] text-white p-2 rounded-lg hover:bg-[#004483] transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
