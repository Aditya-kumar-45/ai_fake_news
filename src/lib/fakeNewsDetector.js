/**
 * Advanced AI Fake News Detection Engine v2.0
 * 
 * Multi-dimensional credibility analysis:
 * 1. Sentiment Analysis — emotional tone detection
 * 2. Bias Detection — political/commercial bias indicators
 * 3. Subjectivity Score — opinion vs fact ratio
 * 4. Readability Analysis — complexity & professionalism
 * 5. Propaganda Detection — loaded language, fallacies
 * 6. Headline-Content Alignment — misleading headline detection
 * 7. Source Credibility — reputation scoring
 * 8. Content Quality — structural integrity
 */

// ==================== DATA DICTIONARIES ====================

const REPUTABLE_SOURCES = [
  'bbc', 'reuters', 'associated press', 'ap news', 'the guardian',
  'the new york times', 'washington post', 'npr', 'pbs', 'al jazeera',
  'the economist', 'bloomberg', 'financial times', 'the wall street journal',
  'abc news', 'cbs news', 'nbc news', 'cnn', 'usa today', 'time',
  'nature', 'science', 'national geographic', 'the hindu', 'times of india',
  'ndtv', 'india today', 'cnbc', 'bbc news', 'space.com', 'space',
  'techcrunch', 'wired', 'the verge', 'ars technica', 'politico',
  'yahoo finance', 'yahoo entertainment', 'business insider', 'forbes',
  'fox news', 'the atlantic', 'new yorker', 'wsj', 'jalopnik', 'engadget'
];

const QUESTIONABLE_SOURCES = [
  'the onion', 'babylon bee', 'daily mash', 'clickhole',
  'world news daily report', 'empire news', 'national report', 'huzlers',
  'infowars', 'natural news', 'beforeitsnews', 'yournewswire'
];

const POSITIVE_WORDS = [
  'achievement', 'success', 'breakthrough', 'progress', 'growth', 'improve',
  'benefit', 'gain', 'advance', 'milestone', 'innovation', 'opportunity',
  'optimistic', 'confident', 'praised', 'celebrated', 'thriving', 'boost',
  'recovery', 'strong', 'surged', 'soared', 'upgraded', 'positive',
  'remarkable', 'excellent', 'impressive', 'promising', 'exciting'
];

const NEGATIVE_WORDS = [
  'crisis', 'crash', 'collapse', 'decline', 'threat', 'danger', 'risk',
  'warning', 'fear', 'concern', 'struggle', 'suffer', 'fail', 'loss',
  'damage', 'hurt', 'harm', 'plunge', 'slump', 'tumble', 'drop',
  'worry', 'anxiety', 'alarm', 'panic', 'turmoil', 'chaos', 'conflict',
  'killed', 'dead', 'death', 'attack', 'violence', 'war', 'bomb',
  'explosion', 'setback', 'crushing', 'stranded', 'disrupted'
];

const OPINION_MARKERS = [
  'i think', 'i believe', 'in my opinion', 'arguably', 'perhaps',
  'it seems', 'apparently', 'supposedly', 'might be', 'could be',
  'should be', 'ought to', 'clearly', 'obviously', 'undoubtedly',
  'without doubt', 'needless to say', 'frankly', 'honestly',
  'personally', 'in my view', 'from my perspective'
];

const FACTUAL_MARKERS = [
  'according to', 'data shows', 'research indicates', 'study found',
  'statistics show', 'reported by', 'confirmed by', 'published in',
  'peer-reviewed', 'evidence suggests', 'analysis reveals', 'survey found',
  'percent', '%', 'million', 'billion', 'quarterly', 'annually',
  'year-over-year', 'estimated', 'measured', 'calculated'
];

const BIAS_INDICATORS = {
  political_left: ['progressive', 'social justice', 'inequality', 'systemic', 'marginalized', 'equity', 'inclusive'],
  political_right: ['patriot', 'freedom fighter', 'traditional values', 'radical left', 'socialist agenda', 'woke'],
  commercial: ['buy now', 'limited time', 'exclusive deal', 'act fast', 'don\'t miss', 'subscribe', 'discount'],
  sensational: ['shocking', 'bombshell', 'explosive', 'devastating', 'nightmare', 'horrifying', 'terrifying']
};

