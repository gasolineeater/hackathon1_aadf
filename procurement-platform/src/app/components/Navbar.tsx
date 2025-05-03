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
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.5 0C10.0736 0 0 10.0736 0 22.5C0 34.9264 10.0736 45 22.5 45C34.9264 45 45 34.9264 45 22.5C45 10.0736 34.9264 0 22.5 0Z" fill="white"/>
                  <path d="M22.5 3.75C12.1447 3.75 3.75 12.1447 3.75 22.5C3.75 32.8553 12.1447 41.25 22.5 41.25C32.8553 41.25 41.25 32.8553 41.25 22.5C41.25 12.1447 32.8553 3.75 22.5 3.75Z" fill="white"/>
                  <path d="M22.5 7.5C14.2157 7.5 7.5 14.2157 7.5 22.5C7.5 30.7843 14.2157 37.5 22.5 37.5C30.7843 37.5 37.5 30.7843 37.5 22.5C37.5 14.2157 30.7843 7.5 22.5 7.5Z" fill="white"/>
                  <path d="M22.5 11.25C16.2868 11.25 11.25 16.2868 11.25 22.5C11.25 28.7132 16.2868 33.75 22.5 33.75C28.7132 33.75 33.75 28.7132 33.75 22.5C33.75 16.2868 28.7132 11.25 22.5 11.25Z" fill="white"/>
                  <path d="M22.5 15C18.3579 15 15 18.3579 15 22.5C15 26.6421 18.3579 30 22.5 30C26.6421 30 30 26.6421 30 22.5C30 18.3579 26.6421 15 22.5 15Z" fill="white"/>
                  <path d="M22.5 18.75C20.4289 18.75 18.75 20.4289 18.75 22.5C18.75 24.5711 20.4289 26.25 22.5 26.25C24.5711 26.25 26.25 24.5711 26.25 22.5C26.25 20.4289 24.5711 18.75 22.5 18.75Z" fill="white"/>
                  <path d="M22.5 22.5C22.5 22.5 22.5 22.5 22.5 22.5C22.5 22.5 22.5 22.5 22.5 22.5Z" fill="white"/>
                  <path d="M22.5 0C19.1842 0 15.9366 0.879735 13.0554 2.53237C10.1742 4.18501 7.7519 6.55032 6.00962 9.40061C4.26734 12.2509 3.26696 15.4913 3.1084 18.8354C2.94983 22.1795 3.63783 25.5005 5.11286 28.4662L22.5 22.5L22.5 0Z" fill="#0072CE"/>
                  <path d="M22.5 0C25.8158 0 29.0634 0.879735 31.9446 2.53237C34.8258 4.18501 37.2481 6.55032 38.9904 9.40061C40.7327 12.2509 41.733 15.4913 41.8916 18.8354C42.0502 22.1795 41.3622 25.5005 39.8871 28.4662L22.5 22.5L22.5 0Z" fill="#DB3E6F"/>
                  <path d="M39.8871 28.4662C38.4121 31.4319 36.1324 33.9358 33.3031 35.7134C30.4738 37.4909 27.1926 38.4699 23.8406 38.5457C20.4886 38.6215 17.1663 37.7913 14.2611 36.1382C11.3558 34.4851 8.9696 32.0848 7.37134 29.1848L22.5 22.5L39.8871 28.4662Z" fill="#672D87"/>
                  <path d="M7.37135 29.1848C5.77309 26.2848 5.00291 22.9566 5.1488 19.6066C5.29469 16.2566 6.35078 13.0275 8.20991 10.2731L22.5 22.5L7.37135 29.1848Z" fill="#0DB14B"/>
                </svg>
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
