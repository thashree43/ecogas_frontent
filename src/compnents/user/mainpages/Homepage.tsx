import React, { useEffect, useRef, useState } from 'react';
import {
  FaFireExtinguisher,
  FaWind,
  FaShieldAlt,
  FaChild,
  FaSprayCan,
  FaBan,
  FaPhoneAlt,
  FaQrcode,
  FaCreditCard,
  FaUniversity,
  FaMobileAlt,
  FaTruck,
  FaCheckCircle,
} from 'react-icons/fa';

/* ---------------------------------------------
   Content — edit copy/data here, layout stays put
--------------------------------------------- */
const GAS_BRANDS = ['HP Gas', 'Bharat Gas', 'Indane Gas', 'Reliance Gas', 'Gujarat Gas', 'Super Gas'];

const STEPS = [
  {
    n: '01',
    title: 'Pick your brand',
    body: 'Choose from six trusted suppliers and the cylinder size your kitchen needs.',
  },
  {
    n: '02',
    title: 'Pay any way you like',
    body: 'UPI, card, bank transfer or QR scan — checkout takes under a minute.',
  },
  {
    n: '03',
    title: 'Track it to your door',
    body: 'A verified delivery partner brings your cylinder, usually inside 30 minutes.',
  },
];

const PAYMENTS = [
  { icon: <FaQrcode size={22} />, label: "Scan & Pay" },
  { icon: <FaMobileAlt size={22} />, label: "UPI" },
  { icon: <FaCreditCard size={22} />, label: "Card" },
  { icon: <FaUniversity size={22} />, label: "Bank Transfer" },
];

const SAFETY_TIPS = [
  { icon: <FaFireExtinguisher />, text: 'Keep a fire extinguisher within reach of the kitchen.' },
  { icon: <FaBan />, text: 'Shut the cylinder valve fully whenever it is not in use.' },
  { icon: <FaWind />, text: 'Keep the kitchen ventilated — never seal the room airtight.' },
  { icon: <FaSprayCan />, text: 'Check fittings for leaks with soapy water, not a flame.' },
  { icon: <FaShieldAlt />, text: 'Skip electrical switches the moment you smell a leak.' },
  { icon: <FaChild />, text: 'Walk family members through what to do in a gas emergency.' },
];

/* ---------------------------------------------
   Small hook: fade sections in as they enter view
--------------------------------------------- */
function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

const Reveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const { ref, inView } = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${inView ? 'in-view' : ''} ${className}`}>
      {children}
    </div>
  );
};

/* ---------------------------------------------
   Signature graphic — flame flickers into a leaf
   (pure SVG + CSS, no external animation assets)
--------------------------------------------- */
const SignatureGraphic: React.FC = () => (
  <div className="signature">
    <div className="signature-ring" />
    {[...Array(6)].map((_, i) => (
      <span
        key={i}
        className="signature-particle"
        style={{
          left: `${28 + i * 8}%`,
          bottom: '20%',
          width: 5 + (i % 3),
          height: 5 + (i % 3),
          animationDelay: `${i * 0.7}s`,
        }}
      />
    ))}
    <div className="signature-core">
      <svg className="flame-shape" viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFB238" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>
        </defs>
        <path
          d="M50 6C38 26 24 40 24 66c0 20 12 40 26 46 14-6 26-26 26-46 0-12-6-20-12-28 2 10-2 18-8 22 2-10-2-22-6-30-2 12-8 16-14 24-4 6-6 12-6 18 0 12 8 22 20 26-10-6-16-16-16-26 0-10 6-16 12-24 4 8 6 16 6 22 0 8-4 14-10 18 8-2 16-10 16-22 0-14-8-22-8-34z"
          fill="url(#flameGrad)"
        />
      </svg>
      <svg className="leaf-shape" viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#146B43" />
            <stop offset="100%" stopColor="#1c8a54" />
          </linearGradient>
        </defs>
        <path
          d="M50 10c26 6 40 26 40 50 0 30-22 54-40 60-18-6-40-30-40-60 0-24 14-44 40-50z"
          fill="url(#leafGrad)"
        />
        <path d="M50 20v90" stroke="#e6f5ea" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 40 30 55M50 40 70 55M50 65 32 80M50 65 68 80" stroke="#e6f5ea" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

const BrandMark: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg className="brand-mark" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
    <circle cx="20" cy="20" r="19" fill="#146B43" />
    <path
      d="M20 8c-5 6-9 10-9 17 0 6 4 11 9 12 5-1 9-6 9-12 0-3-1-6-3-8 1 3-1 5-2 6 0-4-2-7-3-9-1 4-3 5-5 7-1 2-2 4-2 6 0 4 3 7 6 8-3-2-5-5-5-8 0-3 2-5 4-7 1 2 2 5 2 7 0 2-1 4-3 5 3-1 5-4 5-7 0-4-3-7-3-9z"
      fill="#FFB238"
    />
  </svg>
);

/* ---------------------------------------------
   Page
--------------------------------------------- */
const EcogasStyles: React.FC = () => (
  <style>{`
