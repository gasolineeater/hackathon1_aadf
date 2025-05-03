# AADF Procurement Platform API

This document outlines the API endpoints available in the AADF Procurement Platform.

## Base URL

All API endpoints are relative to: `/api`

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /auth/signin | Sign in with email and password |
| POST   | /auth/signout | Sign out the current user |
| POST   | /auth/register | Register a new user |
| GET    | /auth/session | Get the current session |
| POST   | /auth/reset-password | Request password reset |

## Tenders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /tenders | Get all tenders |
| GET    | /tenders/:id | Get a specific tender |
| POST   | /tenders | Create a new tender |
| PUT    | /tenders/:id | Update a tender |
| DELETE | /tenders/:id | Delete a tender |
| GET    | /tenders/:id/proposals | Get all proposals for a tender |
| GET    | /tenders/:id/documents | Get all documents for a tender |
| POST   | /tenders/:id/publish | Publish a tender |
| POST   | /tenders/:id/close | Close a tender |
| POST   | /tenders/:id/award | Award a tender |
| POST   | /tenders/:id/cancel | Cancel a tender |

## Proposals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /proposals | Get all proposals |
| GET    | /proposals/:id | Get a specific proposal |
| POST   | /proposals | Create a new proposal |
| PUT    | /proposals/:id | Update a proposal |
| DELETE | /proposals/:id | Delete a proposal |
| GET    | /proposals/:id/documents | Get all documents for a proposal |
| POST   | /proposals/:id/submit | Submit a proposal |
| POST   | /proposals/:id/withdraw | Withdraw a proposal |
| GET    | /proposals/:id/evaluations | Get evaluations for a proposal |

## Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /documents | Get all documents |
| GET    | /documents/:id | Get a specific document |
| POST   | /documents | Upload a new document |
| DELETE | /documents/:id | Delete a document |
| GET    | /documents/:id/versions | Get all versions of a document |
| POST   | /documents/:id/validate | Validate a document |

## AI Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /ai/validate-document | Validate a document using AI |
| POST   | /ai/analyze-proposal | Analyze a proposal using AI |
| GET    | /ai/compatibility | Get compatibility scores between vendors and tenders |
| POST   | /ai/compatibility/calculate | Calculate compatibility for a specific tender |
| GET    | /ai/suggestions | Get AI suggestions for evaluation |

## Evaluations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /evaluations | Get all evaluations |
| GET    | /evaluations/:id | Get a specific evaluation |
| POST   | /evaluations | Create a new evaluation |
| PUT    | /evaluations/:id | Update an evaluation |
| DELETE | /evaluations/:id | Delete an evaluation |
| POST   | /evaluations/:id/submit | Submit an evaluation |

## Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /reports | Get all reports |
| GET    | /reports/:id | Get a specific report |
| POST   | /reports/generate | Generate a new report |
| GET    | /reports/templates | Get available report templates |

## Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /users | Get all users |
| GET    | /users/:id | Get a specific user |
| PUT    | /users/:id | Update a user |
| DELETE | /users/:id | Delete a user |
| GET    | /users/me | Get the current user |
| PUT    | /users/me | Update the current user |

## Vendors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /vendors | Get all vendors |
| GET    | /vendors/:id | Get a specific vendor |
| POST   | /vendors | Create a new vendor |
| PUT    | /vendors/:id | Update a vendor |
| DELETE | /vendors/:id | Delete a vendor |
| GET    | /vendors/:id/proposals | Get all proposals from a vendor |

## Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /notifications | Get all notifications for the current user |
| POST   | /notifications | Create a new notification |
| PUT    | /notifications/:id | Mark a notification as read |
| DELETE | /notifications/:id | Delete a notification |
| PUT    | /notifications/mark-all-read | Mark all notifications as read |

## Approvals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /approvals | Get all approvals |
| GET    | /approvals/:id | Get a specific approval |
| POST   | /approvals | Create a new approval request |
| PUT    | /approvals/:id/approve | Approve a request |
| PUT    | /approvals/:id/reject | Reject a request |

## Audit Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /audit-logs | Get audit logs |
| GET    | /audit-logs/:id | Get a specific audit log |

## System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /system/status | Get system status |
| GET    | /system/statistics | Get system statistics |
