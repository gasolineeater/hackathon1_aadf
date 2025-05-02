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

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

## Hackathon Challenge

This project was developed as part of the Junction Hackathon Tirana challenge by the Albanian-American Development Foundation (AADF).
