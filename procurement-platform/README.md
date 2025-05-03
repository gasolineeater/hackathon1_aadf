# AADF Smart Procurement Platform

A digital platform for streamlining the Albanian-American Development Foundation's (AADF) procurement process, developed for the Junction Hackathon Tirana.

## Project Overview

The AADF Smart Procurement Platform is designed to automate and digitize the end-to-end procurement process while ensuring transparency, compliance, and efficiency. The platform replaces the current manual, paper-heavy system with a modern, digital solution.

### Key Features

- **Tender Management**: Publish tenders and manage deadlines
- **Secure Proposal Submission**: Receive and organize vendor offers automatically
- **Digital Information Collection**: Collect required information digitally for AI analysis
- **Transparent Evaluation**: Score proposals with customizable criteria
- **Centralized Dashboard**: Track approvals and decisions
- **Automated Reporting**: Generate final reports automatically
- **Version Control**: Track changes for sensitive documents
- **Security & Compliance**: Ensure auditability and data protection

### Bonus Feature
- AI-powered analysis to detect missing information in bids and suggest evaluation scores

## Technology Stack

- **Frontend**: Next.js with React and TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/hackathon1_aadf.git
cd hackathon1_aadf/procurement-platform
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the Application

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Available Pages

- **Home**: [http://localhost:3000](http://localhost:3000)
- **Tenders**: [http://localhost:3000/tenders](http://localhost:3000/tenders)
- **Submit Proposal**: [http://localhost:3000/tenders/[id]/submit-proposal](http://localhost:3000/tenders/[id]/submit-proposal)
- **Login**: [http://localhost:3000/auth/signin](http://localhost:3000/auth/signin)
- **Dashboard** (after login): [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Document Validation**: [http://localhost:3000/admin/document-validation](http://localhost:3000/admin/document-validation)
- **AI Compatibility**: [http://localhost:3000/admin/compatibility](http://localhost:3000/admin/compatibility)

### Admin Access

For the hackathon presentation, I've added:

- A dedicated admin portal at `/admin`
- Document validation at `/admin/document-validation`
- AI compatibility analysis at `/admin/compatibility`
- A helper widget for judges to easily access admin features

You can access the admin features using:

- **Email**: admin@aadf.org
- **Password**: admin123

The admin portal provides access to all administrative functions, including tender management, proposal evaluation, document validation, and AI-powered analysis. The helper widget appears in the bottom-right corner of the screen in development mode to provide quick access to these features.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

Then, you can start the production server:

```bash
npm start
# or
yarn start
```

## Project Structure

- `/src/app`: Main application code (Next.js App Router)
  - `/components`: Reusable UI components
  - `/admin`: Admin portal pages
  - `/auth`: Authentication pages
  - `/dashboard`: Dashboard pages
  - `/tenders`: Tender management pages
  - `/api`: API routes
- `/src/contexts`: React context providers
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and shared code
- `/src/types`: TypeScript type definitions
- `/database`: Database schema and migrations

## Procurement Workflow

The platform supports the following workflow:
1. Call for Tenders
2. Receiving Offers
3. Evaluation of Offers
4. Decision-Making
5. Winner Announcement
6. Documenting processes and decisions

## Key Features in Detail

### Tender Management
- **Create and Publish Tenders**: AADF staff can create, edit, and publish tenders with detailed requirements
- **Deadline Management**: Set and manage submission deadlines with automatic status updates
- **Document Attachments**: Attach and manage tender-related documents with version control

### Proposal Management
- **Secure Submission**: Vendors can submit proposals securely through the platform
- **Automatic Organization**: Proposals are automatically organized and kept hidden until the deadline
- **Digital Information Collection**: Structured forms ensure all required information is collected

### Evaluation System
- **Transparent Scoring**: Evaluators can score proposals based on predefined criteria
- **Collaborative Evaluation**: Multiple evaluators can provide scores and comments
- **AI-Assisted Evaluation**: AI suggests evaluation scores based on preset criteria

### AI-Powered Features
- **Document Validation**: AI detects missing information in documents
- **Vendor-Tender Compatibility**: AI matches vendors to tenders based on compatibility
- **Proposal Analysis**: AI analyzes proposals for completeness and quality

### Centralized Dashboard
- **Approval Tracking**: Track approvals and decisions in a centralized dashboard
- **Status Monitoring**: Monitor the status of all tenders and proposals
- **Activity Tracking**: Track all activities related to tenders and proposals

### Reporting and Documentation
- **Automated Report Generation**: Generate final reports automatically
- **Version Control**: Track changes for sensitive documents
- **Audit Trail**: Maintain a complete audit trail of all actions

### Security and Compliance
- **Role-Based Access Control**: Different user roles have different access levels
- **Data Protection**: Secure storage and transmission of sensitive information
- **Compliance Checks**: Ensure compliance with procurement regulations

## Hackathon Challenge

This project was developed as part of the Junction Hackathon Tirana challenge by the Albanian-American Development Foundation (AADF).

## License

MIT
