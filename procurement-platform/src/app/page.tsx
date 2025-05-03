import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#0056a4] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-start justify-between">
          {/* Left side - Text and buttons */}
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8 flex flex-col items-start">
            <h1 className="text-4xl font-bold mb-6">
              A Digital Solution for AADF's Procurement Process
            </h1>
            <p className="text-lg text-white mb-6 max-w-xl">
              Streamlining the end-to-end procurement workflow with
              transparency, compliance, and efficiency at its core.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/procurement"
                className="px-6 py-3 rounded-md bg-white text-[#0056a4] hover:bg-gray-100 transition-colors font-medium"
              >
                View Tenders
              </Link>
              <Link
                href="/procurement/1/submit"
                className="px-6 py-3 rounded-md border border-white text-white hover:bg-[#0067c5] transition-colors font-medium"
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
                    <svg width="20" height="20" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.5 0C10.0736 0 0 10.0736 0 22.5C0 34.9264 10.0736 45 22.5 45C34.9264 45 45 34.9264 45 22.5C45 10.0736 34.9264 0 22.5 0Z" fill="white"/>
                      <path d="M22.5 0C19.1842 0 15.9366 0.879735 13.0554 2.53237C10.1742 4.18501 7.7519 6.55032 6.00962 9.40061C4.26734 12.2509 3.26696 15.4913 3.1084 18.8354C2.94983 22.1795 3.63783 25.5005 5.11286 28.4662L22.5 22.5L22.5 0Z" fill="#0072CE"/>
                      <path d="M22.5 0C25.8158 0 29.0634 0.879735 31.9446 2.53237C34.8258 4.18501 37.2481 6.55032 38.9904 9.40061C40.7327 12.2509 41.733 15.4913 41.8916 18.8354C42.0502 22.1795 41.3622 25.5005 39.8871 28.4662L22.5 22.5L22.5 0Z" fill="#DB3E6F"/>
                      <path d="M39.8871 28.4662C38.4121 31.4319 36.1324 33.9358 33.3031 35.7134C30.4738 37.4909 27.1926 38.4699 23.8406 38.5457C20.4886 38.6215 17.1663 37.7913 14.2611 36.1382C11.3558 34.4851 8.9696 32.0848 7.37134 29.1848L22.5 22.5L39.8871 28.4662Z" fill="#672D87"/>
                      <path d="M7.37135 29.1848C5.77309 26.2848 5.00291 22.9566 5.1488 19.6066C5.29469 16.2566 6.35078 13.0275 8.20991 10.2731L22.5 22.5L7.37135 29.1848Z" fill="#0DB14B"/>
                    </svg>
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
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
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

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
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

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
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

      {/* Smart Procurement Platform Section - Added for Hackathon */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0056a4] mb-4 inline-block relative">
              Smart Procurement Platform
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#0056a4]"></span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              Our innovative solution for the AADF Hackathon Challenge
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h3>
                  <p className="text-gray-600 mb-6">
                    AADF's procurement process involves several steps: Call for Tenders, Receiving Offers,
                    Evaluation of Offers, Decision-Making, Winner Announcement, and Documenting processes and decisions.
                    There's a clear need for a tech-powered solution that automates and digitizes this end-to-end
                    procurement process while ensuring transparency, compliance, and efficiency.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Transparency
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Efficiency
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Compliance
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Automation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-1 bg-gradient-to-r from-green-500 to-teal-600"></div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
                  <p className="text-gray-600 mb-6">
                    We've developed a comprehensive digital platform that streamlines AADF's procurement process
                    with AI-powered features that enhance decision-making, reduce manual work, and ensure
                    transparency throughout the entire process.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">AI-powered proposal analysis and scoring suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Automatic detection of missing information in proposals</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Digital workflow for the entire procurement process</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">Transparent evaluation system with audit trails</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Tender Creation</h4>
                    <p className="text-gray-600 text-sm">
                      AADF staff create and publish tenders with detailed requirements and evaluation criteria
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-600">2</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Proposal Submission</h4>
                    <p className="text-gray-600 text-sm">
                      Vendors submit proposals through the platform with all required documentation
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-600">3</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h4>
                    <p className="text-gray-600 text-sm">
                      Our AI analyzes proposals, detects missing information, and suggests evaluation scores
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-600">4</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Decision & Award</h4>
                    <p className="text-gray-600 text-sm">
                      Committee evaluates proposals with AI assistance and selects the winning vendor
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 rounded-md bg-[#0056a4] text-white hover:bg-[#004483] transition-colors font-medium"
            >
              Explore the Platform
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