/* ECOGAS — design tokens & styles
   All styles are embedded in this component — no external CSS file.
   Fonts: add these once in your index.html <head> (or index.css):
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
*/

:root {
  --ink: #12261c;
  --ink-soft: #3f5a4c;
  --bg: #f6faf6;
  --surface: #ffffff;
  --primary: #146b43;
  --primary-dark: #0b4a2d;
  --leaf: #bfe8c9;
  --leaf-soft: #e6f5ea;
  --flame: #ff6b35;
  --flame-dark: #e2531f;
  --amber: #ffb238;
  --border: #dfeee2;

  --font-display: 'Sora', 'Segoe UI', sans-serif;
  --font-body: 'Inter', 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --radius-lg: 28px;
  --radius-md: 18px;
  --radius-sm: 12px;
  --shadow: 0 20px 50px -25px rgba(15, 61, 46, 0.35);
}

* { box-sizing: border-box; }

.ecogas {
  font-family: var(--font-body);
  color: var(--ink);
  background: var(--bg);
  overflow-x: hidden;
}

.ecogas h1, .ecogas h2, .ecogas h3, .ecogas .display {
  font-family: var(--font-display);
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 0;
}

.ecogas .mono { font-family: var(--font-mono); }

.ecogas a { text-decoration: none; color: inherit; }

.ecogas .wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 48px);
}

/* ---------- Entry / splash ---------- */
.entry-screen {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  background: linear-gradient(160deg, var(--primary-dark), var(--primary) 60%, #1c8a54);
  color: #fff;
  animation: fadeOutSplash 0.5s ease 2.5s forwards;
}

.entry-screen .splash-mark {
  width: 120px;
  height: 120px;
  animation: splashPulse 1.6s ease-in-out infinite;
}

.entry-screen h1 {
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 800;
}

.entry-screen p {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.75;
}

@keyframes splashPulse {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(255,178,56,0)); }
  50% { transform: scale(1.06); filter: drop-shadow(0 0 24px rgba(255,178,56,0.55)); }
}

@keyframes fadeOutSplash {
  to { opacity: 0; visibility: hidden; }
}

/* ---------- Nav ---------- */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(246, 250, 246, 0.82);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px clamp(20px, 5vw, 48px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 20px;
}

.brand-mark {
  width: 34px;
  height: 34px;
}

.nav-links {
  display: flex;
  gap: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-soft);
}

.nav-links a:hover { color: var(--primary); }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  padding: 12px 22px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover { transform: translateY(-2px); }

.btn-flame {
  background: linear-gradient(135deg, var(--flame), var(--flame-dark));
  color: #fff;
  box-shadow: 0 14px 30px -12px rgba(255, 107, 53, 0.6);
}

.btn-ghost {
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--ink);
}

.btn-ghost:hover { border-color: var(--primary); color: var(--primary); }

.nav-cta { display: none; }
@media (min-width: 768px) { .nav-cta { display: inline-flex; } }
.nav-links { display: none; }
@media (min-width: 900px) { .nav-links { display: flex; } }

/* ---------- Hero ---------- */
.hero {
  position: relative;
  padding: clamp(48px, 8vw, 96px) 0 60px;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  inset: -20% -10% auto -10%;
  height: 480px;
  background: radial-gradient(closest-side, rgba(191, 232, 201, 0.65), transparent 70%);
  z-index: 0;
  pointer-events: none;
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: center;
}

@media (min-width: 960px) {
  .hero-grid { grid-template-columns: 1.05fr 0.95fr; gap: 24px; }
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--primary);
  background: var(--leaf-soft);
  border: 1px solid var(--leaf);
  padding: 7px 14px;
  border-radius: 999px;
}

.hero h1 {
  font-size: clamp(38px, 6vw, 64px);
  font-weight: 800;
  margin-top: 18px;
}

.hero h1 .accent { color: var(--flame); }

.hero p.lede {
  font-size: 17px;
  color: var(--ink-soft);
  max-width: 46ch;
  margin-top: 18px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 30px;
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  margin-top: 46px;
  padding-top: 26px;
  border-top: 1px solid var(--border);
}

.hero-stats .stat b {
  font-family: var(--font-mono);
  font-size: 24px;
  display: block;
  color: var(--primary-dark);
}

.hero-stats .stat span {
  font-size: 12.5px;
  color: var(--ink-soft);
}

/* ---------- Signature graphic: flame <-> leaf ---------- */
.signature {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
}

.signature-ring {
  position: absolute;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  border: 1px dashed var(--leaf);
  animation: spin 40s linear infinite;
}

