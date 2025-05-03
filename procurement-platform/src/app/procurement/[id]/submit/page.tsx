import Link from 'next/link';

// Mock data for tenders
const tenders = [
  {
    id: 1,
    title: 'Executive Design of Urban Trails in Tirana',
    reference: '#00189',
    description: 'Design architectural and engineering studio to deliver the executive design for the Urban Trails Tirana Project.',
    deadline: '2025-03-17',
    status: 'Active',
    date: '2025-01-20',
  },
  {
    id: 2,
    title: 'IT Equipment Procurement',
    reference: '#00188',
    description: 'Supply of laptops, desktops, and peripherals for AADF offices.',
    deadline: '2025-02-15',
    status: 'Active',
    date: '2025-01-15',
  },
  {
    id: 3,
    title: 'Office Renovation Services',
    reference: '#00187',
    description: 'Renovation services for AADF headquarters in Tirana.',
    deadline: '2025-02-20',
    status: 'Active',
    date: '2025-01-10',
  },
  {
    id: 4,
    title: 'Marketing and PR Services',
    reference: '#00186',
    description: 'Marketing and public relations services for AADF programs.',
    deadline: '2025-02-10',
    status: 'Closed',
    date: '2024-12-30',
  },
];

export default function SubmitProposalPage({ params }: { params: { id: string } }) {
  const tenderId = parseInt(params.id);
  const tender = tenders.find(t => t.id === tenderId);

  if (!tender) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900">Tender not found</h1>
        <p className="mt-4">
          <Link href="/procurement" className="text-[#0056a4] hover:underline">
            Return to procurement page
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm">
            <Link href="/procurement" className="text-gray-500 hover:text-[#0056a4]">
              Procurement
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href={`/procurement/${tender.id}`} className="text-gray-500 hover:text-[#0056a4]">
              {tender.title}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">Submit Proposal</span>
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Submit Proposal for {tender.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Reference: {tender.reference}
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Information</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>All fields marked with an asterisk (*) are required.</li>
            <li>Technical and financial proposals must be submitted as separate PDF files.</li>
            <li>Maximum file size for each document is 10MB.</li>
            <li>Proposals submitted after the deadline ({tender.deadline}) will not be considered.</li>
            <li>By submitting a proposal, you agree to AADF's terms and conditions.</li>
          </ul>
        </div>

        <form className="space-y-8">
          {/* Company Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                  required
                />
              </div>
              <div>
                <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number *
                </label>
                <input
                  type="text"
                  id="registration_number"
                  name="registration_number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                  required
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                  required
                >
                  <option value="">Select a country</option>
                  <option value="Albania">Albania</option>
                  <option value="Kosovo">Kosovo</option>
                  <option value="North Macedonia">North Macedonia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                />
              </div>
              <div>
                <label htmlFor="year_established" className="block text-sm font-medium text-gray-700 mb-1">
                  Year Established *
                </label>
                <input
                  type="number"
                  id="year_established"
                  name="year_established"
                  min="1900"
                  max="2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  id="contact_name"
                  name="contact_name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                  required
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Proposal Documents */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Proposal Documents</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="technical_proposal" className="block text-sm font-medium text-gray-700 mb-1">
                  Technical Proposal (PDF) *
                </label>
                <input
                  type="file"
                  id="technical_proposal"
                  name="technical_proposal"
                  accept=".pdf"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Maximum file size: 10MB</p>
              </div>
              <div>
                <label htmlFor="financial_proposal" className="block text-sm font-medium text-gray-700 mb-1">
                  Financial Proposal (PDF) *
                </label>
                <input
                  type="file"
                  id="financial_proposal"
                  name="financial_proposal"
                  accept=".pdf"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Maximum file size: 10MB</p>
              </div>
              <div>
                <label htmlFor="company_profile" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Profile (PDF) *
                </label>
                <input
                  type="file"
                  id="company_profile"
                  name="company_profile"
                  accept=".pdf"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Maximum file size: 10MB</p>
              </div>
              <div>
                <label htmlFor="additional_documents" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Documents (ZIP)
                </label>
                <input
                  type="file"
                  id="additional_documents"
                  name="additional_documents"
                  accept=".zip,.rar"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056a4]"
                />
                <p className="mt-1 text-sm text-gray-500">Maximum file size: 20MB</p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-[#0056a4] border-gray-300 rounded focus:ring-[#0056a4]"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the terms and conditions *
                </label>
                <p className="text-gray-500">
                  By submitting this proposal, I certify that all information provided is accurate and complete. I understand that any false information may result in disqualification.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#0056a4] text-white font-medium rounded-md hover:bg-[#004483] transition-colors"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
