import React, { useState, useEffect, useRef } from 'react';
import StatsCard from './components/StatsCard';
import { SiLeetcode, SiGeeksforgeeks, SiCodechef } from 'react-icons/si';
import { HiOutlineLightningBolt } from 'react-icons/hi';

const CACHE_KEY = 'devstats_cache';
const CACHE_TTL_MS = 30 * 60 * 1000;
const UN_KEY = 'devstats_usernames';

function timeAgo(ts) {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  return `${Math.floor(d / 3600)}h ago`;
}
function getTotal(s) {
  if (!s) return 0;
  const k = Object.keys(s).find(k => k.toLowerCase().includes('total'));
  return k ? s[k] || 0 : 0;
}
function useCountUp(target, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    const t = setTimeout(() => {
      let s = null; const dur = 1800;
      const f = (ts) => { if (!s) s = ts; const p = Math.min((ts - s) / dur, 1); setVal(Math.round((1 - Math.pow(1 - p, 4)) * target)); if (p < 1) requestAnimationFrame(f); };
      requestAnimationFrame(f);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return val;
}

// ── Grain noise overlay ───────────────────────────────────────────────────────
function Grain() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999, pointerEvents: 'none', opacity: 0.038,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
    }} />
  );
}

// ── Aurora floating orbs ──────────────────────────────────────────────────────
function Aurora() {
  const orbs = [
    { w: 750, h: 750, top: '-200px', right: '-200px', color: 'rgba(255,161,22,0.12)', anim: 'drift  30s ease-in-out infinite', blur: 'blur(70px)' },
    { w: 600, h: 600, top: '30%', left: '-200px', color: 'rgba(45,190,96,0.10)', anim: 'drift2 38s ease-in-out infinite', blur: 'blur(75px)' },
    { w: 500, h: 500, bottom: '-80px', right: '10%', color: 'rgba(120,80,220,0.09)', anim: 'drift3 24s ease-in-out infinite', blur: 'blur(80px)' },
    { w: 400, h: 400, top: '55%', right: '-100px', color: 'rgba(249,115,22,0.07)', anim: 'drift  44s ease-in-out infinite reverse', blur: 'blur(65px)' },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {orbs.map((o, i) => (
        <div key={i} style={{
          position: 'absolute', width: o.w, height: o.h, borderRadius: '50%',
          background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
          top: o.top, bottom: o.bottom, left: o.left, right: o.right,
          animation: o.anim, filter: o.blur,
        }} />
      ))}
    </div>
  );
}

// ── Dot grid ──────────────────────────────────────────────────────────────────
function DotGrid() {
  return (
    <div className="dot-grid" style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.4,
    }} />
  );
}

// ── Floating particles (canvas) ───────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialise particles
    const count = 28;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.08),
      a: Math.random() * 0.35 + 0.08,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap around edges
        if (p.y < -4) p.y = canvas.height + 4;
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} />;
}

// ── Platform input ────────────────────────────────────────────────────────────
function PInput({ label, hint, value, onChange, color, focusCls, Icon }) {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
        style={{ color: `${color}99` }}>
        <Icon size={11} style={{ color }} /> {label}
      </label>
      <input
        type="text" placeholder={hint} value={value}
        onChange={onChange}
        className={`glass rounded-xl px-4 py-4 text-white font-mono text-sm placeholder-zinc-700 transition-all duration-200 ${focusCls}`}
        style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
      />
    </div>
  );
}

