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
- **Submit Proposal**: [http://localhost:3000/submit-proposal](http://localhost:3000/submit-proposal)
- **Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Dashboard** (after login): [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

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

- `/src/app`: Main application code
  - `/components`: Reusable UI components
  - `/lib`: Utility functions and shared code
  - `/api`: API routes
  - `/models`: Data models and types
  - `/pages`: Application pages and routes

## Procurement Workflow

The platform supports the following workflow:
1. Call for Tenders
2. Receiving Offers
3. Evaluation of Offers
4. Decision-Making
5. Winner Announcement
6. Documenting processes and decisions

## Application Screenshots

### Homepage
The homepage provides an overview of the platform's features and benefits.

### Tenders Page
The tenders page displays all active procurement opportunities with filtering options.

### Proposal Submission
Vendors can submit detailed proposals through a comprehensive form.

### Dashboard
Authenticated users can manage tenders, evaluate proposals, and generate reports.

## Hackathon Challenge

This project was developed as part of the Junction Hackathon Tirana challenge by the Albanian-American Development Foundation (AADF).

## License

MIT
