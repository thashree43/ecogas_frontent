import React, { useEffect, useRef, useState } from 'react';
import {
  FaTruck, FaPercent, FaCheckCircle, FaEdit,
  FaInstagram, FaWhatsapp, FaFacebookF, FaTwitter,
  FaArrowUp, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import LottieAnimation from './LootieAnimation';
import truckAnimationData from '../animation/Animation - 1724130057483.json';

interface StatProps {
  target: number;
  suffix?: string;
  label: string;
}

const CountUpStat: React.FC<StatProps> = ({ target, suffix = '', label }) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="ecogas-stat">
      <div className="ecogas-stat-value">
        {value.toLocaleString()}{suffix}
      </div>
      <div className="ecogas-stat-label">{label}</div>
    </div>
  );
};

const Footer = React.forwardRef<HTMLDivElement>((props, ref) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const columns = [
    {
      title: 'About',
      items: ['FAQ', 'Careers', 'Sustainability report'],
    },
    {
      title: 'Contact',
      items: [
        { icon: FaPhoneAlt, text: '+91 9192349808' },
        { icon: FaPhoneAlt, text: '+91 8129112776' },
        { icon: FaEnvelope, text: 'ecogas@gmail.com' },
        { icon: FaMapMarkerAlt, text: '@ecogas', link: 'https://twitter.com/ecogas' },
      ],
    },
    {
      title: 'Quick links',
      items: [
        { icon: FaTruck, text: 'Track order' },
        { icon: FaPercent, text: 'Offers' },
        { icon: FaCheckCircle, text: 'Verified refills' },
        { icon: FaEdit, text: 'Feedback' },
      ],
    },
  ];

  const socials = [
    { icon: FaInstagram, color: '#E4405F', link: '#', label: 'Instagram' },
    { icon: FaWhatsapp, color: '#25D366', link: '#', label: 'WhatsApp' },
    { icon: FaFacebookF, color: '#1877F2', link: '#', label: 'Facebook' },
    { icon: FaTwitter, color: '#1DA1F2', link: '#', label: 'Twitter' },
  ];

  return (
    <>
      <footer ref={ref} className="ecogas-footer w-100" {...props}>
        <div className="ecogas-energyline" aria-hidden="true" />
        <div className="ecogas-grid" aria-hidden="true" />
        <div className="ecogas-glow" aria-hidden="true" />

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="ecogas-stats-strip">
            <CountUpStat target={6000} suffix="+" label="cylinders delivered" />
            <CountUpStat target={38} suffix="t" label="CO2 emissions saved" />
            <CountUpStat target={15} label="cities served" />
            <CountUpStat target={24} suffix="/7" label="live tracking" />
          </div>

          <div className="row gy-4 ecogas-columns">
            {columns.map((col, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div className="ecogas-panel h-100">
                  <h6 className="ecogas-col-title">{col.title}</h6>
                  <ul className="list-unstyled mt-3 mb-0">
                    {col.items.map((item, i) => {
                      if (typeof item === 'string') {
                        return (
                          <li key={i} className="mb-3">
                            <a href="#" className="ecogas-link">{item}</a>
                          </li>
                        );
                      }
                      const Icon = item.icon;
                      return (
                        <li key={i} className="mb-3 d-flex align-items-center">
                          <span className="ecogas-icon me-3">
                            <Icon />
                          </span>
                          {'link' in item && item.link ? (
                            <a href={item.link} className="ecogas-link">{item.text}</a>
                          ) : (
                            <span className="ecogas-text">{item.text}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="ecogas-tracking-panel d-flex align-items-center flex-wrap">
            <div className="ecogas-truck-frame">
              <LottieAnimation animationData={truckAnimationData} width="150px" height="95px" />
            </div>
            <div className="flex-grow-1">
              <span className="ecogas-live-badge">
                <span className="ecogas-live-dot" aria-hidden="true" />
                LIVE
              </span>
              <p className="ecogas-tracking-text mb-0">
                Every cylinder tracked from refill station to your door, in real time.
              </p>
            </div>
            <ul className="list-inline mb-0 ecogas-social-row">
              {socials.map(({ icon: Icon, color, link, label }, idx) => (
                <li key={idx} className="list-inline-item ms-2">
                  <a
                    href={link}
                    className="ecogas-social"
                    style={{ ['--brand-color' as string]: color }}
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="row ecogas-divider pt-4 mt-4">
            <div className="col-12 col-md-6 text-center text-md-start">
              <p className="mb-0 ecogas-copyright">
                &copy; {new Date().getFullYear()} <span className="ecogas-signature">Thashreef Khan S</span>, EcoGas
              </p>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end">
              <button onClick={scrollToTop} className="ecogas-backtext">
                Back to top <FaArrowUp className="ms-1" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@500;700&display=swap');

        .ecogas-footer {
          position: relative;
          overflow: hidden;
          background: radial-gradient(ellipse at 20% 0%, #12291b 0%, #081810 55%, #050f0a 100%);
          padding: 4rem 0 2rem;
        }

        .ecogas-energyline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #34d399, #fbbf24, #34d399);
          background-size: 200% 100%;
          animation: ecogasFlow 5s linear infinite;
        }
        @keyframes ecogasFlow {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        .ecogas-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(52, 211, 153, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 211, 153, 0.06) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%);
          pointer-events: none;
        }

        .ecogas-glow {
          position: absolute;
          top: -120px;
          right: -80px;
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, rgba(52, 211, 153, 0.14) 0%, transparent 70%);
          filter: blur(10px);
          pointer-events: none;
          animation: ecogasDrift 12s ease-in-out infinite;
        }
        @keyframes ecogasDrift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 40px); }
        }

        .ecogas-stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          padding-bottom: 2.5rem;
          margin-bottom: 3rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .ecogas-stat { text-align: center; }
        .ecogas-stat-value {
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 700;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          background: linear-gradient(135deg, #6ee7b0, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
        }
        .ecogas-stat-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          color: #8fa396;
          margin-top: 0.35rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .ecogas-panel {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.75rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .ecogas-panel:hover {
          border-color: rgba(52, 211, 153, 0.4);
          box-shadow: 0 0 24px rgba(52, 211, 153, 0.12);
          transform: translateY(-4px);
        }

        .ecogas-col-title {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #eafaf0;
          margin: 0;
        }

        .ecogas-link, .ecogas-text {
          color: #b7c6ba;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .ecogas-link:hover { color: #6ee7b0; }

        .ecogas-icon {
          color: #34d399;
          font-size: 0.95rem;
          flex-shrink: 0;
        }

        .ecogas-tracking-panel {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.5rem 2rem;
          margin-top: 3rem;
          gap: 1.5rem;
        }
        .ecogas-truck-frame {
          filter: drop-shadow(0 0 16px rgba(52, 211, 153, 0.25));
        }
        .ecogas-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(52, 211, 153, 0.12);
          color: #6ee7b0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 3px 10px;
          border-radius: 999px;
          margin-bottom: 0.6rem;
        }
        .ecogas-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6ee7b0;
          animation: ecogasPulse 1.6s ease-in-out infinite;
        }
        @keyframes ecogasPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .ecogas-tracking-text {
          font-family: 'Inter', sans-serif;
          color: #d3ded5;
          font-size: 1rem;
          max-width: 460px;
        }

        .ecogas-social-row { flex-shrink: 0; }
        .ecogas-social {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #b7c6ba;
          font-size: 1.05rem;
          transition: all 0.25s ease;
        }
        .ecogas-social:hover {
          background: var(--brand-color);
          border-color: var(--brand-color);
          color: #fff;
          transform: translateY(-3px);
        }

        .ecogas-divider { border-top: 1px solid rgba(255, 255, 255, 0.08); }
        .ecogas-copyright { font-size: 0.85rem; color: #8fa396; font-family: 'Inter', sans-serif; }
        .ecogas-signature { color: #6ee7b0; font-weight: 500; }

        .ecogas-backtext {
          background: none;
          border: none;
          color: #b7c6ba;
          font-size: 0.85rem;
          font-family: 'Inter', sans-serif;
          display: inline-flex;
          align-items: center;
          transition: color 0.2s ease;
        }
        .ecogas-backtext:hover { color: #6ee7b0; }

        @media (prefers-reduced-motion: reduce) {
          .ecogas-energyline, .ecogas-glow, .ecogas-live-dot { animation: none; }
          .ecogas-panel, .ecogas-social { transition: none; }
        }

        @media (max-width: 768px) {
          .ecogas-footer .container { text-align: center; }
          .ecogas-stats-strip { grid-template-columns: repeat(2, 1fr); row-gap: 1.75rem; }
          .ecogas-tracking-panel { flex-direction: column; text-align: center; }
          .ecogas-social-row { margin-top: 0.5rem; }
        }
      `}</style>
    </>
  );
});

export default Footer;