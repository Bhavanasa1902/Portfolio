import { useId, useState, useEffect, useRef } from 'react';
import { USA_STATES } from './usa-states';

const SQL_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'AVG', 'COUNT', 'JOIN', 'ON', 'AND', 'OR', 'ORDER BY', 'LIMIT', 'AS'];

function sqlHighlight(line) {
  const tokens = [];
  const re = /(\b(?:SELECT|FROM|WHERE|GROUP BY|HAVING|AVG|COUNT|JOIN|ON|AND|OR|ORDER BY|LIMIT|AS)\b)|('[^']*')|(\b\d+\b)|(--[^\n]*)/g;
  let last = 0; let m;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) tokens.push({ t: 'plain', v: line.slice(last, m.index) });
    if (m[1]) tokens.push({ t: 'kw', v: m[1] });
    else if (m[2]) tokens.push({ t: 'str', v: m[2] });
    else if (m[3]) tokens.push({ t: 'num', v: m[3] });
    else if (m[4]) tokens.push({ t: 'cmt', v: m[4] });
    last = re.lastIndex;
  }
  if (last < line.length) tokens.push({ t: 'plain', v: line.slice(last) });
  return tokens;
}

const SQL_COLORS = { kw: '#cb4b16', str: '#859900', num: '#2aa198', cmt: '#586e75', plain: '#93a1a1' };

export const USAMap = ({ width = 880 }) => {
  const id = useId();
  return (
    <svg viewBox="0 0 959 593" width={width} style={{ display: 'block' }}>
      {Object.entries(USA_STATES).map(([state, path]) => (
        <path
          key={state}
          d={path}
          fill={state === 'ca' ? 'var(--base02)' : 'var(--base2)'}
          stroke="var(--base3)"
          strokeWidth="1.5"
          style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}
        />
      ))}
      {/* Fullerton pin */}
      <g transform="translate(90 320)">
        <circle r="20" fill="rgba(3, 3, 3, 0.2)">
          <animate attributeName="r" values="12;24;12" dur="2.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".5;0;.5" dur="2.4s" repeatCount="indefinite"/>
        </circle>
        <path d="M 0 -14 C 8 -14, 12 -6, 12 0 C 12 10, 0 24, 0 24 C 0 24, -12 10, -12 0 C -12 -6, -8 -14, 0 -14 Z" fill="var(--red)" stroke="var(--base3)" strokeWidth="2" style={{ transition: 'stroke 0.3s ease' }}/>
        <circle cx="0" cy="-2" r="4" fill="var(--base3)" style={{ transition: 'fill 0.3s ease' }}/>
      </g>
      {/* Label */}
      <g transform="translate(105 300)">
        <rect x="0" y="0" width="140" height="38" rx="6" fill="var(--base3)" fillOpacity="0.95" stroke="var(--base1)" strokeWidth="1" style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}/>
        <text x="10" y="16" fontFamily="system-ui, sans-serif" fontSize="15" fontWeight="700" fill="var(--base02)" style={{ transition: 'fill 0.3s ease' }}>Fullerton, CA</text>
        <text x="10" y="30" fontFamily="ui-monospace, monospace" fontSize="12" fill="var(--base01)" style={{ transition: 'fill 0.3s ease' }}>33.87° N, 117.92° W</text>
      </g>
    </svg>
  );
};

let amchartsLoaded = false;
let amchartsLoading = null;

function loadAmCharts() {
  if (amchartsLoaded && window.am5) return Promise.resolve();
  if (amchartsLoading) return amchartsLoading;

  amchartsLoading = new Promise((resolve) => {
    // Load core first, then others in parallel (they depend on core)
    const core = document.createElement('script');
    core.src = 'https://cdn.amcharts.com/lib/5/index.js';
    core.onload = () => {
      const scripts = [
        'https://cdn.amcharts.com/lib/5/map.js',
        'https://cdn.amcharts.com/lib/5/geodata/continentsLow.js',
        'https://cdn.amcharts.com/lib/5/themes/Animated.js',
      ];
      let loaded = 0;
      scripts.forEach(src => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => {
          loaded++;
          if (loaded === scripts.length) {
            amchartsLoaded = true;
            resolve();
          }
        };
        document.head.appendChild(s);
      });
    };
    document.head.appendChild(core);
  });

  return amchartsLoading;
}