.signature-ring::before,
.signature-ring::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--amber);
}
.signature-ring::before { top: -4px; left: 50%; }
.signature-ring::after { bottom: -4px; left: 50%; background: var(--primary); }

@keyframes spin {
  to { transform: rotate(360deg); }
}

.signature-core {
  position: relative;
  width: 220px;
  height: 220px;
}

.signature-core svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 18px 30px rgba(15, 61, 46, 0.28));
}

.flame-shape {
  animation: flicker 3.4s ease-in-out infinite;
  transform-origin: 50% 85%;
}

.leaf-shape {
  animation: leafPulse 3.4s ease-in-out infinite;
  animation-delay: 1.7s;
}

@keyframes flicker {
  0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
  50% { opacity: 0.15; transform: scale(0.92) rotate(-2deg); }
}

@keyframes leafPulse {
  0%, 100% { opacity: 0; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1); }
}

.signature-particle {
  position: absolute;
  border-radius: 50%;
  background: var(--amber);
  opacity: 0.7;
  animation: floatUp 4.5s ease-in infinite;
}

@keyframes floatUp {
  0% { transform: translateY(0) scale(1); opacity: 0.7; }
  100% { transform: translateY(-160px) scale(0.3); opacity: 0; }
}

/* ---------- Section shell ---------- */
.section { padding: 70px 0; }
.section-head { max-width: 640px; margin-bottom: 42px; }
.section-head .eyebrow { margin-bottom: 14px; }
.section-head h2 { font-size: clamp(28px, 4vw, 38px); font-weight: 800; }
.section-head p { color: var(--ink-soft); margin-top: 12px; font-size: 15.5px; }

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.in-view { opacity: 1; transform: translateY(0); }

/* ---------- How it works ---------- */
.steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 768px) { .steps { grid-template-columns: repeat(3, 1fr); } }

.step-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 28px;
  position: relative;
}

.step-num {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--flame);
  font-weight: 700;
}

.step-card h3 {
  font-size: 19px;
  margin-top: 14px;
  font-weight: 700;
}

.step-card p {
  font-size: 14.5px;
  color: var(--ink-soft);
  margin-top: 8px;
  line-height: 1.55;
}

/* ---------- Brands ---------- */
.brand-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.brand-pill {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14.5px;
  padding: 14px 26px;
  border-radius: 999px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  transition: all 0.2s ease;
}

.brand-pill:hover { border-color: var(--primary); }

.brand-pill.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 12px 26px -14px rgba(20, 107, 67, 0.6);
}

.brand-note {
  margin-top: 18px;
  font-size: 14px;
  color: var(--ink-soft);
}

.brand-note b { color: var(--primary-dark); }

/* ---------- Payment ---------- */
.pay-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (min-width: 640px) { .pay-grid { grid-template-columns: repeat(4, 1fr); } }

.pay-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 26px 16px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.pay-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }

.pay-card .icon-wrap {
  width: 52px;
  height: 52px;
  margin: 0 auto 14px;
  border-radius: 14px;
  background: var(--leaf-soft);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-card span {
  font-size: 13.5px;
  font-weight: 600;
}

/* ---------- Safety ---------- */
.safety-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 640px) { .safety-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .safety-grid { grid-template-columns: repeat(3, 1fr); } }

.safety-card {
  display: flex;
  gap: 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 18px;
}

.safety-card .icon-wrap {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #fff1ea;
  color: var(--flame);
  display: flex;
  align-items: center;
  justify-content: center;
}

.safety-card p { font-size: 14px; line-height: 1.5; color: var(--ink-soft); }

/* ---------- Emergency banner ---------- */
.emergency {
  background: linear-gradient(120deg, var(--primary-dark), var(--primary));
  border-radius: var(--radius-lg);
  padding: 36px clamp(24px, 5vw, 52px);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  color: #fff;
}

.emergency-left { display: flex; align-items: center; gap: 18px; }

.emergency-icon-wrap {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: rgba(255,255,255,0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ring 2.2s ease-in-out infinite;
}

@keyframes ring {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(-14deg); }
  20% { transform: rotate(10deg); }
  30% { transform: rotate(-8deg); }
  40% { transform: rotate(0deg); }
}

.emergency-left p.label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.75;
}

.emergency-left .number {
  font-family: var(--font-mono);
  font-size: 34px;
  font-weight: 700;
}

