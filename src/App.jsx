import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import img1 from "../src/assets/img1.jpg"
import img2 from "../src/assets/img2.jpg"
import img3 from "../src/assets/img3.jpg"
import img4 from "../src/assets/img4.jpg"
import img5 from "../src/assets/img5.jpg"
import img6 from "../src/assets/img6.jpg"

const C = {
  sage: "#8B9B7A", sageDark: "#5E6E50", sageLight: "#C8D5BE", sagePale: "#EDF2E8",
  cream: "#FAF6F0", creamDark: "#EDE6DC", creamDeep: "#E0D8CC",
  rose: "#C4927A", roseDark: "#9E6E58", roseLight: "#E8C0B0",
  dark: "#2C2A25", muted: "#8A837C", gold: "#C8A86E", white: "#FFFFFF",
}

// ── RESPONSIVE HOOK ────────────────────────────────────────────────────────────
function useIsMobile(bp = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < bp)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < bp)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [bp])
  return isMobile
}

// ── CONFETTI ──────────────────────────────────────────────────────────────────
function Confetti({ active, onComplete }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const palette = [C.rose, C.sage, C.roseLight, C.sageLight, C.gold, "#F0C4A0", "#B8D4A8", "#E8D0B8"]
    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width, y: -20 - Math.random() * 60,
      w: Math.random() * 9 + 5, h: Math.random() * 5 + 3,
      sx: (Math.random() - 0.5) * 5, sy: Math.random() * 3.5 + 1.5,
      color: palette[Math.floor(Math.random() * palette.length)],
      rot: Math.random() * 360, rs: (Math.random() - 0.5) * 7,
      gravity: 0.04 + Math.random() * 0.04,
    }))
    let raf, live = true
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let any = false
      particles.forEach(p => {
        p.x += p.sx; p.y += p.sy; p.sy += p.gravity; p.rot += p.rs
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - p.y / (canvas.height * 0.85))
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
        if (p.y < canvas.height + 20) any = true
      })
      if (any && live) raf = requestAnimationFrame(draw)
      else { onComplete && onComplete() }
    }
    draw()
    return () => { live = false; cancelAnimationFrame(raf) }
  }, [active])
  if (!active) return null
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999 }} />
}

// ── BOTANICAL SVG ─────────────────────────────────────────────────────────────
function Botanical({ style, flip }) {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" style={{ opacity: 0.22, transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      <path d="M80 110 Q40 70 20 30" stroke={C.sage} strokeWidth="1.5" fill="none" />
      <ellipse cx="20" cy="30" rx="14" ry="8" fill={C.sage} transform="rotate(-40 20 30)" />
      <ellipse cx="38" cy="55" rx="12" ry="7" fill={C.sageLight} transform="rotate(-20 38 55)" />
      <ellipse cx="58" cy="80" rx="10" ry="6" fill={C.sage} transform="rotate(-10 58 80)" />
      <ellipse cx="68" cy="45" rx="9" ry="5" fill={C.sageLight} transform="rotate(10 68 45)" />
      <circle cx="80" cy="20" r="5" fill={C.roseLight} />
      <circle cx="80" cy="20" r="2.5" fill={C.rose} />
    </svg>
  )
}