function initGlobeChart(container, isDark) {
  const am5 = window.am5;
  const am5map = window.am5map;
  const am5themes_Animated = window.am5themes_Animated;
  const am5geodata_continentsLow = window.am5geodata_continentsLow;

  const root = am5.Root.new(container);
  root._logo?.dispose();
  root.setThemes([am5themes_Animated.new(root)]);

  // Track timeouts for safe cleanup on unmount
  const timeouts = [];
  const safeTimeout = (fn, delay) => {
    const id = setTimeout(() => {
      const idx = timeouts.indexOf(id);
      if (idx > -1) timeouts.splice(idx, 1);
      if (!root.isDisposed()) fn();
    }, delay);
    timeouts.push(id);
    return id;
  };

  const chart = root.container.children.push(
    am5map.MapChart.new(root, {
      panX: 'rotateX',
      panY: 'rotateY',
      projection: am5map.geoOrthographic(),
      paddingTop: 0,
      paddingBottom: 0,
      rotationX: -77.6,
      rotationY: -13,
    })
  );

  const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
  backgroundSeries.mapPolygons.template.setAll({
    fill: am5.color(isDark ? 0x002b36 : 0xeee8d5),
    fillOpacity: 0.6,
    strokeOpacity: 0,
  });
  backgroundSeries.data.push({ geometry: am5map.getGeoRectangle(90, 180, -90, -180) });

  const polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, { geoJSON: am5geodata_continentsLow })
  );
  polygonSeries.mapPolygons.template.setAll({
    fill: am5.color(isDark ? 0x073642 : 0x073642),
    stroke: am5.color(isDark ? 0x586e75 : 0x073642),
    strokeWidth: 1.5,
    strokeOpacity: 1,
    interactive: false,
  });

  const BLR = { lat: 12.9716, lon: 77.5946 };
  const FUL = { lat: 33.8704, lon: -117.9242 };

  function greatCirclePoints(lat1, lon1, lat2, lon2, n) {
    const toRad = Math.PI / 180, toDeg = 180 / Math.PI;
    lat1 *= toRad; lon1 *= toRad; lat2 *= toRad; lon2 *= toRad;
    const d = 2 * Math.asin(Math.sqrt(
      Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)
    ));
    const points = [];
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      const A = Math.sin((1 - f) * d) / Math.sin(d);
      const B = Math.sin(f * d) / Math.sin(d);
      const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
      const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
      const z = A * Math.sin(lat1) + B * Math.sin(lat2);
      points.push([Math.atan2(y, x) * toDeg, Math.atan2(z, Math.sqrt(x * x + y * y)) * toDeg]);
    }
    return points;
  }

  const arcPoints = greatCirclePoints(BLR.lat, BLR.lon, FUL.lat, FUL.lon, 80);

  const lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
  lineSeries.mapLines.template.setAll({
    stroke: am5.color(0xdc322f),
    strokeWidth: 2,
    strokeDasharray: [6, 4],
    strokeOpacity: 0.9,
  });

  const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, { zIndex: 100 }));
  pointSeries.bullets.push((root, series, dataItem) => {
    const name = dataItem.dataContext?.name || '';
    const container = am5.Container.new(root, { zIndex: 100 });
    container.children.push(am5.Circle.new(root, {
      radius: 6,
      fill: am5.color(0xdc322f),
      strokeWidth: 2,
      stroke: am5.color(isDark ? 0x002b36 : 0xfdf6e3),
    }));
    if (name) {
      container.children.push(am5.Label.new(root, {
        text: name,
        fill: am5.color(isDark ? 0xfdf6e3 : 0x073642),
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'system-ui, sans-serif',
        centerY: am5.p50,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        dx: 14,
        background: am5.RoundedRectangle.new(root, {
          fill: am5.color(isDark ? 0x073642 : 0xfdf6e3),
          fillOpacity: 0.9,
          stroke: am5.color(isDark ? 0x586e75 : 0x93a1a1),
          strokeWidth: 1,
          strokeOpacity: 0.4,
          cornerRadiusTL: 4, cornerRadiusTR: 4, cornerRadiusBL: 4, cornerRadiusBR: 4,
          shadowColor: am5.color(0x000000),
          shadowBlur: 6,
          shadowOpacity: 0.15,
          shadowOffsetY: 2,
        }),
      }));
    }
    return am5.Bullet.new(root, { sprite: container });
  });

  const addCity = (lat, lon, name) => {
    if (!root.isDisposed()) pointSeries.data.push({ latitude: lat, longitude: lon, name });
  };
  addCity(BLR.lat, BLR.lon, 'Bangalore');

  const ARC_DURATION = 2000, START_DELAY = 500, RESUME_DELAY = 2000, SPIN_DURATION = 10000;

  function computeSegmentDelays(n, totalMs) {
    const weights = [];
    let totalWeight = 0;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      let speed = Math.sin(t * Math.PI);
      speed = Math.max(speed, 0.12);
      const w = 1 / speed;
      weights.push(w);
      totalWeight += w;
    }
    return weights.map(w => (w / totalWeight) * totalMs);
  }

  const segmentCount = arcPoints.length - 1;
  const delays = computeSegmentDelays(segmentCount, ARC_DURATION);

  chart.appear(1000, 100);

  safeTimeout(() => {
    if (root.isDisposed()) return;
    chart.animate({ key: 'rotationX', to: -242.1, duration: ARC_DURATION, easing: am5.ease.inOut(am5.ease.cubic) });
    chart.animate({ key: 'rotationY', to: -34, duration: ARC_DURATION, easing: am5.ease.inOut(am5.ease.cubic) });

    let currentIndex = 0;
    function drawNext() {
      if (root.isDisposed()) return;
      if (currentIndex >= segmentCount) {
        addCity(FUL.lat, FUL.lon, 'Fullerton, CA');
        safeTimeout(() => {
          if (root.isDisposed()) return;
          chart.animate({
            key: 'rotationX',
            from: chart.get('rotationX'),
            to: chart.get('rotationX') + 360,
            duration: SPIN_DURATION,
            loops: Infinity,
          });
        }, RESUME_DELAY);
        return;
      }
      lineSeries.pushDataItem({
        geometry: {
          type: 'LineString',
          coordinates: [arcPoints[currentIndex], arcPoints[currentIndex + 1]],
        },
      });
      currentIndex++;
      safeTimeout(drawNext, delays[currentIndex] || 0);
    }
    drawNext();
  }, START_DELAY);

  return {
    dispose: () => {
      timeouts.forEach(clearTimeout);
      root.dispose();
    }
  };
}

