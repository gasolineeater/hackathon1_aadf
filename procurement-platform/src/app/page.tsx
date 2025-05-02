import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">AADF Smart Procurement</h1>
          <nav className="flex space-x-4">
            <Link href="/login" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Streamlining Procurement for AADF
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            A digital platform that automates and digitizes the end-to-end procurement process
            while ensuring transparency, compliance, and efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tenders" className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg font-medium">
              View Tenders
            </Link>
            <Link href="/submit-proposal" className="px-6 py-3 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors text-lg font-medium">
              Submit a Proposal
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tender Management</h3>
            <p className="text-gray-600">
              Publish tenders, manage deadlines, and organize vendor offers automatically.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Evaluation System</h3>
            <p className="text-gray-600">
              Transparent proposal scoring with customizable criteria and automated reporting.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Detect missing information in bids and get AI-suggested evaluation scores.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Procurement Workflow</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col space-y-6 md:w-1/2">
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h3 className="font-medium text-gray-900">1. Tender Publication</h3>
                <p className="text-gray-600 text-sm">Create and publish tender notices with detailed requirements</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h3 className="font-medium text-gray-900">2. Proposal Submission</h3>
                <p className="text-gray-600 text-sm">Vendors submit proposals securely through the platform</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h3 className="font-medium text-gray-900">3. Evaluation Process</h3>
                <p className="text-gray-600 text-sm">Committee members review and score proposals</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h3 className="font-medium text-gray-900">4. Winner Selection</h3>
                <p className="text-gray-600 text-sm">Automated reports help select the winning vendor</p>
              </div>
            </div>
            <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic">
                "Our procurement process involves several steps: Call for Tenders, Receiving Offers,
                Evaluation of Offers, Decision-Making, Winner Announcement, and Documenting processes and decisions.
                There's a clear need for a tech-powered solution that automates and digitizes this end-to-end
                procurement process while ensuring transparency, compliance, and efficiency."
              </p>
              <p className="mt-4 font-medium text-gray-900">- Albanian-American Development Foundation (AADF)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}
