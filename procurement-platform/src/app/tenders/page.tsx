import Link from 'next/link';

// Mock data for tenders
const tenders = [
  {
    id: 1,
    title: 'IT Equipment Procurement',
    description: 'Supply of laptops, desktops, and peripherals for AADF offices',
    deadline: '2023-06-15',
    status: 'Open',
  },
  {
    id: 2,
    title: 'Office Renovation Services',
    description: 'Renovation services for AADF headquarters in Tirana',
    deadline: '2023-06-20',
    status: 'Open',
  },
  {
    id: 3,
    title: 'Marketing and PR Services',
    description: 'Marketing and public relations services for AADF programs',
    deadline: '2023-06-10',
    status: 'Open',
  },
  {
    id: 4,
    title: 'Training and Development Program',
    description: 'Training services for staff development',
    deadline: '2023-05-30',
    status: 'Closed',
  },
];

export default function TendersPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Active Tenders</h1>
          <p className="mt-2 text-gray-600">Browse and apply for current procurement opportunities</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option>All</option>
                <option>Open</option>
                <option>Closed</option>
              </select>
            </div>
            <div className="w-full md:w-auto">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option>All Categories</option>
                <option>IT Services</option>
                <option>Construction</option>
                <option>Consulting</option>
                <option>Supplies</option>
              </select>
            </div>
            <div className="w-full md:w-auto md:ml-auto self-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tenders List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {tenders.map((tender) => (
              <li key={tender.id}>
                <div className="px-6 py-4 flex items-center">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-blue-600">{tender.title}</h3>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tender.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tender.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{tender.description}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="font-medium">Deadline:</span> {tender.deadline}
                    </p>
                  </div>
                  <div className="ml-4">
                    <Link
                      href={`/tenders/${tender.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </a>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
                <span className="font-medium">4</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