// ── Combined banner ───────────────────────────────────────────────────────────
function Banner({ data }) {
  const lc = getTotal(data?.leetCodeStats);
  const gfg = getTotal(data?.gfgStats);
  const cc = getTotal(data?.codeChefStats);
  const grand = useCountUp(lc + gfg + cc, 0);

  return (
    <div className="animate-card-in stagger-2 glass-dark rounded-2xl p-8 mb-8"
      style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 60px rgba(255,161,22,0.05), 0 30px 70px rgba(0,0,0,0.6)' }}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        {/* Grand total */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,161,22,0.6)' }}>
            ⚡ Combined across all platforms
          </p>
          <div className="font-mono-num font-bold leading-none mb-2"
            style={{
              fontSize: 'clamp(3.5rem,9vw,6rem)',
              background: 'linear-gradient(135deg,#FFA116 0%,#fff 50%,#2DBE60 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(255,161,22,0.25))',
            }}>
            {grand.toLocaleString()}
          </div>
          <p className="text-xs uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Total Problems Solved
          </p>
        </div>

        {/* Platform chips */}
        <div className="flex flex-wrap gap-3">
          {[
            { Icon: SiLeetcode, label: 'LeetCode', val: lc, color: '#FFA116' },
            { Icon: SiGeeksforgeeks, label: 'GFG', val: gfg, color: '#2DBE60' },
            { Icon: SiCodechef, label: 'CodeChef', val: cc, color: '#F97316' },
          ].map(({ Icon, label, val, color }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-3 rounded-xl"
              style={{ background: `${color}0d`, border: `1px solid ${color}30` }}>
              <Icon size={18} style={{ color }} />
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-0.5">{label}</div>
                <div className="font-mono-num font-bold text-lg leading-none" style={{ color }}>{val.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Platform comparison chart ─────────────────────────────────────────────────────
function ComparisonRow({ label, platforms, maxVal, delay }) {
  const [bws, setBws] = useState([0, 0, 0]);
  useEffect(() => {
    const t = setTimeout(() => {
      setBws(platforms.map(p => maxVal > 0 ? Math.min(100, (p.val / maxVal) * 100) : 0));
    }, delay);
    return () => clearTimeout(t);
  }, [platforms, maxVal, delay]);

  return (
    <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
      <span className="text-xs font-bold uppercase tracking-widest text-right" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {label}
      </span>
      <div className="space-y-1.5">
        {platforms.map((p, i) => (
          <div key={p.label} className="flex items-center gap-3">
            <div className="w-16 text-right">
              <span className="text-xs font-mono-num font-bold" style={{ color: p.color }}>{p.val}</span>
            </div>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="h-full rounded-full" style={{
                width: `${bws[i]}%`,
                background: `linear-gradient(90deg, ${p.color}55, ${p.color})`,
                boxShadow: `0 0 6px ${p.color}44`,
                transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
              }} />
            </div>
            <span className="text-xs font-mono text-zinc-700 w-8">{Math.round(bws[i])}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonChart({ data }) {
  const lc = data?.leetCodeStats || {};
  const gfg = data?.gfgStats || {};

  // Normalise keys
  const lcEasy = lc.easySolved || 0;
  const lcMedium = lc.mediumSolved || 0;
  const lcHard = lc.hardSolved || 0;
  const gfgBasic = gfg.basic || 0;
  const gfgEasy = gfg.easy || 0;
  const gfgMedium = gfg.medium || 0;
  const gfgHard = gfg.hard || 0;

  const rows = [
    { label: 'BASIC', platforms: [{ label: 'GFG', val: gfgBasic, color: '#2DBE60' }] },
    { label: 'EASY', platforms: [{ label: 'LC', val: lcEasy, color: '#FFA116' }, { label: 'GFG', val: gfgEasy, color: '#2DBE60' }] },
    { label: 'MEDIUM', platforms: [{ label: 'LC', val: lcMedium, color: '#FFA116' }, { label: 'GFG', val: gfgMedium, color: '#2DBE60' }] },
    { label: 'HARD', platforms: [{ label: 'LC', val: lcHard, color: '#FFA116' }, { label: 'GFG', val: gfgHard, color: '#2DBE60' }] },
  ];
  const maxVal = Math.max(lcEasy, lcMedium, lcHard, gfgBasic, gfgEasy, gfgMedium, gfgHard, 1);

  return (
    <div className="animate-card-in stagger-5 glass-dark rounded-2xl p-8 mt-6"
      style={{ border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <div style={{ width: 3, height: 20, borderRadius: 2, background: 'linear-gradient(#FFA116,#2DBE60)' }} />
          <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Difficulty Comparison
          </h3>
          <span className="text-xs text-zinc-600 font-mono">LeetCode vs GFG</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFA116', display: 'inline-block', boxShadow: '0 0 6px #FFA11688' }} />
            <span style={{ color: '#FFA116' }}>LeetCode</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2DBE60', display: 'inline-block', boxShadow: '0 0 6px #2DBE6088' }} />
            <span style={{ color: '#2DBE60' }}>GFG</span>
          </span>
        </div>
      </div>

      {/* Comparison rows */}
      <div className="space-y-5">
        {rows.map((row, i) => (
          <ComparisonRow key={row.label} label={row.label} platforms={row.platforms} maxVal={maxVal} delay={200 + i * 100} />
        ))}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(null);
  const [usernames, setUsernames] = useState({ leetcode: '', gfg: '', codechef: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    try {
      const u = localStorage.getItem(UN_KEY);
      if (u) setUsernames(JSON.parse(u));
      const c = localStorage.getItem(CACHE_KEY);
      if (c) {
        const { data: cd, timestamp, usernames: cu } = JSON.parse(c);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          setData(cd); setLastSynced(timestamp); setFromCache(true);
          if (cu) setUsernames(cu);
        }
      }
    } catch (_) { }
  }, []);

  const change = (field, val) => {
    const u = { ...usernames, [field]: val };
    setUsernames(u);
    localStorage.setItem(UN_KEY, JSON.stringify(u));
  };

  const sync = async () => {
    const lc = usernames.leetcode.trim(), gfg = usernames.gfg.trim(), cc = usernames.codechef.trim();
    if (!lc || !gfg || !cc) { setError('All three fields are required.'); return; }
    setLoading(true); setError(null); setFromCache(false);
    try {
      const r = await fetch(`http://localhost:8080/api/stats?leetcode=${lc}&gfg=${gfg}&codechef=${cc}`);
      if (!r.ok) throw new Error('Fetch failed — verify your usernames.');
      const result = await r.json();
      const now = Date.now();
      setData(result); setLastSynced(now);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, timestamp: now, usernames: { leetcode: lc, gfg, codechef: cc } }));
    } catch (e) { setError(e.message); setData(null); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#060609', position: 'relative' }}>
      <Grain />
      <Aurora />
      <DotGrid />
      <Particles />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1180px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>

        {/* ── Header ──────────────────────────────────────── */}
        <header className="animate-slide-up pt-14 pb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <div style={{
                width: 6, height: 6, borderRadius: '50%', background: '#2DBE60',
                animation: 'pulseDot 2s ease-in-out infinite',
                boxShadow: '0 0 10px rgba(45,190,96,0.9)'
              }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                System Online
              </span>
            </div>

            {/* Main title */}
            <h1 className="font-black leading-none mb-4" style={{ fontSize: 'clamp(3rem,10vw,6.5rem)', letterSpacing: '-0.04em' }}>
              <span style={{
                background: 'linear-gradient(135deg,#FFA116 0%,#FFD166 60%,#F97316 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 25px rgba(255,161,22,0.35))',
              }}>DEV</span>
              <span style={{ color: '#fff' }}> STATS</span>
            </h1>

            <p className="text-sm uppercase tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.22)', letterSpacing: '0.25em' }}>
              Track · Analyze · Dominate
            </p>
          </div>

          {/* Right: sync status */}
          {lastSynced && (
            <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-full text-xs font-mono"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              <span style={{ color: fromCache ? '#555570' : '#2DBE60' }}>{fromCache ? '↻' : '✓'}</span>
              {fromCache ? 'Cached' : 'Live'} · {timeAgo(lastSynced)}
            </div>
          )}
        </header>

        {/* Horizontal rule */}
        <div className="mb-10" style={{ height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />

        {/* ── Input section ────────────────────────────────── */}
        <div className="animate-slide-up stagger-1 glass-dark rounded-2xl p-8 mb-8"
          style={{ border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>

          <div className="flex items-center gap-3 mb-7">
            <div style={{
              width: 3, height: 22, borderRadius: 2,
              background: 'linear-gradient(#FFA116,#2DBE60)'
            }} />
            <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Target Profiles
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-5 mb-8">
            <PInput label="LeetCode" hint="Proflie Name (e.g. john_doe)" value={usernames.leetcode} onChange={e => change('leetcode', e.target.value)} color="#FFA116" focusCls="input-lc" Icon={SiLeetcode} />
            <PInput label="GeeksForGeeks" hint="Profile Name (e.g. john_doe)" value={usernames.gfg} onChange={e => change('gfg', e.target.value)} color="#2DBE60" focusCls="input-gfg" Icon={SiGeeksforgeeks} />
            <PInput label="CodeChef" hint="Profile Name (e.g. john_doe)" value={usernames.codechef} onChange={e => change('codechef', e.target.value)} color="#F97316" focusCls="input-cc" Icon={SiCodechef} />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              id="initiate-sync-btn"
              onClick={sync}
              disabled={loading}
              className="relative overflow-hidden px-9 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-200 focus:outline-none disabled:opacity-60"
              style={{
                background: loading ? 'transparent' : 'linear-gradient(135deg,#FFA116,#F97316)',
                color: loading ? '#FFA116' : '#000',
                border: `1px solid ${loading ? 'rgba(255,161,22,0.35)' : 'transparent'}`,
                boxShadow: loading ? 'none' : '0 0 35px rgba(255,161,22,0.3), 0 8px 24px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 55px rgba(255,161,22,0.45), 0 12px 32px rgba(0,0,0,0.5)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = loading ? 'none' : '0 0 35px rgba(255,161,22,0.3), 0 8px 24px rgba(0,0,0,0.4)'; }}
            >
              {/* Scan shimmer when loading */}
              {loading && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div style={{
                    position: 'absolute', top: 0, bottom: 0, width: '80px',
                    background: 'linear-gradient(90deg,transparent,rgba(255,161,22,0.3),transparent)',
                    animation: 'scanLine 1s linear infinite'
                  }} />
                </div>
              )}
              <span className="relative z-10 flex items-center gap-2.5">
                {loading
                  ? <><span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '120ms' }} />
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '240ms' }} />
                    <span className="ml-1.5">SYNCING</span></>
                  : <><HiOutlineLightningBolt size={16} /> INITIATE SYNC</>}
              </span>
            </button>

            {lastSynced && !loading && (
              <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {fromCache
                  ? `↻ Loaded from cache · ${timeAgo(lastSynced)} · refreshes after 30min`
                  : `✓ Fresh sync · ${timeAgo(lastSynced)}`}
              </p>
            )}
          </div>
        </div>

        {/* ── Error ───────────────────────────────────────── */}
        {error && (
          <div className="animate-slide-up mb-8 px-5 py-4 rounded-xl text-sm font-bold"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
            ✗ {error}
          </div>
        )}

        {/* ── Skeleton loading ─────────────────────────────── */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[0, 1, 2].map(i => (
              <div key={i} className="glass-dark rounded-2xl overflow-hidden animate-fade-in"
                style={{ border: '1px solid rgba(255,255,255,0.07)', animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <div className="p-6 space-y-5">
                  <div className="flex justify-between">
                    <div className="skeleton h-4 w-24 rounded" />
                    <div className="skeleton h-4 w-16 rounded" />
                  </div>
                  <div className="skeleton h-14 w-20 rounded-lg" />
                  <div className="skeleton h-3 w-28 rounded" />
                  <div className="skeleton h-px w-full rounded" />
                  {[0, 1, 2].map(j => (
                    <div key={j} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="skeleton h-3 w-10 rounded" />
                        <div className="skeleton h-3 w-14 rounded" />
                      </div>
                      <div className="skeleton h-1.5 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Results ──────────────────────────────────────── */}
        {data && !loading && (
          <>
            <Banner data={data} />

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'LeetCode Stats', stats: data.leetCodeStats },
                { title: 'GeeksForGeeks Stats', stats: data.gfgStats },
                { title: 'CodeChef Stats', stats: data.codeChefStats },
              ].map(({ title, stats }, i) => (
                <div key={title} className={`animate-card-in stagger-${i + 3}`}>
                  <StatsCard title={title} stats={stats} loading={false} />
                </div>
              ))}
            </div>

            <ComparisonChart data={data} />
          </>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.04)', textAlign: 'center', padding: '2rem 1rem' }}>
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Made with ❤️ by <span style={{ color: 'rgba(255,255,255,0.45)' }}>Sachin</span>
        </p>
        <p className="text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.1)' }}>
          © {new Date().getFullYear()} · Not affiliated with LeetCode, GeeksForGeeks or CodeChef
        </p>
      </footer>
    </div>
  );
}
