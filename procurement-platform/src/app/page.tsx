import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#0056a4] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-pattern"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                A Digital Solution for AADF's Procurement Process
              </h1>
              <p className="text-xl text-gray-100 mb-8 max-w-2xl">
                Streamlining the end-to-end procurement workflow with transparency,
                compliance, and efficiency at its core.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/tenders"
                  className="px-6 py-3 rounded-md bg-white text-[#0056a4] hover:bg-gray-100 transition-colors text-lg font-medium"
                >
                  View Tenders
                </Link>
                <Link
                  href="/submit-proposal"
                  className="px-6 py-3 rounded-md border border-white text-white hover:bg-[#0067c5] transition-colors text-lg font-medium"
                >
                  Submit a Proposal
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="p-6 bg-[#f8f9fa]">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-[#0056a4] rounded-full flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <h3 className="text-xl font-bold text-[#0056a4]">AADF Procurement</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Login to access the procurement platform or submit a proposal as a vendor.
                  </p>
                </div>
                <div className="p-6">
                  <Link
                    href="/login"
                    className="w-full block text-center px-6 py-3 rounded-md bg-[#0056a4] text-white hover:bg-[#004483] transition-colors text-lg font-medium"
                  >
                    Log In
                  </Link>
                  <div className="mt-4 text-center">
                    <Link href="/register" className="text-[#0056a4] hover:underline text-sm">
                      Register as a new vendor
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0056a4] mb-4 inline-block relative">
              AADF Smart Procurement
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#0056a4]"></span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              A non-profit organization working to promote social and economic development in Albania
              through transparent and efficient procurement processes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#f0f7ff] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0056a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0056a4] mb-3">Transparent Process</h3>
              <p className="text-gray-600">
                Our platform ensures complete transparency in the procurement process, from tender publication to winner selection.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#f0f7ff] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0056a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0056a4] mb-3">Digital Efficiency</h3>
              <p className="text-gray-600">
                Replacing paper-heavy processes with digital workflows that save time and reduce errors.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#f0f7ff] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0056a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Stats Section */}
      <section className="bg-[#f8f9fa] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#0056a4] mb-2">AADF Procurement in Numbers</h2>
            <p className="text-gray-600">Our tangible commitment at a glance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-[#0056a4] mb-2">83+</div>
              <div className="text-gray-600 font-medium">Tenders Processed</div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-[#0056a4] mb-2">100%</div>
              <div className="text-gray-600 font-medium">Transparent Evaluation</div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-[#0056a4] mb-2">50%</div>
              <div className="text-gray-600 font-medium">Time Saved in Processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0056a4] mb-4 inline-block relative">
              Procurement Workflow
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#0056a4]"></span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              Our streamlined digital process follows AADF's established procurement workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#0056a4] rounded-full p-3 text-white">
                    <span className="font-bold">1</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-[#0056a4] mb-2">Tender Publication</h3>
                    <p className="text-gray-600">
                      AADF staff create and publish tender notices with detailed requirements and specifications.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#0056a4] rounded-full p-3 text-white">
                    <span className="font-bold">2</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-[#0056a4] mb-2">Proposal Submission</h3>
                    <p className="text-gray-600">
                      Vendors submit technical and financial proposals securely through the platform.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#0056a4] rounded-full p-3 text-white">
                    <span className="font-bold">3</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-[#0056a4] mb-2">Evaluation Process</h3>
                    <p className="text-gray-600">
                      Committee members review and score proposals based on predefined criteria.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#0056a4] rounded-full p-3 text-white">
                    <span className="font-bold">4</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-[#0056a4] mb-2">Winner Selection</h3>
                    <p className="text-gray-600">
                      Automated reports help select the winning vendor based on evaluation scores.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#0056a4] rounded-full flex items-center justify-center text-white font-bold mr-4">
                  A
                </div>
                <h3 className="text-xl font-bold text-[#0056a4]">AADF Statement</h3>
              </div>
              <blockquote className="text-gray-700 italic border-l-4 border-[#0056a4] pl-4 mb-6">
                "Our procurement process involves several steps: Call for Tenders, Receiving Offers,
                Evaluation of Offers, Decision-Making, Winner Announcement, and Documenting processes and decisions.
                There's a clear need for a tech-powered solution that automates and digitizes this end-to-end
                procurement process while ensuring transparency, compliance, and efficiency."
              </blockquote>
              <p className="text-right font-medium text-gray-900">- Albanian-American Development Foundation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0056a4] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto mb-8">
            Join our platform to participate in AADF's procurement process with complete transparency and efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 rounded-md bg-white text-[#0056a4] hover:bg-gray-100 transition-colors text-lg font-medium"
            >
              Register as a Vendor
            </Link>
            <Link
              href="/tenders"
              className="px-8 py-4 rounded-md border border-white text-white hover:bg-[#0067c5] transition-colors text-lg font-medium"
            >
              Browse Active Tenders
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
