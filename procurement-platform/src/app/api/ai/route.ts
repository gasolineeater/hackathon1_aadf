import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Base AI API route handler
 * This serves as a health check and information endpoint for the AI API
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'online',
    version: '1.0.0',
    endpoints: [
      {
        path: '/api/ai/validate-document',
        description: 'Validates procurement documents for compliance and completeness',
        methods: ['POST']
      },
      {
        path: '/api/ai/evaluate-tender',
        description: 'Evaluates a tender against requirements and best practices',
        methods: ['POST']
      },
      {
        path: '/api/ai/match-vendors',
        description: 'Finds the best vendor matches for a specific tender',
        methods: ['POST']
      },
      {
        path: '/api/ai/analyze-proposal',
        description: 'Analyzes a vendor proposal against tender requirements',
        methods: ['POST']
      }
    ]
  });
}
