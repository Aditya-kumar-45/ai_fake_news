'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import NewsCard from '@/components/NewsCard';
import AnalyzeForm from '@/components/AnalyzeForm';
import { DistributionPieChart, CategoryBarChart, ScoreDistributionChart, SourceCredibilityChart, SentimentChart, UnifiedInsightsChart } from '@/components/Charts';
import { computeStats } from '@/lib/stats';
export default function Home() {
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('general');
  const [categories, setCategories] = useState([]);
  const [usingMockData, setUsingMockData] = useState(false);
  const [activeSources, setActiveSources] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('All Sources');
  const [activeRegion, setActiveRegion] = useState('global');
  const [activeArea, setActiveArea] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const INDIAN_AREAS = [
    { id: 'all', name: 'All India' },
    { id: 'Delhi', name: 'Delhi' },
    { id: 'Mumbai', name: 'Mumbai' },
    { id: 'Bangalore', name: 'Bangalore' },
    { id: 'Kerala', name: 'Kerala' },
    { id: 'Tamil Nadu', name: 'Tamil Nadu' },
    { id: 'Uttar Pradesh', name: 'Uttar Pradesh' }
  ];

  const fetchNews = useCallback(async (category, region = 'global', area = 'all', query = '') => {
    setLoading(true);
    try {
      let url = `/api/news?category=${category}`;
      let combinedQuery = query;

      if (region === 'in') {
        url += `&country=in`;
        if (area !== 'all') {
          combinedQuery = combinedQuery ? `${area} ${combinedQuery}` : area;
        }
      } else if (region === 'us') {
        url += `&country=us`;
      }

      if (combinedQuery) {
        url += `&query=${encodeURIComponent(combinedQuery)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setArticles(data.articles);
        setStats(data.stats);
        setCategories(data.categories || []);
        setUsingMockData(data.usingMockData);
        setActiveSources(data.activeSources || []);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchNews(activeCategory, activeRegion, activeArea, searchQuery);
  }, [activeCategory, activeRegion, activeArea, searchQuery, fetchNews]);

  const handleAnalyzeArticle = async (articleIndex) => {
    const articleToAnalyze = articles[articleIndex];
    try {
      const response = await fetch('/api/analyze-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleToAnalyze)
      });
      const data = await response.json();
      
      if (data.success && data.analysis) {
        setArticles(prevArticles => {
          const newArticles = [...prevArticles];
          newArticles[articleIndex] = { ...newArticles[articleIndex], analysis: data.analysis };
          setStats(computeStats(newArticles));
          return newArticles;
        });
      }
    } catch (err) {
      console.error('Failed to analyze article:', err);
    }
  };

  const filteredArticles = articles.filter(article => {
    if (filterType === 'all') return true;
    if (!article.analysis) return false;
    return article.analysis.classification === filterType.toUpperCase();
  });

  const uniqueSources = ['All Sources', ...Array.from(new Set(articles.map(a => a.source))).filter(Boolean).sort()];
  
  const channelStats = selectedChannel !== 'All Sources' 
    ? computeStats(articles.filter(a => a.source === selectedChannel && a.analysis)) 
    : null;

  return (
    <>
      <Header />

      <main className="main">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg">
            <div className="hero-orb orb-1"></div>
            <div className="hero-orb orb-2"></div>
            <div className="hero-orb orb-3"></div>
          </div>
          <div className="hero-content">
            <h2 className="hero-title">
              Detect <span className="gradient-text">Misinformation</span> with AI
            </h2>
            <p className="hero-subtitle">
              Real-time analysis of news articles across multiple channels using advanced NLP-based credibility scoring
            </p>
            {usingMockData && (
              <div className="demo-badge">
                <span>🔬</span> Demo Mode — Using sample data. Add API keys in .env.local for live news.
              </div>
            )}
            {!usingMockData && activeSources.length > 0 && (
              <div className="sources-badge">
                <span>📡</span> Live from {activeSources.length} API{activeSources.length > 1 ? 's' : ''}: {activeSources.join(' • ')}
              </div>
            )}
          </div>
        </section>

        {/* Stats Overview */}
        <section id="dashboard" className="stats-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">📊</span>
              Live Dashboard
            </h2>
            <p className="section-subtitle">Real-time analysis statistics across all monitored channels</p>
          </div>

          {stats && stats.total > 0 ? (
            <div className="stats-grid">
              <StatsCard
                icon="📰"
                label="Total Analyzed"
                value={stats.total}
                color="#00d4ff"
                delay={0}
              />
              <StatsCard
                icon="✅"
                label="Credible News"
                value={stats.real}
                color="#00e676"
                delay={150}
              />
              <StatsCard
                icon="❌"
                label="Fake News"
                value={stats.fake}
                color="#ff1744"
                delay={300}
              />
              <StatsCard
                icon="⚠️"
                label="Suspicious"
                value={stats.suspicious}
                color="#ffab00"
                delay={450}
              />
              <StatsCard
                icon="📈"
                label="Credibility Rate"
                value={stats.realPercentage}
                suffix="%"
                color="#7b2ff7"
                delay={600}
              />
              <StatsCard
                icon="🎯"
                label="Avg. Score"
                value={stats.avgCredibility}
                suffix="/100"
                color="#00d4ff"
                delay={750}
              />
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '3rem', textAlign: 'center', background: 'rgba(26, 32, 68, 0.4)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span className="empty-icon" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>👆</span>
              <p style={{ color: '#8892b0', fontSize: '1.1rem' }}>No articles analyzed yet. Click &quot;Analyze Article&quot; on any news card below to build your dashboard.</p>
            </div>
          )}
        </section>

        {/* Charts Section */}
        {stats && stats.total > 0 && (
          <section className="charts-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon">📉</span>
                Visual Analytics
              </h2>
              <p className="section-subtitle">Comprehensive charts showing news credibility patterns</p>
            </div>

            <div className="charts-grid">
              <DistributionPieChart stats={stats} />
              <CategoryBarChart stats={stats} />
              <ScoreDistributionChart stats={stats} />
              <SentimentChart stats={stats} />
              <SourceCredibilityChart stats={stats} />
            </div>
          </section>
        )}

        {/* Extra: Channel Analytics */}
        {stats && stats.total > 0 && (
          <section className="extra-channel-section" style={{ padding: '2rem 5%', background: 'rgba(20, 24, 48, 0.4)', marginTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
                  <span>✨</span> Extra: Channel Insights
                </h2>
                <p className="section-subtitle" style={{ margin: 0, color: '#8892b0' }}>Deep dive into specific news channels</p>
              </div>
              <div className="channel-selector">
                <select 
                  value={selectedChannel} 
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  style={{
                    padding: '0.6rem 1rem',
                    background: '#1a2044',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {uniqueSources.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedChannel !== 'All Sources' && channelStats ? (
              channelStats.total > 0 ? (
                <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr' }}>
                  <UnifiedInsightsChart stats={channelStats} />
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>👀</span>
                  <p style={{ color: '#8892b0', margin: 0 }}>No articles from {selectedChannel} have been analyzed yet.</p>
                </div>
              )
            ) : null}
          </section>
        )}

        {/* Analyze Custom Text */}
        <AnalyzeForm />

        {/* News Feed */}
        <section id="news-feed" className="news-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">📰</span>
              Analyzed News Feed
            </h2>
            <p className="section-subtitle">Browse analyzed articles from multiple news channels</p>
          </div>

          {/* Feed Controls Bar */}
          <div className="feed-controls" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem', background: 'rgba(20, 24, 48, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', alignItems: 'center' }}>
            
            {/* Category Tabs (Scrollable Row) */}
            <div style={{ flex: '1 1 auto', display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }} className="hide-scrollbar">
              {[{ id: 'general', name: 'All News', icon: '📰' }, ...categories].map(cat => (
                <button
                  key={cat.id}
                  className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ margin: 0, whiteSpace: 'nowrap', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  <span style={{ marginRight: '0.4rem' }}>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Region & Area Selectors */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#8892b0', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Region</span>
                <select 
                  value={activeRegion}
                  onChange={(e) => {
                    setActiveRegion(e.target.value);
                    if (e.target.value !== 'in') setActiveArea('all');
                  }}
                  style={{
                    padding: '0.5rem 1rem', background: '#1a2044', color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px',
                    fontSize: '0.9rem', outline: 'none', cursor: 'pointer'
                  }}
                >
                  <option value="global">🌍 Global (All Over)</option>
                  <option value="in">🇮🇳 India</option>
                  <option value="us">🇺🇸 United States</option>
                </select>
              </div>

              {activeRegion === 'in' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8892b0', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Area Shortlist</span>
                  <select 
                    value={activeArea}
                    onChange={(e) => setActiveArea(e.target.value)}
                    style={{
                      padding: '0.5rem 1rem', background: 'linear-gradient(90deg, rgba(123, 47, 247, 0.2), rgba(0, 212, 255, 0.1))', color: '#fff',
                      border: '1px solid var(--accent)', borderRadius: '8px',
                      fontSize: '0.9rem', outline: 'none', cursor: 'pointer'
                    }}
                  >
                    {INDIAN_AREAS.map(area => (
                      <option key={area.id} value={area.id} style={{ background: '#1a2044' }}>{area.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Search Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#8892b0', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Search Topics</span>
                <form 
                  onSubmit={(e) => { e.preventDefault(); setSearchQuery(searchInput); }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <input
                    type="text"
                    placeholder="Search specific news..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    style={{
                      padding: '0.5rem 1rem', background: '#0a0d1e', color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px 0 0 8px',
                      fontSize: '0.9rem', outline: 'none', width: '200px'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.5rem 1rem', background: 'var(--accent)', color: '#fff',
                      border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer',
                      fontSize: '0.9rem', fontWeight: 'bold'
                    }}
                  >
                    🔍
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="filter-bar">
            <button
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All ({articles.length})
            </button>
            <button
              className={`filter-btn filter-real ${filterType === 'real' ? 'active' : ''}`}
              onClick={() => setFilterType('real')}
            >
              ✓ Real ({articles.filter(a => a.analysis && a.analysis.classification === 'REAL').length})
            </button>
            <button
              className={`filter-btn filter-fake ${filterType === 'fake' ? 'active' : ''}`}
              onClick={() => setFilterType('fake')}
            >
              ✗ Fake ({articles.filter(a => a.analysis && a.analysis.classification === 'FAKE').length})
            </button>
            <button
              className={`filter-btn filter-suspicious ${filterType === 'suspicious' ? 'active' : ''}`}
              onClick={() => setFilterType('suspicious')}
            >
              ⚠ Suspicious ({articles.filter(a => a.analysis && a.analysis.classification === 'SUSPICIOUS').length})
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Fetching latest news articles...</p>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && (
            <div className="news-grid">
              {filteredArticles.map((article, idx) => {
                const originalIndex = articles.indexOf(article);
                return <NewsCard key={originalIndex} article={article} index={idx} onAnalyze={() => handleAnalyzeArticle(originalIndex)} />
              })}
              {filteredArticles.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">🔍</span>
                  <p>No articles found matching your filter.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>TruthLens</h3>
              <p>AI-Powered Fake News Detection</p>
            </div>
            <div className="footer-disclaimer">
              <p>⚠️ <strong>Disclaimer:</strong> This tool uses heuristic NLP analysis for educational purposes. 
              Results are indicative and should not be considered definitive fact-checking. 
              Always verify information through multiple reputable sources.</p>
            </div>
            <div className="footer-bottom">
              <p>© 2026 TruthLens. Built with Next.js & React.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
