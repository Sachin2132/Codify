import React, { useEffect, useRef, useState } from 'react';
import { SiLeetcode, SiGeeksforgeeks, SiCodechef } from 'react-icons/si';

// ─── Platform config ──────────────────────────────────────────────────────────
const PLATFORM = {
  'LeetCode Stats':      { color:'#FFA116', spot:'rgba(255,161,22,0.07)',  cardCls:'card-lc',  Icon:SiLeetcode,       label:'LEETCODE' },
  'GeeksForGeeks Stats': { color:'#2DBE60', spot:'rgba(45,190,96,0.07)',   cardCls:'card-gfg', Icon:SiGeeksforgeeks,  label:'GEEKSFORGEEKS' },
  'CodeChef Stats':      { color:'#F97316', spot:'rgba(249,115,22,0.07)',  cardCls:'card-cc',  Icon:SiCodechef,       label:'CODECHEF' },
};

// ─── Rank badge ───────────────────────────────────────────────────────────────
const getRank = (n) => {
  if (n >= 500) return { badge:'EXPERT',       color:'#F59E0B', bg:'rgba(245,158,11,0.12)' };
  if (n >= 300) return { badge:'ADVANCED',     color:'#A78BFA', bg:'rgba(167,139,250,0.12)' };
  if (n >= 150) return { badge:'INTERMEDIATE', color:'#22C55E', bg:'rgba(34,197,94,0.12)' };
  if (n >= 50)  return { badge:'BEGINNER',     color:'#60A5FA', bg:'rgba(96,165,250,0.12)' };
  return               { badge:'ROOKIE',       color:'#9CA3AF', bg:'rgba(156,163,175,0.12)' };
};

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    const t = setTimeout(() => {
      let s = null;
      const dur = 1300;
      const f = (ts) => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / dur, 1);
        setVal(Math.round((1 - Math.pow(1 - p, 4)) * target));
        if (p < 1) requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return val;
}

// ─── Horizontal stat bar ──────────────────────────────────────────────────────
function StatBar({ label, value, total, color, delay }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  const animVal = useCountUp(value, delay);
  const [bw, setBw] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBw(pct), delay + 120);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color:`${color}88` }}>
          {label}
        </span>
        <div className="flex items-center gap-4">
          <span className="font-mono-num font-bold text-white text-sm tabular-nums">
            {animVal.toLocaleString()}
          </span>
          <span className="text-xs font-mono-num tabular-nums w-7 text-right" style={{ color:'rgba(255,255,255,0.25)' }}>
            {pct}%
          </span>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
        <div className="h-full rounded-full" style={{
          width:`${bw}%`,
          background:`linear-gradient(90deg,${color}66,${color})`,
          boxShadow:`0 0 8px ${color}55`,
          transition:'width 1.1s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard({ delay = 0 }) {
  return (
    <div className="glass-dark rounded-2xl overflow-hidden animate-fade-in"
      style={{ border:'1px solid rgba(255,255,255,0.07)', animationDelay:`${delay}s`, opacity:0 }}>
      <div className="p-6 pb-0">
        <div className="flex justify-between mb-6">
          <div className="skeleton h-5 w-28 rounded" />
          <div className="skeleton h-5 w-20 rounded" />
        </div>
        <div className="skeleton h-16 w-24 rounded-xl mb-1" />
        <div className="skeleton h-3 w-32 rounded mt-3 mb-8" />
      </div>
      <div className="px-6 pb-6 space-y-5">
        {[0,1,2].map(i => (
          <div key={i}>
            <div className="flex justify-between mb-2">
              <div className="skeleton h-3 w-12 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
            <div className="skeleton h-1.5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
export default function StatsCard({ title, stats, loading }) {
  const cfg = PLATFORM[title] || PLATFORM['LeetCode Stats'];
  const cardRef = useRef(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, on: false });

  if (loading) return <SkeletonCard />;
  if (!stats)  return null;

  const totalKey   = Object.keys(stats).find(k => k.toLowerCase().includes('total'));
  const otherKeys  = Object.keys(stats).filter(k => k !== totalKey);
  const totalValue = totalKey ? (stats[totalKey] || 0) : 0;
  const totalDisp  = useCountUp(totalValue, 100);
  const rank       = getRank(totalValue);

  const onMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setSpot({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={() => setSpot(s => ({ ...s, on: false }))}
      className={`glass-dark rounded-2xl overflow-hidden relative ${cfg.cardCls} transition-all duration-300`}
      style={{ borderTop: `2px solid ${cfg.color}` }}
    >
      {/* Platform watermark logo */}
      <div className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden"
        style={{ opacity: 0.035, lineHeight: 0, borderRadius: '0 0 16px 0' }}>
        <cfg.Icon size={160} style={{ color: cfg.color, display:'block' }} />
      </div>

      {/* Cursor spotlight */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ opacity: spot.on ? 1 : 0,
          background:`radial-gradient(500px circle at ${spot.x}px ${spot.y}px, ${cfg.spot}, transparent 65%)` }} />

      <div className="relative z-10 p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <cfg.Icon size={22} style={{ color: cfg.color, filter:`drop-shadow(0 0 6px ${cfg.color}99)` }} />
            <span className="font-black text-sm uppercase tracking-widest" style={{ color: cfg.color }}>
              {cfg.label}
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{ color: rank.color, background: rank.bg }}>
            {rank.badge}
          </span>
        </div>

        {/* Total */}
        {totalKey && (
          <div className="mb-8">
            <div className="font-mono-num font-bold leading-none mb-2"
              style={{ fontSize:'clamp(3rem,5vw,4rem)', color: cfg.color,
                textShadow:`0 0 40px ${cfg.color}60, 0 0 80px ${cfg.color}20` }}>
              {totalDisp.toLocaleString()}
            </div>
            <div className="text-xs uppercase tracking-widest font-bold"
              style={{ color:'rgba(255,255,255,0.25)' }}>
              {totalKey.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          </div>
        )}

        {/* Separator */}
        <div className="mb-6" style={{ height:1, background:`linear-gradient(90deg,${cfg.color}33,transparent)` }} />

        {/* Difficulty bars */}
        <div className="space-y-5">
          {otherKeys.map((key, i) => (
            <StatBar
              key={key}
              label={key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}
              value={stats[key] || 0}
              total={totalValue}
              color={cfg.color}
              delay={200 + i * 90}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