export const Globe = ({ width = 500 }) => {
  const containerRef = useRef(null);
  const rootRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const theme = document.documentElement.getAttribute('data-theme') || 'light';

  useEffect(() => {
    let mounted = true;

    loadAmCharts().then(() => {
      if (mounted && containerRef.current && !rootRef.current) {
        rootRef.current = initGlobeChart(containerRef.current, theme === 'dark');
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (rootRef.current) {
        rootRef.current.dispose();
        rootRef.current = null;
      }
    };
  }, [theme]);

  return (
    <div style={{ width, height: width, position: 'relative' }}>
      {loading && (
        <svg viewBox="0 0 100 100" width={width} height={width} style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx="50" cy="50" r="45" fill="var(--base2)" stroke="var(--base02)" strokeWidth="1.5" style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}/>
          <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="rgba(7,54,66,.15)" strokeWidth="1"/>
          <ellipse cx="50" cy="50" rx="45" ry="30" fill="none" stroke="rgba(7,54,66,.15)" strokeWidth="1"/>
          <circle cx="50" cy="50" r="3" fill="var(--base02)" style={{ transition: 'fill 0.3s ease' }}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
          </circle>
        </svg>
      )}
      <div ref={containerRef} style={{ width: '100%', height: '100%', opacity: loading ? 0 : 1, transition: 'opacity 0.3s' }} />
    </div>
  );
};

export const UniCard = ({ width = 340, title = "California State University", sub = "Fullerton — Master of Science", line3 = "Computer Science · 2024 – 2026" }) => (
  <div className="card" style={{ width, background: 'var(--card-bg)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg viewBox="0 0 80 80" width="60" height="60">
        <defs>
          <linearGradient id="crest" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--orange)"/>
            <stop offset="1" stopColor="var(--yellow)"/>
          </linearGradient>
        </defs>
        <path d="M 40 6 L 70 18 L 70 44 C 70 60 56 70 40 76 C 24 70 10 60 10 44 L 10 18 Z" fill="url(#crest)" stroke="var(--base02)" strokeWidth="1.5"/>
        <text x="40" y="48" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="22" fontWeight="700" fill="var(--base3)">CSUF</text>
      </svg>
      <div>
        <div className="serif" style={{ fontSize: 15, fontWeight: 600, color: 'var(--base02)', lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--base01)' }}>{sub}</div>
        <div className="mono" style={{ fontSize: 10.5, color: 'var(--base00)', marginTop: 2 }}>{line3}</div>
      </div>
    </div>
  </div>
);

export const BachCard = ({ width = 340 }) => (
  <div className="card" style={{ width, background: 'var(--card-bg)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg viewBox="0 0 80 80" width="60" height="60">
        <path d="M 40 6 L 70 18 L 70 44 C 70 60 56 70 40 76 C 24 70 10 60 10 44 L 10 18 Z" fill="var(--violet)" stroke="var(--base02)" strokeWidth="1.5"/>
        <text x="40" y="42" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="13" fontWeight="700" fill="var(--base3)">JIT</text>
        <text x="40" y="56" textAnchor="middle" fontFamily="ui-monospace,Menlo,monospace" fontSize="8" fill="var(--base3)">B.E.</text>
      </svg>
      <div>
        <div className="serif" style={{ fontSize: 15, fontWeight: 600, color: 'var(--base02)', lineHeight: 1.2 }}>Jyothy Institute of Technology</div>
        <div style={{ fontSize: 12.5, color: 'var(--base01)' }}>Bangalore — Bachelor of Engineering</div>
        <div className="mono" style={{ fontSize: 10.5, color: 'var(--base00)', marginTop: 2 }}>Computer Science · 2018 – 2022</div>
      </div>
    </div>
  </div>
);

export const Calendar = ({ width = 200, month = "MAY", day = "2026" }) => (
  <svg viewBox="0 0 220 220" width={width} style={{ display: 'block' }}>
    <rect x="20" y="30" width="180" height="170" rx="14" fill="var(--card-bg)" stroke="var(--base02)" strokeWidth="1.8"/>
    <rect x="20" y="30" width="180" height="46" rx="14" fill="var(--red)"/>
    <rect x="20" y="60" width="180" height="16" fill="var(--red)"/>
    <rect x="50" y="20" width="14" height="30" rx="3" fill="var(--base02)"/>
    <rect x="156" y="20" width="14" height="30" rx="3" fill="var(--base02)"/>
    <text x="110" y="62" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="22" fontWeight="700" fill="var(--base3)">{month}</text>
    <text x="110" y="150" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="56" fontWeight="700" fill="var(--base02)">{day}</text>
    <text x="110" y="182" textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontSize="15" fontWeight="600" fill="var(--base01)" letterSpacing="1">GRADUATION</text>
  </svg>
);

export const CodeWindow = ({ width = 420, lines = [
  "-- ISDS 361B · Revenue by Region",
  "SELECT r.region_name,",
  "       COUNT(DISTINCT o.order_id) AS orders,",
  "       SUM(oi.qty * p.price) AS revenue,",
  "       AVG(c.satisfaction) AS avg_rating",
  "FROM regions r",
  "JOIN stores s ON s.region_id = r.id",
  "JOIN orders o ON o.store_id = s.id",
  "JOIN order_items oi ON oi.order_id = o.id",
  "JOIN products p ON p.id = oi.product_id",
  "LEFT JOIN surveys c ON c.order_id = o.id",
  "WHERE o.order_date >= '2025-01-01'",
  "GROUP BY r.region_name",
  "HAVING SUM(oi.qty * p.price) > 50000",
  "ORDER BY revenue DESC;",
] }) => (
  <div style={{ width, background: 'var(--base02)', borderRadius: 12, border: '1.5px solid var(--base03)', boxShadow: '4px 4px 0 var(--base02)', overflow: 'hidden' }}>
    <div style={{ background: 'var(--base03)', padding: '8px 12px', display: 'flex', gap: 6, alignItems: 'center' }}>
      <span style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--red)' }}/>
      <span style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--yellow)' }}/>
      <span style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--green)' }}/>
      <span style={{ marginLeft: 8, color: 'var(--base1)', fontFamily: 'var(--mono)', fontSize: 11 }}>ISDS_361B.sql</span>
    </div>
    <div style={{ padding: '14px 16px', fontFamily: 'var(--mono)', fontSize: 12.5, lineHeight: 1.55 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ whiteSpace: 'pre' }}>
          <span style={{ color: 'var(--base01)', marginRight: 12, userSelect: 'none' }}>{String(i + 1).padStart(2, '0')}</span>
          {sqlHighlight(l).map((tok, j) => (
            <span key={j} style={{ color: SQL_COLORS[tok.t] }}>{tok.v}</span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const ExcelSheet = ({ width = 380 }) => {
  const headers = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = ['Region', 'Q1 Rev', 'Q2 Rev', 'Growth', 'Target', 'Status'];
  const rows = [
    ['West', '$142K', '$168K', '+18.3%', '$160K', '✓'],
    ['East', '$98K', '$112K', '+14.3%', '$115K', '—'],
    ['Central', '$76K', '$91K', '+19.7%', '$85K', '✓'],
    ['South', '$54K', '$67K', '+24.1%', '$62K', '✓'],
  ];
  const statusColors = { '✓': 'var(--green)', '—': 'var(--yellow)' };
  return (
    <div className="mobile-excel" style={{ width, background: 'var(--card-bg)', borderRadius: 10, border: '1.5px solid var(--base02)', boxShadow: '4px 4px 0 var(--base02)', overflow: 'hidden', fontFamily: 'var(--sans)' }}>
      <div style={{ background: '#107c41', padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ width: 22, height: 22, borderRadius: 4, background: 'var(--base3)', color: '#107c41', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)' }}>X</div>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>regional_analytics.xlsx</span>
      </div>
      <div style={{ padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '26px repeat(6, 1fr)', borderBottom: '1px solid var(--base1)' }}>
          <div style={{ background: 'var(--base2)', borderRight: '1px solid var(--base1)' }}/>
          {headers.map(h => (
            <div key={h} style={{ background: 'var(--base2)', padding: '4px 5px', fontSize: 10, color: 'var(--base01)', textAlign: 'center', borderRight: '1px solid var(--base1)', fontFamily: 'var(--mono)' }}>{h}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '26px repeat(6, 1fr)', borderBottom: '1px solid var(--base1)', background: '#107c41' }}>
          <div style={{ padding: '4px 5px', fontSize: 10, color: 'var(--base00)', textAlign: 'center', background: 'var(--base2)', borderRight: '1px solid var(--base1)', fontFamily: 'var(--mono)' }}>1</div>
          {cols.map(c => (
            <div key={c} style={{ padding: '5px 6px', fontSize: 10, color: '#fff', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,.2)' }}>{c}</div>
          ))}
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '26px repeat(6, 1fr)', borderBottom: '1px solid var(--base1)' }}>
            <div style={{ padding: '4px 5px', fontSize: 10, color: 'var(--base00)', textAlign: 'center', background: 'var(--base2)', borderRight: '1px solid var(--base1)', fontFamily: 'var(--mono)' }}>{i + 2}</div>
            {r.map((v, j) => (
              <div key={j} style={{
                padding: '4px 6px',
                fontSize: 10,
                color: j === 3 ? (v.startsWith('+') ? 'var(--green)' : 'var(--red)') : j === 5 ? statusColors[v] : 'var(--base02)',
                borderRight: '1px solid var(--base1)',
                background: j === 3 ? 'rgba(133,153,0,.1)' : j === 5 ? 'rgba(133,153,0,.08)' : 'var(--card-bg)',
                fontFamily: j === 0 ? 'var(--sans)' : 'var(--mono)',
                fontWeight: j === 3 || j === 5 ? 600 : 400,
                textAlign: j === 5 ? 'center' : 'left'
              }}>{v}</div>
            ))}
          </div>
        ))}
        <div style={{ padding: '6px 10px', background: 'var(--base3)', borderTop: '1px solid var(--base1)', fontFamily: 'var(--mono)', fontSize: 10, color: '#107c41' }}>
          fx&nbsp;&nbsp;<span style={{ color: 'var(--base01)' }}>=IF(C2&gt;E2,"✓","—")</span>
        </div>
      </div>
    </div>
  );
};

export const CompanyCard = ({ width = 380, name, role, dates, color = "var(--cyan)", bullets = [] }) => (
  <div className="card" style={{ width }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
      <div style={{ flex: 1 }}>
        <div className="serif" style={{ fontSize: 20, fontWeight: 600, color: 'var(--base02)', lineHeight: 1.15 }}>{name}</div>
        <div style={{ fontSize: 12.5, color: 'var(--base00)', marginTop: 2 }}>{role}</div>
      </div>
      <div className="mono" style={{ fontSize: 10.5, color: '#fff', background: color, padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>{dates}</div>
    </div>
    {bullets.length > 0 && (
      <ul style={{ margin: '10px 0 0', paddingLeft: 16, fontSize: 12.5, color: 'var(--base01)', lineHeight: 1.5 }}>
        {bullets.map((b, i) => <li key={i} style={{ marginBottom: 3 }}>{b}</li>)}
      </ul>
    )}
  </div>
);

export const SkillPile = ({ width = 480 }) => {
  const skills = [
    { t: 'Python', c: 'cyan' },
    { t: 'SQL', c: 'orange' },
    { t: 'GCP · Vertex AI', c: 'blue' },
    { t: 'Oracle DB', c: 'magenta' },
    { t: 'PostgreSQL', c: 'cyan' },
    { t: 'BigQuery', c: 'green' },
    { t: 'ETL Pipelines', c: 'yellow' },
    { t: 'LLM · RAG', c: 'magenta' },
    { t: 'Tableau', c: 'blue' },
    { t: 'Java', c: 'orange' },
    { t: 'JavaScript', c: 'yellow' },
    { t: 'Stored Procs', c: 'green' },
  ];
  return (
    <div style={{ width, display: 'flex', flexWrap: 'wrap', gap: 10, padding: 4 }}>
      {skills.map((s, i) => (
        <span key={i} className={`tag ${s.c}`} style={{ fontSize: 15, padding: '10px 16px', animation: `slidein .5s cubic-bezier(.2,1,.2,1) ${i * 0.06}s both` }}>{s.t}</span>
      ))}
    </div>
  );
};

export const ProjectGrid = ({ width = 520, onModalOpen, onModalClose }) => {
  const [selected, setSelected] = useState(null);
  const openModal = (i) => {
    setSelected(i);
    onModalOpen?.();
  };
  const closeModal = () => {
    setSelected(null);
    onModalClose?.();
  };
  const projects = [
    {
      t: 'AI Fraud Detection',
      sub: 'Vertex AI · Anomaly',
      c: '#dc322f',
      tech: ['Python', 'Vertex AI', 'BigQuery'],
      desc: 'Built an end-to-end fraud detection pipeline on Vertex AI covering transaction ingestion, feature engineering, and anomaly classification; model identified high-risk patterns across a dataset of 1M+ synthetic transactions with 89% precision.'
    },
    {
      t: 'NLP Content Modelling',
      sub: 'CNN · OCR',
      c: '#268bd2',
      tech: ['Python', 'TensorFlow', 'NLP'],
      desc: 'Developed an NLP document processing pipeline using CNN models and OCR to extract and structure unstructured text from 5+ document formats, reducing manual categorization effort for a 10K-document test corpus.'
    },
    {
      t: 'Textile DB System',
      sub: 'Relational · RT',
      c: '#2aa198',
      tech: ['Oracle', 'SQL', 'PL/SQL'],
      desc: 'Designed and implemented a relational database system supporting real-time inventory, order processing, and payment workflows with normalized schema design and query optimization.'
    },
    {
      t: 'E-Commerce App',
      sub: 'React · Auth',
      c: '#b58900',
      tech: ['React', 'Firebase', 'Firestore'],
      desc: 'Built a React-based Amazon clone with Firebase authentication, Firestore cart persistence, and dynamic product browsing across 5+ product categories.'
    },
  ];
  return (
    <>
      <div style={{ width, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {projects.map((p, i) => (
          <div
            key={i}
            onClick={(e) => { e.stopPropagation(); openModal(i); }}
            style={{ background: '#fff', border: '1.5px solid #073642', borderRadius: 14, padding: '16px 16px 18px', boxShadow: '4px 4px 0 #073642', animation: `slidein .5s cubic-bezier(.2,1,.2,1) ${i * 0.1}s both`, position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-2px, -2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: p.c }}/>
            <div className="serif" style={{ fontSize: 17, fontWeight: 600, color: '#073642', marginTop: 6 }}>{p.t}</div>
            <div className="mono" style={{ fontSize: 11, color: '#586e75', marginTop: 4, textTransform: 'uppercase', letterSpacing: '.04em' }}>{p.sub}</div>
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {p.tech.map((t, j) => (
                <span key={j} style={{ fontSize: 10, fontFamily: 'var(--mono)', padding: '4px 8px', borderRadius: 6, background: `${p.c}18`, color: p.c, border: `1px solid ${p.c}40` }}>{t}</span>
              ))}
            </div>
            <div className="mono" style={{ fontSize: 9, color: '#93a1a1', marginTop: 10, textAlign: 'center' }}>Click for details</div>
          </div>
        ))}
      </div>
      {selected !== null && (
        <div
          onClick={(e) => { e.stopPropagation(); closeModal(); }}
          style={{ position: 'fixed', top: 80, left: 20, right: 0, bottom: 70, background: 'rgba(0,43,54,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, animation: 'fadeIn 0.2s ease' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', border: '2px solid #073642', borderRadius: 18, padding: '28px 32px', boxShadow: '8px 8px 0 #073642', maxWidth: 480, width: '90vw', margin: 16, maxHeight: '100%', overflowY: 'auto', position: 'relative', animation: 'pop 0.3s cubic-bezier(.2,1.4,.3,1)' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: projects[selected].c }}/>
            <button
              onClick={(e) => { e.stopPropagation(); closeModal(); }}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#586e75', lineHeight: 1 }}
            >×</button>
            <div className="serif" style={{ fontSize: 24, fontWeight: 600, color: '#073642', marginTop: 8, marginBottom: 6 }}>{projects[selected].t}</div>
            <div className="mono" style={{ fontSize: 12, color: projects[selected].c, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 16 }}>{projects[selected].sub}</div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: '#073642', margin: '0 0 18px', fontFamily: 'var(--sans)' }}>{projects[selected].desc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {projects[selected].tech.map((t, j) => (
                <span key={j} style={{ fontSize: 12, fontFamily: 'var(--mono)', padding: '6px 12px', borderRadius: 8, background: `${projects[selected].c}18`, color: projects[selected].c, border: `1px solid ${projects[selected].c}40` }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const OpenToWork = ({ width = 280 }) => (
  <div style={{ width, background: 'linear-gradient(135deg, #859900 0%, #2aa198 100%)', borderRadius: 16, padding: '20px 24px', boxShadow: '4px 4px 0 #073642', border: '1.5px solid #073642' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fdf6e3', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#fdf6e3', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Open to Work</span>
    </div>
    <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600, color: '#fdf6e3', lineHeight: 1.25, marginBottom: 8 }}>
      Full-Time Roles
    </div>
    <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'rgba(253,246,227,0.9)', lineHeight: 1.4 }}>
      Data Engineering · ML Platform · Backend
    </div>
    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'rgba(253,246,227,0.75)', marginTop: 10 }}>
      Available Immediately
    </div>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.1); }
      }
    `}</style>
  </div>
);

export const TeachStack = () => (
  <div className="teach-stack" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
    <div style={{ animation: 'slidein .6s cubic-bezier(.2,1,.2,1) both', transform: 'scale(0.7)', transformOrigin: 'top left' }}>
      <ExcelSheet />
    </div>
    <div style={{ animation: 'slidein .6s cubic-bezier(.2,1,.2,1) .15s both', marginLeft: 14, transform: 'scale(0.7)', transformOrigin: 'top left' }}>
      <CodeWindow />
    </div>
  </div>
);

const Illus = {
  USAMap,
  Globe,
  UniCard,
  BachCard,
  Calendar,
  CodeWindow,
  ExcelSheet,
  CompanyCard,
  SkillPile,
  ProjectGrid,
  TeachStack,
  OpenToWork,
};

export default Illus;