// ── ENVELOPE LANDING ───────────────────────────────────────────────────────────
function EnvelopePage({ onOpen }) {
  const [opened, setOpened] = useState(false)
  const isMobile = useIsMobile()
  const handle = () => {
    if (opened) return
    setOpened(true)
    setTimeout(onOpen, 2400)
  }

  const envW = isMobile ? Math.min(window.innerWidth - 48, 300) : 340
  const envH = isMobile ? 200 : 240

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
      transition={{ duration: 0.9 }} onClick={handle}
      style={{
        minHeight: "100vh", cursor: opened ? "default" : "pointer",
        background: `radial-gradient(ellipse 80% 70% at 50% 30%, ${C.sagePale} 0%, ${C.cream} 55%, ${C.creamDark} 100%)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      {!isMobile && <Botanical style={{ position: "absolute", top: 10, left: 10 }} />}
      {!isMobile && <Botanical style={{ position: "absolute", top: 10, right: 10 }} flip />}
      <Botanical style={{ position: "absolute", bottom: 10, left: 0, transform: "rotate(140deg)", opacity: 0.12 }} />
      <Botanical style={{ position: "absolute", bottom: 10, right: 0, transform: "rotate(-140deg) scaleX(-1)", opacity: 0.12 }} />

      <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ color: C.muted, fontSize: 9, letterSpacing: isMobile ? 3 : 5, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, marginBottom: 28, textAlign: "center", padding: "0 16px" }}>
        A Personal Invitation Awaits
      </motion.p>

      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
        style={{ position: "relative", width: envW, height: envH }}>
        <svg width={envW} height={envH} viewBox={`0 0 340 240`} style={{ filter: "drop-shadow(0 10px 32px rgba(44,42,37,0.14))", overflow: "visible", width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="eg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#F5EDE0" /><stop offset="100%" stopColor="#E0CFBC" /></linearGradient>
            <linearGradient id="fg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#EAE0D2" /><stop offset="100%" stopColor="#D8CBBA" /></linearGradient>
          </defs>
          <rect x="0" y="40" width="340" height="200" rx="6" fill="url(#eg)" />
          <path d="M0 40 L0 240 L148 150 Z" fill="#DDD0BF" />
          <path d="M340 40 L340 240 L192 150 Z" fill="#D5C8B5" />
          <path d="M0 240 L170 148 L340 240 Z" fill="#E8DACC" />
          <motion.g animate={opened ? { scaleY: -1, y: -80 } : {}} transition={{ duration: 0.65, delay: 0.05 }}
            style={{ transformOrigin: "170px 40px" }}>
            <path d="M0 40 L170 148 L340 40 Z" fill="url(#fg)" />
            <path d="M0 40 L170 148 L340 40" fill="none" stroke="#C8BAA6" strokeWidth="0.8" />
          </motion.g>
          <path d="M0 40 L170 148 L340 40" fill="none" stroke="#C8BAA6" strokeWidth="0.5" />
          <motion.g animate={opened ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
            style={{ transformOrigin: "170px 172px" }} transition={{ duration: 0.3 }}>
            <circle cx="170" cy="172" r="24" fill={C.roseDark} />
            <circle cx="170" cy="172" r="20" fill={C.rose} />
            <text x="170" y="178" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="12" fontFamily="'Cormorant Garamond',serif" fontStyle="italic"> A &amp; M </text>
          </motion.g>
        </svg>

        <AnimatePresence>
          {opened && (
            <motion.div initial={{ y: 150, opacity: 0 }} animate={{ y: isMobile ? -70 : -85, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.9, ease: "easeOut" }}
              style={{
                position: "absolute", top: 40, left: 22, right: 22, background: "white",
                borderRadius: 3, padding: isMobile ? "16px 20px" : "22px 28px", textAlign: "center", zIndex: 10,
                borderTop: `3px solid ${C.rose}`, fontFamily: "'Cormorant Garamond',serif",
              }}>
              <p style={{ color: C.rose, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif", marginBottom: 6 }}>The Engagement of</p>
              <p style={{ color: C.dark, fontSize: isMobile ? 22 : 28, fontStyle: "italic", fontWeight: 300, letterSpacing: 1 }}> Ahmed &amp; Mahitab</p>
              <div style={{ width: 36, height: 1, background: C.gold, margin: "8px auto" }} />
              <p style={{ color: C.muted, fontSize: 10, fontFamily: "'Josefin Sans',sans-serif", letterSpacing: 2 }}>November  9, 2026</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div animate={{ opacity: opened ? 0 : 1 }} transition={{ duration: 0.3 }}
        style={{ textAlign: "center", marginTop: isMobile ? 28 : 40, pointerEvents: "none" }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", color: C.dark, fontSize: isMobile ? 28 : 36, fontStyle: "italic", fontWeight: 300 }}>Ahmed &amp; Mahitab</p>
        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ color: C.muted, fontSize: 9, letterSpacing: 4, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, marginTop: 14 }}>
          {isMobile ? "Tap to open" : "Tap to open"}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// ── NAV ────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [["celebration", "The Day"], ["gallery", "Gallery"], ["journey", "Our Story"], ["venue", "Venue"], ["puzzle", "Message"], ["rsvp", "RSVP"]]

function Nav({ active }) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  return (
    <>
      <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 56,
          background: "rgba(250,246,240,0.94)", backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${C.creamDark}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px",
        }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: "italic", color: C.dark, letterSpacing: 1 }}>A &amp; M</span>

        {isMobile ? (
          /* Hamburger Button */
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 4px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 5, width: 36, height: 36 }}
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 9 : 0 }} transition={{ duration: 0.25 }}
              style={{ display: "block", width: 22, height: 1.5, background: menuOpen ? C.rose : C.dark, borderRadius: 2, transformOrigin: "center" }} />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }} transition={{ duration: 0.2 }}
              style={{ display: "block", width: 22, height: 1.5, background: C.dark, borderRadius: 2 }} />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -9 : 0 }} transition={{ duration: 0.25 }}
              style={{ display: "block", width: 22, height: 1.5, background: menuOpen ? C.rose : C.dark, borderRadius: 2, transformOrigin: "center" }} />
          </button>
        ) : (
          /* Desktop Nav Links */
          <div style={{ display: "flex", gap: 2 }}>
            {NAV_ITEMS.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: "6px 11px", borderRadius: 4,
                  fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase",
                  fontFamily: "'Josefin Sans',sans-serif",
                  color: active === id ? C.rose : C.muted,
                  fontWeight: active === id ? 600 : 300,
                  transition: "color 0.25s",
                }}>{label}</button>
            ))}
          </div>
        )}
      </motion.nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -12, scaleY: 0.92 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              position: "fixed", top: 56, left: 0, right: 0, zIndex: 99,
              background: "rgba(250,246,240,0.98)", backdropFilter: "blur(16px)",
              borderBottom: `1px solid ${C.creamDark}`,
              display: "flex", flexDirection: "column",
              transformOrigin: "top",
            }}
          >
            {NAV_ITEMS.map(([id, label], i) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.045 }}
                onClick={() => scrollTo(id)}
                style={{
                  background: "none", border: "none", borderBottom: `1px solid ${C.creamDark}`,
                  cursor: "pointer", padding: "16px 24px", textAlign: "left",
                  fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
                  fontFamily: "'Josefin Sans',sans-serif",
                  color: active === id ? C.rose : C.dark,
                  fontWeight: active === id ? 600 : 300,
                  display: "flex", alignItems: "center", gap: 12,
                }}
              >
                {active === id && <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.rose, display: "inline-block" }} />}
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── CELEBRATION ────────────────────────────────────────────────────────────────
function CakeSVG({ isMobile }) {
  const scale = isMobile ? 0.75 : 1
  const w = Math.round(190 * scale)
  const h = Math.round(270 * scale)
  return (
    <svg width={w} height={h} viewBox="0 0 190 270">
      <defs>
        <linearGradient id="t1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#F8F0E4" /><stop offset="100%" stopColor="#EDE0D0" /></linearGradient>
        <linearGradient id="t2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#F5EBDE" /><stop offset="100%" stopColor="#E8D8C8" /></linearGradient>
        <linearGradient id="t3" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#F2E8DA" /><stop offset="100%" stopColor="#E4D4C0" /></linearGradient>
      </defs>
      {/* Top tier */}
      <ellipse cx="95" cy="82" rx="34" ry="11" fill="#EEE4D8" />
      <rect x="61" y="71" width="68" height="48" fill="url(#t1)" rx="1" />
      <ellipse cx="95" cy="119" rx="34" ry="11" fill="#E4DAD0" />
      {/* Middle tier */}
      <ellipse cx="95" cy="119" rx="50" ry="14" fill="#EDE4D5" />
      <rect x="45" y="105" width="100" height="58" fill="url(#t2)" rx="1" />
      <ellipse cx="95" cy="163" rx="50" ry="14" fill="#E0D4C4" />
      {/* Bottom tier */}
      <ellipse cx="95" cy="163" rx="68" ry="16" fill="#EBDFD0" />
      <rect x="27" y="147" width="136" height="68" fill="url(#t3)" rx="1" />
      <ellipse cx="95" cy="215" rx="68" ry="16" fill="#DDD0C0" />
      {/* Decorative piping */}
      {[75, 85, 95, 105, 115].map((x, i) => <circle key={i} cx={x} cy="119" r="3.5" fill={C.roseLight} />)}
      {[52, 63, 74, 85, 95, 105, 116, 127, 138].map((x, i) => <circle key={i} cx={x} cy="163" r="3.5" fill={C.sageLight} />)}
      {/* Sage leaf clusters */}
      <ellipse cx="65" cy="95" rx="10" ry="5" fill={C.sageLight} transform="rotate(-35 65 95)" />
      <ellipse cx="125" cy="95" rx="10" ry="5" fill={C.sageLight} transform="rotate(35 125 95)" />
      <ellipse cx="50" cy="140" rx="12" ry="6" fill={C.sageLight} transform="rotate(-25 50 140)" />
      <ellipse cx="140" cy="140" rx="12" ry="6" fill={C.sageLight} transform="rotate(25 140 140)" />
      <ellipse cx="35" cy="188" rx="13" ry="6" fill={C.sageLight} transform="rotate(-20 35 188)" />
      <ellipse cx="155" cy="188" rx="13" ry="6" fill={C.sageLight} transform="rotate(20 155 188)" />
      {/* Decorative ribbon */}
      <path d="M27 185 Q95 175 163 185" stroke={C.rose} strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M45 130 Q95 120 145 130" stroke={C.sage} strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M61 90 Q95 82 129 90" stroke={C.roseLight} strokeWidth="1" fill="none" opacity="0.5" />
      {/* Rose buds */}
      <circle cx="95" cy="88" r="7" fill={C.roseLight} /><circle cx="95" cy="88" r="4" fill={C.rose} />
      <circle cx="78" cy="133" r="5.5" fill={C.roseLight} /><circle cx="78" cy="133" r="3" fill={C.rose} />
      <circle cx="112" cy="133" r="5.5" fill={C.roseLight} /><circle cx="112" cy="133" r="3" fill={C.rose} />
      <circle cx="60" cy="178" r="5" fill={C.roseLight} /><circle cx="60" cy="178" r="2.8" fill={C.rose} />
      <circle cx="130" cy="178" r="5" fill={C.roseLight} /><circle cx="130" cy="178" r="2.8" fill={C.rose} />
      <circle cx="95" cy="175" r="6" fill={C.roseLight} /><circle cx="95" cy="175" r="3.5" fill={C.rose} />
      {/* Candle */}
      <rect x="89" y="56" width="12" height="20" fill="#FFF5E0" rx="3" />
      <ellipse cx="95" cy="57" rx="5" ry="3.5" fill="#FFD670" />
      <ellipse cx="95" cy="54" rx="2" ry="3" fill="#FF9030" />
      {/* Flame glow */}
      <ellipse cx="95" cy="52" rx="5" ry="6" fill="#FFB84080" />
      {/* Stand */}
      <ellipse cx="95" cy="226" rx="70" ry="9" fill="#D8CCBA" />
      <rect x="86" y="226" width="18" height="20" fill="#CFC3B0" />
      <ellipse cx="95" cy="246" rx="30" ry="8" fill="#C8BCAA" />
    </svg>
  )
}

function CelebrationSection() {
  const isMobile = useIsMobile()
  return (
    <section id="celebration" style={{
      minHeight: "100vh",
      background: `linear-gradient(155deg, ${C.sagePale} 0%, ${C.cream} 45%, ${C.creamDark} 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: isMobile ? "90px 20px 60px" : "110px 24px 70px",
      position: "relative", overflow: "hidden",
      fontFamily: "'Cormorant Garamond',serif",
    }}>
      {!isMobile && (
        <div style={{ position: "absolute", fontSize: 220, color: "rgba(139,155,122,0.05)", fontStyle: "italic", userSelect: "none", whiteSpace: "nowrap", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>Forever</div>
      )}
      {!isMobile && <Botanical style={{ position: "absolute", top: 70, left: 20, opacity: 0.18 }} />}
      {!isMobile && <Botanical style={{ position: "absolute", top: 70, right: 20, opacity: 0.18 }} flip />}

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} style={{ textAlign: "center", position: "relative", width: "100%", maxWidth: 600 }}>
        <p style={{ color: C.rose, fontSize: 9, letterSpacing: isMobile ? 4 : 6, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, marginBottom: 14 }}>Save the Date</p>
        <h1 style={{ fontSize: isMobile ? "clamp(40px,10vw,60px)" : "clamp(56px, 9vw, 96px)", fontWeight: 300, color: C.dark, fontStyle: "italic", lineHeight: 1.05, marginBottom: 0 }}>Ahmed &amp; Mahitab</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center", margin: "18px 0 24px" }}>
          <div style={{ height: 1, width: 60, background: `linear-gradient(to right, transparent, ${C.rose})` }} />
          <span style={{ color: C.rose, fontSize: 13 }}>✦</span>
          <div style={{ height: 1, width: 60, background: `linear-gradient(to left, transparent, ${C.rose})` }} />
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }}>
          <CakeSVG isMobile={isMobile} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.55, duration: 0.7 }}>
          <p style={{ color: C.dark, fontSize: isMobile ? 20 : 24, fontStyle: "italic", fontWeight: 300, marginBottom: 8 }}>November  9, 2026</p>
          <p style={{ color: C.muted, fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", letterSpacing: 2, fontWeight: 300, marginBottom: 4 }}>Marshal Wedding Hall</p>
          <div style={{ marginTop: 28, display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6, background: "rgba(196,146,122,0.1)", border: `1px solid rgba(196,146,122,0.28)`, borderRadius: 4, padding: isMobile ? "18px 36px" : "22px 48px" }}>
            <p style={{ color: C.rose, fontSize: 9, letterSpacing: 4, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif" }}>Ceremony begins at</p>
            <p style={{ color: C.dark, fontSize: isMobile ? 32 : 40, fontStyle: "italic", fontWeight: 300, lineHeight: 1 }}>7:00 PM</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ── GALLERY ────────────────────────────────────────────────────────────────────
const PHOTOS = [
  { id: 1, src: img1, h: 300 },
  { id: 2, src: img2, h: 210 },
  { id: 3, src: img3, h: 260 },
  { id: 4, src: img4, h: 300 },
  { id: 5, src: img5, h: 230 },
  { id: 6, src: img6, h: 280 },
]

function GallerySection() {
  const [lb, setLb] = useState(null)
  const isMobile = useIsMobile()
  return (
    <section id="gallery" style={{ background: C.cream, padding: isMobile ? "60px 16px" : "80px 24px", fontFamily: "'Cormorant Garamond',serif" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 40 }}>
        <p style={{ color: C.rose, fontSize: 9, letterSpacing: 5, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, marginBottom: 12 }}>Our Moments Together</p>
        <h2 style={{ fontSize: isMobile ? 36 : 46, fontWeight: 300, fontStyle: "italic", color: C.dark }}>The Gallery</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 16 }}>
          <div style={{ height: 1, width: 50, background: `linear-gradient(to right, transparent, ${C.sageLight})` }} />
          <span style={{ color: C.sage, fontSize: 12 }}>✦</span>
          <div style={{ height: 1, width: 50, background: `linear-gradient(to left, transparent, ${C.sageLight})` }} />
        </div>
      </motion.div>

      <div style={{
        maxWidth: 920,
        margin: "0 auto",
        columnCount: isMobile ? 2 : 3, /* التعديل هنا: استخدام columnCount لفرض العدد */
        columnGap: 10
      }}>
        {PHOTOS.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            whileHover={{ scale: 1.025, transition: { duration: 0.25 } }}
            onClick={() => setLb(img)}
            style={{
              marginBottom: 10,
              breakInside: "avoid",
              display: "inline-block", /* إضافة مهمة لضمان استقرار العناصر جوه الأعمدة */
              width: "100%",           /* عشان العنصر ياخد عرض العمود بالكامل */
              cursor: "pointer",
              borderRadius: 4,
              overflow: "hidden",
              height: isMobile ? Math.round(img.h * 0.72) : img.h,
              background: C.creamDark,
              position: "relative"
            }}
          >
            <img
              src={img.src}
              alt={`Couple moment ${img.id}`}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => {
                e.target.style.display = "none";
                e.target.parentElement.style.background = `linear-gradient(135deg, ${C.sageLight}, ${C.creamDark})`
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(44,42,37,0.35) 0%, transparent 55%)",
                opacity: 0,
                transition: "opacity 0.3s"
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lb && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLb(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(44,42,37,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, cursor: "zoom-out" }}>
            <motion.img initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.82, opacity: 0 }} transition={{ duration: 0.35 }}
              src={lb.src} alt="Enlarged photo"
              style={{ maxWidth: "92vw", maxHeight: "88vh", objectFit: "contain", borderRadius: 4, cursor: "default" }}
              onClick={e => e.stopPropagation()} />
            <button onClick={() => setLb(null)}
              style={{ position: "absolute", top: 18, right: 20, background: "none", border: "none", color: "white", fontSize: 26, cursor: "pointer", opacity: 0.8, lineHeight: 1 }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ── TIMELINE ───────────────────────────────────────────────────────────────────
const EVENTS = [
  { year: "2019", title: "First Meeting", desc: "A chance encounter that changed everything. A simple conversation that felt like we had known each other for a lifetime.", side: "left" },
  { year: "2020", title: "The Proposal", desc: "The moment he formally asked for her hand. A promise made to walk this path together with the blessing of our families.", side: "right" },
  { year: "2022", title: "Fatiha Reading", desc: "A sacred milestone where our families gathered to recite the Fatiha, sealing our commitment with faith and love.", side: "left" },
  { year: "2023", title: "Engagement", desc: "Under a canopy of stars, we exchanged rings and officially became each other's 'forever.' The night our dream felt real.", side: "right" },
  { year: "2026", title: "Our Engagement  Day", desc: "The beginning of our greatest chapter. Hand in hand, we step into a new life, and we are honored to have you witness our 'I do.'", side: "left" },
]

// Mobile timeline item — line on far left, cards all on right
function TimelineItemMobile({ ev, i }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const isWedding = i === 4
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, ease: "easeOut" }}
      style={{ display: "flex", alignItems: "flex-start", gap: 0, paddingBottom: 36, position: "relative" }}
    >
      {/* Left column: line + dot */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0, paddingTop: 4 }}>
        {/* Dot */}
        <div style={{
          width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
          background: isWedding ? C.rose : C.sage,
          border: `2.5px solid ${C.sagePale}`,
          boxShadow: `0 0 0 3px ${isWedding ? C.roseLight : C.sageLight}`,
          zIndex: 2, position: "relative",
        }} />
        {/* Vertical line segment */}
        {i < EVENTS.length - 1 && (
          <div style={{ width: 1, flex: 1, minHeight: 80, background: `linear-gradient(to bottom, ${isWedding ? C.roseLight : C.sageLight}, ${C.sageLight})`, marginTop: 4 }} />
        )}
      </div>

      {/* Card */}
      <div style={{ flex: 1, marginLeft: 14, background: "white", borderRadius: 6, padding: "18px 18px", border: `1px solid ${C.creamDark}`, boxShadow: "0 4px 18px rgba(44,42,37,0.07)" }}>
        <p style={{ color: isWedding ? C.rose : C.sage, fontSize: 8, letterSpacing: 3, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600, marginBottom: 5, textTransform: "uppercase" }}>{ev.year}</p>
        <h3 style={{ color: C.dark, fontSize: 20, fontStyle: "italic", fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", marginBottom: 8 }}>{ev.title}</h3>
        <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300 }}>{ev.desc}</p>
      </div>
    </motion.div>
  )
}

