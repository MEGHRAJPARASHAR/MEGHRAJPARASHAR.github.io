import { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
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
        setDisplay(d => d)
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
   3D Laptop Component (Procedural Three.js — Zero External Models)
   ───────────────────────────────────────────────────────────── */
function Laptop3D() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // Scene
    const scene = new THREE.Scene()
    let width = container.clientWidth || 500
    let height = container.clientHeight || 450

    // Camera
    const camera = new THREE.PerspectiveCamera(width < 500 ? 52 : 40, width / height, 0.1, 100)
    camera.position.set(0, 1.1, width < 500 ? 5.4 : 4.8)
    camera.lookAt(0, 0.25, 0)

    // Renderer — transparent background
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    // Studio Lighting Rig
    scene.add(new THREE.AmbientLight(0xffffff, 0.75))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4)
    keyLight.position.set(5, 7, 4)
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight(0x64ffda, 0.85)
    rimLight.position.set(-5, -2, -3)
    scene.add(rimLight)
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4)
    fillLight.position.set(0, -4, 3)
    scene.add(fillLight)

    // Materials
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x161b26, metalness: 0.85, roughness: 0.28 })
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x090c12, metalness: 0.2, roughness: 0.85 })
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x202836, metalness: 0.5, roughness: 0.2 })
    const hingeMat = new THREE.MeshStandardMaterial({ color: 0x283040, metalness: 0.9, roughness: 0.2 })

    // ── Laptop Assembly ──
    const laptop = new THREE.Group()
    scene.add(laptop)

    // Base chassis
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 2.2), metalMat)
    base.position.set(0, 0.06, 0)
    laptop.add(base)

    // Front thumb notch
    const notch = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.06), darkMat)
    notch.position.set(0, 0.11, 1.08)
    laptop.add(notch)

    // Rubber foot pads
    const padGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16)
    const padMat = new THREE.MeshBasicMaterial({ color: 0x05070a })
    ;[[-1.3, 0.005, -0.85], [1.3, 0.005, -0.85], [-1.3, 0.005, 0.85], [1.3, 0.005, 0.85]].forEach(([x, y, z]) => {
      const pad = new THREE.Mesh(padGeo, padMat)
      pad.position.set(x, y, z)
      laptop.add(pad)
    })

    // Keyboard tray
    const tray = new THREE.Mesh(new THREE.BoxGeometry(2.82, 0.015, 1.25), darkMat)
    tray.position.set(0, 0.125, -0.22)
    laptop.add(tray)

    // ── Dynamic Canvas Keyboard ──
    const kbCanvas = document.createElement('canvas')
    kbCanvas.width = 1024
    kbCanvas.height = 450
    const kbCtx = kbCanvas.getContext('2d')
    if (kbCtx) {
      kbCtx.fillStyle = '#0a0e16'
      kbCtx.fillRect(0, 0, 1024, 450)
      const rows = [
        ['ESC','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','DEL'],
        ['~','1','2','3','4','5','6','7','8','9','0','-','=','←'],
        ['TAB','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'],
        ['CAPS','A','S','D','F','G','H','J','K','L',';','\'','ENTER'],
        ['SHIFT','Z','X','C','V','B','N','M',',','.','/','SHIFT'],
        ['CTRL','OPT','CMD','          SPACE          ','CMD','OPT','◄','▲▼','►'],
      ]
      let startY = 15
      rows.forEach(row => {
        let curX = 20
        row.forEach(key => {
          let kw = (1024 - 40) / row.length - 6
          if (key.includes('SPACE')) kw = 340
          else if (key === 'SHIFT') kw = 85
          else if (['TAB','DEL','←'].includes(key)) kw = 75
          else if (['CAPS','ENTER'].includes(key)) kw = 80
          kbCtx.fillStyle = '#141b27'
          kbCtx.strokeStyle = 'rgba(100, 255, 218, 0.35)'
          kbCtx.lineWidth = 1.5
          kbCtx.beginPath()
          kbCtx.roundRect(curX, startY, kw, 52, 6)
          kbCtx.fill()
          kbCtx.stroke()
          kbCtx.fillStyle = '#94a3b8'
          kbCtx.font = '600 16px monospace'
          kbCtx.textAlign = 'center'
          kbCtx.textBaseline = 'middle'
          kbCtx.fillText(key.trim(), curX + kw / 2, startY + 27)
          curX += kw + 6
        })
        startY += 65
      })
    }
    const kbTex = new THREE.CanvasTexture(kbCanvas)
    kbTex.minFilter = THREE.LinearFilter
    const kbPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 1.22),
      new THREE.MeshStandardMaterial({ map: kbTex, roughness: 0.4, metalness: 0.1 })
    )
    kbPlane.rotation.x = -Math.PI / 2
    kbPlane.position.set(0, 0.133, -0.22)
    laptop.add(kbPlane)

    // Trackpad
    const trackpad = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.01, 0.68), trackMat)
    trackpad.position.set(0, 0.125, 0.62)
    laptop.add(trackpad)

    // Hinge
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.7, 24), hingeMat)
    hinge.rotation.z = Math.PI / 2
    hinge.position.set(0, 0.10, -1.04)
    laptop.add(hinge)

    // ── Display Lid Group ──
    const lid = new THREE.Group()
    lid.position.set(0, 0.10, -1.04)
    lid.rotation.x = -0.30
    laptop.add(lid)

    const lidBack = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.1, 0.06), metalMat)
    lidBack.position.set(0, 1.05, -0.03)
    lid.add(lidBack)

    const bezel = new THREE.Mesh(new THREE.BoxGeometry(3.18, 2.08, 0.015), darkMat)
    bezel.position.set(0, 1.05, 0.005)
    lid.add(bezel)

    // Camera + LED
    lid.add(new THREE.Mesh(new THREE.CircleGeometry(0.014, 16), new THREE.MeshBasicMaterial({ color: 0x05070a })).position.set(0, 2.03, 0.015) || lid.children[lid.children.length - 1])
    const camMesh = new THREE.Mesh(new THREE.CircleGeometry(0.014, 16), new THREE.MeshBasicMaterial({ color: 0x05070a }))
    camMesh.position.set(0, 2.03, 0.015)
    lid.add(camMesh)
    const ledMesh = new THREE.Mesh(new THREE.CircleGeometry(0.007, 12), new THREE.MeshBasicMaterial({ color: 0x22c55e }))
    ledMesh.position.set(0.05, 2.03, 0.015)
    lid.add(ledMesh)

    // ── Dynamic Terminal Screen ──
    const scrCanvas = document.createElement('canvas')
    scrCanvas.width = 1024
    scrCanvas.height = 640
    const sCtx = scrCanvas.getContext('2d')
    if (sCtx) {
      sCtx.fillStyle = '#060a12'
      sCtx.fillRect(0, 0, 1024, 640)
      // Titlebar
      sCtx.fillStyle = '#0c121e'
      sCtx.fillRect(0, 0, 1024, 46)
      // Traffic light dots
      ;[{ x: 30, c: '#ef4444' }, { x: 54, c: '#eab308' }, { x: 78, c: '#22c55e' }].forEach(d => {
        sCtx.beginPath()
        sCtx.arc(d.x, 23, 7, 0, Math.PI * 2)
        sCtx.fillStyle = d.c
        sCtx.fill()
      })
      // Title
      sCtx.fillStyle = '#64748b'
      sCtx.font = '500 17px monospace'
      sCtx.textAlign = 'center'
      sCtx.fillText('zsh — meghraj@workstation: ~/portfolio', 512, 29)
      // Code lines
      const lines = [
        { t: '// Meghraj Parashar — Production Systems', c: '#64748b' },
        { t: 'const engineer = {', c: '#38bdf8' },
        { t: '  name: "Meghraj Parashar",', c: '#f8fafc' },
        { t: '  role: "Full Stack Dev (MERN & PHP)",', c: '#64ffda' },
        { t: '  focus: ["APIs", "RBAC", "CMS"],', c: '#cbd5e1' },
        { t: '  qa: ["Playwright E2E", "Schema @graph"],', c: '#38bdf8' },
        { t: '  impact: { pages: "30+", perf: "+62%" },', c: '#facc15' },
        { t: '  status: "🟢 Open to Opportunities"', c: '#22c55e' },
        { t: '};', c: '#38bdf8' },
        { t: '', c: '#000' },
        { t: '$ playwright test --suite=prod  [32/32 ✓]', c: '#94a3b8' },
        { t: '$ deploy --env=prod --zero-downtime █', c: '#64ffda' },
      ]
      let ly = 88
      lines.forEach((l, i) => {
        if (!l.t) { ly += 38; return }
        sCtx.fillStyle = '#334155'
        sCtx.font = '500 18px monospace'
        sCtx.textAlign = 'right'
        sCtx.fillText(String(i + 1).padStart(2, ' '), 55, ly)
        sCtx.fillStyle = l.c
        sCtx.textAlign = 'left'
        sCtx.fillText(l.t, 80, ly)
        ly += 38
      })
    }
    const scrTex = new THREE.CanvasTexture(scrCanvas)
    scrTex.minFilter = THREE.LinearFilter
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.98, 1.88),
      new THREE.MeshBasicMaterial({ map: scrTex })
    )
    screen.position.set(0, 1.05, 0.016)
    lid.add(screen)

    // Screen downlight
    const screenLight = new THREE.PointLight(0x38bdf8, 1.6, 3.2)
    screenLight.position.set(0, 1.0, 0.3)
    lid.add(screenLight)

    // Default position
    laptop.position.set(0, -0.4, 0)
    laptop.rotation.x = 0.28
    laptop.rotation.y = -0.45

    // ── Drag-to-Orbit ──
    let isDragging = false
    let prevX = 0, prevY = 0
    let autoSpin = true
    let spinTimer = null
    let targetRotY = -0.45
    let targetRotX = 0.28

    const onDown = e => {
      isDragging = true
      autoSpin = false
      clearTimeout(spinTimer)
      const ev = e.touches ? e.touches[0] : e
      prevX = ev.clientX
      prevY = ev.clientY
    }
    const onMove = e => {
      if (!isDragging) return
      const ev = e.touches ? e.touches[0] : e
      targetRotY += (ev.clientX - prevX) * 0.008
      targetRotX += (ev.clientY - prevY) * 0.005
      targetRotX = Math.max(0.05, Math.min(0.65, targetRotX))
      prevX = ev.clientX
      prevY = ev.clientY
    }
    const onUp = () => {
      if (!isDragging) return
      isDragging = false
      clearTimeout(spinTimer)
      spinTimer = setTimeout(() => { autoSpin = true }, 2000)
    }

    canvas.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    canvas.addEventListener('touchstart', onDown, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)

    // Responsive
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      if (w < 500) { camera.fov = 52; camera.position.z = 5.4 }
      else { camera.fov = 40; camera.position.z = 4.8 }
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // Render loop
    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (autoSpin) targetRotY += 0.004
      laptop.rotation.y += (targetRotY - laptop.rotation.y) * 0.08
      laptop.rotation.x += (targetRotX - laptop.rotation.x) * 0.08
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(spinTimer)
      renderer.dispose()
      canvas.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('touchstart', onDown)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div ref={containerRef} className="floating-3d-stage" title="Drag to rotate 3D laptop">
      <canvas ref={canvasRef} />
    </div>
  )
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
   DATA — Projects (4 Case Studies with Color Themes + Engineering Challenges)
   ───────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    title: 'AttendTrack — Real-Time GPS Tracking PWA',
    tech: ['React.js', 'Firebase', 'Leaflet.js', 'Service Workers'],
    description:
      'Real-time workforce tracking PWA supporting Admin and Employee roles, featuring automated 2-minute background GPS sync and interactive live route visualization on Leaflet.js maps.',
    challenge:
      'Prevented mobile browser background location throttling using Web Workers and Firebase secondary app instances for clean Role-Based Access Control.',
    highlights: [
      'RBAC using Firebase Auth secondary app instance pattern',
      '6 real-time Firestore (onSnapshot) dashboards',
      '70% faster initial load via React lazy() code splitting',
    ],
    status: 'live',
    statusLabel: 'FLAGSHIP PWA',
    theme: 'emerald',
    github: 'https://github.com/MEGHRAJPARASHAR/AttendTrack',
  },
  {
    title: 'BiteRush — Full Stack Food Delivery Platform',
    tech: ['TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'Razorpay'],
    description:
      'Production-grade food delivery platform with 3 user roles, 8 route modules, 30+ REST endpoints, Google OAuth 2.0, and real-time Socket.IO order dispatching.',
    challenge:
      'Engineered secure Razorpay payments with HMAC-SHA256 signature verification preventing payment tampering and webhook replay attacks.',
    highlights: [
      'Google OAuth 2.0 + JWT + OTP forgot-password flow',
      'Real-time order tracking via Socket.IO rooms',
      '6 Mongoose schemas with Cloudinary image uploads',
    ],
    status: 'live',
    statusLabel: 'PRODUCTION MERN',
    theme: 'amber',
    live: 'https://bite-rush-delta.vercel.app/',
    github: 'https://github.com/MEGHRAJPARASHAR/BiteRush-',
  },
  {
    title: 'Logistics24x7 & GKSCPL Portals',
    tech: ['PHP 8.2', 'MySQL', 'Tailwind CSS', 'Playwright QA'],
    description:
      'Enterprise freight forwarding platform with Dual CMS administration, dynamic routing for trade corridors, and automated E2E Playwright regression suites.',
    challenge:
      'Architected a Dual CMS Engine combining 6-module Admin CRUD Panel with Live Inline Editing via Fetch API with SQL whitelist validation and CSRF protection.',
    highlights: [
      '30+ production pages across 2 platforms',
      'RBAC with Bcrypt hashing + superadmin safety locks',
      'Automated PHPMailer recruitment pipelines',
    ],
    status: 'live',
    statusLabel: 'ENTERPRISE LIVE',
    theme: 'cyan',
  },
  {
    title: 'WebTechPrime IT Services Platform',
    tech: ['PHP', 'MySQL', 'REST APIs', 'Tailwind CSS'],
    description:
      'IT services Progressive Web App with 7-module admin panel, drag-to-reorder navigation, IP-tracked audit logging, and inline content editing across 78+ text nodes.',
    challenge:
      'Integrated zero-reload inline editing via asynchronous REST endpoints with server-side validation and CSRF token defenses across 78+ dynamic DOM nodes.',
    highlights: [
      'Service worker caching for offline PWA',
      '7-module Admin Panel with audit trail',
      'Automated orphaned media cleanup',
    ],
    status: 'done',
    statusLabel: 'COMPLETED',
    theme: 'blue',
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

const STATS = [
  { num: '30+', label: 'Production Pages', sub: 'Dual CMS & WebGL' },
  { num: '62%', label: 'Speed Optimization', sub: 'CSS refactor & splitting' },
  { num: '100%', label: 'Automated E2E QA', sub: 'Playwright regressions' },
  { num: '22+', label: 'Bugs Resolved', sub: 'Critical/high severity' },
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
          <span className="logo-dot" />
          <span>Meghraj Parashar</span>
          <span className="logo-badge">Full Stack</span>
        </a>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {['About', 'Experience', 'Projects', 'Contact'].map((item, i) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link" onClick={close}>
              <span className="nav-num">0{i + 1}.</span>{item}
            </a>
          ))}
          <a href="mailto:meghrajparashar@gmail.com" className="nav-cta" onClick={close}>
            Say Hello
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
        {/* Availability Badge */}
        <div className="avail-badge">
          <span className="avail-dot" />
          <span>Available for Full-Stack Roles & High-Impact Projects</span>
        </div>

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
          Building production <strong className="hl">PHP & MERN</strong> architectures with
          enterprise Dual CMS engines, automated Playwright QA pipelines, and cross-platform
          technical SEO. Currently engineering production systems at{' '}
          <span className="hl">Logistics24x7 India Pvt Ltd</span>.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn-filled">Explore Case Studies</a>
          <a href="#contact" className="btn-primary">Get In Touch</a>
        </div>
        <div className="hero-social">
          <a href="https://github.com/MEGHRAJPARASHAR" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
          </a>
          <a href="https://linkedin.com/in/meghraj-parashar" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
          </a>
          <a href="mailto:meghrajparashar@gmail.com" aria-label="Email">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
          </a>
          <a href="tel:+918595988011" aria-label="Phone">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          </a>
          <span className="hero-location">New Delhi, IN</span>
        </div>
      </div>

      {/* Desktop: 3D Laptop | Mobile: hidden */}
      <div className="hero-right">
        <div className="workstation-glow" />
        <Laptop3D />
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
          <span className="stat-sub">{s.sub}</span>
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
          <h3 className="edu-heading">Education & Credentials</h3>
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
            <h4 className="currently-label">Current Focus</h4>
            <p className="currently-text">
              Scaling enterprise logistics portals, automated Playwright regression rigs,
              and high-performance web applications for global trade lanes.
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
        <span className="sec-num">02.</span> Where I've Worked
        <span className="sec-line" />
      </h2>
      <div className="exp-container">
        <div className="exp-tabs" role="tablist">
          {EXPERIENCES.map((e, i) => (
            <button key={e.id} role="tab" aria-selected={activeTab === i}
              className={`exp-tab ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}>
              {e.tabLabel}
            </button>
          ))}
        </div>
        <div className="exp-panel" role="tabpanel">
          <div className="exp-top">
            <div>
              <h3 className="exp-role">{exp.role} <span className="exp-at">@ {exp.company}</span></h3>
              <p className="exp-location">{exp.location}</p>
            </div>
            <span className="exp-date">{exp.period}</span>
          </div>
          {exp.subProjects && exp.subProjects.map((sub, i) => (
            <div key={i} className="sub-project">
              <h4 className="sub-project-title"><span className="sub-arrow">▹</span> {sub.title}</h4>
              <ul className="exp-points">{sub.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
            </div>
          ))}
          {exp.points && <ul className="exp-points">{exp.points.map((p, j) => <li key={j}>{p}</li>)}</ul>}
          <div className="exp-tech">{exp.tech.map(t => <span key={t} className="tech-chip">{t}</span>)}</div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="section">
      <h2 className="sec-heading">
        <span className="sec-num">03.</span> Featured Engineering Case Studies
        <span className="sec-line" />
      </h2>
      <div className="projects-grid">
        {PROJECTS.map(p => (
          <div key={p.title} className={`proj-card proj-${p.theme}`}>
            <div className="proj-top">
              <span className={`proj-status ${p.theme}`}>{p.statusLabel}</span>
              <div className="proj-actions">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label="Live">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  </a>
                )}
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                )}
              </div>
            </div>
            <h3 className="proj-title">{p.title}</h3>
            <p className="proj-desc">{p.description}</p>
            {/* Engineering Challenge Solved Block */}
            <div className={`proj-challenge challenge-${p.theme}`}>
              <strong>Engineering Challenge Solved:</strong>
              <span>{p.challenge}</span>
            </div>
            <div className="proj-tech">
              {p.tech.map(t => <span key={t} className={`tech-chip chip-${p.theme}`}>{t}</span>)}
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
      <p className="contact-eyebrow"><span className="sec-num">04.</span> Connect Directly</p>
      <h2 className="contact-title">Get In Touch</h2>
      <p className="contact-body">
        Currently shipping code at Logistics24x7 and always excited about engineering
        challenges — whether it's an ambitious full-stack project, an enterprise architecture
        role, or an in-depth technical discussion.
      </p>
      <a href="https://mail.google.com/mail/?view=cm&to=meghrajparashar@gmail.com"
        target="_blank" rel="noopener noreferrer" className="btn-filled">
        Say Hello on Gmail
      </a>
      <div className="contact-links">
        <div className="btn-secondary"><a href="https://github.com/MEGHRAJPARASHAR" target="_blank" rel="noopener noreferrer">GitHub</a></div>
        <span className="dot-sep">·</span>
        <div className="btn-secondary"><a href="https://linkedin.com/in/meghraj-parashar" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
        <span className="dot-sep">·</span>
        <div className="btn-secondary"><a href="tel:+918595988011">+91 85959 88011</a></div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>Designed & Engineered by <span className="hl">Meghraj Parashar</span></p>
      <p className="footer-sub">Enterprise Full Stack Architecture • 3D WebGL Workstation</p>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════════
   APP — Root with GSAP ScrollTrigger animations
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const appRef = useRef(null)

  useGSAP(() => {
    gsap.utils.toArray('.sec-heading').forEach(el => {
      gsap.from(el, { x: -40, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
    })
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
    })
    gsap.utils.toArray('.skill-group').forEach(group => {
      gsap.from(group.querySelectorAll('.skill-pill'), { scale: 0.8, opacity: 0, duration: 0.3, stagger: 0.04, ease: 'back.out(1.7)', scrollTrigger: { trigger: group, start: 'top 85%' } })
    })
    gsap.from(gsap.utils.toArray('.proj-card'), { y: 60, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' } })
    gsap.from(gsap.utils.toArray('.stat-item'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.stats-bar', start: 'top 90%' } })
    gsap.from('.exp-container', { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.exp-container', start: 'top 80%' } })
    gsap.from('.contact-title', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.contact-section', start: 'top 75%' } })
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
