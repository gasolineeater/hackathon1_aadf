# AADF Procurement Platform

This project is a comprehensive procurement platform for the Albanian-American Development Foundation (AADF), developed for the Junction Tirana Hackathon 2023.

## Features

The platform includes the following key features:

### Core Procurement Features
- **Tender Management**: Publish tenders, manage deadlines, and track the entire procurement process
- **Proposal Collection**: Receive and organize vendor proposals automatically, hidden until deadline
- **Evaluation**: Score proposals transparently with evaluation tools
- **Approval Tracking**: Track approvals and decisions in a centralized dashboard
- **Report Generation**: Automatically generate final reports by the tender commission
- **Document Management**: Version control and track changes for sensitive documents

### AI-Powered Features
- **Missing Information Detection**: AI automatically detects missing information in vendor proposals and flags them for review
- **Evaluation Score Suggestions**: AI analyzes proposals and suggests evaluation scores based on preset criteria
- **Vendor-Tender Matching**: AI matches vendors to tenders based on compatibility and expertise

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hackathon1_aadf.git
cd hackathon1_aadf
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to:
```
http://localhost:3001
```

## Admin Dashboard

The admin dashboard provides access to all the procurement platform features. To access it:

1. Log in to the application
2. Navigate to the admin dashboard at `/admin`
3. Click on the "Procurement Platform" button

### Key Admin Pages

- **Dashboard**: `/admin/procurement-dashboard` - Overview of all procurement activities
- **Tenders**: `/admin/procurement-dashboard/tenders` - Manage tenders
- **Proposals**: `/admin/procurement-dashboard/proposals` - View and manage proposals
- **Evaluation**: `/admin/procurement-dashboard/evaluation` - Evaluate proposals
- **Approvals**: `/admin/procurement-dashboard/approvals` - Track approval workflows
- **Reports**: `/admin/procurement-dashboard/reports` - Generate reports
- **Documents**: `/admin/procurement-dashboard/documents` - Manage procurement documents

### AI Features

- **Missing Information Detection**: `/admin/procurement-dashboard/ai/missing-info` - Detect missing information in proposals
- **Evaluation Suggestions**: `/admin/procurement-dashboard/ai/evaluation` - Get AI-suggested evaluation scores
- **Vendor-Tender Matching**: `/admin/procurement-dashboard/ai/matching` - Match vendors to tenders based on compatibility

## Demo for Judges

For the hackathon judges, we've created a special demo page that showcases the AI capabilities of the platform:

1. Log in to the application
2. Navigate to the admin dashboard at `/admin`
3. Click on the "Judges Demo" button

This demo highlights the AI-powered features that make our platform unique:
- AI-powered missing information detection
- AI-suggested evaluation scores
- AI vendor-tender matching

## Technologies Used

- **Frontend**: Next.js, React, TailwindCSS
- **State Management**: React Context API
- **UI Components**: Custom components with TailwindCSS
- **AI Integration**: Custom AI models for procurement analysis

## License

This project is licensed under the MIT License - see the LICENSE file for details.
