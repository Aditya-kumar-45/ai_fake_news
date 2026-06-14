import { NextResponse } from 'next/server';
import { computeStats } from '@/lib/stats';
import { analyzeArticleRuleBased } from '@/lib/fakeNewsDetector';
import { MOCK_NEWS, NEWS_CATEGORIES } from '@/lib/newsChannels';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const CURRENTS_API_KEY = process.env.CURRENTS_API_KEY;
const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;

const NEWS_API_BASE = 'https://newsapi.org/v2';
const GNEWS_API_BASE = 'https://gnews.io/api/v4';
const CURRENTS_API_BASE = 'https://api.currentsapi.services/v1';
const NEWSDATA_API_BASE = 'https://newsdata.io/api/1';

/**
 * Fetch from NewsAPI.org
 */
async function fetchFromNewsAPI(category, country, query) {
  if (!NEWS_API_KEY || NEWS_API_KEY === 'your_api_key_here') return [];

  try {
    let url = '';
    if (query) {
      // Use /everything for specific city/area queries to ensure we get results
      url = `${NEWS_API_BASE}/everything?language=en&pageSize=20&apiKey=${NEWS_API_KEY}`;
      url += `&q=${encodeURIComponent(query + (country === 'in' ? ' India' : ''))}`;
    } else {
      url = `${NEWS_API_BASE}/top-headlines?language=en&pageSize=20&apiKey=${NEWS_API_KEY}`;
      if (country) url += `&country=${country}`;
      if (category && category !== 'general') url += `&category=${category}`;
      else if (!country) url += `&category=general`;
    }

    const response = await fetch(url, { next: { revalidate: 300 } });
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
async function fetchFromGNews(category, country, query) {
  if (!GNEWS_API_KEY || GNEWS_API_KEY === 'your_api_key_here') return [];

  const categoryMap = {
    general: 'general', technology: 'technology', science: 'science',
    health: 'health', business: 'business', entertainment: 'entertainment',
    sports: 'sports'
  };

  try {
    const cat = categoryMap[category] || 'general';
    let url = '';
    if (query) {
      // Use /search for specific queries
      url = `${GNEWS_API_BASE}/search?lang=en&max=10&apikey=${GNEWS_API_KEY}`;
      if (country) url += `&country=${country}`;
      url += `&q=${encodeURIComponent(query)}`;
    } else {
      url = `${GNEWS_API_BASE}/top-headlines?category=${cat}&lang=en&max=10&apikey=${GNEWS_API_KEY}`;
      if (country) url += `&country=${country}`;
    }

    const response = await fetch(url, { next: { revalidate: 300 } });
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
async function fetchFromCurrents(category, country, query) {
  if (!CURRENTS_API_KEY || CURRENTS_API_KEY === 'your_api_key_here') return [];

  const categoryMap = {
    general: 'general', technology: 'technology', science: 'science',
    health: 'health', business: 'business', entertainment: 'entertainment',
    sports: 'sports'
  };

  try {
    const cat = categoryMap[category] || 'general';
    let url = '';
    
    if (query) {
      url = `${CURRENTS_API_BASE}/search?language=en&apiKey=${CURRENTS_API_KEY}`;
      if (country) url += `&country=${country}`;
      url += `&keywords=${encodeURIComponent(query)}`;
    } else {
      url = `${CURRENTS_API_BASE}/latest-news?category=${cat}&language=en&apiKey=${CURRENTS_API_KEY}`;
      if (country) url += `&country=${country}`;
    }

    const response = await fetch(url, { next: { revalidate: 300 } });
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
 * Fetch from NewsData.io (Excellent for Indian / Regional News)
 */
async function fetchFromNewsData(category, country, query) {
  if (!NEWSDATA_API_KEY || NEWSDATA_API_KEY === 'your_api_key_here') return [];

  const categoryMap = {
    general: 'top', technology: 'technology', science: 'science',
    health: 'health', business: 'business', entertainment: 'entertainment',
    sports: 'sports'
  };

  try {
    const cat = categoryMap[category] || 'top';
    let url = `${NEWSDATA_API_BASE}/news?apikey=${NEWSDATA_API_KEY}&language=en`;
    
    if (country) url += `&country=${country}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    if (category && category !== 'general') url += `&category=${cat}`;

    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) return [];
    const data = await response.json();
    
    return (data.results || []).map(article => ({
      title: article.title || '',
      description: article.description || '',
      content: article.content || article.description || '',
      source: article.source_id || 'NewsData.io',
      author: article.creator ? article.creator[0] : '',
      url: article.link || '',
      urlToImage: article.image_url || null,
      publishedAt: article.pubDate || new Date().toISOString(),
      category,
      apiSource: 'NewsData.io'
    }));
  } catch (err) {
    console.error('NewsData error:', err.message);
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
    const country = searchParams.get('country') || '';
    const query = searchParams.get('query') || '';

    // Fetch from all configured APIs in parallel
    const [newsApiArticles, gnewsArticles, currentsArticles, newsDataArticles] = await Promise.all([
      fetchFromNewsAPI(category, country, query),
      fetchFromGNews(category, country, query),
      fetchFromCurrents(category, country, query),
      fetchFromNewsData(category, country, query)
    ]);

    let articles = [...newsApiArticles, ...gnewsArticles, ...currentsArticles, ...newsDataArticles];

    // Track which APIs returned data
    const activeSources = [];
    if (newsApiArticles.length > 0) activeSources.push('NewsAPI');
    if (gnewsArticles.length > 0) activeSources.push('GNews');
    if (currentsArticles.length > 0) activeSources.push('CurrentsAPI');
    if (newsDataArticles.length > 0) activeSources.push('NewsData.io');

    const usingMockData = articles.length === 0;

    // Fallback to mock data if no articles fetched
    if (usingMockData) {
      articles = category === 'general'
        ? [...MOCK_NEWS]
        : MOCK_NEWS.filter(a => a.category === category);
      if (articles.length === 0) articles = [...MOCK_NEWS];
      
      // If the user requested a specific area (query), dynamically simulate local news for demo mode
      if (query) {
        const areaName = query.charAt(0).toUpperCase() + query.slice(1);
        articles = articles.slice(0, 4).map(a => ({
          ...a,
          title: `[${areaName}] ${a.title}`,
          description: `Latest updates from ${areaName}: ${a.description}`,
          content: `Reporting live from ${areaName}. ${a.content}`
        }));
      }

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

    // Auto-analyze articles locally (fast, no API limits)
    const analyzedArticles = articles.map(article => {
      const analysis = analyzeArticleRuleBased(article);

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


