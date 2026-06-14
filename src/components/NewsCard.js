'use client';

import { useState } from 'react';

export default function NewsCard({ article, index, onAnalyze }) {
  const [expanded, setExpanded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { analysis } = article;

  const getClassColor = (classification) => {
    switch (classification) {
      case 'REAL': return '#00e676';
      case 'FAKE': return '#ff1744';
      case 'SUSPICIOUS': return '#ffab00';
      default: return '#666';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#00e676';
    if (score >= 45) return '#ffab00';
    return '#ff1744';
  };

  const classColor = analysis ? getClassColor(analysis.classification) : '#444';
  const scoreColor = analysis ? getScoreColor(analysis.credibilityScore) : '#444';

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffHrs = Math.floor(diffMs / 3600000);
      if (diffHrs < 1) return 'Just now';
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const getSentimentEmoji = (tone) => {
    if (!tone) return '😐';
    if (tone.includes('Positive')) return '😊';
    if (tone.includes('Negative')) return '😟';
    return '😐';
  };

  return (
    <div
      className={`news-card ${expanded ? 'expanded' : ''}`}
      style={{ animationDelay: `${index * 80}ms`, '--class-color': classColor }}
    >
      <div className="news-card-header">
        <div className="news-card-source">
          <span className="source-badge">{article.source}</span>
          <span className="news-time">{formatDate(article.publishedAt)}</span>
        </div>
        <div className="news-card-badge" style={{ background: `${classColor}18`, color: classColor, borderColor: `${classColor}40` }}>
          {!analysis && 'UNANALYZED'}
          {analysis?.classification === 'REAL' && '✓ '}
          {analysis?.classification === 'FAKE' && '✗ '}
          {analysis?.classification === 'SUSPICIOUS' && '⚠ '}
          {analysis?.classification}
        </div>
      </div>

      <h3 className="news-card-title">{article.title}</h3>
      
      {article.description && (
        <p className="news-card-description">{article.description}</p>
      )}

      {/* Cross-reference badge */}
      {article.crossRefSources && article.crossRefSources.length > 0 && (
        <div className="cross-ref-badge">
          <span className="cross-ref-icon">🔗</span>
          Verified across {article.crossRefSources.length} source{article.crossRefSources.length > 1 ? 's' : ''}: {article.crossRefSources.join(', ')}
        </div>
      )}

      {analysis && (
        <>
          <div className="news-card-score-bar">
            <div className="score-bar-header">
              <span className="score-label">Credibility Score</span>
              <span className="score-value" style={{ color: scoreColor }}>{analysis.credibilityScore}/100</span>
            </div>
            <div className="score-bar-track">
              <div
                className="score-bar-fill"
                style={{
                  width: `${analysis.credibilityScore}%`,
                  background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`
                }}
              ></div>
            </div>
          </div>

          {/* Quick insight pills */}
          <div className="insight-pills">
            {analysis.breakdown.sentiment && (
              <span className="insight-pill" title={`Sentiment: ${analysis.breakdown.sentiment.detail}`}>
                {getSentimentEmoji(analysis.breakdown.sentiment.tone)} {analysis.breakdown.sentiment.tone || 'Neutral'}
              </span>
            )}
            {analysis.breakdown.subjectivity && (
              <span className="insight-pill" title={`Objectivity: ${analysis.breakdown.subjectivity.detail}`}>
                📐 {analysis.breakdown.subjectivity.factRatio || 0}% Factual
              </span>
            )}
            {analysis.breakdown.readability && (
              <span className="insight-pill" title={`Readability: ${analysis.breakdown.readability.detail}`}>
                📖 {analysis.breakdown.readability.level || 'N/A'}
              </span>
            )}
            {analysis.breakdown.propaganda && analysis.breakdown.propaganda.techniques && analysis.breakdown.propaganda.techniques.length > 0 && (
              <span className="insight-pill pill-warning" title={`Propaganda: ${analysis.breakdown.propaganda.detail}`}>
                🎭 {analysis.breakdown.propaganda.techniques.length} flag{analysis.breakdown.propaganda.techniques.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {analysis.flags && analysis.flags.length > 0 && (
            <div className="news-card-flags">
              {analysis.flags.slice(0, 3).map((flag, i) => (
                <span key={i} className={`flag flag-${flag.type}`}>
                  {flag.type === 'danger' && '🚨'}
                  {flag.type === 'warning' && '⚠️'}
                  {flag.type === 'info' && 'ℹ️'}
                  {' '}{flag.message}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <button className="expand-btn" onClick={() => setExpanded(!expanded)} style={{ margin: 0 }}>
              {expanded ? 'Hide Details' : 'View Full Analysis'} 
              <span className={`expand-arrow ${expanded ? 'up' : ''}`}>▾</span>
            </button>
            
            {!analysis.isAdvanced && (
              <button 
                className="analyze-btn primary-btn" 
                onClick={async (e) => {
                  e.stopPropagation();
                  setIsAnalyzing(true);
                  if (onAnalyze) await onAnalyze();
                  setIsAnalyzing(false);
                }}
                disabled={isAnalyzing}
                style={{ 
                  padding: '0.4rem 1rem', 
                  borderRadius: '6px', 
                  background: isAnalyzing ? '#444' : 'linear-gradient(90deg, var(--accent), #7b2ff7)', 
                  color: '#fff', 
                  border: 'none', 
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}
              >
                {isAnalyzing ? 'Analyzing...' : '✨ Advanced AI Analysis'}
              </button>
            )}
          </div>
        </>
      )}

      {expanded && analysis && (
        <div className="news-card-details">
          {/* Extra: Precise AI Analysis */}
          {analysis.preciseAnalysis && (
            <div className="precise-analysis-container" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(123, 47, 247, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>✨</span> Extra: Precise AI Analysis
              </h4>
              <p style={{ margin: 0, color: '#e2e8f0', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {analysis.preciseAnalysis}
              </p>
            </div>
          )}

          <h4>8-Dimension Analysis</h4>
          <div className="breakdown-grid">
            {Object.entries(analysis.breakdown).map(([key, item]) => (
              <div key={key} className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-label">{item.label}</span>
                  <span className="breakdown-score" style={{ color: getScoreColor(item.score) }}>
                    {item.score}
                  </span>
                </div>
                <div className="breakdown-bar-track">
                  <div
                    className="breakdown-bar-fill"
                    style={{
                      width: `${item.score}%`,
                      background: getScoreColor(item.score)
                    }}
                  ></div>
                </div>
                {item.detail && (
                  <span className="breakdown-detail">{item.detail}</span>
                )}
              </div>
            ))}
          </div>

          {/* Propaganda techniques detail */}
          {analysis.breakdown.propaganda?.techniques?.length > 0 && (
            <div className="propaganda-detail">
              <h5>Propaganda Techniques Detected</h5>
              <div className="technique-tags">
                {analysis.breakdown.propaganda.techniques.map((t, i) => (
                  <span key={i} className="technique-tag">🎭 {t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Bias types */}
          {analysis.breakdown.bias?.types?.length > 0 && (
            <div className="bias-detail">
              <h5>Bias Indicators</h5>
              <div className="technique-tags">
                {analysis.breakdown.bias.types.map((t, i) => (
                  <span key={i} className="technique-tag bias-tag">⚖️ {t}</span>
                ))}
              </div>
            </div>
          )}

          {article.author && (
            <div className="detail-row">
              <span className="detail-label">Author:</span>
              <span className="detail-value">{article.author}</span>
            </div>
          )}
          
          {article.url && (
            <div className="detail-row">
              <span className="detail-label">Source:</span>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="detail-link">
                View Original Article ↗
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
