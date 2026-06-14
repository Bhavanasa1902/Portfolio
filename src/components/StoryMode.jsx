import { useState, useEffect, useRef } from 'react';
import Illus, { TeachStack, ExcelSheet, CodeWindow } from './Illustrations';

const FRAMES = [
  {
    poseFile: 'waving',
    pos: { x: '50%', y: '88%' }, size: 62,
    bubble: {
      text: "Hi, I'm Bhavana — I help teams turn messy data into dependable systems.",
      side: 'top',
      font: 'serif',
    },
    duration: 5,
  },
  {
    poseFile: 'peace_wink',
    pos: { x: '22%', y: '92%' }, size: 66,
    bubble: {
      text: "I build data platforms that keep analytics, ML, and operations running.",
      side: 'right',
    },
    art: { kind: 'SkillPile', side: 'far-right', x: '56%', y: '46%' },
    duration: 5,
  },
  {
    poseFile: 'notebook',
    pos: { x: '32%', y: '92%' }, size: 64,
    bubble: {
      text: "MS in Computer Science at CSU Fullerton. During my journey, I turned machine data, logs, and business events into clean pipelines and backend systems.",
      side: 'right',
    },
    art: {
      kind: 'CompanyCard', side: 'far-right', x: '62%', y: '48%',
      props: {
        name: 'Nokia · Cognizant · CSU',
        role: 'Systems, Cloud, & Data',
        dates: '2022 – 2026',
        color: '#268bd2',
        bullets: [
          'Built ETL and inference pipelines with PostgreSQL, MySQL, and BigQuery.',
          'Improved production query performance, batch runtime, and incident response.',
          'Mentored students while scaling analytics systems in the classroom.',
        ],
      },
    },
    duration: 6,
  },
  {
    poseFile: 'coffee',
    pos: { x: '20%', y: '92%' }, size: 62,
    bubble: {
      text: "I ship work that turns data into products — from schema design to observability.",
      side: 'right',
    },
    art: { kind: 'ProjectGrid', side: 'far-right', x: '56%', y: '50%' },
    duration: 5,
  },
  {
    poseFile: 'standing',
    pos: { x: '20%', y: '92%' }, size: 64,
    bubble: {
      text: "These projects show the kinds of systems and products I like to build.",
      side: 'right',
    },
    art: { kind: 'ProjectGrid', side: 'far-right', x: '56%', y: '50%' },
    mobileLayout: 'art-top-bitmoji-left',
    duration: 5,
  },
  {
    poseFile: 'pro_blue',
    pos: { x: '32%', y: '92%' }, size: 64,
    bubble: {
      text: "If you want dependable data products and faster insights, let's build them together.",
      side: 'top',
      font: 'serif',
    },
    art: { kind: 'OpenToWork', side: 'far-right', x: '72%', y: '52%' },
    duration: 5,
  },
];

function getXY(pos, anchor = 'cb') {
  const style = { left: pos.x, top: pos.y };
  let tx = '-50%', ty = '-50%';
  if (anchor === 'cb') ty = '-100%';
  if (anchor === 'ct') ty = '0';
  if (anchor === 'cl') tx = '0';
  if (anchor === 'cr') tx = '-100%';
  if (anchor === 'lb') { tx = '0'; ty = '-100%'; }
  if (anchor === 'rb') { tx = '-100%'; ty = '-100%'; }
  style.transform = `translate(${tx}, ${ty})`;
  return style;
}

