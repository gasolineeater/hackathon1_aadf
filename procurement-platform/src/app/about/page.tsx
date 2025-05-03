'use client';

import { useEffect } from 'react';

export default function AboutPage() {
  const aadfAboutUrl = 'https://www.aadf.org/our-story-approach/';

  useEffect(() => {
    // Redirect to AADF's "Our Story & Approach" page
    window.location.href = aadfAboutUrl;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Redirecting to AADF's Story & Approach</h1>
        <p className="text-gray-600 mb-6">
          You are being redirected to the AADF's "Our Story & Approach" page.
        </p>
        <p className="text-gray-600">
          If you are not redirected automatically, please{' '}
          <a 
            href={aadfAboutUrl}
            className="text-[#0056a4] hover:underline"
          >
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
