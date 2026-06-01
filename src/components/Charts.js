'use client';

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const COLORS = {
  real: '#00e676',
  fake: '#ff1744',
  suspicious: '#ffab00',
  primary: '#00d4ff',
  secondary: '#7b2ff7',
};

const PIE_COLORS = ['#00e676', '#ff1744', '#ffab00'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label || payload[0]?.name}</p>
        {payload.map((item, index) => (
          <p key={index} style={{ color: item.color || item.fill }}>
            {item.name || item.dataKey}: <strong>{item.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function DistributionPieChart({ stats }) {
  const data = [
    { name: 'Real', value: stats.real, color: COLORS.real },
    { name: 'Fake', value: stats.fake, color: COLORS.fake },
    { name: 'Suspicious', value: stats.suspicious, color: COLORS.suspicious },
  ].filter(d => d.value > 0);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        <span className="chart-icon">📊</span>
        News Classification Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={110}
            innerRadius={55}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={1200}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span style={{ color: '#b0b8d1', fontSize: '13px' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBarChart({ stats }) {
  const data = Object.entries(stats.categoryBreakdown || {}).map(([category, counts]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    Real: counts.real || 0,
    Fake: counts.fake || 0,
    Suspicious: counts.suspicious || 0,
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        <span className="chart-icon">📈</span>
        Analysis by Category
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2044" />
          <XAxis dataKey="name" tick={{ fill: '#8892b0', fontSize: 12 }} axisLine={{ stroke: '#1a2044' }} />
          <YAxis tick={{ fill: '#8892b0', fontSize: 12 }} axisLine={{ stroke: '#1a2044' }} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(value) => <span style={{ color: '#b0b8d1', fontSize: '13px' }}>{value}</span>} />
          <Bar dataKey="Real" fill={COLORS.real} radius={[4, 4, 0, 0]} animationDuration={1200} />
          <Bar dataKey="Fake" fill={COLORS.fake} radius={[4, 4, 0, 0]} animationDuration={1200} />
          <Bar dataKey="Suspicious" fill={COLORS.suspicious} radius={[4, 4, 0, 0]} animationDuration={1200} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScoreDistributionChart({ stats }) {
  const data = (stats.scoreDistribution || []).map(item => ({
    ...item,
    name: item.range,
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        <span className="chart-icon">📉</span>
        Credibility Score Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.fake} />
              <stop offset="50%" stopColor={COLORS.suspicious} />
              <stop offset="100%" stopColor={COLORS.real} />
            </linearGradient>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.4} />
              <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2044" />
          <XAxis dataKey="name" tick={{ fill: '#8892b0', fontSize: 12 }} axisLine={{ stroke: '#1a2044' }} />
          <YAxis tick={{ fill: '#8892b0', fontSize: 12 }} axisLine={{ stroke: '#1a2044' }} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke={COLORS.primary}
            fill="url(#areaFill)"
            strokeWidth={2}
            name="Articles"
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SourceCredibilityChart({ stats }) {
  const data = Object.entries(stats.sourceBreakdown || {})
    .map(([source, info]) => ({
      name: source.length > 18 ? source.substring(0, 16) + '...' : source,
      fullName: source,
      score: info.avgScore,
      articles: info.total,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const getBarColor = (score) => {
    if (score >= 70) return COLORS.real;
    if (score >= 45) return COLORS.suspicious;
    return COLORS.fake;
  };

  return (
    <div className="chart-container full-width">
      <h3 className="chart-title">
        <span className="chart-icon">🏢</span>
        Source Credibility Ranking
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2044" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#8892b0', fontSize: 12 }} axisLine={{ stroke: '#1a2044' }} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#b0b8d1', fontSize: 12 }} axisLine={{ stroke: '#1a2044' }} width={100} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="chart-tooltip">
                    <p className="tooltip-label">{d.fullName}</p>
                    <p style={{ color: getBarColor(d.score) }}>Score: <strong>{d.score}/100</strong></p>
                    <p style={{ color: '#8892b0' }}>Articles: <strong>{d.articles}</strong></p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="score"
            radius={[0, 4, 4, 0]}
            animationDuration={1200}
            name="Credibility"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const SENTIMENT_COLORS = ['#00e676', '#00d4ff', '#ff1744'];

export function SentimentChart({ stats }) {
  const dist = stats.sentimentDist || { Positive: 0, Neutral: 0, Negative: 0 };
  const data = [
    { name: 'Positive', value: dist.Positive, color: '#00e676' },
    { name: 'Neutral', value: dist.Neutral, color: '#00d4ff' },
    { name: 'Negative', value: dist.Negative, color: '#ff1744' },
  ].filter(d => d.value > 0);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        <span className="chart-icon">😊</span>
        Sentiment Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={110}
            innerRadius={55}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={1200}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span style={{ color: '#b0b8d1', fontSize: '13px' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

