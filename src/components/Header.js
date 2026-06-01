'use client';

export default function Header() {
  return (
    <header className="header">
      <div className="header-bg"></div>
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L2 9L16 16L30 9L16 2Z" fill="url(#grad1)" />
                <path d="M2 23L16 30L30 23V9L16 16L2 9V23Z" fill="url(#grad2)" opacity="0.8" />
                <defs>
                  <linearGradient id="grad1" x1="2" y1="2" x2="30" y2="16">
                    <stop stopColor="#00d4ff" />
                    <stop offset="1" stopColor="#7b2ff7" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="2" y1="9" x2="30" y2="30">
                    <stop stopColor="#7b2ff7" />
                    <stop offset="1" stopColor="#00d4ff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 className="logo-text">TruthLens</h1>
              <p className="logo-tagline">AI-Powered Fake News Detection</p>
            </div>
          </div>
        </div>
        <nav className="header-nav">
          <a href="#dashboard" className="nav-link active">Dashboard</a>
          <a href="#analyze" className="nav-link">Analyze</a>
          <a href="#news-feed" className="nav-link">News Feed</a>
        </nav>
        <div className="header-right">
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span>Live Analysis</span>
          </div>
        </div>
      </div>
    </header>
  );
}