const PROPAGANDA_TECHNIQUES = [
  { name: 'Appeal to Fear', patterns: [/fear/i, /terrif/i, /nightmare/i, /dread/i, /horrif/i], weight: 8 },
  { name: 'Loaded Language', patterns: [/destroy/i, /annihilate/i, /evil/i, /corrupt/i, /sinister/i, /betrayal/i], weight: 10 },
  { name: 'Ad Hominem', patterns: [/stupid/i, /idiot/i, /fool/i, /moron/i, /incompetent/i], weight: 8 },
  { name: 'False Urgency', patterns: [/act now/i, /before it'?s too late/i, /emergency/i, /urgent/i, /immediately/i], weight: 7 },
  { name: 'Conspiracy Framing', patterns: [/deep state/i, /cover.?up/i, /they don'?t want/i, /wake up/i, /sheeple/i, /big pharma/i], weight: 12 },
  { name: 'Bandwagon', patterns: [/everyone knows/i, /everybody agrees/i, /no one denies/i, /the people demand/i], weight: 5 },
  { name: 'Black & White', patterns: [/either.*or/i, /you'?re either with us or against/i, /only option/i, /no choice/i], weight: 6 },
  { name: 'Straw Man', patterns: [/they want you to believe/i, /liberals think/i, /conservatives think/i], weight: 6 },
  { name: 'Appeal to Authority', patterns: [/experts say/i, /scientists agree/i, /doctors confirm/i], weight: 3 },
];

const CLICKBAIT_PATTERNS = [
  /you won'?t believe/i, /what happens next/i, /doctors hate/i,
  /one weird trick/i, /shocking[!]*$/i, /exposed[!]*$/i,
  /will blow your mind/i, /they don'?t want you to know/i,
  /secret.*(revealed|exposed)/i, /\d+ reasons why/i,
  /number \d+ will/i, /this is (?:not )?a drill/i
];

// ==================== MAIN ANALYSIS ====================

export function analyzeArticle(article) {
  const title = article.title || '';
  const description = article.description || '';
  const content = article.content || '';
  const source = (article.source || '').toLowerCase();
  const author = article.author || '';
  const fullText = `${title} ${description} ${content}`;

  // Run all 8 analysis dimensions
  const sentiment = analyzeSentiment(fullText);
  const bias = analyzeBias(fullText);
  const subjectivity = analyzeSubjectivity(fullText);
  const readability = analyzeReadability(fullText);
  const propaganda = analyzePropaganda(fullText);
  const alignment = analyzeHeadlineAlignment(title, description, content);
  const sourceScore = analyzeSource(source, article.url);
  const quality = analyzeContentQuality(article);

  // Weighted composite credibility score
  const weights = {
    sentiment: 0.08,
    bias: 0.12,
    subjectivity: 0.10,
    readability: 0.08,
    propaganda: 0.20,
    alignment: 0.12,
    source: 0.18,
    quality: 0.12
  };

  const compositeScore = Math.round(
    sentiment.credibilityImpact * weights.sentiment +
    bias.score * weights.bias +
    subjectivity.score * weights.subjectivity +
    readability.score * weights.readability +
    propaganda.score * weights.propaganda +
    alignment.score * weights.alignment +
    sourceScore.score * weights.source +
    quality.score * weights.quality
  );

  // Classification with nuanced thresholds
  let classification, confidence;
  if (compositeScore >= 72) {
    classification = 'REAL';
    confidence = Math.min(99, 60 + Math.round((compositeScore - 72) * 1.4));
  } else if (compositeScore >= 45) {
    classification = 'SUSPICIOUS';
    confidence = Math.round(50 + Math.abs(compositeScore - 58));
  } else {
    classification = 'FAKE';
    confidence = Math.min(99, 60 + Math.round((45 - compositeScore) * 1.5));
  }

  // Collect all flags from each dimension
  const flags = [
    ...sentiment.flags,
    ...bias.flags,
    ...subjectivity.flags,
    ...propaganda.flags,
    ...alignment.flags,
    ...sourceScore.flags,
    ...quality.flags
  ];

  return {
    credibilityScore: compositeScore,
    classification,
    confidence,
    breakdown: {
      sentiment: {
        score: sentiment.credibilityImpact,
        weight: weights.sentiment,
        label: '😊 Sentiment Analysis',
        detail: sentiment.label,
        positiveRatio: sentiment.positiveRatio,
        negativeRatio: sentiment.negativeRatio,
        tone: sentiment.tone
      },
      bias: {
        score: bias.score,
        weight: weights.bias,
        label: '⚖️ Bias Detection',
        detail: bias.detail,
        types: bias.types
      },
      subjectivity: {
        score: subjectivity.score,
        weight: weights.subjectivity,
        label: '📐 Objectivity',
        detail: subjectivity.detail,
        opinionRatio: subjectivity.opinionRatio,
        factRatio: subjectivity.factRatio
      },
      readability: {
        score: readability.score,
        weight: weights.readability,
        label: '📖 Readability',
        detail: readability.detail,
        level: readability.level,
        avgSentenceLength: readability.avgSentenceLength
      },
      propaganda: {
        score: propaganda.score,
        weight: weights.propaganda,
        label: '🎭 Propaganda Check',
        detail: propaganda.detail,
        techniques: propaganda.techniques
      },
      alignment: {
        score: alignment.score,
        weight: weights.alignment,
        label: '🔗 Headline Accuracy',
        detail: alignment.detail
      },
      source: {
        score: sourceScore.score,
        weight: weights.source,
        label: '🏢 Source Credibility',
        detail: sourceScore.detail
      },
      quality: {
        score: quality.score,
        weight: weights.quality,
        label: '📝 Content Quality',
        detail: quality.detail
      }
    },
    flags
  };
}

// ==================== DIMENSION 1: SENTIMENT ====================

function analyzeSentiment(text) {
  const words = text.toLowerCase().split(/\s+/);
  const totalWords = Math.max(words.length, 1);

  let positiveCount = 0;
  let negativeCount = 0;

  for (const word of words) {
    const clean = word.replace(/[^a-z]/g, '');
    if (POSITIVE_WORDS.includes(clean)) positiveCount++;
    if (NEGATIVE_WORDS.includes(clean)) negativeCount++;
  }

  const positiveRatio = positiveCount / totalWords;
  const negativeRatio = negativeCount / totalWords;
  const sentimentBalance = positiveRatio - negativeRatio;

  let tone, label, credibilityImpact;
  const flags = [];

  if (Math.abs(sentimentBalance) < 0.01) {
    tone = 'Neutral';
    label = 'Balanced, neutral tone';
    credibilityImpact = 80;
  } else if (sentimentBalance > 0.03) {
    tone = 'Positive';
    label = 'Predominantly positive tone';
    credibilityImpact = sentimentBalance > 0.06 ? 55 : 70;
    if (sentimentBalance > 0.06) flags.push({ type: 'warning', message: 'Overly positive — may indicate promotional content' });
  } else if (sentimentBalance > 0) {
    tone = 'Slightly Positive';
    label = 'Mildly positive tone';
    credibilityImpact = 75;
  } else if (sentimentBalance > -0.03) {
    tone = 'Slightly Negative';
    label = 'Mildly negative tone';
    credibilityImpact = 70;
  } else {
    tone = 'Negative';
    label = 'Predominantly negative tone';
    credibilityImpact = negativeRatio > 0.06 ? 50 : 65;
    if (negativeRatio > 0.06) flags.push({ type: 'warning', message: 'Highly negative — may use fear to manipulate' });
  }

  return { tone, label, credibilityImpact, positiveRatio: Math.round(positiveRatio * 100), negativeRatio: Math.round(negativeRatio * 100), flags };
}

// ==================== DIMENSION 2: BIAS ====================

function analyzeBias(text) {
  const lowerText = text.toLowerCase();
  let score = 85;
  const detectedTypes = [];
  const flags = [];

  for (const [biasType, words] of Object.entries(BIAS_INDICATORS)) {
    let count = 0;
    for (const word of words) {
      if (lowerText.includes(word)) count++;
    }
    if (count >= 2) {
      const label = biasType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      detectedTypes.push(label);
      score -= count * 6;
    }
  }

  if (detectedTypes.length === 0) {
    return { score: Math.max(0, Math.min(100, score)), detail: 'No significant bias detected', types: [], flags };
  }

  if (score < 50) flags.push({ type: 'warning', message: `Potential bias: ${detectedTypes.join(', ')}` });

  return {
    score: Math.max(0, Math.min(100, score)),
    detail: `Detected: ${detectedTypes.join(', ')}`,
    types: detectedTypes,
    flags
  };
}

// ==================== DIMENSION 3: SUBJECTIVITY ====================

function analyzeSubjectivity(text) {
  const lowerText = text.toLowerCase();
  let opinionCount = 0;
  let factCount = 0;

  for (const marker of OPINION_MARKERS) {
    const regex = new RegExp(marker, 'gi');
    const matches = text.match(regex);
    if (matches) opinionCount += matches.length;
  }

  for (const marker of FACTUAL_MARKERS) {
    const regex = new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    if (matches) factCount += matches.length;
  }

  const total = Math.max(opinionCount + factCount, 1);
  const factRatio = factCount / total;
  const opinionRatio = opinionCount / total;

  let score, detail;
  const flags = [];

  if (factRatio > 0.7) {
    score = 90;
    detail = 'Highly factual — data-driven reporting';
  } else if (factRatio > 0.4) {
    score = 75;
    detail = 'Mostly factual with some opinion';
  } else if (opinionRatio > 0.7) {
    score = 40;
    detail = 'Heavily opinion-based content';
    flags.push({ type: 'info', message: 'Article is primarily opinion-based' });
  } else if (opinionCount === 0 && factCount === 0) {
    score = 60;
    detail = 'Neutral — limited factual markers';
  } else {
    score = 55;
    detail = 'Mixed factual and opinion content';
  }

  return {
    score, detail,
    opinionRatio: Math.round(opinionRatio * 100),
    factRatio: Math.round(factRatio * 100),
    flags
  };
}

// ==================== DIMENSION 4: READABILITY ====================

function analyzeReadability(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const totalSentences = Math.max(sentences.length, 1);
  const totalWords = Math.max(words.length, 1);

  const avgSentenceLength = Math.round(totalWords / totalSentences);
  const longWords = words.filter(w => w.replace(/[^a-zA-Z]/g, '').length > 6).length;
  const longWordRatio = longWords / totalWords;

  // Simplified Fog-like index
  const complexity = avgSentenceLength + (longWordRatio * 100);

  let score, level, detail;

  if (complexity >= 25 && complexity <= 50) {
    score = 85;
    level = 'Professional';
    detail = 'Professional-grade writing quality';
  } else if (complexity > 50) {
    score = 70;
    level = 'Academic';
    detail = 'Complex academic-level writing';
  } else if (complexity >= 15) {
    score = 75;
    level = 'Standard';
    detail = 'Standard readability level';
  } else {
    score = 50;
    level = 'Simple';
    detail = 'Very simple writing — may lack depth';
  }

  return { score, level, detail, avgSentenceLength, flags: [] };
}

// ==================== DIMENSION 5: PROPAGANDA ====================

function analyzePropaganda(text) {
  let score = 100;
  const detectedTechniques = [];
  const flags = [];

  for (const technique of PROPAGANDA_TECHNIQUES) {
    let found = false;
    for (const pattern of technique.patterns) {
      if (pattern.test(text)) {
        found = true;
        break;
      }
    }
    if (found) {
      detectedTechniques.push(technique.name);
      score -= technique.weight;
    }
  }

  // Check clickbait patterns
  const title = text.substring(0, 200);
  let clickbaitHits = 0;
  for (const pattern of CLICKBAIT_PATTERNS) {
    if (pattern.test(title)) clickbaitHits++;
  }
  score -= clickbaitHits * 12;

  // Excessive caps
  const capsWords = text.split(/\s+/).filter(w => w.length > 3 && w === w.toUpperCase());
  if (capsWords.length > 3) {
    score -= capsWords.length * 3;
    detectedTechniques.push('Excessive Capitalization');
  }

  // Excessive exclamation
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations > 3) {
    score -= exclamations * 2;
    detectedTechniques.push('Excessive Punctuation');
  }

  score = Math.max(0, Math.min(100, score));

  let detail;
  if (detectedTechniques.length === 0) {
    detail = 'No propaganda techniques detected';
  } else if (detectedTechniques.length <= 2) {
    detail = `Minor: ${detectedTechniques.join(', ')}`;
    flags.push({ type: 'info', message: `Mild propaganda: ${detectedTechniques[0]}` });
  } else {
    detail = `${detectedTechniques.length} techniques found`;
    flags.push({ type: 'danger', message: `Multiple propaganda techniques (${detectedTechniques.length})` });
  }

  return { score, detail, techniques: detectedTechniques, flags };
}

// ==================== DIMENSION 6: HEADLINE ALIGNMENT ====================

function analyzeHeadlineAlignment(title, description, content) {
  if (!title || (!description && !content)) {
    return { score: 60, detail: 'Insufficient content for comparison', flags: [] };
  }

  const titleWords = extractKeywords(title);
  const bodyText = `${description} ${content}`.toLowerCase();
  const bodyWords = extractKeywords(`${description} ${content}`);

  if (titleWords.length === 0) {
    return { score: 60, detail: 'Unable to extract keywords', flags: [] };
  }

  // Check how many title keywords appear in body
  let matchCount = 0;
  for (const word of titleWords) {
    if (bodyText.includes(word)) matchCount++;
  }

  const matchRatio = matchCount / titleWords.length;
  const flags = [];

  let score, detail;
  if (matchRatio >= 0.7) {
    score = 90;
    detail = 'Headline accurately reflects content';
  } else if (matchRatio >= 0.4) {
    score = 70;
    detail = 'Headline partially matches content';
  } else if (matchRatio >= 0.2) {
    score = 45;
    detail = 'Headline may be misleading';
    flags.push({ type: 'warning', message: 'Headline-content mismatch detected' });
  } else {
    score = 25;
    detail = 'Headline does not match article content';
    flags.push({ type: 'danger', message: 'Misleading headline — content mismatch' });
  }

  return { score, detail, flags };
}

function extractKeywords(text) {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'it', 'its', 'not', 'from', 'how', 'what', 'which', 'who', 'whom',
    'their', 'there', 'then', 'than', 'more', 'most', 'some', 'any'
  ]);
  return text.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
}

// ==================== DIMENSION 7: SOURCE ====================

function analyzeSource(source, url) {
  const flags = [];

  for (const reputable of REPUTABLE_SOURCES) {
    if (source.includes(reputable)) {
      return { score: 88, detail: `Recognized reputable source`, flags };
    }
  }

  for (const questionable of QUESTIONABLE_SOURCES) {
    if (source.includes(questionable)) {
      flags.push({ type: 'danger', message: 'Known unreliable/satirical source' });
      return { score: 12, detail: `Known questionable source`, flags };
    }
  }

  // Check URL for suspicious patterns
  let score = 55;
  let detail = 'Unverified source — limited reputation data';

  if (url) {
    if (url.startsWith('https://')) score += 5;
    const suspiciousTLDs = ['.info', '.biz', '.click', '.xyz', '.top', '.buzz'];
    for (const tld of suspiciousTLDs) {
      if (url.includes(tld)) {
        score -= 15;
        detail = 'Suspicious domain extension';
        flags.push({ type: 'warning', message: `Suspicious domain: ${tld}` });
        break;
      }
    }
    // Check for known domain patterns
    if (url.includes('.com') || url.includes('.org') || url.includes('.edu') || url.includes('.gov')) {
      score += 5;
    }
  }

  return { score: Math.max(0, Math.min(100, score)), detail, flags };
}

// ==================== DIMENSION 8: CONTENT QUALITY ====================

function analyzeContentQuality(article) {
  let score = 40;
  const flags = [];

  // Author attribution
  if (article.author && article.author.trim().length > 0) score += 12;
  else flags.push({ type: 'info', message: 'No author attribution' });

  // Content length
  const contentLen = (article.content || '').length;
  if (contentLen > 1000) score += 15;
  else if (contentLen > 500) score += 12;
  else if (contentLen > 200) score += 8;
  else if (contentLen > 0) score += 4;
  else {
    score -= 5;
    flags.push({ type: 'info', message: 'Limited content available' });
  }

  // Has description
  if (article.description && article.description.length > 30) score += 8;

  // HTTPS
  if (article.url && article.url.startsWith('https://')) score += 5;

  // Has image
  if (article.urlToImage) score += 5;

  // Check for proper date
  if (article.publishedAt) {
    try {
      const date = new Date(article.publishedAt);
      const now = new Date();
      const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
      if (daysDiff >= 0 && daysDiff <= 7) score += 10;
      else if (daysDiff >= 0 && daysDiff <= 30) score += 5;
    } catch (e) { /* ignore */ }
  }

  // Multiple sentences in content (not just a snippet)
  const sentences = (article.content || '').split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length >= 5) score += 5;

  let detail;
  const finalScore = Math.max(0, Math.min(100, score));
  if (finalScore >= 80) detail = 'Well-structured, complete article';
  else if (finalScore >= 60) detail = 'Adequate content quality';
  else if (finalScore >= 40) detail = 'Limited content — may be truncated';
  else detail = 'Poor content quality';

  return { score: finalScore, detail, flags };
}

// ==================== TEXT ANALYSIS EXPORT ====================

export function analyzeText(text, title = '') {
  return analyzeArticle({
    title: title || text.substring(0, 100),
    description: text.substring(0, 300),
    content: text,
    source: 'user-submitted',
    author: '',
    url: ''
  });
}
