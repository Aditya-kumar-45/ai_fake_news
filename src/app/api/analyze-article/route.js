import { NextResponse } from 'next/server';
import { analyzeArticle } from '@/lib/fakeNewsDetector';

export async function POST(request) {
  try {
    const article = await request.json();

    if (!article || !article.title) {
      return NextResponse.json(
        { success: false, error: 'Valid article object is required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeArticle(article);

    // Boost credibility if cross-referenced across multiple sources
    if (article.crossRefSources && article.crossRefSources.length > 0) {
      const crossRefBonus = Math.min(10, article.crossRefSources.length * 4);
      analysis.credibilityScore = Math.min(100, analysis.credibilityScore + crossRefBonus);

      // Recalculate classification after boost
      if (analysis.credibilityScore >= 72) analysis.classification = 'REAL';
      else if (analysis.credibilityScore >= 45) analysis.classification = 'SUSPICIOUS';
      else analysis.classification = 'FAKE';

      if (article.crossRefSources.length >= 2) {
        analysis.flags = analysis.flags || [];
        analysis.flags.push({
          type: 'info',
          message: `Cross-verified by ${article.crossRefSources.length} independent sources`
        });
      }
    }

    analysis.isAdvanced = true;

    return NextResponse.json({
      success: true,
      analysis,
      analyzedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analyze Article API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze article' },
      { status: 500 }
    );
  }
}
