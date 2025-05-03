-- Create tables for storing AI analysis results

-- Document validation results
CREATE TABLE IF NOT EXISTS document_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_type TEXT NOT NULL,
  document_id UUID,
  content_hash TEXT NOT NULL,
  is_valid BOOLEAN NOT NULL,
  score INTEGER NOT NULL,
  issues JSONB,
  suggestions JSONB,
  missing_elements JSONB,
  compliance JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(document_id, content_hash)
);

-- Tender evaluation results
CREATE TABLE IF NOT EXISTS tender_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
  content_hash TEXT NOT NULL,
  score INTEGER NOT NULL,
  quality JSONB NOT NULL,
  issues JSONB,
  recommendations JSONB,
  strengths JSONB,
  weaknesses JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(tender_id, content_hash)
);

-- Vendor matching results
CREATE TABLE IF NOT EXISTS tender_vendor_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  compatibility_score INTEGER NOT NULL,
  match_details JSONB NOT NULL,
  strengths JSONB,
  weaknesses JSONB,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tender_id, vendor_id)
);

-- Proposal analysis results
CREATE TABLE IF NOT EXISTS proposal_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
  content_hash TEXT NOT NULL,
  overall_score INTEGER NOT NULL,
  compliance_score INTEGER NOT NULL,
  evaluation_score INTEGER NOT NULL,
  recommendation TEXT NOT NULL,
  key_findings JSONB,
  compliance JSONB NOT NULL,
  evaluation JSONB NOT NULL,
  insights JSONB,
  recommendation_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(proposal_id, tender_id, content_hash)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_document_validations_document_id ON document_validations(document_id);
CREATE INDEX IF NOT EXISTS idx_tender_evaluations_tender_id ON tender_evaluations(tender_id);
CREATE INDEX IF NOT EXISTS idx_tender_vendor_matches_tender_id ON tender_vendor_matches(tender_id);
CREATE INDEX IF NOT EXISTS idx_tender_vendor_matches_vendor_id ON tender_vendor_matches(vendor_id);
CREATE INDEX IF NOT EXISTS idx_proposal_analyses_proposal_id ON proposal_analyses(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_analyses_tender_id ON proposal_analyses(tender_id);

-- Add RLS policies
ALTER TABLE document_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_vendor_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_analyses ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY admin_document_validations ON document_validations 
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
  
CREATE POLICY admin_tender_evaluations ON tender_evaluations 
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
  
CREATE POLICY admin_tender_vendor_matches ON tender_vendor_matches 
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
  
CREATE POLICY admin_proposal_analyses ON proposal_analyses 
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Evaluators can read all analyses
CREATE POLICY evaluator_read_document_validations ON document_validations 
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE role = 'evaluator'));
  
CREATE POLICY evaluator_read_tender_evaluations ON tender_evaluations 
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE role = 'evaluator'));
  
CREATE POLICY evaluator_read_tender_vendor_matches ON tender_vendor_matches 
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE role = 'evaluator'));
  
CREATE POLICY evaluator_read_proposal_analyses ON proposal_analyses 
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE role = 'evaluator'));

-- Vendors can only see their own proposal analyses
CREATE POLICY vendor_read_proposal_analyses ON proposal_analyses 
  FOR SELECT USING (
    auth.uid() IN (
      SELECT u.id FROM users u
      JOIN vendors v ON u.id = v.user_id
      JOIN proposals p ON v.id = p.vendor_id
      WHERE p.id = proposal_analyses.proposal_id
    )
  );

-- Function to generate content hash
CREATE OR REPLACE FUNCTION generate_content_hash(content TEXT) 
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(content, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
