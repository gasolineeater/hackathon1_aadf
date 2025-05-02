import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          {/* Replace with actual AADF logo */}
          <div className="w-10 h-10 bg-[#0056a4] rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-xl font-bold text-[#0056a4]">
            AADF Smart Procurement
          </span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link
            href="/tenders"
            className="text-gray-700 hover:text-[#0056a4] font-medium transition-colors relative group"
          >
            Tenders
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056a4] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/submit-proposal"
            className="text-gray-700 hover:text-[#0056a4] font-medium transition-colors relative group"
          >
            Submit Proposal
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056a4] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-md bg-[#0056a4] text-white hover:bg-[#004483] transition-colors"
          >
            Log In
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-700 hover:text-[#0056a4] focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Language selector - similar to AADF site */}
      <div className="bg-gray-100 py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center text-sm">
          <button className="text-gray-600 hover:text-[#0056a4]">EN</button>
          <span className="mx-2 text-gray-400">|</span>
          <button className="text-gray-600 hover:text-[#0056a4]">AL</button>
        </div>
      </div>
    </header>
  );
}
