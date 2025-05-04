'use client';

import Link from 'next/link';

interface DemoBannerProps {
  title?: string;
  subtitle?: string;
  showBackLink?: boolean;
  backLink?: string;
  backText?: string;
}

export default function DemoBanner({
  title = "AADF Hackathon Demo",
  subtitle = "AI-Powered Procurement Platform",
  showBackLink = true,
  backLink = "/admin",
  backText = "Back to Admin"
}: DemoBannerProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md overflow-hidden mb-6">
      <div className="px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="text-sm text-purple-100">{subtitle}</p>
        </div>
        
        {showBackLink && (
          <Link
            href={backLink}
            className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50"
          >
            {backText}
          </Link>
        )}
      </div>
    </div>
  );
}
