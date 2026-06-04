import { useState, useEffect } from 'react';

function Portfolio({ tweaks, onReplay }) {
  const [hasRealPhoto, setHasRealPhoto] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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

  const showFlipped = hasRealPhoto && (isHovering ? !isFlipped : isFlipped);

  return (
    <div className="portfolio mode-enter">
      <div className="portfolio-inner">
        {/* Hero */}
        <section className="hero-grid">
          <div>
            <h1 className="display">
              Hello, I am <span style={{ color: 'var(--cyan)' }}>Bhavana</span>
            </h1>
            <p className="body" style={{ marginTop: 18, fontSize: 16.5, maxWidth: 520 }}>
              I'm a Computer Science grad student at <strong>CSU Fullerton</strong>, finishing my Master's in May 2026. I work on databases, AI-driven backend systems, and the unglamorous-but-thrilling art of making queries fast.
            </p>
            <p className="body" style={{ maxWidth: 520 }}>
              Two co-ops at Nokia, two-and-a-half years at Cognizant, and a teaching assistantship in Business Analytics later — I'm looking for full-time roles in <strong>data engineering, ML platform, or backend</strong> work where I can build things that scale.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
              <a className="btn-cta" href="/Bhavana_Resume.pdf" target="_blank" rel="noopener">Download resume ↓</a>
              <a className="btn-soft" href="https://www.linkedin.com/in/bhavana-athavane/" target="_blank" rel="noopener">LinkedIn ↗</a>
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
            <ContactRow icon="✉" label="bhavana.sa@csu.fullerton.edu"/>
            <ContactRow icon="in" label="bhavana-athavane" link="https://www.linkedin.com/in/bhavana-athavane/"/>
            <ContactRow icon="📍" label="Fullerton, California, USA"/>
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

        {/* Experience timeline */}
        <section style={{ marginBottom: 56 }}>
          <h2 className="section">Experience</h2>
          <div className="timeline">
            <TLItem
              color="cyan" tag="Jan 2026 – Present"
              role="Graduate Teaching Assistant — ISDS 361B"
              org="California State University, Fullerton"
              bullets={[
                "Mentor 50+ students/semester in applied business analytics — 95% completion rate, 18% lift in average quiz scores.",
                "Hands-on instruction in advanced Excel (VLOOKUP, INDEX-MATCH, Pivot Tables, Power Query, Macros) and SQL across 100K+ row datasets."
              ]}
            />
            <TLItem
              color="blue" tag="Sep – Dec 2025"
              role="Database Software Engineer — Co-Op"
              org="Nokia · Sunnyvale, CA"
              bullets={[
                "Designed and optimized relational schemas across Oracle, MySQL, PostgreSQL — query latency ↓ 55%.",
                "Engineered SQL queries, stored procs, and multi-level indexes that cut ETL pipeline runtime by 65%.",
                "Built Python REST integrations connecting backend services to OLTP databases, reducing end-to-end latency."
              ]}
            />
            <TLItem
              color="blue" tag="May – Aug 2025"
              role="Platform Engineering Architect — Co-Op"
              org="Nokia · Sunnyvale, CA"
              bullets={[
                "AI-powered fault diagnostic pipeline on Vertex AI — 82% classification accuracy, MTTR ↓ 41%.",
                "Scalable log pipelines on GCP (Pub/Sub, Dataflow, BigQuery) handling real-time telemetry across 200+ nodes.",
                "Integrated LLM semantic search (RAG) across CMDB, Jira, and knowledge bases — runbooks surfaced 3× faster."
              ]}
            />
            <TLItem
              color="orange" tag="Dec 2023 – Aug 2024"
              role="Senior Systems Engineer"
              org="Cognizant · Bangalore, India"
              bullets={[
                "Led Oracle DB performance engineering — system throughput ↑ 30%, supporting SLA compliance.",
                "Built automated SQL data-validation framework in Python + PL/SQL, reducing reporting inconsistencies by 20%."
              ]}
            />
            <TLItem
              color="orange" tag="Mar 2022 – Dec 2023"
              role="Programmer Analyst Trainee"
              org="Cognizant · Bangalore, India"
              bullets={[
                "Automated 8 internal ETL workflows — efficiency ↑ 20%, freed up 15 hrs/week for higher-value analytics.",
                "Multi-source data validation across Oracle DB and SQL Server; delivered 6 Tableau dashboards across revenue, ops, compliance."
              ]}
            />
          </div>
        </section>

        {/* Projects */}
        <section style={{ marginBottom: 56 }}>
          <h2 className="section">Selected Projects</h2>
          <div className="two-col-grid gap-sm">
            <ProjectCard
              title="AI-Powered Financial Fraud Detection"
              tag="VERTEX AI · ANOMALY"
              color="#dc322f"
              body="End-to-end fraud detection pipeline integrating large-scale transaction ingestion, feature engineering, and Vertex AI anomaly classification to identify high-risk financial patterns."
            />
            <ProjectCard
              title="Content Modelling using NLP"
              tag="CNN · OCR · NLP"
              color="#268bd2"
              body="NLP-driven document processing pipeline using CNN models and OCR to extract, structure, and summarize unstructured textual data for downstream analytics."
            />
            <ProjectCard
              title="Textile Database Management System"
              tag="ORACLE · NORMALIZATION"
              color="#2aa198"
              body="Relational database system supporting real-time inventory, order processing, and payment workflows — normalized schema design and aggressive query optimization."
            />
            <ProjectCard
              title="E-Commerce Web Application"
              tag="REACT · AUTH · CART"
              color="#b58900"
              body="React-based Amazon-style storefront with authentication, cart persistence, and dynamic product browsing — built during internship."
            />
          </div>
        </section>

        {/* Skills */}
        <section style={{ marginBottom: 56 }}>
          <h2 className="section">Technical Skills</h2>
          <div className="two-col-grid">
            <div>
              <SkillGroup title="Programming" items={[
                { l: 'Python', n: 5 }, { l: 'SQL', n: 5 }, { l: 'Java', n: 4 }, { l: 'JavaScript', n: 4 },
              ]}/>
              <SkillGroup title="Databases" items={[
                { l: 'Oracle DB', n: 5 }, { l: 'PostgreSQL', n: 5 }, { l: 'MySQL', n: 4 }, { l: 'SQL Server', n: 4 }, { l: 'AWS Redshift', n: 3 },
              ]}/>
            </div>
            <div>
              <SkillGroup title="Cloud & AI" items={[
                { l: 'Google Cloud (GCP)', n: 5 }, { l: 'Vertex AI', n: 4 }, { l: 'BigQuery ML', n: 4 }, { l: 'LLM / RAG', n: 4 }, { l: 'NLP', n: 3 },
              ]}/>
              <SkillGroup title="Tools" items={[
                { l: 'Git', n: 5 }, { l: 'Tableau', n: 4 }, { l: 'Jira REST APIs', n: 4 }, { l: 'ETL Pipelines', n: 5 },
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

function TLItem({ color, tag, role, org, bullets }) {
  return (
    <div className={`tl-item ${color}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
        <h3 className="sub" style={{ marginBottom: 2 }}>{role}</h3>
        <span className={`tag ${color}`}>{tag}</span>
      </div>
      <div className="mono" style={{ fontSize: 12, color: 'var(--base00)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>{org}</div>
      <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--base01)', fontSize: 14, lineHeight: 1.55 }}>
        {bullets.map((b, i) => <li key={i} style={{ marginBottom: 4 }}>{b}</li>)}
      </ul>
    </div>
  );
}

function ProjectCard({ title, tag, color, body }) {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden', paddingTop: 22 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: color }}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <h3 className="sub">{title}</h3>
      </div>
      <div className="mono" style={{ fontSize: 11, color: color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>{tag}</div>
      <p className="body" style={{ marginBottom: 0 }}>{body}</p>
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
