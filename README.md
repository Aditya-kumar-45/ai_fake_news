# 🔍 TruthLens — AI-Powered Fake News Detection System

> A full-stack Next.js web application that aggregates news from multiple API sources, performs **8-dimensional NLP credibility analysis**, and presents results through interactive dashboards with real-time visual analytics.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [File Structure](#file-structure)
- [8-Dimension Analysis Engine](#8-dimension-analysis-engine)
- [Multi-Source API Integration](#multi-source-api-integration)
- [API Endpoints](#api-endpoints)
- [Components Documentation](#components-documentation)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [How It Works — Data Flow](#how-it-works--data-flow)
- [Design System](#design-system)
- [Future Enhancements](#future-enhancements)

---

## Overview

**TruthLens** is an AI-powered fake news detection web application built with **Next.js 16**, **React 19**, and **Recharts**. The system fetches real-time news articles from multiple news APIs (NewsAPI, GNews, CurrentsAPI), analyzes each article through an advanced **8-dimensional NLP credibility engine**, and displays results on an interactive dashboard.

The analysis engine evaluates articles across 8 independent dimensions — sentiment analysis, bias detection, subjectivity scoring, readability analysis, propaganda detection, headline-content alignment, source credibility, and content quality — to produce a composite credibility score (0-100) and classification (REAL / SUSPICIOUS / FAKE).

---

## Features

### 🧠 Core Analysis
- **8-Dimensional NLP Analysis** — Each article is scored across 8 independent analysis factors
- **Sentiment Analysis** — Detects emotional tone (positive/negative/neutral) and identifies manipulative emotional framing
- **Bias Detection** — Identifies political, commercial, and sensational bias indicators
- **Subjectivity Scoring** — Measures the ratio of opinion vs. factual markers in the text
- **Readability Analysis** — Evaluates writing complexity and professionalism level
- **Propaganda Detection** — Detects 9+ propaganda techniques (fear appeals, loaded language, conspiracy framing, etc.)
- **Headline Accuracy** — Compares headline keywords against article body to detect misleading titles
- **Source Credibility** — Cross-references source names against a database of 40+ reputable and questionable outlets
- **Content Quality** — Evaluates structural integrity (author attribution, content length, HTTPS, publication date)

### 📡 Multi-Source News Aggregation
- **NewsAPI.org** — Top headlines and everything search (1,000 req/day free)
- **GNews.io** — Global news aggregation (100 req/day free)
- **CurrentsAPI** — Latest news by category (free tier)
- **Cross-Referencing** — Articles appearing in multiple APIs get a credibility boost
- **Deduplication** — Automatically removes duplicate articles from different sources
- **Fallback System** — Mock data with intentional real/fake examples when no API keys are configured

### 📊 Visual Analytics Dashboard
- **Real-Time Stats Cards** — Animated counters showing total analyzed, credible, fake, suspicious, credibility rate, and avg. score
- **Classification Pie Chart** — Distribution of REAL vs FAKE vs SUSPICIOUS
- **Category Bar Chart** — Breakdown by news category (technology, science, health, etc.)
- **Score Distribution Area Chart** — Histogram of credibility score ranges
- **Sentiment Distribution Donut** — Positive vs Neutral vs Negative tone analysis
- **Source Credibility Ranking** — Horizontal bar chart ranking news sources by average score

### 🔍 Custom Text Analysis
- **Paste-to-Analyze** — Users can paste any text/headline for instant credibility analysis
- **Example Loaders** — Pre-built "real" and "fake" examples for demonstration
- **Full 8-Dimension Breakdown** — Same detailed analysis as the news feed

### 🎨 Premium UI/UX
- **Dark Mode Glassmorphism** — Frosted glass cards with backdrop blur effects
- **Animated Hero Section** — Floating gradient orbs with CSS animations
- **Micro-Animations** — Fade-in, slide-up, count-up animations throughout
- **Insight Pills** — Quick-glance sentiment, factual %, readability level per article
- **Cross-Reference Badges** — Visual indicator when articles are verified across sources
- **Responsive Design** — Fully responsive from mobile (600px) to desktop (1400px+)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.2.6 |
| **UI Library** | React | 19.2.4 |
| **Charts** | Recharts | 3.8.1 |
| **Styling** | Vanilla CSS (Glassmorphism) | - |
| **Font** | Inter (Google Fonts) | - |
| **APIs** | NewsAPI, GNews, CurrentsAPI | - |
| **Language** | JavaScript (ES2024) | - |

---

## Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌─────────────┐  │
│  │  Header   │ │StatsCard │ │   Charts   │ │AnalyzeForm  │  │
│  └──────────┘ └──────────┘ └────────────┘ └─────────────┘  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                     NewsCard                          │   │
│  │  (8-Dimension Breakdown, Insight Pills, Flags)        │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                   │
│                    fetch('/api/...')                          │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                  BACKEND (Next.js API Routes)                │
│                          │                                   │
│  ┌───────────────────────┴───────────────────────────┐      │
│  │              /api/news (GET)                        │      │
│  │  1. Fetch from NewsAPI, GNews, CurrentsAPI          │      │
│  │  2. Deduplicate articles                            │      │
│  │  3. Cross-reference across sources                  │      │
│  │  4. Run 8-dimension analysis                        │      │
│  │  5. Compute stats & return JSON                     │      │
│  └────────────────────────────────────────────────────┘      │
│  ┌────────────────────────────────────────────────────┐      │
│  │              /api/analyze (POST)                    │      │
│  │  1. Accept custom text                              │      │
│  │  2. Run 8-dimension analysis                        │      │
│  │  3. Return analysis JSON                            │      │
│  └────────────────────────────────────────────────────┘      │
│                          │                                   │
│               ┌──────────┴──────────┐                        │
│               │  fakeNewsDetector   │ ◄── NLP Analysis Engine│
│               │  (8 dimensions)     │                        │
│               └─────────────────────┘                        │
└──────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
ai_fake_news/
├── .env.local                          # API keys configuration
├── package.json                        # Dependencies & scripts
├── README.md                           # This documentation
│
└── src/
    ├── app/
    │   ├── layout.js                   # Root layout (Inter font, SEO metadata)
    │   ├── page.js                     # Main dashboard page (client component)
    │   ├── globals.css                 # Complete design system & styles (~460 lines)
    │   └── api/
    │       ├── news/
    │       │   └── route.js            # GET /api/news — Multi-source news fetch + analysis
    │       └── analyze/
    │           └── route.js            # POST /api/analyze — Custom text analysis
    │
    ├── components/
    │   ├── Header.js                   # Sticky header with logo, nav, live indicator
    │   ├── StatsCard.js                # Animated stat counter cards
    │   ├── NewsCard.js                 # Article card with insight pills & 8D breakdown
    │   ├── Charts.js                   # 5 chart components (Pie, Bar, Area, Sentiment, Source)
    │   └── AnalyzeForm.js              # Custom text analysis form with results display
    │
    └── lib/
        ├── fakeNewsDetector.js          # 8-Dimension NLP Analysis Engine (~350 lines)
        └── newsChannels.js              # Categories, channels, mock data
```

---

## 8-Dimension Analysis Engine

The core of TruthLens is the `fakeNewsDetector.js` engine. Every article is scored across **8 independent dimensions**, each producing a **0-100 score** (100 = most credible). These are combined using weighted averaging into a composite credibility score.

### Dimension Details

| # | Dimension | Weight | What It Measures |
|---|-----------|--------|------------------|
| 1 | 😊 **Sentiment Analysis** | 8% | Emotional tone — positive, negative, neutral. Overly emotional articles score lower |
| 2 | ⚖️ **Bias Detection** | 12% | Political (left/right), commercial, and sensational bias indicators |
| 3 | 📐 **Objectivity** | 10% | Ratio of factual markers (data, statistics, citations) vs. opinion phrases |
| 4 | 📖 **Readability** | 8% | Writing complexity — Professional/Academic/Standard/Simple levels |
| 5 | 🎭 **Propaganda Check** | 20% | Detects 9 propaganda techniques + clickbait patterns + excessive caps/punctuation |
| 6 | 🔗 **Headline Accuracy** | 12% | Keyword overlap between headline and body — catches misleading titles |
| 7 | 🏢 **Source Credibility** | 18% | 40+ reputable sources database, suspicious domain detection |
| 8 | 📝 **Content Quality** | 12% | Author attribution, content length, HTTPS, images, publication date |


https://ai-fake-news-chi.vercel.app/


| Composite Score | Classification | Meaning |
|----------------|---------------|---------|
| **72-100** | ✅ REAL | Highly credible article |
| **45-71** | ⚠️ SUSPICIOUS | Needs verification — mixed signals |
| **0-44** | ❌ FAKE | Likely misinformation or propaganda |

### Propaganda Techniques Detected (9 Types)

1. **Appeal to Fear** — Terrorizing language to bypass rational thought
2. **Loaded Language** — Emotionally charged words (destroy, evil, corrupt, sinister)
3. **Ad Hominem** — Attacking people instead of arguments
4. **False Urgency** — "Act now!", "Before it's too late!"
5. **Conspiracy Framing** — "Deep state", "Wake up", "They don't want you to know"
6. **Bandwagon** — "Everyone knows", "Nobody denies"
7. **Black & White** — False dilemmas, "Either/or" framing
8. **Straw Man** — Misrepresenting opposing viewpoints
9. **Appeal to Authority** — Vague "experts say" without specifics

### Cross-Reference Bonus

When the same story appears across multiple independent API sources, TruthLens awards a **credibility bonus** (up to +10 points). This is a key differentiator — stories verified by multiple independent outlets are inherently more trustworthy.

---

## Multi-Source API Integration

TruthLens fetches news from **3 independent APIs simultaneously** using `Promise.all()` for maximum performance:

### API Sources

| API | Free Tier | Endpoint Used | What It Provides |
|-----|-----------|--------------|-----------------|
| **[NewsAPI.org](https://newsapi.org)** | 1,000 req/day | `/v2/top-headlines` | Top headlines by category, 20+ languages |
| **[GNews.io](https://gnews.io)** | 100 req/day | `/v4/top-headlines` | Global news, compact API, 60+ countries |
| **[CurrentsAPI](https://currentsapi.services)** | Free tier | `/v1/latest-news` | Latest news by category |

### Cross-Referencing Algorithm

```
For each article:
  1. Extract significant keywords from title (remove stop words, keep words > 3 chars)
  2. Compare against ALL other articles from ALL sources
  3. If keyword overlap ≥ 40% with another article from different source → cross-reference match
  4. Each cross-reference match adds +4 credibility (max +10)
  5. Display green "🔗 Verified across N sources" badge on card
```

### Deduplication

Before analysis, the system removes near-duplicate articles by normalizing titles (lowercase, strip special chars) and comparing the first 60 characters. This prevents the same CNBC story from appearing 3 times when multiple APIs return it.

---

## API Endpoints

### `GET /api/news`

Fetches, deduplicates, cross-references, and analyzes news articles.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string | `general` | News category: general, technology, science, health, business, entertainment, sports |

**Response:**
```json
{
  "success": true,
  "articles": [
    {
      "title": "Article headline",
      "description": "Short summary",
      "content": "Full article text...",
      "source": "CNBC",
      "author": "Author Name",
      "url": "https://...",
      "urlToImage": "https://...",
      "publishedAt": "2026-06-01T10:00:00Z",
      "category": "technology",
      "apiSource": "NewsAPI",
      "crossRefSources": ["Bloomberg (GNews)"],
      "analysis": {
        "credibilityScore": 78,
        "classification": "REAL",
        "confidence": 68,
        "breakdown": {
          "sentiment": { "score": 70, "tone": "Slightly Negative", "detail": "..." },
          "bias": { "score": 85, "types": [], "detail": "No significant bias" },
          "subjectivity": { "score": 75, "factRatio": 60, "detail": "..." },
          "readability": { "score": 85, "level": "Professional", "detail": "..." },
          "propaganda": { "score": 100, "techniques": [], "detail": "..." },
          "alignment": { "score": 90, "detail": "Headline accurately reflects content" },
          "source": { "score": 88, "detail": "Recognized reputable source" },
          "quality": { "score": 82, "detail": "Well-structured, complete article" }
        },
        "flags": [
          { "type": "info", "message": "Cross-verified by 2 independent sources" }
        ]
      }
    }
  ],
  "stats": {
    "total": 25, "real": 18, "fake": 3, "suspicious": 4,
    "avgCredibility": 72, "realPercentage": 72, "fakePercentage": 12,
    "categoryBreakdown": {},
    "sourceBreakdown": {},
    "scoreDistribution": [],
    "sentimentDist": { "Positive": 8, "Neutral": 12, "Negative": 5 }
  },
  "categories": [...],
  "activeSources": ["NewsAPI", "GNews"],
  "usingMockData": false,
  "fetchedAt": "2026-06-01T15:00:00Z"
}
```

---

### `POST /api/analyze`

Analyzes custom user-submitted text.

**Request Body:**
```json
{
  "text": "The full article text to analyze...",
  "title": "Optional headline"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "credibilityScore": 45,
    "classification": "SUSPICIOUS",
    "confidence": 62,
    "breakdown": { ... },
    "flags": [ ... ]
  },
  "analyzedAt": "2026-06-01T15:00:00Z"
}
```

---

## Components Documentation

### `Header.js`
Sticky navigation header with glassmorphism blur effect. Contains:
- Custom SVG logo with gradient
- Brand name "TruthLens" with gradient text
- Navigation links (Dashboard, Analyze, News Feed) with smooth scroll
- Pulsing green "Live Analysis" indicator

### `StatsCard.js`
Animated statistics display card. Features:
- **Count-up animation** — Numbers animate from 0 to target value with cubic ease-out
- **Staggered entrance** — Cards appear one after another with configurable delay
- **Radial glow** — Background glow effect matching the card's accent color
- Props: `icon`, `label`, `value`, `suffix`, `color`, `delay`

### `NewsCard.js`
The main article display component. Shows:
- Source badge, timestamp, classification badge (REAL/FAKE/SUSPICIOUS)
- Article title and truncated description
- **Cross-reference badge** — Green badge when verified across multiple APIs
- **Credibility score bar** — Color-coded progress bar (green/yellow/red)
- **Insight pills** — Quick-glance pills showing sentiment emoji, factual %, readability level, propaganda flag count
- **Warning flags** — Danger/warning/info badges for detected issues
- **Expandable 8D breakdown** — Click "View Full Analysis" to see all 8 dimension scores with progress bars and detail text
- **Propaganda technique tags** — Red tags for each detected propaganda technique
- **Bias indicator tags** — Yellow tags for detected bias types

### `Charts.js`
Five exported chart components using Recharts:
1. **DistributionPieChart** — Donut chart: Real vs Fake vs Suspicious distribution
2. **CategoryBarChart** — Grouped bar chart: Analysis breakdown by news category
3. **ScoreDistributionChart** — Area chart: Credibility score histogram (0-20, 21-40, etc.)
4. **SentimentChart** — Donut chart: Positive vs Neutral vs Negative sentiment
5. **SourceCredibilityChart** — Horizontal bar chart: Top 8 sources ranked by avg credibility

### `AnalyzeForm.js`
Custom text analysis form with:
- Title input (optional) and textarea for article content
- "Analyze with AI" submit button with loading spinner
- Example loaders (real NASA article, fake conspiracy text)
- Full analysis result display with score circle, 8D breakdown, propaganda tags, bias tags, and warning flags

---

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm

### Quick Start

```bash
# 1. Clone or navigate to the project
cd ai_fake_news

# 2. Install dependencies
npm install

# 3. Configure API keys (see Environment Variables section)
# Edit .env.local with your keys

# 4. Start development server
npm run dev

# 5. Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# REQUIRED — Get free key from https://newsapi.org
NEWS_API_KEY=your_newsapi_key_here

# OPTIONAL — Get free key from https://gnews.io (100 req/day)
GNEWS_API_KEY=your_gnews_key_here

# OPTIONAL — Get free key from https://currentsapi.services
CURRENTS_API_KEY=your_currents_key_here
```

> **Note:** NewsAPI free tier only works on `localhost`. For production deployment, you need their paid plan or alternative APIs. GNews and CurrentsAPI free tiers work in production.

If no API keys are configured, the app runs in **Demo Mode** with built-in mock data containing intentional real and fake news examples for demonstration.

---

## How It Works — Data Flow

```
User opens app
       │
       ▼
  page.js useEffect
       │
       ▼
  fetch('/api/news?category=general')
       │
       ▼
  route.js (API Route)
       │
       ├─── fetchFromNewsAPI()  ──► newsapi.org/v2/top-headlines
       ├─── fetchFromGNews()    ──► gnews.io/api/v4/top-headlines
       └─── fetchFromCurrents() ──► currentsapi.services/v1/latest-news
       │
       ▼  (Promise.all — parallel fetch)
       │
  Combine all articles
       │
       ▼
  deduplicateArticles()  →  Remove near-duplicate titles
       │
       ▼
  crossReferenceArticles()  →  Find same stories across APIs
       │
       ▼
  analyzeArticle() × N  →  Run 8-dimension NLP analysis on each
       │
       ├── analyzeSentiment()     →  Positive/Negative/Neutral tone
       ├── analyzeBias()          →  Political, commercial, sensational bias
       ├── analyzeSubjectivity()  →  Opinion vs fact markers
       ├── analyzeReadability()   →  Writing complexity level
       ├── analyzePropaganda()    →  9 propaganda techniques + clickbait
       ├── analyzeHeadlineAlignment() → Title-body keyword match
       ├── analyzeSource()        →  40+ source reputation database
       └── analyzeContentQuality()→  Structure, author, length, date
       │
       ▼
  Apply cross-reference bonus (+4 per match, max +10)
       │
       ▼
  computeStats()  →  Aggregate statistics for charts
       │
       ▼
  Return JSON  →  { articles, stats, activeSources, ... }
       │
       ▼
  React renders Dashboard → Stats Cards → Charts → News Feed
```

---

## Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background Primary | `#0a0e27` | Main page background |
| Background Secondary | `#0f1535` | Cards, footer |
| Glass Background | `rgba(15, 21, 53, 0.7)` | Glassmorphism cards |
| Accent Cyan | `#00d4ff` | Primary accent, links, highlights |
| Accent Purple | `#7b2ff7` | Secondary accent, gradients |
| Accent Green | `#00e676` | REAL classification, positive |
| Accent Red | `#ff1744` | FAKE classification, danger |
| Accent Yellow | `#ffab00` | SUSPICIOUS classification, warning |
| Text Primary | `#e8eaf6` | Main text |
| Text Secondary | `#8892b0` | Labels, descriptions |
| Text Muted | `#5a6380` | Timestamps, captions |

### Typography
- **Font:** Inter (Google Fonts) with system font fallbacks
- **Weights:** 500 (normal), 600 (semi-bold), 700 (bold), 800 (extra-bold)

### Effects
- **Glassmorphism:** `backdrop-filter: blur(12px)` on cards
- **Gradient:** `linear-gradient(135deg, #00d4ff, #7b2ff7)` for primary gradient
- **Glow:** `0 0 40px rgba(0, 212, 255, 0.08)` on card hover
- **Animations:** fadeInUp, fadeIn, pulse, float1/2/3, spin, count-up

---

## Future Enhancements

- [ ] **ML-Based Classification** — Train a real ML model (TF.js) on labeled fake news datasets
- [ ] **User Reporting** — Allow users to flag articles and contribute to training data
- [ ] **Historical Trends** — Track credibility trends over time with time-series charts
- [ ] **Browser Extension** — Chrome extension to analyze articles while browsing
- [ ] **Multi-Language Support** — Analyze articles in Hindi, Spanish, and other languages
- [ ] **Social Media Integration** — Analyze tweets and Facebook posts
- [ ] **API Rate Limit Dashboard** — Show remaining API calls per source
- [ ] **Export Reports** — Download analysis results as PDF

---

## License

This project is for educational and research purposes. The NLP analysis provides heuristic assessments and should not be considered definitive fact-checking. Always verify information through multiple reputable sources.

---

Built with ❤️ using Next.js, React, and Recharts
