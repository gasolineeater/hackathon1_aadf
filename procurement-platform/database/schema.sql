-- Create tables for the procurement platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'evaluator', 'vendor', 'user')),
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
  cancelled_at TIMESTAMP WITH TIME ZONE,
  awarded_to UUID REFERENCES vendors(id),
  version INTEGER DEFAULT 1
);

-- Proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID REFERENCES tenders(id) NOT NULL,
  vendor_id UUID REFERENCES vendors(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  price DECIMAL NOT NULL,
  currency TEXT DEFAULT 'EUR',
  delivery_timeline TEXT,
  additional_info TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  withdrawn_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1,
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

-- Document versions table for version control
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_type TEXT NOT NULL,
  document_id UUID NOT NULL,
  version INTEGER NOT NULL,
  content JSONB NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  change_summary TEXT,
  UNIQUE(document_type, document_id, version)
);

-- Document validations table
CREATE TABLE document_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) NOT NULL,
  document_type TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  is_valid BOOLEAN NOT NULL,
  score INTEGER NOT NULL,
  issues JSONB,
  suggestions JSONB,
  missing_elements JSONB,
  compliance JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_id, content_hash)
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

-- Evaluations table (comprehensive evaluation)
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) NOT NULL,
  tender_id UUID REFERENCES tenders(id) NOT NULL,
  evaluator_id UUID REFERENCES users(id) NOT NULL,
  score INTEGER NOT NULL,
  comments TEXT,
  criteria_scores JSONB,
  strengths TEXT[],
  weaknesses TEXT[],
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(proposal_id, evaluator_id)
);

-- Evaluation scores (individual criteria scores)
CREATE TABLE evaluation_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID REFERENCES evaluations(id) NOT NULL,
  criteria_id TEXT NOT NULL,
  score DECIMAL NOT NULL,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(evaluation_id, criteria_id)
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

-- Proposal analyses table (AI-powered analysis)
CREATE TABLE proposal_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) NOT NULL,
  tender_id UUID REFERENCES tenders(id) NOT NULL,
  content_hash TEXT NOT NULL,
  overall_score INTEGER NOT NULL,
  compliance_score INTEGER NOT NULL,
  evaluation_score INTEGER NOT NULL,
  recommendation TEXT NOT NULL,
  key_findings JSONB,
  compliance JSONB,
  evaluation JSONB,
  insights JSONB,
  recommendation_details JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(proposal_id, content_hash)
);

-- Approvals table
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  resource_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  approvers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tender reports table
CREATE TABLE tender_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID REFERENCES tenders(id) NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  generated_by UUID REFERENCES users(id),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  options JSONB
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  user_id UUID REFERENCES users(id),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_document_validations_document_id ON document_validations(document_id);
CREATE INDEX idx_proposals_tender_id ON proposals(tender_id);
CREATE INDEX idx_proposals_vendor_id ON proposals(vendor_id);
CREATE INDEX idx_evaluations_proposal_id ON evaluations(proposal_id);
CREATE INDEX idx_evaluations_tender_id ON evaluations(tender_id);
CREATE INDEX idx_evaluations_evaluator_id ON evaluations(evaluator_id);
CREATE INDEX idx_evaluation_scores_evaluation_id ON evaluation_scores(evaluation_id);
CREATE INDEX idx_compatibility_scores_tender_id ON compatibility_scores(tender_id);
CREATE INDEX idx_compatibility_scores_vendor_id ON compatibility_scores(vendor_id);
CREATE INDEX idx_document_versions_document ON document_versions(document_type, document_id);
CREATE INDEX idx_proposal_analyses_proposal_id ON proposal_analyses(proposal_id);
CREATE INDEX idx_proposal_analyses_tender_id ON proposal_analyses(tender_id);
CREATE INDEX idx_approvals_resource ON approvals(resource_type, resource_id);
CREATE INDEX idx_tender_reports_tender_id ON tender_reports(tender_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Create views for common queries
CREATE OR REPLACE VIEW active_tenders AS
SELECT * FROM tenders WHERE status = 'published' AND deadline > NOW();

CREATE OR REPLACE VIEW closed_tenders AS
SELECT * FROM tenders WHERE status = 'closed' OR status = 'awarded';

CREATE OR REPLACE VIEW tender_proposal_counts AS
SELECT
  t.id AS tender_id,
  t.title AS tender_title,
  t.status AS tender_status,
  COUNT(p.id) AS proposal_count
FROM tenders t
LEFT JOIN proposals p ON t.id = p.tender_id AND p.status = 'submitted'
GROUP BY t.id, t.title, t.status;

CREATE OR REPLACE VIEW tender_evaluation_summary AS
SELECT
  t.id AS tender_id,
  t.title AS tender_title,
  t.status AS tender_status,
  COUNT(DISTINCT p.id) AS proposal_count,
  COUNT(DISTINCT e.id) AS evaluation_count,
  AVG(e.score) AS average_score
FROM tenders t
LEFT JOIN proposals p ON t.id = p.tender_id AND p.status = 'submitted'
LEFT JOIN evaluations e ON p.id = e.proposal_id
GROUP BY t.id, t.title, t.status;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION close_expired_tenders()
RETURNS INTEGER AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  UPDATE tenders
  SET
    status = 'closed',
    closed_at = NOW(),
    updated_at = NOW()
  WHERE
    status = 'published' AND
    deadline < NOW();

  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_proposal_average_score(proposal_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  avg_score DECIMAL;
BEGIN
  SELECT AVG(score) INTO avg_score
  FROM evaluations
  WHERE proposal_id = proposal_uuid;

  RETURN COALESCE(avg_score, 0);
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
-- (These would be expanded in a real implementation to secure the data properly)

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_committee ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
