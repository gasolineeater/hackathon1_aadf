import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">AADF Smart Procurement</h3>
            <p className="text-gray-400 text-sm">A digital platform for streamlining procurement processes</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} AADF Smart Procurement. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
