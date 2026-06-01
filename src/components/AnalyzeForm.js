'use client';

import { useState } from 'react';

export default function AnalyzeForm() {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), title: title.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.analysis);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Failed to connect to analysis server');
    } finally {
      setLoading(false);
    }
  };

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

  const loadExample = (type) => {
    if (type === 'real') {
      setTitle('NASA Confirms Successful Mars Sample Return Mission');
      setText('NASA announced today the successful completion of its Mars Sample Return mission, a collaborative effort with the European Space Agency. The carefully sealed samples, collected by the Perseverance rover from the Jezero Crater, touched down safely at the Utah Test and Training Range. Scientists at NASA\'s Johnson Space Center will begin analyzing the 30 rock and soil samples over the coming months, searching for signs of ancient microbial life. The mission, which cost approximately $7 billion, represents a major milestone in planetary science. Dr. Elena Rodriguez, the mission\'s principal investigator, stated that initial inspections show the samples are in excellent condition.');
    } else {
      setTitle('SHOCKING!!! Government CAUGHT Hiding Alien Technology!!');
      setText('BREAKING: Leaked documents reveal that the government has been hiding alien technology for decades! This bombshell conspiracy has been covered up by the deep state and mainstream media. Wake up people! Big pharma and the elite don\'t want you to know the truth. A brave whistleblower has exposed this sinister cover-up. Share before this gets deleted! They are censoring anyone who speaks the truth. Do your own research! This devastating scandal proves everything we\'ve been saying. The corrupt officials are terrified that this information is finally getting out!!!');
    }
  };

  return (
    <section id="analyze" className="analyze-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-icon">🔍</span>
          Analyze Custom Text
        </h2>
        <p className="section-subtitle">Paste any news article or text to check its credibility</p>
      </div>

      <form onSubmit={handleAnalyze} className="analyze-form">
        <div className="form-group">
          <label htmlFor="analyze-title" className="form-label">Headline / Title (optional)</label>
          <input
            id="analyze-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the news headline..."
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="analyze-text" className="form-label">Article Text</label>
          <textarea
            id="analyze-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the full news article text here for analysis..."
            className="form-textarea"
            rows={6}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="analyze-btn" disabled={loading || !text.trim()}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <span>🤖</span>
                Analyze with AI
              </>
            )}
          </button>
          
          <div className="example-btns">
            <button type="button" className="example-btn real" onClick={() => loadExample('real')}>
              Load Real Example
            </button>
            <button type="button" className="example-btn fake" onClick={() => loadExample('fake')}>
              Load Fake Example
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="analyze-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {result && (
        <div className="analyze-result" style={{ '--result-color': getClassColor(result.classification) }}>
          <div className="result-header">
            <div className="result-classification" style={{ color: getClassColor(result.classification) }}>
              <span className="result-icon">
                {result.classification === 'REAL' && '✓'}
                {result.classification === 'FAKE' && '✗'}
                {result.classification === 'SUSPICIOUS' && '⚠'}
              </span>
              <span className="result-label">{result.classification}</span>
            </div>
            <div className="result-score">
              <div className="score-circle" style={{ 
                background: `conic-gradient(${getScoreColor(result.credibilityScore)} ${result.credibilityScore * 3.6}deg, #1a1f3a ${result.credibilityScore * 3.6}deg)` 
              }}>
                <span>{result.credibilityScore}</span>
              </div>
              <span className="score-subtitle">Credibility Score</span>
            </div>
          </div>

          <div className="result-breakdown">
            <h4>8-Dimension Analysis</h4>
            <div className="breakdown-grid">
              {Object.entries(result.breakdown).map(([key, item]) => (
                <div key={key} className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-label">{item.label}</span>
                    <span className="breakdown-score" style={{ color: getScoreColor(item.score) }}>
                      {item.score}/100
                    </span>
                  </div>
                  <div className="breakdown-bar-track">
                    <div
                      className="breakdown-bar-fill"
                      style={{
                        width: `${item.score}%`,
                        background: `linear-gradient(90deg, ${getScoreColor(item.score)}88, ${getScoreColor(item.score)})`
                      }}
                    ></div>
                  </div>
                  {item.detail && (
                    <span className="breakdown-detail">{item.detail}</span>
                  )}
                </div>
              ))}
            </div>

            {result.breakdown.propaganda?.techniques?.length > 0 && (
              <div className="propaganda-detail">
                <h5>Propaganda Techniques Detected</h5>
                <div className="technique-tags">
                  {result.breakdown.propaganda.techniques.map((t, i) => (
                    <span key={i} className="technique-tag">🎭 {t}</span>
                  ))}
                </div>
              </div>
            )}

            {result.breakdown.bias?.types?.length > 0 && (
              <div className="bias-detail">
                <h5>Bias Indicators</h5>
                <div className="technique-tags">
                  {result.breakdown.bias.types.map((t, i) => (
                    <span key={i} className="technique-tag bias-tag">⚖️ {t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {result.flags && result.flags.length > 0 && (
            <div className="result-flags">
              <h4>Flags & Warnings</h4>
              {result.flags.map((flag, i) => (
                <div key={i} className={`result-flag flag-${flag.type}`}>
                  {flag.type === 'danger' && '🚨'}
                  {flag.type === 'warning' && '⚠️'}
                  {flag.type === 'info' && 'ℹ️'}
                  {' '}{flag.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
