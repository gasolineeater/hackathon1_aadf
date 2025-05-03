import Link from 'next/link';

export default function ProcurementPage() {
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

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Procurement</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            At AADF, recognizing the importance of responsibly and efficiently managing resources, we uphold transparency, fairness, and competitive excellence in all procurement activities. Dedicated to strengthening local markets through prioritized local sourcing, we also strive to foster knowledge transfer to local teams when collaborating with international experts, supporting professional growth and economic development. For any inquiries or further information, please contact us via email at tenders@aadf.org.
          </p>
        </div>
      </div>

      {/* Tenders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tenders.map((tender) => (
          <div key={tender.id} className="mb-8 border-b border-gray-200 pb-8">
            <div className="text-sm text-gray-500 mb-2">{tender.date.split('-')[2]} {getMonthName(tender.date.split('-')[1])} {tender.date.split('-')[0]}</div>
            <h2 className="text-2xl font-bold text-[#0056a4] mb-2">
              <Link href={`/procurement/${tender.id}`} className="hover:underline">
                {tender.title}
              </Link>
            </h2>
            <p className="text-gray-700 mb-4">{tender.description}</p>
            <Link 
              href={`/procurement/${tender.id}`} 
              className="text-[#0056a4] font-medium hover:underline"
            >
              More details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function getMonthName(month: string): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[parseInt(month) - 1];
}
