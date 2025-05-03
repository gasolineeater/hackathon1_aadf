import Link from "next/link";
import Image from "next/image";
import HomeLayout from "./components/HomeLayout";

export default function Home() {
  return (
    <HomeLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section - Exactly matching the screenshot */}
        <section className="bg-[#0056a4] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-start justify-between">
            {/* Left side - Text and buttons */}
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8 flex flex-col items-start">
              <p className="text-lg text-white mb-6 max-w-xl">
                Streamlining the end-to-end procurement workflow with
                transparency, compliance, and efficiency at its core.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/tenders"
                  className="px-6 py-2 rounded-md bg-white text-[#0056a4] hover:bg-gray-100 transition-colors font-medium"
                >
                  View Tenders
                </Link>
                <Link
                  href="/submit-proposal"
                  className="px-6 py-2 rounded-md border border-white text-white hover:bg-[#0067c5] transition-colors font-medium"
                >
                  Submit a Proposal
                </Link>
              </div>
            </div>

            {/* Right side - Login card */}
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-[#0056a4] rounded-full flex items-center justify-center text-white">
                      <Image
                        src="/images/aadf-logo.svg"
                        alt="AADF"
                        width={20}
                        height={20}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-[#0056a4]">AADF Procurement</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Login to access the procurement platform or submit a proposal as a vendor.
                  </p>
                  <Link
                    href="/login"
                    className="w-full block text-center px-4 py-2 rounded-md bg-[#0056a4] text-white hover:bg-[#004483] transition-colors font-medium"
                  >
                    Log In
                  </Link>
                  <div className="mt-3 text-center">
                    <Link href="/register" className="text-[#0056a4] hover:underline text-xs">
                      Register as a new vendor
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0056a4] mb-4 inline-block relative">
                AADF Smart Procurement
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#0056a4]"></span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
                A non-profit organization working to promote social and economic development in Albania
                through transparent and efficient procurement processes.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                <div className="flex justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#0056a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#0056a4] mb-3">Transparent Process</h3>
                <p className="text-gray-600">
                  Our platform ensures complete transparency in the procurement process, from tender publication to winner selection.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                <div className="flex justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#0056a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#0056a4] mb-3">Digital Efficiency</h3>
                <p className="text-gray-600">
                  Replacing paper-heavy processes with digital workflows that save time and reduce errors.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                <div className="flex justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#0056a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#0056a4] mb-3">AI-Powered Analysis</h3>
                <p className="text-gray-600">
                  Advanced AI tools to analyze proposals, detect missing information, and suggest evaluation scores.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HomeLayout>
  );
}
