'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import NewsCard from '@/components/NewsCard';
import AnalyzeForm from '@/components/AnalyzeForm';
import { DistributionPieChart, CategoryBarChart, ScoreDistributionChart, SourceCredibilityChart, SentimentChart } from '@/components/Charts';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('general');
  const [categories, setCategories] = useState([]);
  const [usingMockData, setUsingMockData] = useState(false);
  const [activeSources, setActiveSources] = useState([]);
  const [filterType, setFilterType] = useState('all');

  const fetchNews = useCallback(async (category) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/news?category=${category}`);
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
    fetchNews(activeCategory);
  }, [activeCategory, fetchNews]);

  const filteredArticles = articles.filter(article => {
    if (filterType === 'all') return true;
    return article.analysis.classification === filterType.toUpperCase();
  });

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

          {stats && (
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
          )}
        </section>

        {/* Charts Section */}
        {stats && (
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

          {/* Category Tabs */}
          <div className="category-tabs">
            {[{ id: 'general', name: 'All News', icon: '📰' }, ...categories].map(cat => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
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
              ✓ Real ({articles.filter(a => a.analysis.classification === 'REAL').length})
            </button>
            <button
              className={`filter-btn filter-fake ${filterType === 'fake' ? 'active' : ''}`}
              onClick={() => setFilterType('fake')}
            >
              ✗ Fake ({articles.filter(a => a.analysis.classification === 'FAKE').length})
            </button>
            <button
              className={`filter-btn filter-suspicious ${filterType === 'suspicious' ? 'active' : ''}`}
              onClick={() => setFilterType('suspicious')}
            >
              ⚠ Suspicious ({articles.filter(a => a.analysis.classification === 'SUSPICIOUS').length})
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Analyzing news articles...</p>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && (
            <div className="news-grid">
              {filteredArticles.map((article, index) => (
                <NewsCard key={index} article={article} index={index} />
              ))}
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
