import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────────────────────────
   Typing Effect Component (custom, React 18 StrictMode safe)
   ───────────────────────────────────────────────────────────── */
function TypingText({ texts, speed = 80, deleteSpeed = 40, pauseTime = 2000 }) {
  const [display, setDisplay] = useState('')
  const state = useRef({ textIdx: 0, charIdx: 0, deleting: false, paused: false })

  useEffect(() => {
    const s = state.current
    const current = texts[s.textIdx]

    if (s.paused) {
      const t = setTimeout(() => {
        s.paused = false
        s.deleting = true
        setDisplay(d => d) // trigger re-render
      }, pauseTime)
      return () => clearTimeout(t)
    }

    const timeout = s.deleting ? deleteSpeed : speed
    const t = setTimeout(() => {
      if (!s.deleting) {
        s.charIdx++
        setDisplay(current.slice(0, s.charIdx))
        if (s.charIdx === current.length) s.paused = true
      } else {
        s.charIdx--
        setDisplay(current.slice(0, s.charIdx))
        if (s.charIdx === 0) {
          s.deleting = false
          s.textIdx = (s.textIdx + 1) % texts.length
        }
      }
    }, timeout)

    return () => clearTimeout(t)
  }, [display, texts, speed, deleteSpeed, pauseTime])

  return <span>{display}<span className="typing-cursor">|</span></span>
}

/* ─────────────────────────────────────────────────────────────
   DATA — Skills (from resume)
   ───────────────────────────────────────────────────────────── */
const SKILLS = {
  'Languages & Core': ['JavaScript (ES6+)', 'TypeScript', 'PHP', 'SQL', 'HTML5', 'CSS3', 'Python'],
  'Frontend & UI': ['React.js', 'Redux Toolkit', 'Tailwind CSS', 'Bootstrap 5', 'Vite', 'GSAP', 'PWA'],
  'Backend & Databases': ['Node.js', 'Express.js', 'PHP (MVC)', 'REST APIs', 'MySQL', 'MongoDB', 'Firebase'],
  'Security & QA': ['CSRF Protection', 'Bcrypt/Argon2id', 'CSP Nonces', 'RBAC', 'Playwright (E2E)', 'CDP'],
  'SEO & DevTools': ['Schema.org JSON-LD', 'Technical SEO', 'Search Console', 'Git', 'GitHub', 'Postman', 'Linux'],
}

/* ─────────────────────────────────────────────────────────────
   DATA — Experience (from resume)
   ───────────────────────────────────────────────────────────── */
const EXPERIENCES = [
  {
    id: 'logistics24x7',
    tabLabel: 'Logistics24x7',
    company: 'Logistics24x7 India Pvt Ltd',
    location: 'Okhla, New Delhi',
    role: 'Web Developer Intern',
    period: 'Sept 2026 – Present',
    tech: ['PHP', 'MySQL', 'Tailwind CSS', 'Playwright'],
    subProjects: [
      {
        title: 'Logistics24x7.com & GKSCPL — Full-Stack Redesign, Dual CMS & Auth Overhaul',
        points: [
          'Redesigned and deployed 30+ production pages across two freight forwarding platforms, building a standalone Tailwind CSS build pipeline that eliminated 200KB+ of CDN bloat and dynamic routing for international trade corridors.',
          'Architected a reusable Dual CMS Engine combining a 6-module Admin CRUD Panel with Live Inline Editing (real-time DOM text updates via Fetch API with strict SQL table/column whitelist validation and CSRF protection).',
          'Engineered automated recruitment and client inquiry pipelines using MySQL and PHPMailer (SSL SMTP) for instant candidate dossier routing, alongside an enterprise RBAC system with Bcrypt hashing and superadmin safety locks.',
        ],
      },
      {
        title: 'WebTechPrime — Solo Full-Stack PWA & 7-Module Admin Suite',
        points: [
          'Built and deployed an IT services Progressive Web App (PWA) from scratch with service worker caching and a custom inline-editing helper enabling real-time content updates across 78+ dynamic text nodes without page reloads.',
          'Developed a 7-module Admin Panel featuring drag-to-reorder navigation, dynamic portfolio/service CRUD, and an IP-tracked Administrative Audit Log recording actor, target, IP address, and timestamp for every state change.',
          'Hardened platform security with password_hash authentication, anti-CSRF tokens on all state-mutating forms, session regeneration on login, and automated server-side cleanup for orphaned media files.',
        ],
      },
      {
        title: 'JeevanJyoti Trust — Automated Playwright QA & Performance Optimization',
        points: [
          'Executed an automated Playwright E2E QA suite across 14 public and admin portals, uncovering and resolving 22+ critical/high defects including DOM modal ID collisions, silent multipart CV upload failures, and broken PHPMailer routing.',
          'Refactored 3,170 lines of inline CSS into cached external stylesheets (71% payload reduction), migrated 5 legacy donation workflows to Bootstrap 5, and documented a 30-node dependency graph for safe refactoring.',
        ],
      },
      {
        title: 'Cross-Project Enterprise Technical SEO Engine (All 4 Websites)',
        points: [
          'Engineered a 3-tier dynamic meta cascade, cryptographic CSP nonces, interconnected Schema.org JSON-LD @graph schemas (6 entity types), and hardened robots.txt/sitemap.xml directives to optimize search crawl budget.',
        ],
      },
    ],
  },
  {
    id: 'arth',
    tabLabel: 'Arth Institute',
    company: 'Arth Institute',
    location: 'New Delhi',
    role: 'Software Development Intern',
    period: 'Jun – Aug 2024',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
    points: [
      'Developed and documented 8+ RESTful API endpoints using Node.js and Express.js for a multi-user web platform.',
      'Optimized MongoDB schemas and indexing strategies, reducing average API query execution time by 20%.',
      'Implemented stateless JWT authentication and Role-Based Access Control (RBAC) middleware to secure protected routes.',
    ],
  },
]