/* ---------- Footer ---------- */
.footer {
  border-top: 1px solid var(--border);
  padding: 40px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  font-size: 13.5px;
  color: var(--ink-soft);
}

  `}</style>
);

const Homepage: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ecogas">
      <EcogasStyles />
      {showSplash && (
        <div className="entry-screen">
          <BrandMark size={110} />
          <h1>ECOGAS</h1>
          <p>The eco-friendly gas, on its way</p>
        </div>
      )}

      {/* Nav */}
      {/* <header className="nav">
        <div className="nav-inner">
          <div className="brand">
            <BrandMark />
            ECOGAS
          </div>
          <nav className="nav-links">
            <a href="#how-it-works">How it works</a>
            <a href="#brands">Brands</a>
            <a href="#safety">Safety</a>
            <a href="#contact">Emergency</a>
          </nav>
          <a href="#order" className="btn btn-flame nav-cta">
            Order Now
          </a>
        </div>
      </header> */}

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="hero-glow" />
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">Trusted by 50,000+ homes</span>
              <h1>
                Fuel your home,
                <br />
                not the <span className="accent">planet.</span>
              </h1>
              <p className="lede">
                ECOGAS delivers certified, leak-checked cylinders from six trusted brands, straight to
                your kitchen. Order in a minute, track every step, and stay covered by round-the-clock
                safety support.
              </p>
              <div className="hero-actions">
                <a href="book-gas" className="btn btn-flame">
                  <FaTruck /> Order a Cylinder
                </a>
                <a href="#how-it-works" className="btn btn-ghost">
                  See how it works
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <b>30 min</b>
                  <span>Average delivery</span>
                </div>
                <div className="stat">
                  <b>6</b>
                  <span>Trusted brands</span>
                </div>
                <div className="stat">
                  <b>24/7</b>
                  <span>Support line</span>
                </div>
                <div className="stat">
                  <b>1906</b>
                  <span>Emergency number</span>
                </div>
              </div>
            </div>
            <SignatureGraphic />
          </div>
        </section>

        {/* How it works */}
        <section className="section" id="how-it-works">
          <div className="wrap">
            <Reveal>
              <div className="section-head">
                <span className="eyebrow">The process</span>
                <h2>Three steps, one calm kitchen</h2>
                <p>No call centre queues, no guessing when the cylinder will show up.</p>
              </div>
            </Reveal>
            <div className="steps">
              {STEPS.map((step) => (
                <Reveal key={step.n}>
                  <div className="step-card">
                    <span className="step-num">{step.n}</span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Brands */}
        <section className="section" id="brands" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Reveal>
              <div className="section-head">
                <span className="eyebrow">Choose a supplier</span>
                <h2>All the brands you already trust</h2>
                <p>Tap the one you refill with — we'll route your order to the nearest depot.</p>
              </div>
            </Reveal>
            <Reveal>
              <div className="brand-grid">
                {GAS_BRANDS.map((brand) => (
                  <button
                    key={brand}
                    className={`brand-pill ${activeBrand === brand ? 'active' : ''}`}
                    onClick={() => setActiveBrand(brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
              {activeBrand && (
                <p className="brand-note">
                  <FaCheckCircle style={{ color: '#146B43', marginRight: 6 }} />
                  Selected <b>{activeBrand}</b> — continue to checkout when you're ready.
                </p>
              )}
            </Reveal>
          </div>
        </section>

        {/* Payment */}
        <section className="section" id="order">
          <div className="wrap">
            <Reveal>
              <div className="section-head">
                <span className="eyebrow">Checkout</span>
                <h2>Pay however suits you</h2>
                <p>Every method is encrypted and confirmed instantly.</p>
              </div>
            </Reveal>
            <Reveal>
              <div className="pay-grid">
                {PAYMENTS.map((p) => (
                  <div
                    className="pay-card"
                    key={p.label}
                    onClick={() => window.location.href = '/book-gas'}
                  >
                    <div className="icon-wrap">{p.icon}</div>
                    <span>{p.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Safety */}
        <section className="section" id="safety">
          <div className="wrap">
            <Reveal>
              <div className="section-head">
                <span className="eyebrow">Stay safe</span>
                <h2>Habits worth keeping in every kitchen</h2>
              </div>
            </Reveal>
            <Reveal>
              <div className="safety-grid">
                {SAFETY_TIPS.map((tip, i) => (
                  <div className="safety-card" key={i}>
                    <div className="icon-wrap">{tip.icon}</div>
                    <p>{tip.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Emergency */}
        <section className="section" id="contact" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Reveal>
              <div className="emergency">
                <div className="emergency-left">
                  <div className="emergency-icon-wrap">
                    <FaPhoneAlt size={22} />
                  </div>
                  <div>
                    <p className="label">Gas emergency helpline</p>
                    <p className="number">1906</p>
                  </div>
                </div>
                <a href="tel:1906" className="btn btn-flame">
                  Call now
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer" style={{ borderTop: 'none', padding: 0, width: '100%' }}>
          <div className="brand" style={{ fontSize: 15 }}>
            <BrandMark size={22} />
            ECOGAS
          </div>
          <span>© {new Date().getFullYear()} ECOGAS. Clean fuel, delivered responsibly.</span>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;