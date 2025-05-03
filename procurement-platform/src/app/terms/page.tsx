'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();
  // Using the main AADF website as the target for terms of service
  // If AADF has a specific terms page, this URL should be updated
  const aadfTermsUrl = 'https://www.aadf.org/';

  useEffect(() => {
    // Redirect to AADF's website
    window.location.href = aadfTermsUrl;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Redirecting to Terms of Service</h1>
        <p className="text-gray-600 mb-6">
          You are being redirected to the AADF website.
        </p>
        <p className="text-gray-600">
          If you are not redirected automatically, please{' '}
          <a 
            href={aadfTermsUrl}
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
