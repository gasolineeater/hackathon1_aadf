import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Top bar with login */}
      <div className="bg-gray-50 py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center text-sm">
          <Link href="/login" className="text-gray-600 hover:text-[#0056a4] text-sm">
            Log In
          </Link>
        </div>
      </div>

      {/* Main navigation */}
      <div className="border-b border-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <div className="mr-2">
                <Image
                  src="/images/aadf-logo.png"
                  alt="AADF Logo"
                  width={45}
                  height={45}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div>
                <div className="text-[#2D2E6F] text-sm font-medium">Albanian-American</div>
                <div className="text-[#2D2E6F] text-sm font-medium">Development Foundation</div>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center">
            <div className="flex space-x-8">
              <Link
                href="/about"
                className="text-gray-700 hover:text-[#0056a4] font-medium text-sm transition-colors py-2 relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056a4] transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link
                href="/projects"
                className="text-gray-700 hover:text-[#0056a4] font-medium text-sm transition-colors py-2 relative group"
              >
                Projects
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056a4] transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link
                href="/opportunities"
                className="text-gray-700 hover:text-[#0056a4] font-medium text-sm transition-colors py-2 relative group"
              >
                Opportunities
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056a4] transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link
                href="/news"
                className="text-gray-700 hover:text-[#0056a4] font-medium text-sm transition-colors py-2 relative group"
              >
                News
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056a4] transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link
                href="/contact"
                className="text-gray-700 hover:text-[#0056a4] font-medium text-sm transition-colors py-2 relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056a4] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </nav>

          {/* Search and Language Selector */}
          <div className="flex items-center space-x-2">
            {/* Search button */}
            <button className="text-gray-700 hover:text-[#0056a4] focus:outline-none p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Language selector */}
            <Link href="/al" className="flex items-center justify-center w-8 h-8 rounded-full bg-[#5A2D81] text-white text-xs ml-2">
              AL
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
