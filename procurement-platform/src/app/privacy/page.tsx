'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();
  const aadfPrivacyUrl = 'https://www.aadf.org/privacy-policy/';

  useEffect(() => {
    // Redirect to AADF's privacy policy page
    window.location.href = aadfPrivacyUrl;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Redirecting to Privacy Policy</h1>
        <p className="text-gray-600 mb-6">
          You are being redirected to the AADF Privacy Policy page.
        </p>
        <p className="text-gray-600">
          If you are not redirected automatically, please{' '}
          <a 
            href={aadfPrivacyUrl}
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
