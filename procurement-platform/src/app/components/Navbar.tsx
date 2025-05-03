import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar with login and language selector */}
      <div className="bg-gray-100 py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center text-sm">
          <Link href="/login" className="text-gray-600 hover:text-[#0056a4] mr-4">
            Log In
          </Link>
          <div className="flex items-center">
            <button className="text-gray-600 hover:text-[#0056a4]">EN</button>
            <span className="mx-2 text-gray-400">|</span>
            <button className="flex items-center justify-center w-6 h-6 rounded-full bg-[#5A2D81] text-white text-xs">
              AL
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/aadf-logo.svg"
              alt="Albanian-American Development Foundation"
              width={180}
              height={48}
              priority
            />
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/about"
              className="text-gray-700 hover:text-[#0056a4] font-medium transition-colors py-2"
            >
              About
            </Link>

            <Link
              href="/projects"
              className="text-gray-700 hover:text-[#0056a4] font-medium transition-colors py-2"
            >
              Projects
            </Link>

            <Link
              href="/opportunities"
              className="text-gray-700 hover:text-[#0056a4] font-medium transition-colors py-2"
            >
              Opportunities
            </Link>

            <Link
              href="/news"
              className="text-gray-700 hover:text-[#0056a4] font-medium transition-colors py-2"
            >
              News
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 hover:text-[#0056a4] font-medium transition-colors py-2"
            >
              Contact
            </Link>
          </nav>

          {/* Search and mobile menu buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-[#0056a4] focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile menu button */}
            <button className="md:hidden text-gray-700 hover:text-[#0056a4] focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
