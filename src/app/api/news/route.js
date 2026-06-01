import { NextResponse } from 'next/server';
import { analyzeArticle } from '@/lib/fakeNewsDetector';
import { MOCK_NEWS, NEWS_CATEGORIES } from '@/lib/newsChannels';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const CURRENTS_API_KEY = process.env.CURRENTS_API_KEY;

const NEWS_API_BASE = 'https://newsapi.org/v2';
const GNEWS_API_BASE = 'https://gnews.io/api/v4';
const CURRENTS_API_BASE = 'https://api.currentsapi.services/v1';

/**
 * Fetch from NewsAPI.org
 */
async function fetchFromNewsAPI(category) {
  if (!NEWS_API_KEY || NEWS_API_KEY === 'your_api_key_here') return [];

  try {
    const response = await fetch(
      `${NEWS_API_BASE}/top-headlines?category=${category}&language=en&pageSize=20&apiKey=${NEWS_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return (data.articles || []).map(article => ({
      title: article.title || '',
      description: article.description || '',
      content: article.content || '',
      source: article.source?.name || 'Unknown',
      author: article.author || '',
      url: article.url || '',
      urlToImage: article.urlToImage || null,
      publishedAt: article.publishedAt || new Date().toISOString(),
      category,
      apiSource: 'NewsAPI'
    }));
  } catch (err) {
    console.error('NewsAPI error:', err.message);
    return [];
  }
}

/**
 * Fetch from GNews.io
 */
async function fetchFromGNews(category) {
  if (!GNEWS_API_KEY || GNEWS_API_KEY === 'your_api_key_here') return [];

  const categoryMap = {
    general: 'general', technology: 'technology', science: 'science',
    health: 'health', business: 'business', entertainment: 'entertainment',
    sports: 'sports'
  };

  try {
    const cat = categoryMap[category] || 'general';
    const response = await fetch(
      `${GNEWS_API_BASE}/top-headlines?category=${cat}&lang=en&max=10&apikey=${GNEWS_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return (data.articles || []).map(article => ({
      title: article.title || '',
      description: article.description || '',
      content: article.content || '',
      source: article.source?.name || 'Unknown',
      author: '',
      url: article.url || '',
      urlToImage: article.image || null,
      publishedAt: article.publishedAt || new Date().toISOString(),
      category,
      apiSource: 'GNews'
    }));
  } catch (err) {
    console.error('GNews error:', err.message);
    return [];
  }
}

/**
 * Fetch from CurrentsAPI
 */
async function fetchFromCurrents(category) {
  if (!CURRENTS_API_KEY || CURRENTS_API_KEY === 'your_api_key_here') return [];

  const categoryMap = {
    general: 'general', technology: 'technology', science: 'science',
    health: 'health', business: 'business', entertainment: 'entertainment',
    sports: 'sports'
  };

  try {
    const cat = categoryMap[category] || 'general';
    const response = await fetch(
      `${CURRENTS_API_BASE}/latest-news?category=${cat}&language=en&apiKey=${CURRENTS_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return (data.news || []).map(article => ({
      title: article.title || '',
      description: article.description || '',
      content: article.description || '',
      source: article.author || 'Unknown',
      author: article.author || '',
      url: article.url || '',
      urlToImage: article.image !== 'None' ? article.image : null,
      publishedAt: article.published || new Date().toISOString(),
      category,
      apiSource: 'CurrentsAPI'
    }));
  } catch (err) {
    console.error('CurrentsAPI error:', err.message);
    return [];
  }
}

/**
 * Cross-reference articles across sources — find similar headlines
 */
function crossReferenceArticles(allArticles) {
  // Extract keywords from each title for matching
  const getKeywords = (title) => {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'its', 'how', 'what', 'this', 'that', 'from', 'not']);
    return title.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
  };

  return allArticles.map(article => {
    const keywords = getKeywords(article.title);
    const crossRefSources = [];

    for (const other of allArticles) {
      if (other === article) continue;
      if (other.source === article.source && other.apiSource === article.apiSource) continue;

      const otherKeywords = getKeywords(other.title);
      const commonWords = keywords.filter(w => otherKeywords.includes(w));
      const similarity = commonWords.length / Math.max(keywords.length, 1);

      if (similarity >= 0.4) {
        const label = other.apiSource !== article.apiSource
          ? `${other.source} (${other.apiSource})`
          : other.source;
        if (!crossRefSources.includes(label)) {
          crossRefSources.push(label);
        }
      }
    }

    return { ...article, crossRefSources };
  });
}

/**
 * GET /api/news
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'general';

    // Fetch from all configured APIs in parallel
    const [newsApiArticles, gnewsArticles, currentsArticles] = await Promise.all([
      fetchFromNewsAPI(category),
      fetchFromGNews(category),
      fetchFromCurrents(category)
    ]);

    let articles = [...newsApiArticles, ...gnewsArticles, ...currentsArticles];

    // Track which APIs returned data
    const activeSources = [];
    if (newsApiArticles.length > 0) activeSources.push('NewsAPI');
    if (gnewsArticles.length > 0) activeSources.push('GNews');
    if (currentsArticles.length > 0) activeSources.push('CurrentsAPI');

    const usingMockData = articles.length === 0;

    // Fallback to mock data if no articles fetched
    if (usingMockData) {
      articles = category === 'general'
        ? MOCK_NEWS
        : MOCK_NEWS.filter(a => a.category === category);
      if (articles.length === 0) articles = MOCK_NEWS;
      articles = articles.map(a => ({ ...a, apiSource: 'Mock' }));
    }

    // Filter out removed / empty articles
    articles = articles.filter(a =>
      a.title && !a.title.includes('[Removed]') && a.title.trim().length > 0
    );

    // Deduplicate by similar titles
    articles = deduplicateArticles(articles);

    // Cross-reference across sources
    articles = crossReferenceArticles(articles);

    // Analyze each article
    const analyzedArticles = articles.map(article => {
      const analysis = analyzeArticle(article);

      // Boost credibility if cross-referenced across multiple sources
      if (article.crossRefSources && article.crossRefSources.length > 0) {
        const crossRefBonus = Math.min(10, article.crossRefSources.length * 4);
        analysis.credibilityScore = Math.min(100, analysis.credibilityScore + crossRefBonus);

        // Recalculate classification after boost
        if (analysis.credibilityScore >= 72) analysis.classification = 'REAL';
        else if (analysis.credibilityScore >= 45) analysis.classification = 'SUSPICIOUS';

        if (article.crossRefSources.length >= 2) {
          analysis.flags.push({
            type: 'info',
            message: `Cross-verified by ${article.crossRefSources.length} independent sources`
          });
        }
      }

      return { ...article, analysis };
    });

    const stats = computeStats(analyzedArticles);

    return NextResponse.json({
      success: true,
      articles: analyzedArticles,
      stats,
      categories: NEWS_CATEGORIES,
      usingMockData,
      activeSources,
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch and analyze news' },
      { status: 500 }
    );
  }
}

/**
 * Remove near-duplicate articles (same story from same source)
 */
function deduplicateArticles(articles) {
  const seen = new Map();
  return articles.filter(article => {
    const key = article.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 60);
    if (seen.has(key)) return false;
    seen.set(key, true);
    return true;
  });
}

function computeStats(articles) {
  const total = articles.length;
  const real = articles.filter(a => a.analysis.classification === 'REAL').length;
  const fake = articles.filter(a => a.analysis.classification === 'FAKE').length;
  const suspicious = articles.filter(a => a.analysis.classification === 'SUSPICIOUS').length;

  const avgCredibility = total > 0
    ? Math.round(articles.reduce((sum, a) => sum + a.analysis.credibilityScore, 0) / total)
    : 0;

  // Category breakdown
  const categoryBreakdown = {};
  articles.forEach(article => {
    const cat = article.category || 'general';
    if (!categoryBreakdown[cat]) {
      categoryBreakdown[cat] = { total: 0, real: 0, fake: 0, suspicious: 0 };
    }
    categoryBreakdown[cat].total++;
    categoryBreakdown[cat][article.analysis.classification.toLowerCase()]++;
  });

  // Source breakdown
  const sourceBreakdown = {};
  articles.forEach(article => {
    const src = article.source || 'Unknown';
    if (!sourceBreakdown[src]) {
      sourceBreakdown[src] = { total: 0, real: 0, fake: 0, suspicious: 0, avgScore: 0, scores: [] };
    }
    sourceBreakdown[src].total++;
    sourceBreakdown[src][article.analysis.classification.toLowerCase()]++;
    sourceBreakdown[src].scores.push(article.analysis.credibilityScore);
  });

  Object.keys(sourceBreakdown).forEach(src => {
    const scores = sourceBreakdown[src].scores;
    sourceBreakdown[src].avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    delete sourceBreakdown[src].scores;
  });

  // Score distribution
  const scoreDistribution = [
    { range: '0-20', count: articles.filter(a => a.analysis.credibilityScore <= 20).length, label: 'Very Low' },
    { range: '21-40', count: articles.filter(a => a.analysis.credibilityScore > 20 && a.analysis.credibilityScore <= 40).length, label: 'Low' },
    { range: '41-60', count: articles.filter(a => a.analysis.credibilityScore > 40 && a.analysis.credibilityScore <= 60).length, label: 'Medium' },
    { range: '61-80', count: articles.filter(a => a.analysis.credibilityScore > 60 && a.analysis.credibilityScore <= 80).length, label: 'High' },
    { range: '81-100', count: articles.filter(a => a.analysis.credibilityScore > 80).length, label: 'Very High' },
  ];

  // Sentiment distribution (new)
  const sentimentDist = { Positive: 0, Neutral: 0, Negative: 0 };
  articles.forEach(a => {
    const tone = a.analysis.breakdown?.sentiment?.tone || 'Neutral';
    if (tone.includes('Positive')) sentimentDist.Positive++;
    else if (tone.includes('Negative')) sentimentDist.Negative++;
    else sentimentDist.Neutral++;
  });

  return {
    total, real, fake, suspicious, avgCredibility,
    realPercentage: total > 0 ? Math.round((real / total) * 100) : 0,
    fakePercentage: total > 0 ? Math.round((fake / total) * 100) : 0,
    categoryBreakdown, sourceBreakdown, scoreDistribution, sentimentDist
  };
}