// Desktop timeline item — alternating sides
function TimelineItemDesktop({ ev, i }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-90px" })
  const left = ev.side === "left"
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: left ? -55 : 55 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease: "easeOut" }}
      style={{ display: "flex", justifyContent: left ? "flex-start" : "flex-end", position: "relative", paddingBottom: 52 }}>
      <div style={{
        position: "absolute", left: "50%", transform: "translateX(-50%)", top: 22, zIndex: 2,
        width: 18, height: 18, borderRadius: "50%", background: i === 4 ? C.rose : C.sage,
        border: `3px solid ${C.sagePale}`, boxShadow: `0 0 0 4px ${i === 4 ? C.roseLight : C.sageLight}`,
      }} />
      <div style={{
        position: "absolute", [left ? "right" : "left"]: "calc(50% + 30px)",
        top: 20, color: C.muted, fontSize: 11, fontFamily: "'Josefin Sans',sans-serif",
        letterSpacing: 2, fontWeight: 300, whiteSpace: "nowrap",
      }}>{ev.year}</div>
      <div style={{ width: "43%", background: "white", borderRadius: 5, padding: "22px 26px", border: `1px solid ${C.creamDark}`, boxShadow: "0 6px 24px rgba(44,42,37,0.06)" }}>
        <p style={{ color: i === 4 ? C.rose : C.sage, fontSize: 9, letterSpacing: 4, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>{ev.year}</p>
        <h3 style={{ color: C.dark, fontSize: 23, fontStyle: "italic", fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", marginBottom: 10 }}>{ev.title}</h3>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300 }}>{ev.desc}</p>
      </div>
    </motion.div>
  )
}

function JourneySection() {
  const isMobile = useIsMobile()
  return (
    <section id="journey" style={{ background: C.sagePale, padding: isMobile ? "60px 0px" : "80px 24px", fontFamily: "'Cormorant Garamond',serif" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: isMobile ? 44 : 64, padding: "0 20px" }}>
        <p style={{ color: C.sage, fontSize: 9, letterSpacing: 5, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, marginBottom: 12 }}>From the beginning</p>
        <h2 style={{ fontSize: isMobile ? 36 : 46, fontWeight: 300, fontStyle: "italic", color: C.dark }}>Our Journey</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 16 }}>
          <div style={{ height: 1, width: 50, background: `linear-gradient(to right, transparent, ${C.sage})` }} />
          <span style={{ color: C.sage, fontSize: 12 }}>✦</span>
          <div style={{ height: 1, width: 50, background: `linear-gradient(to left, transparent, ${C.sage})` }} />
        </div>
      </motion.div>

      {isMobile ? (
        /* Mobile: left-aligned timeline */
        <div style={{ padding: "0 16px 0 20px", position: "relative" }}>
          {EVENTS.map((ev, i) => <TimelineItemMobile key={i} ev={ev} i={i} />)}
        </div>
      ) : (
        /* Desktop: alternating timeline */
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, transform: "translateX(-50%)", background: `linear-gradient(to bottom, transparent, ${C.sageLight} 15%, ${C.roseLight} 85%, transparent)` }} />
          {EVENTS.map((ev, i) => <TimelineItemDesktop key={i} ev={ev} i={i} />)}
        </div>
      )}
    </section>
  )
}