/* ─────────────────────────────────────────────────────────────
   DATA — Projects (from resume)
   ───────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    title: 'AttendTrack — Real-Time Attendance & GPS Tracker',
    tech: ['React.js', 'Firebase', 'Leaflet.js', 'PWA'],
    description:
      'Real-time workforce tracking PWA supporting Admin and Employee roles, featuring automated 2-minute background GPS sync and interactive live route visualization on Leaflet.js maps.',
    highlights: [
      'RBAC using Firebase Auth secondary app instance pattern for seamless admin provisioning',
      '6 real-time Firestore (onSnapshot) dashboards for live workforce monitoring',
      '70% faster initial load via React lazy() code splitting',
    ],
    status: 'live',
    statusLabel: 'Flagship',
    github: 'https://github.com/MEGHRAJPARASHAR/AttendTrack',
  },
  {
    title: 'BiteRush — Full Stack Food Delivery Platform',
    tech: ['React.js', 'TypeScript', 'Redux Toolkit', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay'],
    description:
      'Production-grade food delivery platform with 3 user roles (Customer, Restaurant Owner, Delivery Partner), 8 route modules, and 30+ REST API endpoints.',
    highlights: [
      'Google OAuth 2.0 + JWT auth + OTP forgot-password via Nodemailer',
      'Razorpay payment gateway with server-side HMAC-SHA256 signature verification',
      'Real-time order tracking via Socket.IO room-based architecture',
    ],
    status: 'live',
    statusLabel: 'Live',
    live: 'https://bite-rush-delta.vercel.app/',
    github: 'https://github.com/MEGHRAJPARASHAR/BiteRush-',
  },
]

/* ─────────────────────────────────────────────────────────────
   DATA — Education (from resume)
   ───────────────────────────────────────────────────────────── */
const EDUCATION = [
  { year: '2026 – Present', degree: 'Master of Computer Applications (MCA)', school: 'Jamia Hamdard, New Delhi', score: 'Enrolled' },
  { year: '2023 – 2026', degree: 'Bachelor of Computer Applications (BCA)', school: 'JB Knowledge Park, MDU University', score: '85%' },
  { year: '2022 – 2024', degree: 'PG Diploma in Software Engineering (NIELIT)', school: 'The Institute of Commerce & Vocational Studies, New Delhi', score: 'Grade A (79%)' },
]

/* ─────────────────────────────────────────────────────────────
   DATA — Impact Stats (from resume numbers)
   ───────────────────────────────────────────────────────────── */
