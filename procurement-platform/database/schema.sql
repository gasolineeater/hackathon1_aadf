-- Create tables for the procurement platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'evaluator', 'vendor')),
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  address TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  industry TEXT[],
  expertise TEXT[],
  years_in_business INTEGER,
  company_size TEXT,
  previous_projects JSONB,
  certifications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenders table
CREATE TABLE tenders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'closed', 'awarded', 'cancelled')),
  budget_range JSONB,
  location TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  requirements JSONB,
  evaluation_criteria JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  awarded_at TIMESTAMP WITH TIME ZONE,
  awarded_to UUID REFERENCES vendors(id)
);

-- Proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID REFERENCES tenders(id) NOT NULL,
  vendor_id UUID REFERENCES vendors(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL,
  currency TEXT DEFAULT 'EUR',
  timeline JSONB,
  approach TEXT,
  team JSONB,
  status TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(tender_id, vendor_id)
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  file_hash TEXT,
  document_type TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('tender', 'proposal', 'vendor')),
  entity_id UUID NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document validations table
CREATE TABLE document_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) NOT NULL,
  validation_id TEXT NOT NULL,
  is_valid BOOLEAN NOT NULL,
  validation_result JSONB NOT NULL,
  validated_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluation committee members
CREATE TABLE evaluation_committee (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID REFERENCES tenders(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('chair', 'member', 'secretary')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tender_id, user_id)
);

-- Evaluation scores
CREATE TABLE evaluation_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) NOT NULL,
  evaluator_id UUID REFERENCES users(id) NOT NULL,
  criteria_id TEXT NOT NULL,
  score DECIMAL NOT NULL,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(proposal_id, evaluator_id, criteria_id)
);

-- AI Compatibility scores
CREATE TABLE compatibility_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID REFERENCES tenders(id) NOT NULL,
  vendor_id UUID REFERENCES vendors(id) NOT NULL,
  score DECIMAL NOT NULL,
  factors JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tender_id, vendor_id)
);

-- Create indexes for better performance
CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_document_validations_document_id ON document_validations(document_id);
CREATE INDEX idx_proposals_tender_id ON proposals(tender_id);
CREATE INDEX idx_proposals_vendor_id ON proposals(vendor_id);
CREATE INDEX idx_evaluation_scores_proposal_id ON evaluation_scores(proposal_id);
CREATE INDEX idx_compatibility_scores_tender_id ON compatibility_scores(tender_id);
CREATE INDEX idx_compatibility_scores_vendor_id ON compatibility_scores(vendor_id);

-- Create RLS policies
-- (These would be expanded in a real implementation to secure the data properly)

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_committee ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_scores ENABLE ROW LEVEL SECURITY;
