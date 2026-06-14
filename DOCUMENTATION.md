# 🔍 TruthLens — Complete Project Documentation

> **AI-Powered Fake News Detection System** — A full-stack Next.js 16 web application that aggregates news from 3 APIs, performs 8-dimensional NLP credibility analysis, and presents results through interactive dashboards.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [File Structure & Codebase Metrics](#4-file-structure--codebase-metrics)
5. [Source Files — Detailed Breakdown](#5-source-files--detailed-breakdown)
6. [8-Dimension Analysis Engine](#6-8-dimension-analysis-engine)
7. [API Endpoints](#7-api-endpoints)
8. [Frontend Components](#8-frontend-components)
9. [Design System & CSS](#9-design-system--css)
10. [Data Flow](#10-data-flow)
11. [Setup & Configuration](#11-setup--configuration)
12. [Future Enhancements](#12-future-enhancements)

---

## 1. Project Overview

**TruthLens** is a web application that helps users identify misinformation by:

1. **Fetching** real-time news from 3 independent API sources (NewsAPI, GNews, CurrentsAPI)
2. **Deduplicating** articles across sources to avoid repeats
3. **Cross-referencing** — stories found in multiple APIs get a credibility boost
4. **Analyzing** each article through an 8-dimension NLP credibility engine
5. **Visualizing** results via interactive charts and a filterable news feed
6. **Allowing** users to paste custom text for instant analysis

### Key Metrics

| Metric | Value |
|--------|-------|
| Total source files | 13 |
| Total lines of code | 2,850 |
| Total bytes | ~112 KB |
| React components | 5 |
| API routes | 2 |
| Library modules | 2 |
| Chart types | 5 |
| Analysis dimensions | 8 |

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | 16.2.6 | Server/client rendering, API routes |
| UI Library | React | 19.2.4 | Component-based UI |
| Charts | Recharts | 3.8.1 | Interactive data visualization |
| Styling | Vanilla CSS | — | Glassmorphism dark-mode design |
| Font | Inter (Google Fonts) | — | Typography |
| APIs | NewsAPI, GNews, CurrentsAPI | — | Real-time news data |
| Language | JavaScript ES2024 | — | Full-stack logic |

### Dependencies (package.json)
- **Production**: `next@16.2.6`, `react@19.2.4`, `react-dom@19.2.4`, `recharts@^3.8.1`
- **Dev**: `eslint@^9`, `eslint-config-next@16.2.6`

---

## 3. Architecture

```
┌─────────────────────────────────────────────┐
│            FRONTEND (React 19)              │
│                                             │
│  Header ─ StatsCard ─ Charts ─ AnalyzeForm  │
│  NewsCard (8D breakdown, pills, flags)      │
│                    │                        │
│              fetch('/api/...')               │
└────────────────────┼────────────────────────┘
                     │
┌────────────────────┼────────────────────────┐
│         BACKEND (Next.js API Routes)        │
│                    │                        │
│  GET /api/news ────┤                        │
│    ├─ NewsAPI.org  │  POST /api/analyze     │
│    ├─ GNews.io     │    └─ Custom text      │
│    └─ CurrentsAPI  │        analysis        │
│         │          │                        │
│    Deduplicate → Cross-reference            │
│         │                                   │
│    fakeNewsDetector.js (8-dim engine)        │
│         │                                   │
│    Return JSON { articles, stats }          │
└─────────────────────────────────────────────┘
```

---

## 4. File Structure & Codebase Metrics

```
ai_fake_news/
├── .env.local                    (9 lines)   API keys
├── package.json                  (22 lines)  Dependencies & scripts
├── next.config.mjs               (7 lines)   Next.js config (default)
├── README.md                     (538 lines) Existing docs
│
└── src/
    ├── app/
    │   ├── layout.js             (24 lines, 676B)    Root layout + SEO
    │   ├── page.js               (262 lines, 9.3KB)  Main dashboard
    │   ├── globals.css           (462 lines, 20.8KB) Full design system
    │   └── api/
    │       ├── news/route.js     (322 lines, 11.4KB) News fetch + analysis
    │       └── analyze/route.js  (42 lines, 1.0KB)   Custom text analysis
    │
    ├── components/
    │   ├── Header.js             (47 lines, 1.7KB)   Sticky header
    │   ├── StatsCard.js          (54 lines, 1.6KB)   Animated counters
    │   ├── NewsCard.js           (210 lines, 7.9KB)  Article card + 8D view
    │   ├── Charts.js             (281 lines, 10.1KB) 5 chart components
    │   └── AnalyzeForm.js        (223 lines, 8.9KB)  Custom text form
    │
    └── lib/
        ├── fakeNewsDetector.js   (629 lines, 21.7KB) NLP analysis engine
        └── newsChannels.js       (164 lines, 15.0KB) Categories + mock data
```

---

## 5. Source Files — Detailed Breakdown

### 5.1 `src/app/layout.js` — Root Layout (24 lines)

The Next.js root layout that wraps every page.

**What it does:**
- Imports the **Inter** font from Google Fonts via `next/font/google`
- Sets the CSS variable `--font-inter` for use throughout the app
- Exports SEO `metadata` (title, description, keywords)
- Renders children inside `<html>` and `<body>` tags

**Key exports:** `metadata` object with title `"TruthLens — AI Fake News Detection"`

---

### 5.2 `src/app/page.js` — Main Dashboard (262 lines)

The primary client component (`'use client'`) that orchestrates the entire dashboard.

**State variables (8 total):**

| State | Type | Purpose |
|-------|------|---------|
| `articles` | Array | Analyzed news articles |
| `stats` | Object | Aggregate statistics for charts |
| `loading` | Boolean | Loading spinner toggle |
| `activeCategory` | String | Selected news category tab |
| `categories` | Array | Available categories from API |
| `usingMockData` | Boolean | Whether demo mode is active |
| `activeSources` | Array | Which APIs returned data |
| `filterType` | String | Classification filter (all/real/fake/suspicious) |

**Sections rendered (in order):**
1. **Header** — Sticky nav component
2. **Hero** — Animated background with gradient orbs, title, demo/live badge
3. **Stats Dashboard** — 6 StatsCard components (total, credible, fake, suspicious, rate, avg score)
4. **Visual Analytics** — 5 chart components in a grid
5. **Analyze Form** — Custom text analysis
6. **News Feed** — Category tabs → filter buttons → article grid
7. **Footer** — Brand, disclaimer, copyright

**Key logic:**
- `fetchNews(category)` — calls `GET /api/news?category=X`, updates all state
- `useEffect` triggers fetch on category change
- `filteredArticles` — client-side filter by classification type

---

### 5.3 `src/app/globals.css` — Design System (462 lines)

Complete CSS design system with 22 CSS custom properties, organized into sections:

| Section | Lines | What it covers |
|---------|-------|----------------|
| Variables & Reset | 1-35 | 22 CSS vars, box-sizing reset, smooth scroll |
| Header | 37-78 | Sticky header, glassmorphism, nav links, live dot pulse |
| Hero | 80-107 | Floating orbs (3 animations), gradient text, badges |
| Sections | 109-116 | Section headers, titles, subtitles |
| Stats Cards | 118-142 | Grid layout, glow effect, fade-in animation |
| Charts | 144-166 | Chart containers, tooltip styling |
| Analyze Form | 168-217 | Form inputs, buttons, spinner, error display |
| Analyze Result | 219-253 | Score circle (conic-gradient), breakdown bars |
| News Feed | 255-283 | Category tabs (pill-shaped), filter bar |
| News Card | 287-350 | Card with left border, hover glow, expandable details |
| Insight Pills | 353-365 | Small round info badges |
| Cross-Reference | 367-374 | Green verification badge |
| Propaganda/Bias Tags | 390-407 | Red/yellow tag styling |
| Loading/Empty | 409-417 | Spinner, empty state |
| Footer | 419-436 | Footer with disclaimer box |
| Animations | 438-443 | `fadeInUp`, `fadeIn` keyframes |
| Responsive | 445-461 | Breakpoints at 900px and 600px |

---

### 5.4 `src/app/api/news/route.js` — News API (322 lines)

Server-side API route that fetches, processes, and analyzes news.

**Functions:**

| Function | Lines | Purpose |
|----------|-------|---------|
| `fetchFromNewsAPI(category)` | 16-42 | Fetch from newsapi.org `/v2/top-headlines` (20 articles) |
| `fetchFromGNews(category)` | 47-80 | Fetch from gnews.io `/v4/top-headlines` (10 articles) |
| `fetchFromCurrents(category)` | 85-118 | Fetch from currentsapi `/v1/latest-news` |
| `crossReferenceArticles(all)` | 123-154 | Compare titles across sources, 40% keyword overlap = match |
| `GET(request)` | 159-243 | Main handler — orchestrates entire pipeline |
| `deduplicateArticles(articles)` | 248-256 | Normalize titles, compare first 60 chars |
| `computeStats(articles)` | 258-321 | Aggregate stats for dashboard charts |

**Pipeline (in GET handler):**
1. `Promise.all()` — parallel fetch from all 3 APIs
2. Fallback to `MOCK_NEWS` if all APIs return empty
3. Filter out `[Removed]` and empty articles
4. Deduplicate by normalized title similarity
5. Cross-reference across sources
6. Run `analyzeArticle()` on each article
7. Apply cross-reference bonus (+4 per match, max +10)
8. Compute aggregate statistics
9. Return JSON response

**Response shape:**
```json
{
  "success": true,
  "articles": ["... analyzed articles ..."],
  "stats": { "total", "real", "fake", "suspicious", "avgCredibility", "..." },
  "categories": ["..."],
  "usingMockData": false,
  "activeSources": ["NewsAPI", "GNews"],
  "fetchedAt": "ISO timestamp"
}
```

---

### 5.5 `src/app/api/analyze/route.js` — Text Analysis API (42 lines)

Simple POST endpoint for custom text analysis.

**Validation:**
- Text is required and must be ≥ 10 characters
- Title is optional

**Flow:** Calls `analyzeText(text, title)` from the detector engine and returns the analysis JSON.

---

### 5.6 `src/lib/fakeNewsDetector.js` — NLP Engine (629 lines)

**The core of the project.** A heuristic NLP engine that scores articles across 8 independent dimensions.

**Data dictionaries defined (lines 17-93):**

| Dictionary | Size | Purpose |
|------------|------|---------|
| `REPUTABLE_SOURCES` | 40+ entries | Known trustworthy outlets (BBC, Reuters, NYT, etc.) |
| `QUESTIONABLE_SOURCES` | 12 entries | Known satire/unreliable sites (The Onion, Infowars, etc.) |
| `POSITIVE_WORDS` | 29 words | Positive sentiment indicators |
| `NEGATIVE_WORDS` | 39 words | Negative sentiment indicators |
| `OPINION_MARKERS` | 22 phrases | Subjective language patterns |
| `FACTUAL_MARKERS` | 20 phrases | Data/evidence language patterns |
| `BIAS_INDICATORS` | 4 categories | Political left, political right, commercial, sensational |
| `PROPAGANDA_TECHNIQUES` | 9 techniques | Each with regex patterns and weights |
| `CLICKBAIT_PATTERNS` | 12 regexes | Common clickbait headline patterns |

**Exported functions:**
- `analyzeArticle(article)` — Full 8-dimension analysis for article objects
- `analyzeText(text, title)` — Wrapper that creates a pseudo-article from raw text

---

### 5.7 `src/lib/newsChannels.js` — Categories & Mock Data (164 lines)

**Exports:**
- `NEWS_CATEGORIES` — 7 categories (general, technology, science, health, business, entertainment, sports) each with id, name, icon emoji, and color
- `NEWS_CHANNELS` — 8 source definitions (BBC, CNN, Al Jazeera, Guardian, Reuters, ABC, Times of India, Bloomberg)
- `MOCK_NEWS` — 12 mock articles (6 credible + 6 fake) for demo mode

The mock data is carefully crafted with credible examples (Reuters, Bloomberg, BBC, NDTV, Guardian, Al Jazeera) and fake examples (clickbait, miracle cures, conspiracy theories).

---

## 6. 8-Dimension Analysis Engine

Every article is scored across 8 independent dimensions (0-100 each), then combined with weighted averaging.

### Dimension Details

#### 1. 😊 Sentiment Analysis (Weight: 8%)
- Counts positive/negative word matches, calculates ratio
- Neutral=80, Slightly Positive=75, Positive=70/55, Slightly Negative=70, Negative=65/50
- Flags overly positive (promotional) or highly negative (fear-based) content

#### 2. ⚖️ Bias Detection (Weight: 12%)
- Scans for 4 bias categories (political left/right, commercial, sensational)
- Starts at 85, deducts 6 per bias indicator found (≥2 per category to trigger)

#### 3. 📐 Objectivity/Subjectivity (Weight: 10%)
- Counts opinion markers vs factual markers, calculates ratios
- Highly factual (>70% facts)=90, Mostly factual=75, Heavily opinion-based=40

#### 4. 📖 Readability (Weight: 8%)
- Simplified Fog-like index using avg sentence length + long word ratio
- Levels: Professional (85), Academic (70), Standard (75), Simple (50)

#### 5. 🎭 Propaganda Detection (Weight: 20% — highest weight)
- 9 Techniques: Appeal to Fear, Loaded Language, Ad Hominem, False Urgency, Conspiracy Framing, Bandwagon, Black & White, Straw Man, Appeal to Authority
- Plus clickbait patterns, excessive caps/punctuation

#### 6. 🔗 Headline Accuracy (Weight: 12%)
- Extracts keywords from title, checks overlap with body text
- ≥70% match=90, ≥40%=70, ≥20%=45, <20%=25

#### 7. 🏢 Source Credibility (Weight: 18%)
- 40+ reputable sources → 88, 12 questionable sources → 12
- Unknown sources: checks HTTPS, suspicious TLDs, standard domains

#### 8. 📝 Content Quality (Weight: 12%)
- Additive scoring: author (+12), content length (+4 to +15), description (+8), HTTPS (+5), image (+5), recent date (+5/+10), sentences (+5)

### Classification Thresholds

| Composite Score | Classification |
|----------------|---------------|
| 72-100 | ✅ REAL |
| 45-71 | ⚠️ SUSPICIOUS |
| 0-44 | ❌ FAKE |

---

## 7. API Endpoints

### `GET /api/news?category=general`

Returns analyzed articles with stats. Query param `category` accepts: general, technology, science, health, business, entertainment, sports.

### `POST /api/analyze`

Accepts `{ "text": "...", "title": "..." }` and returns full 8-dimension analysis.

---

## 8. Frontend Components

### Header.js (47 lines)
Sticky glassmorphism header with SVG logo, gradient text, nav links, pulsing live indicator.

### StatsCard.js (54 lines)
Animated counter cards with cubic ease-out animation, staggered entrance, radial glow.

### NewsCard.js (210 lines)
Full article card: source badge, timestamp, classification badge, description, cross-reference badge, score bar, insight pills, flags, expandable 8D breakdown with propaganda/bias tags.

### Charts.js (281 lines)
5 Recharts components: DistributionPieChart, CategoryBarChart, ScoreDistributionChart, SentimentChart, SourceCredibilityChart.

### AnalyzeForm.js (223 lines)
Custom text analysis form with example loaders, loading state, and full result display with score circle and 8D breakdown.

---

## 9. Design System

### Color Palette
- Background: `#0a0e27` (primary), `#0f1535` (secondary)
- Accents: `#00d4ff` (cyan), `#7b2ff7` (purple), `#00e676` (green), `#ff1744` (red), `#ffab00` (yellow)
- Text: `#e8eaf6` (primary), `#8892b0` (secondary), `#5a6380` (muted)

### Effects
- Glassmorphism: `backdrop-filter: blur(12px)`
- Gradient: `linear-gradient(135deg, #00d4ff, #7b2ff7)`
- 6 CSS animations: pulse, float1/2/3, spin, fadeInUp, fadeIn

### Responsive: Breakpoints at 900px and 600px

---

## 10. Data Flow

```
User → page.js useEffect → GET /api/news
  → Parallel fetch (3 APIs) → Deduplicate → Cross-reference
  → 8-dimension analysis × N articles → Cross-ref bonus
  → computeStats() → JSON response
  → React renders: Stats → Charts → News Feed
```

---

## 11. Setup

```bash
cd ai_fake_news
npm install
# Add API keys to .env.local
npm run dev  # http://localhost:3000
```

**Environment Variables:**
- `NEWS_API_KEY` — newsapi.org (required, 1000 req/day free)
- `GNEWS_API_KEY` — gnews.io (optional, 100 req/day free)
- `CURRENTS_API_KEY` — currentsapi.services (optional, free tier)

No keys? App runs in **Demo Mode** with 12 built-in mock articles.

---

## 12. Future Enhancements

- ML-Based Classification (TF.js)
- User Reporting system
- Historical trend tracking
- Browser extension
- Multi-language support
- Social media analysis
- API rate limit dashboard
- PDF report export

---

> **Disclaimer:** Heuristic NLP analysis for educational purposes. Not definitive fact-checking.

*Built with Next.js 16, React 19, Recharts • 2,850 lines across 13 files*
