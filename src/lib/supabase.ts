import { createClient } from '@supabase/supabase-js';
import { createMockSupabaseClient } from './mockApi';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdGJyZWZlcmVuY2UiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2NTI3OCwiZXhwIjoyMDE0MzQxMjc4fQ.mock_key_for_demo';

// For demo purposes, use mock API instead of real Supabase
const USE_MOCK_API = true;

// Create the appropriate client based on the environment
export const supabase = USE_MOCK_API
  ? createMockSupabaseClient() as any
  : createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations

// Tenders
export async function getTenders() {
  const { data, error } = await supabase
    .from('tenders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tenders:', error);
    return [];
  }

  return data || [];
}

export async function getTenderById(id: string) {
  const { data, error } = await supabase
    .from('tenders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching tender with id ${id}:`, error);
    return null;
  }

  return data;
}

export async function createTender(tender: any) {
  const { data, error } = await supabase
    .from('tenders')
    .insert([tender])
    .select();

  if (error) {
    console.error('Error creating tender:', error);
    return null;
  }

  return data?.[0] || null;
}

export async function updateTender(id: string, updates: any) {
  const { data, error } = await supabase
    .from('tenders')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating tender with id ${id}:`, error);
    return null;
  }

  return data?.[0] || null;
}

// Proposals
export async function getProposals(tenderId?: string) {
  let query = supabase
    .from('proposals')
    .select('*, vendor:vendors(*)');

  if (tenderId) {
    query = query.eq('tender_id', tenderId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching proposals:', error);
    return [];
  }

  return data || [];
}

export async function getProposalById(id: string) {
  const { data, error } = await supabase
    .from('proposals')
    .select('*, vendor:vendors(*), tender:tenders(*), documents:documents(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching proposal with id ${id}:`, error);
    return null;
  }

  return data;
}

export async function createProposal(proposal: any) {
  const { data, error } = await supabase
    .from('proposals')
    .insert([proposal])
    .select();

  if (error) {
    console.error('Error creating proposal:', error);
    return null;
  }

  return data?.[0] || null;
}

// Vendors
export async function getVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }

  return data || [];
}

export async function getVendorById(id: string) {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching vendor with id ${id}:`, error);
    return null;
  }

  return data;
}

// Documents
export async function getDocuments(filter?: { entity_type?: string; entity_id?: string }) {
  let query = supabase
    .from('documents')
    .select('*, validation_results:document_validations(*)');

  if (filter?.entity_type) {
    query = query.eq('entity_type', filter.entity_type);
  }

  if (filter?.entity_id) {
    query = query.eq('entity_id', filter.entity_id);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }

  return data || [];
}

export async function getDocumentById(id: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*, validation_results:document_validations(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching document with id ${id}:`, error);
    return null;
  }

  return data;
}

export async function createDocument(document: any) {
  const { data, error } = await supabase
    .from('documents')
    .insert([document])
    .select();

  if (error) {
    console.error('Error creating document:', error);
    return null;
  }

  return data?.[0] || null;
}

// Document Validations
export async function getDocumentValidations(documentId?: string) {
  let query = supabase
    .from('document_validations')
    .select('*');

  if (documentId) {
    query = query.eq('document_id', documentId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching document validations:', error);
    return [];
  }

  return data || [];
}

export async function createDocumentValidation(validation: any) {
  const { data, error } = await supabase
    .from('document_validations')
    .insert([validation])
    .select();

  if (error) {
    console.error('Error creating document validation:', error);
    return null;
  }

  return data?.[0] || null;
}

// AI Compatibility Scores
export async function getCompatibilityScores(tenderId?: string, vendorId?: string) {
  let query = supabase
    .from('compatibility_scores')
    .select('*, tender:tenders(*), vendor:vendors(*)');

  if (tenderId) {
    query = query.eq('tender_id', tenderId);
  }

  if (vendorId) {
    query = query.eq('vendor_id', vendorId);
  }

  const { data, error } = await query.order('score', { ascending: false });

  if (error) {
    console.error('Error fetching compatibility scores:', error);
    return [];
  }

  return data || [];
}

export async function createOrUpdateCompatibilityScore(score: any) {
  // Check if a score already exists for this tender-vendor pair
  const { data: existingScore } = await supabase
    .from('compatibility_scores')
    .select('id')
    .eq('tender_id', score.tender_id)
    .eq('vendor_id', score.vendor_id)
    .single();

  if (existingScore) {
    // Update existing score
    const { data, error } = await supabase
      .from('compatibility_scores')
      .update({
        score: score.score,
        factors: score.factors,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingScore.id)
      .select();

    if (error) {
      console.error('Error updating compatibility score:', error);
      return null;
    }

    return data?.[0] || null;
  } else {
    // Create new score
    const { data, error } = await supabase
      .from('compatibility_scores')
      .insert([{
        ...score,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Error creating compatibility score:', error);
      return null;
    }

    return data?.[0] || null;
  }
}