const STATS = [
  { num: '30+', label: 'Production Pages' },
  { num: '4', label: 'Live Websites' },
  { num: '22+', label: 'Bugs Resolved' },
  { num: '3,170', label: 'Lines Refactored' },
]

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <a href="#hero" className="nav-logo">
          <span className="logo-bracket">&lt;</span>MP<span className="logo-bracket">/&gt;</span>
        </a>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {['About', 'Experience', 'Projects', 'Contact'].map((item, i) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link" onClick={close}>
              <span className="nav-num">0{i + 1}.</span>{item}
            </a>
          ))}
          <a href="mailto:meghrajparashar@gmail.com" className="nav-cta" onClick={close}>
            Hire Me
          </a>
        </div>
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(m => !m)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>
      {menuOpen && <div className="menu-overlay" onClick={close} />}
    </>
  )
}

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-left">
        <p className="hero-intro">Hi, my name is</p>
        <h1 className="hero-name">Meghraj<br />Parashar.</h1>
        <h2 className="hero-tagline">
          <TypingText
            texts={[
              'Full Stack Web Developer.',
              'Enterprise CMS Architect.',
              'PHP & MERN Stack Builder.',
              'Playwright QA Engineer.',
              'Technical SEO Specialist.',
            ]}
            speed={70}
            deleteSpeed={35}
            pauseTime={1800}
          />
        </h2>
        <p className="hero-bio">
          Currently shipping <span className="hl">30+ production pages</span> at{' '}
          <span className="hl">Logistics24x7 India Pvt Ltd</span> — building enterprise
          CMS architectures, automated Playwright QA suites, and cross-platform
          technical SEO engines across 4 live freight forwarding websites.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn-primary">View My Work</a>
          <a
            href="https://mail.google.com/mail/?view=cm&to=meghrajparashar@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Say Hello
          </a>
        </div>
        <div className="hero-social">
          <a href="https://github.com/MEGHRAJPARASHAR" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/meghraj-parashar" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a href="mailto:meghrajparashar@gmail.com" aria-label="Email">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
          <a href="tel:+918595988011" aria-label="Phone">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="hero-right">
        <div className="code-window">
          <div className="code-titlebar">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="code-filename">meghraj.js</span>
          </div>
          <pre className="code-body"><code>
            <span className="c-keyword">const</span> <span className="c-var">developer</span> <span className="c-op">=</span> {'{'}
            <span className="c-prop">  name</span><span className="c-op">:</span> <span className="c-str">"Meghraj Parashar"</span><span className="c-op">,</span>
            <span className="c-prop">  role</span><span className="c-op">:</span> <span className="c-str">"Full Stack Dev"</span><span className="c-op">,</span>
            <span className="c-prop">  at</span><span className="c-op">:</span> <span className="c-str">"Logistics24x7"</span><span className="c-op">,</span>
            <span className="c-prop">  stack</span><span className="c-op">:</span> [<span className="c-str">"PHP"</span><span className="c-op">,</span> <span className="c-str">"React"</span><span className="c-op">,</span>
            {'          '}<span className="c-str">"Node.js"</span><span className="c-op">,</span> <span className="c-str">"MySQL"</span>]<span className="c-op">,</span>
            <span className="c-prop">  shipped</span><span className="c-op">:</span> <span className="c-str">"30+ pages"</span><span className="c-op">,</span>
            <span className="c-prop">  openTo</span><span className="c-op">:</span> <span className="c-str">"opportunities"</span>
            {'}'}<span className="c-op">;</span>
          </code></pre>
        </div>
      </div>

      <div className="scroll-hint">
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}

