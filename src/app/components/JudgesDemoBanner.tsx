'use client';

import Link from 'next/link';

export default function JudgesDemoBanner() {
  return (
    <div className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">AADF Hackathon Judges Demo</h2>
          <p className="mt-1 text-sm text-purple-100">
            Explore our AI-powered procurement features
          </p>
        </div>
        <Link
          href="/admin/judges-demo"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-purple-600 bg-white hover:bg-purple-50"
        >
          Open Demo Dashboard
        </Link>
      </div>
    </div>
  );
}
