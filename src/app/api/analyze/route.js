import { NextResponse } from 'next/server';
import { analyzeText } from '@/lib/fakeNewsDetector';

/**
 * POST /api/analyze
 * Analyzes custom text input for fake news indicators
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { text, title } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Text content is required' },
        { status: 400 }
      );
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Text must be at least 10 characters long' },
        { status: 400 }
      );
    }

    const analysis = analyzeText(text.trim(), title?.trim() || '');

    return NextResponse.json({
      success: true,
      analysis,
      analyzedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analyze API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze text' },
      { status: 500 }
    );
  }
}
