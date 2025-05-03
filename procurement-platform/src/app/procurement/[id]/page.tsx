import Link from 'next/link';

// Mock data for tenders
const tenders = [
  {
    id: 1,
    title: 'Executive Design of Urban Trails in Tirana',
    reference: '#00189',
    description: 'Design architectural and engineering studio to deliver the executive design for the Urban Trails Tirana Project.',
    fullDescription: "Albanian-American Development Foundation is inviting qualified companies to apply for developing the executive design for the Urban Trails of Tirana. An integrated trail system driving Tirana's sustainable future, preserving the environment. The objective of the request is to identify a design architectural and engineering studio to deliver the executive design for the Urban Trails Tirana Project. The project aims to build green paths and trails that link the Grand Park of Tirana with Farka Park and the Dry Lake neighborhood, to enhance eco-tourism, sustainability mobility, and recreation. Space and cost optimization for cyclists and pedestrians is prioritized, fostering feasibility and encouraging diverse usage patterns.",
    deadline: '2025-03-17',
    deadlineTime: '10:00AM',
    status: 'Active',
    date: '2025-01-20',
    ceilingFund: '300,000',
    currency: 'USD',
    documents: [
      { name: 'AADF_ToR_Urban_trail', type: 'PDF', size: '1456.64 Kb' },
      { name: 'Application Package RFTs', type: 'DOCX', size: '85.08 Kb' },
      { name: 'General Conditions', type: 'PDF', size: '196.37 Kb' },
      { name: 'Specific Bidding Details', type: 'PDF', size: '225.09 Kb' },
      { name: 'Urban Trail_Service Contract template', type: 'PDF', size: '378.09 Kb' },
    ]
  },
  {
    id: 2,
    title: 'IT Equipment Procurement',
    reference: '#00188',
    description: 'Supply of laptops, desktops, and peripherals for AADF offices.',
    fullDescription: 'The Albanian-American Development Foundation (AADF) is seeking proposals from qualified vendors for the supply of IT equipment including laptops, desktops, monitors, and peripherals for its offices in Tirana. The selected vendor will be responsible for the delivery, installation, and initial setup of all equipment. AADF is looking for high-quality, business-grade equipment that meets the specifications outlined in the tender documents.',
    deadline: '2025-02-15',
    deadlineTime: '16:00PM',
    status: 'Active',
    date: '2025-01-15',
    ceilingFund: '50,000',
    currency: 'USD',
    documents: [
      { name: 'IT Equipment Specifications', type: 'PDF', size: '856.32 Kb' },
      { name: 'Application Form', type: 'DOCX', size: '75.45 Kb' },
      { name: 'General Terms and Conditions', type: 'PDF', size: '196.37 Kb' },
    ]
  },
  {
    id: 3,
    title: 'Office Renovation Services',
    reference: '#00187',
    description: 'Renovation services for AADF headquarters in Tirana.',
    fullDescription: 'The Albanian-American Development Foundation (AADF) is inviting qualified construction companies to submit proposals for the renovation of its headquarters in Tirana. The renovation project includes interior remodeling, electrical and plumbing updates, HVAC system installation, and general construction work. The selected contractor will be responsible for all aspects of the renovation, including obtaining necessary permits, providing materials, and executing the work according to the specifications provided in the tender documents.',
    deadline: '2025-02-20',
    deadlineTime: '14:00PM',
    status: 'Active',
    date: '2025-01-10',
    ceilingFund: '150,000',
    currency: 'USD',
    documents: [
      { name: 'Renovation Specifications', type: 'PDF', size: '2456.78 Kb' },
      { name: 'Floor Plans', type: 'PDF', size: '3856.92 Kb' },
      { name: 'Application Form', type: 'DOCX', size: '85.08 Kb' },
      { name: 'General Terms and Conditions', type: 'PDF', size: '196.37 Kb' },
    ]
  },
  {
    id: 4,
    title: 'Marketing and PR Services',
    reference: '#00186',
    description: 'Marketing and public relations services for AADF programs.',
    fullDescription: 'The Albanian-American Development Foundation (AADF) is seeking proposals from qualified marketing and public relations agencies to provide comprehensive services for AADF programs and initiatives. The selected agency will be responsible for developing and implementing marketing strategies, managing social media presence, organizing events, and handling media relations. The agency should have experience working with non-profit organizations and a strong understanding of the Albanian media landscape.',
    deadline: '2025-02-10',
    deadlineTime: '17:00PM',
    status: 'Closed',
    date: '2024-12-30',
    ceilingFund: '75,000',
    currency: 'USD',
    documents: [
      { name: 'Marketing Services Scope', type: 'PDF', size: '956.32 Kb' },
      { name: 'Application Form', type: 'DOCX', size: '85.08 Kb' },
      { name: 'General Terms and Conditions', type: 'PDF', size: '196.37 Kb' },
    ]
  },
];

export default function TenderDetailPage({ params }: { params: { id: string } }) {
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
          </div>
        </div>
      </div>

      {/* Tender Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
            {tender.status}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {tender.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Reference: {tender.reference}
          </p>
          <p className="text-gray-700 mb-8">
            {tender.fullDescription}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tender Details</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Deadline for applications</p>
                  <p className="font-medium">{tender.deadline.split('-')[1]}/{tender.deadline.split('-')[2]}/{tender.deadline.split('-')[0]} at {tender.deadlineTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ceiling Fund</p>
                  <p className="font-medium">{tender.currency} {tender.ceilingFund} (VAT Excluded)</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit a Proposal</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Register to download the documentation and submit your proposal for this tender.
                </p>
                <Link
                  href={`/procurement/${tender.id}/submit`}
                  className="inline-block px-6 py-3 bg-[#0056a4] text-white font-medium rounded-md hover:bg-[#004483] transition-colors"
                >
                  Submit Proposal
                </Link>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Downloads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tender.documents.map((doc, index) => (
                <div key={index} className="flex items-start p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="w-6 h-6 text-[#0056a4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.type} ({doc.size})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Share</h2>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-[#0056a4]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-[#0056a4]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-[#0056a4]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
