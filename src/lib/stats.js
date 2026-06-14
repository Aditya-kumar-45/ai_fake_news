export function computeStats(articles) {
  const analyzedArticles = articles.filter(a => a.analysis);
  const total = analyzedArticles.length;
  
  if (total === 0) {
    return {
      total: 0, real: 0, fake: 0, suspicious: 0, avgCredibility: 0,
      realPercentage: 0, fakePercentage: 0,
      categoryBreakdown: {}, sourceBreakdown: {}, scoreDistribution: [], sentimentDist: { Positive: 0, Neutral: 0, Negative: 0 }
    };
  }

  const real = analyzedArticles.filter(a => a.analysis.classification === 'REAL').length;
  const fake = analyzedArticles.filter(a => a.analysis.classification === 'FAKE').length;
  const suspicious = analyzedArticles.filter(a => a.analysis.classification === 'SUSPICIOUS').length;

  const avgCredibility = Math.round(analyzedArticles.reduce((sum, a) => sum + a.analysis.credibilityScore, 0) / total);

  // Category breakdown
  const categoryBreakdown = {};
  analyzedArticles.forEach(article => {
    const cat = article.category || 'general';
    if (!categoryBreakdown[cat]) {
      categoryBreakdown[cat] = { 
        total: 0, real: 0, fake: 0, suspicious: 0,
        sentiment: { Positive: 0, Neutral: 0, Negative: 0 }
      };
    }
    categoryBreakdown[cat].total++;
    categoryBreakdown[cat][article.analysis.classification.toLowerCase()]++;
    
    const tone = article.analysis.breakdown?.sentiment?.tone || 'Neutral';
    if (tone.includes('Positive')) categoryBreakdown[cat].sentiment.Positive++;
    else if (tone.includes('Negative')) categoryBreakdown[cat].sentiment.Negative++;
    else categoryBreakdown[cat].sentiment.Neutral++;
  });

  // Source breakdown
  const sourceBreakdown = {};
  analyzedArticles.forEach(article => {
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
    { range: '0-20', count: analyzedArticles.filter(a => a.analysis.credibilityScore <= 20).length, label: 'Very Low' },
    { range: '21-40', count: analyzedArticles.filter(a => a.analysis.credibilityScore > 20 && a.analysis.credibilityScore <= 40).length, label: 'Low' },
    { range: '41-60', count: analyzedArticles.filter(a => a.analysis.credibilityScore > 40 && a.analysis.credibilityScore <= 60).length, label: 'Medium' },
    { range: '61-80', count: analyzedArticles.filter(a => a.analysis.credibilityScore > 60 && a.analysis.credibilityScore <= 80).length, label: 'High' },
    { range: '81-100', count: analyzedArticles.filter(a => a.analysis.credibilityScore > 80).length, label: 'Very High' },
  ];

  // Sentiment distribution (new)
  const sentimentDist = { Positive: 0, Neutral: 0, Negative: 0 };
  analyzedArticles.forEach(a => {
    const tone = a.analysis.breakdown?.sentiment?.tone || 'Neutral';
    if (tone.includes('Positive')) sentimentDist.Positive++;
    else if (tone.includes('Negative')) sentimentDist.Negative++;
    else sentimentDist.Neutral++;
  });

  return {
    total, real, fake, suspicious, avgCredibility,
    realPercentage: Math.round((real / total) * 100),
    fakePercentage: Math.round((fake / total) * 100),
    categoryBreakdown, sourceBreakdown, scoreDistribution, sentimentDist
  };
}