// ── VENUE ──────────────────────────────────────────────────────────────────────
const VENUE = {
  name: "Marshal Wedding Hall",
  address: "Marshall Hall, Aja, Dakahlia, Egypt",
  date: "November  9, 2026 · 7:00 PM",
  googleMapsUrl: "https://maps.apple/p/VHIt7VchnyBEiH",
  mapEmbedSrc: "https://maps.apple/p/VHIt7VchnyBEiH",
}

function VenueIllustration() {
  return (
    <svg viewBox="0 0 800 460" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D4E8C8" /><stop offset="100%" stopColor="#EDF2E8" /></linearGradient>
        <linearGradient id="lawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A8C090" /><stop offset="100%" stopColor="#88A870" /></linearGradient>
        <linearGradient id="stone2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F5EBDE" /><stop offset="100%" stopColor="#E0CFBC" /></linearGradient>
        <linearGradient id="roof2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C8A86E" /><stop offset="100%" stopColor="#A88850" /></linearGradient>
        <radialGradient id="sun2" cx="50%" cy="50%"><stop offset="0%" stopColor="#FFF5C8" stopOpacity="0.9" /><stop offset="100%" stopColor="#FFF5C8" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="800" height="460" fill="url(#sky)" />
      <ellipse cx="680" cy="80" rx="90" ry="90" fill="url(#sun2)" />
      <ellipse cx="120" cy="70" rx="60" ry="22" fill="rgba(255,255,255,0.7)" />
      <ellipse cx="160" cy="58" rx="44" ry="18" fill="rgba(255,255,255,0.6)" />
      <ellipse cx="580" cy="90" rx="50" ry="18" fill="rgba(255,255,255,0.6)" />
      <ellipse cx="400" cy="420" rx="500" ry="180" fill="#B8D0A0" />
      <ellipse cx="700" cy="400" rx="300" ry="140" fill="#C0D8A8" />
      <rect x="0" y="340" width="800" height="120" fill="url(#lawn)" />
      <path d="M0 340 Q200 320 400 335 Q600 350 800 330 L800 380 Q600 365 400 350 Q200 340 0 355 Z" fill="#98B880" />
      <path d="M360 460 L380 340 L420 340 L440 460 Z" fill="#D8CCBA" />
      <rect x="180" y="180" width="440" height="165" fill="url(#stone2)" rx="2" />
      {[200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580].map((x, i) => <line key={i} x1={x} y1="180" x2={x} y2="345" stroke="rgba(180,160,140,0.2)" strokeWidth="0.8" />)}
      {[200, 220, 240, 260, 280, 300, 320].map((y, i) => <line key={i} x1="180" y1={y} x2="620" y2={y} stroke="rgba(180,160,140,0.15)" strokeWidth="0.8" />)}
      <path d="M160 185 L400 110 L640 185 Z" fill="url(#roof2)" />
      <path d="M175 185 L400 118 L625 185 Z" fill="#D4B878" />
      {[240, 290, 350, 410, 460, 510, 560].map((x, i) => <g key={i}><rect x={x - 7} y="175" width="14" height="170" fill="#F0E6D8" rx="7" /><ellipse cx={x} cy="175" rx="9" ry="5" fill="#E8DCC8" /><ellipse cx={x} cy="345" rx="11" ry="5" fill="#E0D4C0" /></g>)}
      <rect x="368" y="258" width="64" height="87" fill="#5E6E50" rx="3" />
      <path d="M368 275 Q368 258 400 258 Q432 258 432 275" fill="#4A5840" />
      <rect x="373" y="270" width="24" height="30" fill="rgba(255,255,255,0.08)" rx="2" />
      <rect x="403" y="270" width="24" height="30" fill="rgba(255,255,255,0.08)" rx="2" />
      <circle cx="398" cy="300" r="3" fill="#C8A86E" /><circle cx="402" cy="300" r="3" fill="#C8A86E" />
      {[220, 270, 490, 540].map((x, i) => <g key={i}><rect x={x} y="210" width="42" height="60" fill="#7BA8C4" rx="3" opacity="0.8" /><path d={`M${x} 228 Q${x + 21} 208 ${x + 42} 228`} fill="#9EC0D8" opacity="0.5" /><line x1={x + 21} y1="210" x2={x + 21} y2="270" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" /><line x1={x} y1="240" x2={x + 42} y2="240" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" /><rect x={x - 3} y="207" width="48" height="66" fill="none" stroke="#D8C8B0" strokeWidth="3" rx="3" /></g>)}
      <rect x="80" y="240" width="120" height="105" fill="#EEE4D4" /><path d="M70 245 L140 205 L210 245 Z" fill="#C8A86E" /><rect x="110" y="290" width="30" height="55" fill="#5E6E50" rx="2" />
      <rect x="600" y="240" width="120" height="105" fill="#EEE4D4" /><path d="M590 245 L660 205 L730 245 Z" fill="#C8A86E" /><rect x="660" y="290" width="30" height="55" fill="#5E6E50" rx="2" />
      {[100, 145].map((x, i) => <g key={i}><rect x={x - 4} y="240" width="8" height="100" fill="#6B5E48" /><ellipse cx={x} cy="240" rx="16" ry="55" fill="#5E7248" /><ellipse cx={x} cy="220" rx="12" ry="40" fill="#6B8055" /></g>)}
      {[655, 700].map((x, i) => <g key={i}><rect x={x - 4} y="240" width="8" height="100" fill="#6B5E48" /><ellipse cx={x} cy="240" rx="16" ry="55" fill="#5E7248" /><ellipse cx={x} cy="220" rx="12" ry="40" fill="#6B8055" /></g>)}
      {[340, 460].map((x, i) => <g key={i}><ellipse cx={x} cy="348" rx="22" ry="14" fill="#8B9B7A" /><circle cx={x - 8} cy="342" r="5" fill="#E8C0B0" /><circle cx={x + 5} cy="340" r="6" fill="#C4927A" /><circle cx={x + 14} cy="344" r="4" fill="#E8C0B0" /></g>)}
      {[220, 260, 300, 340, 380, 420, 460, 500, 540, 580].map((x, i) => <circle key={i} cx={x} cy="183" r="4" fill={i % 2 === 0 ? "#E8C0B0" : "#C8D5BE"} opacity="0.8" />)}
    </svg>
  )
}

