import { useState, useEffect } from 'react';

const HERO_METRICS = [
  { value: '4', label: 'Shipped data & AI projects' },
  { value: '8+', label: 'Production data pipelines' },
  { value: '500K+', label: 'Transactions & telemetry processed' },
  { value: '3', label: 'Years in production systems' },
];

const TECHNOLOGY_STACK = [
  'SQL',
  'Python',
  'GCP',
  'BigQuery',
  'Vertex AI',
  'ETL',
  'Tableau',
  'NLP',
  'RAG',
  'Oracle',
];

const PROJECTS = [
  {
    title: 'AI-Powered Financial Fraud Detection System',
    tag: 'Vertex AI · Anomaly Detection · BigQuery',
    color: '#dc322f',
    tech: ['Vertex AI', 'BigQuery', 'Python', 'Cloud Functions'],
    body: 'Built an end-to-end fraud detection pipeline on Vertex AI covering transaction ingestion, feature engineering, and anomaly classification; identified high-risk patterns with 89% precision.',
    bullets: [
      'Ingested and processed 1M+ synthetic transactions through feature engineering pipeline.',
      'Trained and deployed anomaly detection model achieving 89% precision on transaction classification.',
      'Integrated model outputs with alerting system for real-time fraud response.',
    ],
    url: 'https://github.com/Bhavanasa1902/AI-powered-Financial-Fraud-Detection-Anomaly-Analysis',
  },
  {
    title: 'Content Modelling using NLP',
    tag: 'CNN · OCR · NLP',
    color: '#268bd2',
    tech: ['NLP', 'OCR', 'TensorFlow', 'Python'],
    body: 'Developed NLP document processing pipeline using CNN models and OCR to extract and structure unstructured text from diverse document formats.',
    bullets: [
      'Processed 5+ document formats using OCR and text cleaning pipelines.',
      'Trained CNN models to classify text segments and extract structured metadata.',
      'Reduced manual categorization effort for 10K-document test corpus through automation.',
    ],
    url: 'https://github.com/Bhavanasa1902/nlp-document-modeling',
  },
  {
    title: 'Textile Database Management System',
    tag: 'Oracle · PL/SQL · Normalization',
    color: '#2aa198',
    tech: ['Oracle', 'PL/SQL', 'SQL', 'Reporting'],
    body: 'Designed and implemented a normalized textile inventory and order system with real-time transaction support and analytical reporting.',
    bullets: [
      'Created a normalized schema for orders, inventory, and supplier tracking.',
      'Built stored procedures to keep stock and pricing consistent in real time.',
      'Added reporting queries for demand forecasting and production planning.',
    ],
    url: 'https://github.com/Bhavanasa1902/textile-db-management',
  },
  {
    title: 'E-Commerce Web Application',
    tag: 'React · Firebase · Firestore',
    color: '#b58900',
    tech: ['React', 'Firebase', 'Firestore', 'Auth'],
    body: 'Built a React-based Amazon clone with Firebase authentication, Firestore cart persistence, and dynamic product browsing across 5+ categories.',
    bullets: [
      'Implemented product discovery with search and filtering across 5+ product categories.',
      'Built Firebase authentication, Firestore cart persistence, and secure checkout flow.',
      'Optimized app performance with lazy loading and client-side caching.',
    ],
    url: 'https://github.com/Bhavanasa1902/ecommerce-react-store',
  },
  {
    title: 'Book to Playlist',
    tag: 'LLM · Music API · Web App',
    color: '#859900',
    tech: ['LLM', 'React', 'Spotify API', 'Python'],
    body: 'AI-powered web application that transforms book themes and emotions into curated Spotify playlists using LLM analysis and music API integration.',
    bullets: [
      'Integrated LLM to analyze book themes, emotions, and narrative elements from user input.',
      'Connected Spotify API to search and curate music matching extracted book characteristics.',
      'Built interactive React interface for book input and playlist visualization.',
    ],
    url: 'https://github.com/Bhavanasa1902/book-to-playlist',
  },
  {
    title: 'CryptoZombies Arena',
    tag: 'Blockchain · Solidity · Web3',
    color: '#6c71c4',
    tech: ['Solidity', 'Web3', 'React', 'Ethereum'],
    body: 'Built an interactive blockchain game using Solidity smart contracts and Web3 integration for on-chain arena battles.',
    bullets: [
      'Developed Solidity smart contracts for NFT-enabled gameplay and token interactions.',
      'Connected a React front end with Web3 wallets for seamless player engagement.',
      'Designed game logic for battles, rewards, and on-chain state updates.',
    ],
    url: 'https://github.com/Bhavanasa1902/CryptoZombies-Arena',
  },
  {
    title: 'TitanFund',
    tag: 'Fintech · Data Analytics · Dashboard',
    color: '#b58900',
    tech: ['React', 'Python', 'Analytics', 'Visualization'],
    body: 'Developed a fintech dashboard platform for portfolio insights, analytics, and investment tracking.',
    bullets: [
      'Built a dashboard experience for tracking investment performance and portfolio metrics.',
      'Connected backend analytics to frontend visualizations for real-time data updates.',
      'Enabled users to explore fund performance with dynamic filtering and charting.',
    ],
    url: 'https://github.com/Bhavanasa1902/TitanFund',
  },
];

