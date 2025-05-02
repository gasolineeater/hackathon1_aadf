import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-800">
          AADF Smart Procurement
        </Link>
        <nav className="flex space-x-4">
          <Link href="/tenders" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
            Tenders
          </Link>
          <Link href="/submit-proposal" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
            Submit Proposal
          </Link>
          <Link href="/login" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