function StatsBar() {
  return (
    <section className="stats-bar">
      {STATS.map(s => (
        <div key={s.label} className="stat-item reveal">
          <span className="stat-num">{s.num}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </section>
  )
}

function About() {
  return (
    <section id="about" className="section">
      <h2 className="sec-heading">
        <span className="sec-num">01.</span> About Me
        <span className="sec-line" />
      </h2>
      <div className="about-grid">
        <div className="about-text">
          <p className="reveal">
            I'm a <span className="hl">Full Stack Web Developer</span> currently working at{' '}
            <span className="hl">Logistics24x7 India Pvt Ltd</span> in New Delhi, where I've
            shipped 30+ production pages across 4 live freight forwarding platforms — building
            everything from enterprise CMS architectures to automated Playwright QA suites.
          </p>
          <p className="reveal">
            My strength is bridging backend engineering with real-world business needs — designing
            Dual CMS engines with live inline editing, engineering RBAC systems with Bcrypt hashing
            and superadmin safety locks, and building cross-platform technical SEO engines with
            interconnected <span className="hl">Schema.org JSON-LD @graph schemas</span>.
          </p>
          <p className="reveal">
            Beyond my internship, I've built <span className="hl">AttendTrack</span> — a real-time
            GPS-based employee attendance PWA that got me my current job interview, and{' '}
            <span className="hl">BiteRush</span> — a production-grade food delivery platform with
            Razorpay payments and Socket.IO real-time order tracking.
          </p>

          <div className="skills-wrapper">
            {Object.entries(SKILLS).map(([cat, items]) => (
              <div key={cat} className="skill-group reveal">
                <h4 className="skill-cat">{cat}</h4>
                <div className="skill-tags">
                  {items.map(s => <span key={s} className="skill-pill">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-edu">
          <h3 className="edu-heading">Education</h3>
          <div className="edu-list">
            {EDUCATION.map(e => (
              <div key={e.degree} className="edu-item reveal">
                <span className="edu-year">{e.year}</span>
                <div>
                  <h4 className="edu-degree">{e.degree}</h4>
                  <p className="edu-school">{e.school}</p>
                  {e.score && <p className="edu-score">{e.score}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="currently-box reveal">
            <h4 className="currently-label">Currently</h4>
            <p className="currently-text">
              Shipping production code at Logistics24x7 · Pursuing MCA from Jamia Hamdard ·
              Grinding DSA on LeetCode (Striver's A2Z sheet) · Building enterprise-grade
              web platforms daily.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Experience() {
  const [activeTab, setActiveTab] = useState(0)
  const exp = EXPERIENCES[activeTab]

  return (
    <section id="experience" className="section">
      <h2 className="sec-heading">
        <span className="sec-num">02.</span> Experience
        <span className="sec-line" />
      </h2>
      <div className="exp-container">
        <div className="exp-tabs" role="tablist">
          {EXPERIENCES.map((e, i) => (
            <button
              key={e.id}
              role="tab"
              aria-selected={activeTab === i}
              className={`exp-tab ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {e.tabLabel}
            </button>
          ))}
        </div>

        <div className="exp-panel" role="tabpanel">
          <div className="exp-top">
            <div>
              <h3 className="exp-role">
                {exp.role} <span className="exp-at">@ {exp.company}</span>
              </h3>
              <p className="exp-location">{exp.location}</p>
            </div>
            <span className="exp-date">{exp.period}</span>
          </div>

          {/* Logistics24x7 — has sub-projects */}
          {exp.subProjects && exp.subProjects.map((sub, i) => (
            <div key={i} className="sub-project">
              <h4 className="sub-project-title">
                <span className="sub-arrow">▹</span> {sub.title}
              </h4>
              <ul className="exp-points">
                {sub.points.map((p, j) => <li key={j}>{p}</li>)}
              </ul>
            </div>
          ))}

          {/* Arth — has simple points */}
          {exp.points && (
            <ul className="exp-points">
              {exp.points.map((p, j) => <li key={j}>{p}</li>)}
            </ul>
          )}

          <div className="exp-tech">
            {exp.tech.map(t => <span key={t} className="tech-chip">{t}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="section">
      <h2 className="sec-heading">
        <span className="sec-num">03.</span> Projects
        <span className="sec-line" />
      </h2>
      <div className="projects-grid">
        {PROJECTS.map(p => (
          <div key={p.title} className={`proj-card ${p.statusLabel === 'Flagship' ? 'proj-featured' : ''}`}>
            <div className="proj-top">
              <svg className="proj-folder" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <div className="proj-actions">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label="Live link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  </a>
                )}
                <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                </a>
              </div>
            </div>
            <span className={`proj-status ${p.status}`}>{p.statusLabel}</span>
            <h3 className="proj-title">{p.title}</h3>
            <p className="proj-desc">{p.description}</p>
            {p.highlights && (
              <ul className="proj-highlights">
                {p.highlights.map(h => <li key={h}>{h}</li>)}
              </ul>
            )}
            <div className="proj-tech">
              {p.tech.map(t => <span key={t} className="tech-chip">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <p className="contact-eyebrow"><span className="sec-num">04.</span> What's Next?</p>
      <h2 className="contact-title">Get In Touch</h2>
      <p className="contact-body">
        I'm currently working at Logistics24x7 and always open to new opportunities —
        whether it's a full-time role, an exciting project, or just a conversation about
        web development. My inbox is always open!
      </p>
      <a
        href="https://mail.google.com/mail/?view=cm&to=meghrajparashar@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
      >
        Say Hello on Gmail
      </a>
      <div className="contact-links">
        <div className="btn-secondary">
          <a href="https://github.com/MEGHRAJPARASHAR" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <span className="dot-sep">·</span>
        <div className="btn-secondary">
          <a href="https://linkedin.com/in/meghraj-parashar" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        <span className="dot-sep">·</span>
        <div className="btn-secondary">
          <a href="tel:+918595988011">+91 85959 88011</a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>Designed & Built by <span className="hl">Meghraj Parashar</span></p>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════════
   APP — Root component with GSAP ScrollTrigger animations
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const appRef = useRef(null)

  useGSAP(() => {
    /* ── Section headings slide in ── */
    gsap.utils.toArray('.sec-heading').forEach(el => {
      gsap.from(el, {
        x: -40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    })

    /* ── Reveal elements fade up ── */
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    })

    /* ── Skill pills stagger ── */
    gsap.utils.toArray('.skill-group').forEach(group => {
      const pills = group.querySelectorAll('.skill-pill')
      gsap.from(pills, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        stagger: 0.04,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: group, start: 'top 85%' },
      })
    })

    /* ── Project cards stagger ── */
    const cards = gsap.utils.toArray('.proj-card')
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 0.7,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' },
    })

    /* ── Stats counter animation ── */
    gsap.utils.toArray('.stat-item').forEach(el => {
      gsap.from(el, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      })
    })

    /* ── Experience panel fade ── */
    gsap.from('.exp-container', {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.exp-container', start: 'top 80%' },
    })

    /* ── Contact section ── */
    gsap.from('.contact-title', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-section', start: 'top 75%' },
    })
  }, { scope: appRef })

  return (
    <div className="app" ref={appRef}>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