const EXPERIENCE = [
  {
    tag: 'Graduate TA',
    role: 'Graduate Teaching Assistant — ISDS 361B',
    org: 'California State University, Fullerton',
    dates: 'Jan 2026 – May 2026',
    bullets: [
      'Mentored 50+ students per semester in Excel, SQL, and business analytics.',
      'Guided labs covering VLOOKUP, INDEX/MATCH, Pivot Tables, Power Query, and SQL.',
      'Helped learners translate business questions into structured analysis.',
    ],
    color: 'cyan',
  },
  {
    tag: 'Nokia SWE',
    role: 'Database Software Engineer — Co-Op',
    org: 'Nokia · Sunnyvale, CA',
    dates: 'Sep – Dec 2025',
    bullets: [
      'Designed 4+ relational database schemas in PostgreSQL and MySQL for AI-driven inference pipelines, improving avg query response time by ~15% through composite indexing and normalization.',
      'Consolidated 3 redundant ETL scheduled jobs into a single stored procedure pipeline, cutting avg batch completion time.',
      'Built Python REST API integrations connecting backend services to OLTP databases, reducing avg DB round-trips per request by ~40%.',
    ],
    color: 'blue',
  },
  {
    tag: 'Nokia Platform',
    role: 'Platform Engineering Architect — Co-Op',
    org: 'Nokia · Sunnyvale, CA',
    dates: 'May – Aug 2025',
    bullets: [
      'Designed an AI-powered fault diagnostic pipeline on Google Cloud Vertex AI achieving 82% fault classification accuracy; contributed to 41% reduction in Mean Time to Resolution (MTTR).',
      'Built log-processing pipelines on GCP (Pub/Sub → Dataflow → BigQuery) handling real-time telemetry, cutting manual triage effort by ~80% and enabling automated alerting.',
      'Integrated LLM-powered semantic search using RAG architecture across CMDB, JIRA, and knowledge bases, reducing avg incident resolution time by over 35%.',
    ],
    color: 'blue',
  },
  {
    tag: 'Cognizant SWE',
    role: 'Senior Systems Engineer',
    org: 'Cognizant · Bangalore, India',
    dates: 'Dec 2023 – Aug 2024',
    bullets: [
      'Led Oracle DB performance engineering initiative across 3 production systems, improving overall throughput by 30% through query analysis, index rebuilding, and partition pruning.',
      'Developed automated SQL data-validation framework in Python and PL/SQL spanning Oracle DB and SQL Server, catching ~200 cross-system discrepancies per month and reducing reconciliation time by 20%.',
    ],
    color: 'orange',
  },
  {
    tag: 'Cognizant Analyst',
    role: 'Programmer Analyst Trainee',
    org: 'Cognizant · Bangalore, India',
    dates: 'Mar 2022 – Dec 2023',
    bullets: [
      'Automated 8 internal ETL workflows using Python and SQL, reducing end-to-end processing time by ~20% and freeing ~15 hours/week of analyst time.',
      'Performed data validation across Oracle DB and SQL Server for 4 production pipelines; built and delivered 6 executive Tableau dashboards tracking KPIs across revenue, operations, and compliance.',
    ],
    color: 'orange',
  },
];

