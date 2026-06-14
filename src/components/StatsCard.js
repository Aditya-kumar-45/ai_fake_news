'use client';

import { useEffect, useState } from 'react';

export default function StatsCard({ icon, label, value, suffix, color, delay }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay || 0);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible || typeof value !== 'number') {
      // eslint-disable-next-line
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const end = value;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isVisible]);

  return (
    <div className={`stats-card ${isVisible ? 'visible' : ''}`} style={{ '--accent-color': color }}>
      <div className="stats-card-glow" style={{ background: `radial-gradient(circle at center, ${color}20, transparent 70%)` }}></div>
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-value">
        {displayValue}{suffix || ''}
      </div>
      <div className="stats-card-label">{label}</div>
    </div>
  );
}