function StoryMode({ tweaks, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 760);
  const timerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 760);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const total = FRAMES.length;
  const f = FRAMES[idx];
  const duration = (f.duration || tweaks.pacing || 4) * 1000;

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => {
      if (idx < total - 1) setIdx(i => i + 1);
      else onFinish();
    }, duration);
    return () => clearTimeout(timerRef.current);
  }, [idx, paused, duration, total, onFinish]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { prev(); }
      else if (e.key === 'Escape') { onFinish(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx]);

  const next = () => {
    clearTimeout(timerRef.current);
    if (idx < total - 1) setIdx(i => i + 1);
    else onFinish();
  };
  const prev = () => {
    clearTimeout(timerRef.current);
    if (idx > 0) setIdx(i => i - 1);
  };

  const sizeMult = { small: 0.78, medium: 1, large: 1.2 }[tweaks.bitmojiSize || 'medium'];
  const bitmojiHeightVh = (f.size || 50) * sizeMult;
  const bitmojiHeight = `${bitmojiHeightVh}vh`;
  const bitmojiHalfWidthVh = bitmojiHeightVh * 0.28;
  const bitmojiWidthVh = bitmojiHeightVh * 0.56;

  const ArtComp = f.art ? Illus[f.art.kind] : null;

  const shapeClass = {
    rounded: '',
    pill: 'shape-pill',
    paper: 'shape-paper',
  }[tweaks.bubbleShape || 'rounded'];

  let bubbleStyle = {};
  let tailClass = '';
  if (f.bubble.side === 'top') {
    bubbleStyle = {
      left: f.pos.x,
      top: `calc(${f.pos.y} - ${bitmojiHeightVh + 2}vh)`,
      transform: 'translate(-50%, -100%)',
    };
    tailClass = 'tail-bc';
  } else if (f.bubble.side === 'right') {
    bubbleStyle = {
      left: `calc(${f.pos.x} + ${bitmojiHalfWidthVh + 1}vh)`,
      top: `calc(${f.pos.y} - ${bitmojiHeightVh * 0.6}vh)`,
      transform: 'translate(0, -50%)',
    };
    tailClass = 'tail-l';
  } else if (f.bubble.side === 'left') {
    bubbleStyle = {
      left: `calc(${f.pos.x} - ${bitmojiHalfWidthVh + 1}vh)`,
      top: `calc(${f.pos.y} - ${bitmojiHeightVh * 0.6}vh)`,
      transform: 'translate(-100%, -50%)',
    };
    tailClass = 'tail-r';
  }

  let artStyle = {};
  if (f.art) {
    artStyle = { left: f.art.x, top: f.art.y, transform: 'translate(-50%, -50%)' };
  }

  return (
    <div className="story-canvas grain mode-enter">
      <div className="segs">
        {FRAMES.map((_, i) => (
          <div key={i} className={`seg ${i < idx ? 'done' : ''} ${i === idx ? 'active' : ''}`}>
            <div
              className="fill"
              style={i === idx ? { animation: paused ? 'none' : `segFill ${duration}ms linear forwards` } : {}}
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes segFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>

      <div className="tap-region" onClick={next} />

      <button
        className={`btn-soft skip-${tweaks.skipPos || 'tr'}`}
        onClick={(e) => { e.stopPropagation(); onFinish(); }}
      >
        Skip intro →
      </button>

      <button
        className="btn-soft"
        style={{ position: 'absolute', top: 36, left: tweaks.skipPos === 'tl' ? 'auto' : 18, right: tweaks.skipPos === 'tl' ? 18 : 'auto', zIndex: 50 }}
        onClick={(e) => { e.stopPropagation(); setPaused(p => !p); }}
      >
        {paused ? '▶ Resume' : '❚❚ Pause'}
      </button>

      {f.art && ArtComp && !(isMobile && f.mobileLayout === 'teach-stack') && (
        <div
          key={`art-${idx}`}
          className={`scene-art ${f.art.side === 'far-l' || f.art.side === 'far-left' ? 'from-l' : 'from-r'}`}
          style={{ ...artStyle, pointerEvents: f.art.kind === 'ProjectGrid' ? 'auto' : 'none' }}
        >
          {f.art.kind === 'TeachStack' ? (
            <TeachStack/>
          ) : f.art.kind === 'ProjectGrid' ? (
            <ArtComp {...(f.art.props || {})} onModalOpen={() => setPaused(true)} onModalClose={() => setPaused(false)} />
          ) : (
            <ArtComp {...(f.art.props || {})} />
          )}
        </div>
      )}

      {isMobile && f.mobileLayout === 'teach-stack' ? (
        <>
          {/* Excel at top */}
          <div className="mobile-excel" style={{ order: 1, alignSelf: 'center', transform: 'scale(1)', transformOrigin: 'top center' }}>
            <ExcelSheet />
          </div>
          {/* Bubble below Excel */}
          <div className="bubble-wrap" style={{ position: 'relative', order: 2, alignSelf: 'center', margin: '0 auto' }}>
            <div className={`bubble ${shapeClass}`} style={{ position: 'relative' }}>
              {f.bubble.text}
              {tweaks.bubbleShape !== 'paper' && (
                <span style={{
                  position: 'absolute',
                  width: 16,
                  height: 16,
                  background: '#fff',
                  borderRight: '1.5px solid var(--base02)',
                  borderBottom: '1.5px solid var(--base02)',
                  right: 30,
                  bottom: -9,
                  transform: 'rotate(20deg)'
                }} />
              )}
            </div>
          </div>
          {/* Bitmoji + SQL side by side */}
          <div className="mobile-bottom-row" style={{ order: 3, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ transform: 'scale(0.75)', transformOrigin: 'bottom right', marginRight: -30 }}>
              <CodeWindow />
            </div>
            <div className="mojo-wrap" style={{ position: 'relative', height: '22vh', marginLeft: -20 }}>
              <img
                className="mojo bob"
                src={`/bitmoji/${f.poseFile || f.pose}.png`}
                alt=""
                style={{ height: '100%', width: 'auto' }}
              />
            </div>
          </div>
        </>
      ) : isMobile && f.mobileLayout === 'art-top-bitmoji-left' ? (
        <>
          {/* Bitmoji left + Bubble right at bottom */}
          <div style={{ order: 3, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', marginTop: 'auto' }}>
            <div style={{ height: '42vh', flexShrink: 0 }}>
              <img
                className="mojo bob"
                src={`/bitmoji/${f.poseFile || f.pose}.png`}
                alt=""
                style={{ height: '100%', width: 'auto' }}
              />
            </div>
            <div style={{ flex: 1, maxWidth: '65vw' }}>
              <div className={`bubble ${shapeClass}`} style={{ position: 'relative' }}>
                {f.bubble.text}
                {tweaks.bubbleShape !== 'paper' && (
                  <span style={{
                    position: 'absolute',
                    width: 16,
                    height: 16,
                    background: '#fff',
                    borderRight: '1.5px solid var(--base02)',
                    borderBottom: '1.5px solid var(--base02)',
                    left: -9,
                    top: '50%',
                    marginTop: -8,
                    transform: 'rotate(135deg)'
                  }} />
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="bubble-wrap"
            style={bubbleStyle}
          >
            <div className={`bubble ${shapeClass} ${f.bubble.font === 'serif' ? 'serif' : ''} ${tailClass}`}>
              {f.bubble.text}
              {tweaks.bubbleShape !== 'paper' && <span className="tail" />}
            </div>
          </div>

          <div
            className="mojo-wrap"
            style={{ ...getXY(f.pos, 'cb'), width: `${bitmojiWidthVh}vh`, height: bitmojiHeight }}
          >
            <img
              className="mojo bob"
              src={`/bitmoji/${f.poseFile || f.pose}.png`}
              alt=""
              style={{ height: '100%', width: 'auto' }}
            />
          </div>
        </>
      )}

      <div className="story-controls" onClick={e => e.stopPropagation()}>
        <button className="btn-soft" onClick={prev} disabled={idx === 0} style={{ opacity: idx === 0 ? 0.3 : 1 }}>← Back</button>
        <div className="mono" style={{ fontSize: 11, color: 'var(--base00)', alignSelf: 'center' }}>
          {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · tap or → to advance
        </div>
        {idx === total - 1 ? (
          <button className="btn-cta" onClick={onFinish}>See portfolio →</button>
        ) : (
          <button className="btn-soft" onClick={next}>Next →</button>
        )}
      </div>
    </div>
  );
}

export default StoryMode;