function Portfolio({ tweaks, onReplay }) {
  const [hasRealPhoto, setHasRealPhoto] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [activeExperience, setActiveExperience] = useState(0);

  useEffect(() => {
    let timer;
    const img = new Image();
    img.onload = () => {
      setHasRealPhoto(true);
      timer = setTimeout(() => setIsFlipped(true), 800);
    };
    img.onerror = () => setHasRealPhoto(false);
    img.src = '/photo/bhavana.jpg';
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const showFlipped = hasRealPhoto && (isHovering ? !isFlipped : isFlipped);

  return (
    <div className="portfolio mode-enter">
      <div className="portfolio-inner">
        {/* Hero */}
        <section className="hero-grid">
          <div>
            <h1 className="display">
              I build the data foundations that let AI and analytics scale.
            </h1>
            <p className="body" style={{ marginTop: 18, fontSize: 16.5, maxWidth: 560 }}>
              After starting in Bangalore and earning my MS in Computer Science at <strong>CSU Fullerton</strong>, I focus on turning complex data systems into reliable, production-ready pipelines.
            </p>
            <p className="body" style={{ maxWidth: 560 }}>
              I bridge the gap between business questions and backend systems by building fast databases, cloud ETL, and ML-ready data workflows that teams can trust.
            </p>
            <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginTop: 28, marginBottom: 24 }}>
              {HERO_METRICS.map((metric) => (
                <div key={metric.label} className="card" style={{ padding: '18px 16px', textAlign: 'center' }}>
                  <div className="serif" style={{ fontSize: 28, color: 'var(--base02)' }}>{metric.value}</div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--base01)', marginTop: 4 }}>{metric.label}</div>
                </div>
              ))}
            </div>
            <div className="mono" style={{ fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--base01)', marginBottom: 14 }}>Superpowers</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginTop: 8 }}>
              <div className="card">
                <div className="sub" style={{ fontSize: 16, marginBottom: 8 }}>Reliable pipelines</div>
                <p className="body" style={{ margin: 0, color: 'var(--base01)' }}>
                  Build ETL and backend flows that avoid surprises, keep data fresh, and scale with demand.
                </p>
              </div>
              <div className="card">
                <div className="sub" style={{ fontSize: 16, marginBottom: 8 }}>Production-ready data</div>
                <p className="body" style={{ margin: 0, color: 'var(--base01)' }}>
                  Design databases, schemas, and observability so teams can ship analytics and ML with confidence.
                </p>
              </div>
              <div className="card">
                <div className="sub" style={{ fontSize: 16, marginBottom: 8 }}>Impact-first work</div>
                <p className="body" style={{ margin: 0, color: 'var(--base01)' }}>
                  Focus on outcomes: faster queries, lower batch time, and clearer business insights.
                </p>
              </div>
            </div>
            <div className="chip-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
              {TECHNOLOGY_STACK.map((tech) => (
                <span key={tech} className="chip">{tech}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <a className="btn-cta" href="/Bhavana_Resume.pdf" target="_blank" rel="noopener">Download resume ↓</a>
              <a className="btn-soft" href="https://www.linkedin.com/in/bhavana-athavane/" target="_blank" rel="noopener">LinkedIn ↗</a>
              <a className="btn-soft" href="https://github.com/Bhavanasa1902" target="_blank" rel="noopener">GitHub ↗</a>
              <button className="btn-soft" onClick={onReplay}>Replay intro ↺</button>
            </div>
          </div>
          <div
            className={`blob-wrap ${hasRealPhoto ? 'flip-enabled' : ''}`}
            onMouseEnter={() => hasRealPhoto && setIsHovering(true)}
            onMouseLeave={() => hasRealPhoto && setIsHovering(false)}
          >
            <div className={`flip-card ${showFlipped ? 'flipped' : ''}`}>
              <div className="flip-card-front">
                <svg viewBox="0 0 340 420" preserveAspectRatio="none">
                  <path d="M 170 20 C 250 20, 320 80, 320 180 C 320 280, 280 360, 200 400 C 120 420, 40 380, 30 280 C 20 180, 80 60, 170 20 Z" fill="#2aa198"/>
                </svg>
                <img src="/bitmoji/pro_arms.png" alt="Bhavana bitmoji"/>
              </div>
              <div className="flip-card-back">
                <svg viewBox="0 0 340 420" preserveAspectRatio="none">
                  <defs>
                    <clipPath id="blob-clip">
                      <path d="M 170 20 C 250 20, 320 80, 320 180 C 320 280, 280 360, 200 400 C 120 420, 40 380, 30 280 C 20 180, 80 60, 170 20 Z"/>
                    </clipPath>
                  </defs>
                  <image
                     href="/photo/bhavana.jpg"
                     x="0" y="0"
                     width="340" height="420"
                     preserveAspectRatio="xMidYMin slice"
                     clipPath="url(#blob-clip)"
                   />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section style={{ marginBottom: 56 }}>
          <h2 className="section">Contact</h2>
          <div className="contact-grid">
            <ContactRow icon="✉" label="bhavanasathavane@gmail.com" link="mailto:bhavanasathavane@gmail.com"/>
            <ContactRow icon="📞" label="+1 (657) 751-9230" link="tel:+16577519230"/>
            <ContactRow icon="📍" label="Fullerton, California, USA"/>
            <ContactRow icon="💼" label="Open to data platform / AI engineering roles"/>
          </div>
        </section>

        {/* Education */}
        <section style={{ marginBottom: 56 }}>
          <h2 className="section">Education</h2>
          <div className="two-col-grid">
            <div>
              <h3 className="sub">California State University, Fullerton</h3>
              <div className="mono" style={{ fontSize: 12, color: 'var(--cyan)', marginBottom: 6 }}>2024 – MAY 2026</div>
              <p className="body">Master of Science, Computer Science</p>
            </div>
            <div>
              <h3 className="sub">Jyothy Institute of Technology</h3>
              <div className="mono" style={{ fontSize: 12, color: 'var(--cyan)', marginBottom: 6 }}>2018 – JULY 2022</div>
              <p className="body">Bachelor of Engineering, Computer Science · Bangalore, India</p>
            </div>
          </div>
        </section>

        {/* Experience tabs */}
        <section style={{ marginBottom: 56 }}>
          <h2 className="section">Experience</h2>
          <div className="experience-tabs">
            {EXPERIENCE.map((item, index) => (
              <button
                key={item.tag}
                className={`tab-button ${activeExperience === index ? 'active' : ''}`}
                onClick={() => setActiveExperience(index)}
              >
                {item.tag}
              </button>
            ))}
          </div>
          <div className="tab-panel">
            {(() => {
              const item = EXPERIENCE[activeExperience];
              return (
                <div className="card" style={{ padding: '24px 26px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
                    <div>
                      <div className="serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--base02)', lineHeight: 1.15 }}>{item.role}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--base00)', marginTop: 4 }}>{item.org}</div>
                    </div>
                    <div className="mono" style={{ fontSize: 10.5, color: '#fff', background: item.color === 'orange' ? '#cb4b16' : item.color === 'blue' ? '#268bd2' : '#2aa198', padding: '6px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>{item.dates}</div>
                  </div>
                  <ul style={{ margin: '0', paddingLeft: 18, fontSize: 14, color: 'var(--base01)', lineHeight: 1.55 }}>
                    {item.bullets.map((bullet, idx) => (
                      <li key={idx} style={{ marginBottom: 8 }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>
        </section>

        {/* Projects */}
        <section style={{ marginBottom: 56 }}>
          <h2 className="section">Selected Projects</h2>
          <div className="two-col-grid gap-sm">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        {/* Skills */}
        <section style={{ marginBottom: 56 }}>
          <h2 className="section">Technical Skills & Expertise</h2>
          <div className="two-col-grid">
            <div>
              <SkillGroup title="Programming & Query" items={[
                { l: 'SQL / PL/SQL / Query Optimization', n: 5 },
                { l: 'Python', n: 4 },
                { l: 'ETL/ELT Pipeline Development', n: 4 },
                { l: 'Database Design & Normalization', n: 4 },
                { l: 'Java / JavaScript', n: 2 },
              ]}/>
              <SkillGroup title="Databases & Data Warehousing" items={[
                { l: 'PostgreSQL / MySQL', n: 4 },
                { l: 'Oracle DB / SQL Server', n: 4 },
                { l: 'BigQuery / Redshift', n: 3 },
                { l: 'Data Warehousing Architecture', n: 3 },
                { l: 'Stored Procedures & Triggers', n: 4 },
              ]}/>
            </div>
            <div>
              <SkillGroup title="Cloud & AI" items={[
                { l: 'Google Cloud Platform (GCP)', n: 4 },
                { l: 'Vertex AI / ML Pipelines', n: 3 },
                { l: 'BigQuery ML / Analytics', n: 3 },
                { l: 'LLM Integration & Semantic Search', n: 4 },
                { l: 'NLP & Text Analytics', n: 3 },
              ]}/>
              <SkillGroup title="Tools & DevOps" items={[
                { l: 'Git / Version Control', n: 4 },
                { l: 'Tableau / Data Visualization', n: 4 },
                { l: 'REST APIs / Microservices', n: 4 },
                { l: 'Docker / Kubernetes', n: 2 },
                { l: 'Jira / CI-CD Pipelines', n: 3 },
              ]}/>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1.5px solid var(--base2)', paddingTop: 24, marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="mono" style={{ fontSize: 12, color: 'var(--base00)' }}>© 2026 BHAVANA SUDHAKAR ATHAVANE</div>
          <button className="btn-soft" onClick={onReplay}>↺ Replay intro story</button>
        </footer>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, link }) {
  const inner = (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--base2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--base02)' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--base02)' }}>{label}</div>
    </div>
  );
  if (link) return <a href={link} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>{inner}</a>;
  return inner;
}

function ProjectCard({ title, tag, color, tech = [], body, bullets = [], url }) {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden', paddingTop: 22 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: color }}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <h3 className="sub">{title}</h3>
      </div>
      <div className="mono" style={{ fontSize: 11, color: color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>{tag}</div>
      <div className="chip-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {tech.map((item) => (
          <span key={item} className="chip">{item}</span>
        ))}
      </div>
      <p className="body" style={{ marginBottom: 14 }}>{body}</p>
      {bullets.length > 0 && (
        <ul style={{ margin: '0 0 18px', paddingLeft: 18, color: 'var(--base01)', fontSize: 14, lineHeight: 1.55 }}>
          {bullets.map((bullet, idx) => (
            <li key={idx} style={{ marginBottom: 6 }}>{bullet}</li>
          ))}
        </ul>
      )}
      {url && (
        <a className="btn-soft" href={url} target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center' }}>
          View Code ↗
        </a>
      )}
    </div>
  );
}

function SkillGroup({ title, items }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 className="sub" style={{ fontSize: 18, marginBottom: 8 }}>{title}</h3>
      {items.map((s, i) => (
        <div className="skill" key={i}>
          <div className="lab">{s.l}</div>
          <div className="bar">
            {[1,2,3,4,5].map(p => <div key={p} className={`pip ${p <= s.n ? 'on' : ''}`}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Portfolio;
