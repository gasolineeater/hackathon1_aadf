'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CookiesPage() {
  const router = useRouter();
  // Using the main AADF website as the target for cookies policy
  // If AADF has a specific cookies policy page, this URL should be updated
  const aadfCookiesUrl = 'https://www.aadf.org/';

  useEffect(() => {
    // Redirect to AADF's website
    window.location.href = aadfCookiesUrl;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Redirecting to Cookies Policy</h1>
        <p className="text-gray-600 mb-6">
          You are being redirected to the AADF website.
        </p>
        <p className="text-gray-600">
          If you are not redirected automatically, please{' '}
          <a 
            href={aadfCookiesUrl}
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