function VenueSection() {
  const isMobile = useIsMobile()
  const openMap = () => window.open(VENUE.googleMapsUrl, "_blank", "noopener,noreferrer")

  return (
    <section id="venue" style={{ background: C.cream, padding: isMobile ? "60px 16px" : "80px 24px", fontFamily: "'Cormorant Garamond',serif" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ textAlign: "center", marginBottom: isMobile ? 36 : 52 }}>
        <p style={{ color: C.sage, fontSize: 9, letterSpacing: 6, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, marginBottom: 12 }}>Where It All Happens</p>
        <h2 style={{ fontSize: isMobile ? 36 : 46, fontWeight: 300, fontStyle: "italic", color: C.dark }}>The Venue</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 16 }}>
          <div style={{ height: 1, width: 50, background: `linear-gradient(to right, transparent, ${C.sageLight})` }} />
          <span style={{ color: C.sage, fontSize: 12 }}>✦</span>
          <div style={{ height: 1, width: 50, background: `linear-gradient(to left, transparent, ${C.sageLight})` }} />
        </div>
      </motion.div>

      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: isMobile ? 16 : 24 }}>

        {/* Venue illustration / photo */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ width: "100%", borderRadius: 8, overflow: "hidden", height: isMobile ? 220 : 380, background: `linear-gradient(135deg, ${C.sagePale}, ${C.creamDark})`, boxShadow: "0 16px 48px rgba(44,42,37,0.12)", position: "relative" }}>
          {/* 👉 To use a real photo: replace <VenueIllustration /> with <img src={venueImg} style={{width:"100%",height:"100%",objectFit:"cover"}} /> */}
          <VenueIllustration />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to top, rgba(44,42,37,0.42), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", background: "rgba(250,246,240,0.92)", backdropFilter: "blur(10px)", borderRadius: 4, padding: isMobile ? "8px 18px" : "11px 26px", border: `1px solid rgba(200,168,110,0.4)`, textAlign: "center", whiteSpace: "nowrap" }}>
            <p style={{ color: C.gold, fontSize: 7, letterSpacing: 4, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>Est. 1890</p>
            <p style={{ color: C.dark, fontSize: isMobile ? 14 : 18, fontStyle: "italic", fontWeight: 300 }}>{VENUE.name}</p>
          </div>
        </motion.div>

        {/* Info cards */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.6 }}
          style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
          {[
            { icon: "📍", label: "Address", value: VENUE.address },
            { icon: "🕓", label: "Ceremony", value: VENUE.date },
            { icon: "🌿", label: "Setting", value: "Vineyard Estate · Outdoor & Indoor" },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, background: "white", borderRadius: 6, padding: isMobile ? "14px 16px" : "20px 22px", border: `1px solid ${C.creamDark}`, boxShadow: "0 4px 16px rgba(44,42,37,0.05)", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
              <div>
                <p style={{ color: C.muted, fontSize: 8, letterSpacing: 3, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 5 }}>{item.label}</p>
                <p style={{ color: C.dark, fontSize: isMobile ? 13 : 14, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, lineHeight: 1.5 }}>{item.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Open Maps button */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.6 }}
          style={{ display: "flex", justifyContent: "center" }}>
          <motion.button
            whileHover={{ scale: 1.035, boxShadow: "0 14px 36px rgba(94,110,80,0.38)" }}
            whileTap={{ scale: 0.97 }}
            onClick={openMap}
            style={{ display: "inline-flex", alignItems: "center", gap: 12, background: `linear-gradient(135deg, ${C.sage}, ${C.sageDark})`, border: "none", borderRadius: 6, cursor: "pointer", padding: isMobile ? "15px 28px" : "17px 42px", boxShadow: "0 6px 24px rgba(94,110,80,0.26)", transition: "box-shadow 0.25s" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="rgba(255,255,255,0.92)" />
              <circle cx="12" cy="9" r="2.5" fill={C.sageDark} />
            </svg>
            <span style={{ color: "white", fontSize: 9, letterSpacing: 3.5, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600 }}>Open in Google Maps</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </motion.div>

      </div>
    </section>
  )
}

// ── SCRATCH PUZZLE ─────────────────────────────────────────────────────────────
function PuzzleSection() {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [pct, setPct] = useState(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext("2d")
    const grad = ctx.createLinearGradient(0, 0, c.width, c.height)
    grad.addColorStop(0, "#8B9B7A")
    grad.addColorStop(0.5, "#A0A882")
    grad.addColorStop(1, "#7A8B6A")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, c.width, c.height)
    for (let n = 0; n < 280; n++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.12})`
      ctx.fillRect(Math.random() * c.width, Math.random() * c.height, Math.random() * 3 + 1, 1)
    }
    ctx.fillStyle = "rgba(250,246,240,0.75)"
    ctx.font = "500 11px 'Josefin Sans', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("✦  Scratch to reveal our message  ✦", c.width / 2, c.height / 2)
  }, [])

  const doScratch = useCallback((cx, cy) => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext("2d")
    const rect = c.getBoundingClientRect()
    const sx = c.width / rect.width, sy = c.height / rect.height
    const x = (cx - rect.left) * sx, y = (cy - rect.top) * sy
    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath(); ctx.arc(x, y, isMobile ? 30 : 26, 0, Math.PI * 2); ctx.fill()
    if (!revealed) {
      const d = ctx.getImageData(0, 0, c.width, c.height).data
      let t = 0; for (let i = 3; i < d.length; i += 4) if (d[i] < 128) t++
      const p = (t / (c.width * c.height)) * 100
      setPct(p); if (p > 62) setRevealed(true)
    }
  }, [revealed, isMobile])

  const onMouse = useCallback(e => { if (drawing) doScratch(e.clientX, e.clientY) }, [drawing, doScratch])
  const onTouch = useCallback(e => { e.preventDefault(); doScratch(e.touches[0].clientX, e.touches[0].clientY) }, [doScratch])

  return (
    <section id="puzzle" style={{ background: C.creamDark, padding: isMobile ? "60px 16px" : "80px 24px", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Cormorant Garamond',serif" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 40 }}>
        <p style={{ color: C.rose, fontSize: 9, letterSpacing: 5, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, marginBottom: 12 }}>A Gift for You</p>
        <h2 style={{ fontSize: isMobile ? 36 : 46, fontWeight: 300, fontStyle: "italic", color: C.dark }}>Message of Love</h2>
        <p style={{ color: C.muted, fontSize: 12, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, marginTop: 12 }}>Scratch the card to unlock our special message for you</p>
      </motion.div>

      <div style={{ position: "relative", width: "100%", maxWidth: 440, borderRadius: 8, overflow: "hidden", boxShadow: "0 12px 40px rgba(44,42,37,0.1)" }}>
        <div style={{ background: "white", padding: isMobile ? "36px 24px" : "44px 36px", textAlign: "center", minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div style={{ color: C.rose, fontSize: 16, letterSpacing: 8 }}>✦ ✦ ✦</div>
          <p style={{ color: C.rose, fontSize: 9, letterSpacing: 4, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, textTransform: "uppercase" }}>Words We Live By</p>
          <p style={{ color: C.dark, fontSize: isMobile ? 18 : 21, fontStyle: "italic", fontWeight: 300, lineHeight: 1.65, fontFamily: "'Cormorant Garamond',serif" }}>
            "Love is not just looking at each other,<br />it's looking in the same direction."
          </p>
          <p style={{ color: C.muted, fontSize: 12, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, letterSpacing: 1 }}>— Antoine de Saint-Exupéry</p>
          <div style={{ width: 36, height: 1, background: C.gold, marginTop: 4 }} />
          <p style={{ color: C.sage, fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, letterSpacing: 2 }}>A &amp; M · 2026</p>
        </div>
        <AnimatePresence>
          {!revealed && (
            <motion.canvas ref={canvasRef} width={440} height={270}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              onMouseDown={() => setDrawing(true)} onMouseUp={() => setDrawing(false)} onMouseLeave={() => setDrawing(false)} onMouseMove={onMouse}
              onTouchStart={e => { setDrawing(true); onTouch(e) }} onTouchEnd={() => setDrawing(false)} onTouchMove={onTouch}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "crosshair", touchAction: "none", borderRadius: 8 }} />
          )}
        </AnimatePresence>
      </div>

      {!revealed && pct > 5 && (
        <div style={{ marginTop: 16, width: "100%", maxWidth: 440 }}>
          <div style={{ height: 2, background: C.creamDeep, borderRadius: 2, overflow: "hidden" }}>
            <motion.div animate={{ width: `${Math.min(pct / 62 * 100, 100)}%` }} style={{ height: "100%", background: C.rose, borderRadius: 2 }} />
          </div>
        </div>
      )}

      <AnimatePresence>
        {revealed && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ color: C.sage, fontSize: 10, letterSpacing: 3, fontFamily: "'Josefin Sans',sans-serif", marginTop: 20, fontWeight: 300, textAlign: "center" }}>
            ✦ You've uncovered our words ✦
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}

// ── RSVP ───────────────────────────────────────────────────────────────────────
function RSVPSection() {
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [guest, setGuest] = useState("")
  const [confetti, setConfetti] = useState(false)
  const isMobile = useIsMobile()

  const submit = () => {
    if (!name.trim()) return
    setGuest(name.trim()); setSubmitted(true)
    setTimeout(() => setConfetti(true), 400)
  }

  return (
    <section id="rsvp" style={{
      minHeight: "90vh",
      background: `linear-gradient(150deg, ${C.sageDark} 0%, ${C.sage} 45%, #A0B090 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: isMobile ? "70px 20px" : "80px 24px", position: "relative", overflow: "hidden",
      fontFamily: "'Cormorant Garamond',serif",
    }}>
      <Confetti active={confetti} onComplete={() => setConfetti(false)} />

      {!isMobile && ["M", "A"].map((l, i) => (
        <div key={l} style={{ position: "absolute", [i === 0 ? "left" : "right"]: "4%", top: "50%", transform: "translateY(-50%)", fontSize: 200, color: "rgba(255,255,255,0.06)", fontStyle: "italic", userSelect: "none", lineHeight: 1 }}>{l}</div>
      ))}
      <Botanical style={{ position: "absolute", bottom: 10, left: "10%", opacity: 0.1, filter: "brightness(10)" }} />
      <Botanical style={{ position: "absolute", top: 70, right: "10%", opacity: 0.1, filter: "brightness(10)" }} flip />

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 36 }}>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 9, letterSpacing: 5, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300, marginBottom: 12 }}>Join Our Celebration</p>
        <h2 style={{ fontSize: isMobile ? 44 : 52, fontWeight: 300, fontStyle: "italic", color: "white", letterSpacing: 1 }}>RSVP</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 14 }}>
          <div style={{ height: 1, width: 50, background: "rgba(255,255,255,0.3)" }} />
          <span style={{ color: C.roseLight, fontSize: 12 }}>✦</span>
          <div style={{ height: 1, width: 50, background: "rgba(255,255,255,0.3)" }} />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -22, scale: 0.96 }} transition={{ duration: 0.5 }}
            style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.78)", fontFamily: "'Josefin Sans',sans-serif", fontSize: isMobile ? 13 : 14, fontWeight: 300, marginBottom: 28, lineHeight: 1.8, padding: "0 4px" }}>
              We'd be honored to have you celebrate with us. Please enter your name to confirm your attendance.
            </p>
            <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="Your full name..."
              style={{
                width: "100%", padding: "16px 20px", fontSize: 18, borderRadius: 4, marginBottom: 12,
                background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.38)",
                color: "white", outline: "none", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic",
              }} />
            <motion.button whileHover={{ background: C.roseDark }} whileTap={{ scale: 0.97 }} onClick={submit}
              style={{
                width: "100%", padding: "16px 32px", background: C.rose, border: "none", borderRadius: 4,
                color: "white", fontSize: 9, letterSpacing: 4, textTransform: "uppercase",
                fontFamily: "'Josefin Sans',sans-serif", cursor: "pointer", fontWeight: 600, transition: "background 0.2s",
              }}>
              Confirm Attendance
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="ty" initial={{ opacity: 0, scale: 0.88, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{
              maxWidth: 500, width: "100%", textAlign: "center",
              background: "rgba(255,255,255,0.13)", backdropFilter: "blur(22px)",
              border: "1px solid rgba(255,255,255,0.32)", borderRadius: 10, padding: isMobile ? "36px 24px" : "52px 44px",
            }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              style={{ width: 52, height: 52, borderRadius: "50%", background: C.roseLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 20 }}>
              ✦
            </motion.div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 9, letterSpacing: 5, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif", marginBottom: 16 }}>See you on the 14th</p>
            <h3 style={{ color: "white", fontSize: isMobile ? 24 : 30, fontStyle: "italic", fontWeight: 300, lineHeight: 1.35, marginBottom: 16 }}>
              We are waiting for you,<br />{guest}!
            </h3>
            <p style={{ color: "rgba(255,255,255,0.82)", fontFamily: "'Josefin Sans',sans-serif", fontSize: isMobile ? 12 : 14, fontWeight: 300, lineHeight: 1.85, marginBottom: 24 }}>
              You've just made our day more special. We cannot wait to share this moment with you — November  9, 2026, Napa Valley.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
              <div style={{ height: 1, width: 44, background: "rgba(255,255,255,0.3)" }} />
              <span style={{ color: C.roseLight, fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: "italic" }}>A &amp; M</span>
              <div style={{ height: 1, width: 44, background: "rgba(255,255,255,0.3)" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ── FOOTER ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.dark, padding: "40px 24px", textAlign: "center" }}>
      <p style={{ color: "rgba(250,246,240,0.45)", fontSize: 9, letterSpacing: 5, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif", marginBottom: 12 }}>November  9, 2026</p>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", color: "rgba(250,246,240,0.88)", fontSize: 24, fontStyle: "italic", fontWeight: 300, marginBottom: 14 }}>Ahmed &amp; Mahitab</p>
      <p style={{ color: "rgba(250,246,240,0.28)", fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", letterSpacing: 1.5 }}>Marshal Wedding Hall</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 22 }}>
        <div style={{ height: 1, width: 40, background: "rgba(250,246,240,0.15)" }} />
        <span style={{ color: C.rose, fontSize: 12 }}>✦</span>
        <div style={{ height: 1, width: 40, background: "rgba(250,246,240,0.15)" }} />
      </div>
    </footer>
  )
}

// ── MAIN APP ───────────────────────────────────────────────────────────────────
function MainApp() {
  const [active, setActive] = useState("celebration")
  useEffect(() => {
    const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }), { threshold: 0.3 })
    NAV_ITEMS.forEach(([id]) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
      <Nav active={active} />
      <CelebrationSection />
      <VenueSection />
      <PuzzleSection />
      <RSVPSection />
      <Footer />
    </motion.div>
  )
}

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function WeddingApp() {
  const [phase, setPhase] = useState("envelope")

  useEffect(() => {
    const s = document.createElement("style")
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Josefin+Sans:wght@300;400;600&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
      input::placeholder{color:rgba(255,255,255,0.45)}
      input:focus{box-shadow:0 0 0 2px rgba(196,146,122,0.35)!important}
      ::-webkit-scrollbar{width:6px}
      ::-webkit-scrollbar-track{background:${C.cream}}
      ::-webkit-scrollbar-thumb{background:${C.sageLight};border-radius:3px}
      @media (max-width: 768px) {
        html { font-size: 15px; }
      }
    `
    document.head.appendChild(s)
    return () => document.head.removeChild(s)
  }, [])

  return (
    <div>
      <AnimatePresence mode="wait">
        {phase === "envelope"
          ? <EnvelopePage key="env" onOpen={() => setPhase("main")} />
          : <MainApp key="main" />}
      </AnimatePresence>
    </div>
  )
}