import { useEffect, useRef, useState, useCallback } from 'react'
import {
  NAV,
  MARQUEE_A,
  MARQUEE_B,
  SIGNALS,
  SERVICES,
  KPIS,
  EFFICIENCY,
  CASES,
  PROCESS,
  PLAYBOOKS,
  FRAMEWORKS,
  CREATIVE,
  CLIENTS,
  MFC,
} from './data'
import {
  CaseChart,
  Efficiency,
  TrendGrid,
  RankList,
  PageBars,
  Opportunity,
  REDUCED_MOTION,
  useInView,
} from './charts'

/* ==========================================================================
   PRIMITIVES
   ========================================================================== */

function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (REDUCED_MOTION) {
      el.classList.add('in')
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}s`, ...style }} {...rest}>
      {children}
    </Tag>
  )
}

function Counter({ target, money, prefix = '', suffix }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const fmt = (v) => (money ? v.toFixed(2) : Math.round(v).toLocaleString('en-US'))
    if (REDUCED_MOTION) {
      el.textContent = fmt(target)
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          io.unobserve(el)
          const t0 = performance.now()
          const dur = 1700
          const ease = (t) => 1 - Math.pow(1 - t, 4)
          const tick = (now) => {
            const p = Math.min((now - t0) / dur, 1)
            el.textContent = fmt(target * ease(p))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }),
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, money])
  return (
    <>
      {prefix}
      <span ref={ref}>{money ? '0.00' : '0'}</span>
      {suffix && <span style={{ color: 'var(--accent-ink)' }}>{suffix}</span>}
    </>
  )
}

function useTilt(strength = 3.5) {
  const onMove = useCallback(
    (e) => {
      if (REDUCED_MOTION || !window.matchMedia('(pointer: fine)').matches) return
      const card = e.currentTarget
      const r = card.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      card.style.transform = `perspective(1000px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateY(-4px)`
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
    },
    [strength]
  )
  const onLeave = useCallback((e) => {
    e.currentTarget.style.transform = ''
  }, [])
  return { onMouseMove: onMove, onMouseLeave: onLeave }
}

const Italic = ({ children }) => (
  <span className="italic" style={{ color: 'var(--accent-ink)' }}>
    {children}
  </span>
)


function SectionHead({ eyebrow, index, children, lede, align = 'center' }) {
  const center = align === 'center'
  return (
    <Reveal className={`mb-14 ${center ? 'text-center' : ''}`}>
      <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
        <span className="eyebrow !mb-0">{eyebrow}</span>
        {index && (
          <span className="font-mono text-[10px] tracking-[0.16em]" style={{ color: 'var(--faint)' }}>
            {index}
          </span>
        )}
      </div>
      <h2 className="font-display font-bold leading-[1.04] tracking-[-0.03em] text-[clamp(33px,5vw,56px)] mt-4">
        {children}
      </h2>
      {lede && (
        <p
          className={`max-w-[600px] mt-5 text-[16.5px] ${center ? 'mx-auto' : ''}`}
          style={{ color: 'var(--dim)' }}
        >
          {lede}
        </p>
      )}
    </Reveal>
  )
}

/* ==========================================================================
   NAV
   ========================================================================== */

function Nav({ theme, toggleTheme }) {
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const ids = NAV.map(([h]) => h.slice(1))
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (vis[0]) setActive(`#${vis[0].target.id}`)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6] }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-2xl"
      style={{ background: 'var(--nav-bg)', borderColor: 'var(--line)' }}
    >
      <div className="shell py-3 flex items-center justify-between gap-4">
        <a
          href="#top"
          className="tap-safe gap-2.5 font-display font-bold text-[20px] tracking-tight no-underline shrink-0"
          style={{ color: 'var(--text)' }}
        >
          <span className="relative w-7 h-7 inline-flex items-center justify-center">
            <span
              className="absolute inset-0 rounded-[9px] rotate-[18deg]"
              style={{ background: 'linear-gradient(135deg, var(--ember), var(--gold))' }}
            />
            <span
              className="relative font-mono text-[12px] font-bold"
              style={{ color: 'var(--on-ember)' }}
            >
              T
            </span>
          </span>
          Tanzim.
        </a>

        <nav className="hidden lg:flex gap-1" aria-label="Sections">
          {NAV.map(([href, label]) => {
            const on = active === href
            return (
              <a
                key={href}
                href={href}
                aria-current={on ? 'true' : undefined}
                className="relative px-3 py-2 text-[14px] font-medium no-underline transition-colors rounded-full"
                style={{ color: on ? 'var(--text)' : 'var(--dim)' }}
              >
                {label}
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0.5 h-[3px] w-[3px] rounded-full transition-opacity"
                  style={{ background: 'var(--ember)', opacity: on ? 1 : 0 }}
                />
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="w-11 h-11 rounded-full inline-flex items-center justify-center cursor-pointer bg-transparent transition-all duration-300 hover:rotate-[22deg]"
            style={{ border: '1px solid var(--line-strong)', color: 'var(--text)' }}
          >
            {theme === 'dark' ? (
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>

          <a href="#contact" className="pill pill-accent hidden sm:inline-flex">
            Hire Me
          </a>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="lg:hidden w-11 h-11 rounded-full inline-flex items-center justify-center cursor-pointer bg-transparent"
            style={{ border: '1px solid var(--line-strong)', color: 'var(--text)' }}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t" style={{ borderColor: 'var(--line)', background: 'var(--bg)' }}>
          <nav className="shell py-4 flex flex-col" aria-label="Sections">
            {NAV.map(([href, label], i) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-3.5 text-[17px] font-medium no-underline border-b flex items-center justify-between"
                style={{ color: 'var(--text)', borderColor: 'var(--line)' }}
              >
                {label}
                <span className="font-mono text-[11px]" style={{ color: 'var(--faint)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="pill pill-accent mt-5">
              Hire Me
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

/* ==========================================================================
   HERO
   ========================================================================== */

function Hero() {
  const photoRef = useRef(null)
  const spotRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    if (REDUCED_MOTION) return
    const onScroll = () => {
      if (photoRef.current) {
        photoRef.current.style.transform = `translateY(${Math.min(window.scrollY, 700) * 0.1}px)`
      }
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (REDUCED_MOTION || !window.matchMedia('(pointer: fine)').matches) return
    const el = sectionRef.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      if (spotRef.current) {
        spotRef.current.style.transform = `translate3d(${e.clientX - r.left - 300}px, ${e.clientY - r.top - 300}px, 0)`
      }
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-5 sm:px-6 pt-16 pb-10 text-center"
      aria-label="Introduction"
    >
      {/* backdrop */}
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
      <div
        className="aurora animate-float-a w-[560px] h-[440px] -top-[140px] left-[6%] pointer-events-none"
        style={{ background: 'var(--glow)' }}
        aria-hidden
      />
      <div
        className="aurora animate-float-b w-[460px] h-[380px] top-[120px] right-[2%] pointer-events-none"
        style={{ background: 'var(--glow-2)' }}
        aria-hidden
      />
      <div
        className="aurora animate-float-a w-[380px] h-[300px] top-[380px] left-[34%] pointer-events-none"
        style={{ background: 'var(--glow-3)', animationDelay: '-6s' }}
        aria-hidden
      />
      <div
        ref={spotRef}
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none hidden md:block"
        style={{
          background: 'radial-gradient(closest-side, var(--glow), transparent 72%)',
          opacity: 0.65,
          willChange: 'transform',
        }}
        aria-hidden
      />

      <div className="hero-stagger relative z-10 shell">
        <div
          className="inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 mb-8 font-mono text-[11px] uppercase tracking-[0.13em]"
          style={{ color: 'var(--dim)', border: '1px solid var(--line-strong)', background: 'var(--bg-soft)' }}
        >
          <span
            className="w-[7px] h-[7px] rounded-full animate-pulse-dot"
            style={{ background: 'var(--ember)' }}
          />
          Digital Marketing Lead · Social Engagement Group
        </div>

        <h1 className="font-display font-bold mx-auto mb-3 max-w-[13em] leading-[1.0] sm:leading-[0.98] tracking-[-0.04em] sm:tracking-[-0.045em] text-[clamp(38px,8.4vw,104px)]">
          I&apos;m{' '}
          <span className="accent-name">
            <span className="gradient-text">Tanzim Shahriar</span>
            <svg viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden>
              <path
                d="M2 8.5C46 3.5 108 2 150 3.5C196 5 258 7 298 4"
                fill="none"
                stroke="var(--ember)"
                strokeWidth="4"
                strokeLinecap="round"
                pathLength="1"
              />
            </svg>
          </span>
        </h1>

        <p
          className="font-display italic font-medium mb-6 text-[clamp(21px,3vw,32px)]"
          style={{ color: 'var(--dim)' }}
        >
          and I turn ad spend into measurable growth.
        </p>

        <p className="max-w-[580px] mx-auto mb-9 text-[17px] leading-relaxed" style={{ color: 'var(--dim)' }}>
          I build and manage Google and paid social campaigns for law firms, medical practices,
          restaurants, and local businesses. I report back in qualified leads and ROAS, not
          impressions.
        </p>

        <div className="flex justify-center gap-3 flex-wrap mb-10">
          <a href="#results" className="pill pill-accent">
            See the results
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </a>
          <a href="#contact" className="pill pill-ghost">
            Hire Me
          </a>
        </div>

        <SignalTicker />

        <div className="relative w-fit mx-auto mt-14">
          <div ref={photoRef} className="relative w-[176px] h-[176px] will-change-transform">
            <div
              className="absolute -inset-1 rounded-full"
              style={{ background: 'linear-gradient(135deg, var(--ember), var(--gold), var(--violet))' }}
              aria-hidden
            />
            <div className="absolute inset-0 rounded-full p-[5px]" style={{ background: 'var(--bg)' }}>
              <img
                src="/hero.jpg"
                alt="Tanzim Shahriar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div
              className="absolute -inset-4 rounded-full border border-dashed animate-spin-slow"
              style={{ borderColor: 'var(--line-strong)' }}
              aria-hidden
            />
            <div
              className="absolute -inset-8 rounded-full border animate-spin-rev"
              style={{ borderColor: 'var(--line)' }}
              aria-hidden
            />
          </div>

          <FloatCard className="hidden sm:flex -left-[190px] top-2" value="1,846" label="leads / 30 days" tone="var(--gold)" />
          <FloatCard className="hidden sm:flex -right-[176px] top-[92px]" value="$0.16" label="cost per follower" tone="var(--violet)" />
        </div>
      </div>
    </section>
  )
}

function FloatCard({ className = '', value, label, tone }) {
  return (
    <div
      className={`absolute items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-md animate-float-a ${className}`}
      style={{ background: 'var(--overlay)', border: '1px solid var(--line-strong)' }}
      aria-hidden
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: tone }} />
      <span className="text-left">
        <span className="block font-display font-bold text-[19px] leading-none tabular-nums">{value}</span>
        <span className="block font-mono text-[9.5px] uppercase tracking-[0.12em] mt-1" style={{ color: 'var(--faint)' }}>
          {label}
        </span>
      </span>
    </div>
  )
}

function SignalTicker() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (REDUCED_MOTION) return
    const t = setInterval(() => setI((v) => (v + 1) % SIGNALS.length), 2800)
    return () => clearInterval(t)
  }, [])
  const [value, what, who] = SIGNALS[i]
  return (
    <div
      className="inline-flex items-center gap-3 rounded-full px-5 py-3 max-w-full"
      style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)' }}
      aria-live="off"
    >
      <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] shrink-0" style={{ color: 'var(--faint)' }}>
        Proof
      </span>
      <span className="w-px h-4 shrink-0" style={{ background: 'var(--line-strong)' }} aria-hidden />
      <span key={i} className="flex items-baseline gap-2 flex-wrap justify-center text-[14px]">
        <b className="font-display font-bold text-[17px] tabular-nums" style={{ color: 'var(--accent-ink)' }}>
          {value}
        </b>
        <span style={{ color: 'var(--dim)' }}>{what}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--faint)' }}>
          {who}
        </span>
      </span>
    </div>
  )
}

/* ==========================================================================
   MARQUEE
   ========================================================================== */

function Marquee() {
  const a = [...MARQUEE_A, ...MARQUEE_A]
  const b = [...MARQUEE_B, ...MARQUEE_B]
  return (
    <div className="relative overflow-hidden mt-6 mb-2 select-none" aria-hidden>
      <div className="marquee-band -mx-6">
      <div
        className="-rotate-[1.4deg] overflow-hidden py-3.5"
        style={{ background: 'linear-gradient(90deg, var(--ember), var(--gold) 55%, var(--ember))' }}
      >
        <div className="animate-marquee-l flex w-max">
          {a.map((label, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 px-5 font-display font-bold text-[17px] uppercase tracking-wide whitespace-nowrap"
              style={{ color: 'var(--on-ember)' }}
            >
              {label}
              <span className="text-[11px] opacity-70">◆</span>
            </span>
          ))}
        </div>
      </div>
      <div
        className="rotate-[1.1deg] -mt-1 overflow-hidden py-2.5 border-y"
        style={{ background: 'var(--bg-soft)', borderColor: 'var(--line)' }}
      >
        <div className="animate-marquee-r flex w-max">
          {b.map((label, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 px-5 font-mono text-[12px] uppercase tracking-[0.12em] whitespace-nowrap"
              style={{ color: 'var(--faint)' }}
            >
              {label}
              <span style={{ color: 'var(--accent-ink)' }}>/</span>
            </span>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}

/* ==========================================================================
   SERVICES
   ========================================================================== */

function Services() {
  const [open, setOpen] = useState(0)
  return (
    <section id="services" className="py-16 md:py-28" aria-label="Services">
      <div className="shell">
        <SectionHead
          eyebrow="My Services"
          index="01"
          lede="Four service pillars, one outcome: a predictable pipeline of qualified leads with a return you can point to."
        >
          How I turn spend into <Italic>leads</Italic>
        </SectionHead>

        <div className="flex flex-col gap-3">
          {SERVICES.map((s, i) => {
            const isOpen = open === i
            return (
              <Reveal
                as="article"
                key={s.title}
                delay={i * 0.07}
                className="relative rounded-card overflow-hidden border transition-all duration-300"
                style={{
                  background: isOpen ? 'var(--card-2)' : 'var(--bg-soft)',
                  borderColor: isOpen ? 'color-mix(in srgb, var(--ember) 50%, transparent)' : 'var(--line)',
                }}
              >
                {isOpen && (
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: 'linear-gradient(180deg, var(--ember), var(--gold))' }}
                    aria-hidden
                  />
                )}
                <button
                  className="w-full flex items-center gap-4 md:gap-6 px-5 md:px-8 py-6 text-left cursor-pointer bg-transparent border-none"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span
                    className="font-mono text-[12px] min-w-[30px]"
                    style={{ color: isOpen ? 'var(--accent-ink)' : 'var(--faint)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 font-display font-bold tracking-[-0.02em] text-[clamp(20px,2.6vw,29px)]">
                    {s.title}
                  </span>
                  <span className="hidden md:flex flex-col items-end mr-2">
                    <span className="font-display font-bold text-[17px] tabular-nums" style={{ color: 'var(--accent-ink)' }}>
                      {s.metric[0]}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: 'var(--faint)' }}>
                      {s.metric[1]}
                    </span>
                  </span>
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                    style={
                      isOpen
                        ? { background: 'var(--ember)', color: 'var(--on-ember)', transform: 'rotate(45deg)' }
                        : { color: 'var(--dim)', border: '1px solid var(--line-strong)' }
                    }
                    aria-hidden
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{ maxHeight: isOpen ? '460px' : '0px' }}
                >
                  <div className="px-5 md:pl-[86px] md:pr-8 pb-8">
                    <p className="max-w-[680px] mb-5 text-[15.5px] leading-relaxed" style={{ color: 'var(--dim)' }}>
                      {s.body}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   RESULTS
   ========================================================================== */

function KpiTile({ k, i }) {
  const [ref, inView] = useInView(0.4)
  return (
    <Reveal
      delay={i * 0.06}
      className="surface surface-glow p-5 sm:p-6 md:p-7 overflow-hidden"
      style={{ background: 'var(--card)' }}
    >
      <div ref={ref} className="relative">
        <span
          className="absolute right-0 top-0 w-9 h-9 rounded-full opacity-25"
          style={{ background: `var(--${k.tone})`, filter: 'blur(16px)' }}
          aria-hidden
        />
        <div className="stat-num text-[clamp(31px,4.2vw,46px)]">
          <Counter {...k} />
        </div>
        <div className="mt-3 text-[13.5px] font-semibold">{k.label}</div>
        <div
          className="font-mono text-[10px] uppercase tracking-[0.12em] mt-1"
          style={{ color: 'var(--faint)' }}
        >
          {k.sub}
        </div>
        <div className="mt-4 h-[3px] rounded-full" style={{ background: 'var(--chart-track)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: inView ? '100%' : '0%',
              background: `linear-gradient(90deg, var(--${k.tone}), transparent)`,
              transition: REDUCED_MOTION ? 'none' : `width 1.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
            }}
          />
        </div>
      </div>
    </Reveal>
  )
}

function Results() {
  const tilt = useTilt(2.5)
  return (
    <section
      id="results"
      className="py-16 md:py-28 border-y relative"
      style={{ background: 'var(--bg-soft)', borderColor: 'var(--line)' }}
      aria-label="Results and case studies"
    >
      <div className="shell">
        <SectionHead
          eyebrow="Case Studies & Results"
          index="02"
          lede="Numbers pulled straight from the ad accounts I've managed. Every figure below comes from SEG campaign reporting."
        >
          Proof, not <Italic>promises</Italic>
        </SectionHead>

        {/* Bento: 4 KPI tiles + efficiency chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 mb-3.5">
          {KPIS.map((k, i) => (
            <KpiTile key={k.label} k={k} i={i} />
          ))}
        </div>

        <Reveal className="surface p-5 sm:p-6 md:p-9 mb-8" style={{ background: 'var(--card)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.35fr] gap-8 lg:gap-12 items-start">
            <div>
              <span className="tag-outline mb-4">Efficiency</span>
              <h3 className="font-display font-bold text-[clamp(23px,2.8vw,31px)] tracking-[-0.02em] leading-tight mb-3">
                What an outcome actually costs
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: 'var(--dim)' }}>
                Cost per lead is the only number that survives a budget meeting. These are the real
                reported costs across five campaigns, on three different platforms, for three
                different kinds of outcome.
              </p>
            </div>
            <Efficiency config={EFFICIENCY} />
          </div>
        </Reveal>

        {/* Case study cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {CASES.map((c, i) => (
            <Reveal
              as="article"
              key={c.client}
              delay={(i % 2) * 0.07}
              className="surface surface-glow p-5 sm:p-6 md:p-8 flex flex-col"
              style={{ background: 'var(--card)' }}
              {...tilt}
            >
              {/* Stacked on phones — the client tag and channel label both wrap
                  and collide when forced side by side at 390px. */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3 mb-3">
                <span className="tag-outline self-start">{c.client}</span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.12em] sm:pt-2 sm:text-right"
                  style={{ color: 'var(--faint)' }}
                >
                  {c.channel}
                </span>
              </div>

              <h3 className="font-display font-bold text-[clamp(20px,2.3vw,25px)] tracking-[-0.02em] leading-tight mb-3">
                {c.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed mb-4" style={{ color: 'var(--dim)' }}>
                {c.body}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {c.highlights.map((h) => (
                  <span
                    key={h}
                    className="font-mono text-[10.5px] px-2.5 py-1.5 rounded-md"
                    style={{
                      color: 'var(--accent-ink)',
                      background: 'color-mix(in srgb, var(--ember) 10%, transparent)',
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              <div
                className="mt-auto pt-6 border-t"
                style={{ borderColor: 'var(--line)' }}
              >
                <CaseChart config={c.chart} />
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {c.stats.map(([v, l]) => (
                  <span key={l} className="chip">
                    <b>{v}</b> {l}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 rounded-card px-6 py-5 text-center" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
          <p className="font-mono text-[11px] uppercase tracking-[0.09em] leading-loose" style={{ color: 'var(--faint)' }}>
            Also proven on TikTok:{' '}
            <span style={{ color: 'var(--dim)' }}>Sporcle — 753K video views, 927 clicks, $0.22 per paid follower</span>{' '}
            ·{' '}
            <span style={{ color: 'var(--dim)' }}>BPI Sports — 6,119 follows at $0.16 each</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ==========================================================================
   MFC LAW — organic search showcase, from the July 2026 client report
   ========================================================================== */

function KpiCard({ k, i }) {
  const [ref, inView] = useInView(0.4)
  return (
    <Reveal delay={i * 0.06} className="surface surface-glow p-5 sm:p-6 overflow-hidden">
      <div ref={ref} className="relative">
        <span
          className="absolute right-0 -top-1 w-10 h-10 rounded-full opacity-25"
          style={{ background: `var(--${k.tone})`, filter: 'blur(18px)' }}
          aria-hidden
        />
        <div
          className="font-mono text-[9.5px] uppercase tracking-[0.14em]"
          style={{ color: 'var(--faint)' }}
        >
          {k.label}
        </div>
        <div className="stat-num text-[clamp(30px,4vw,44px)] mt-2">
          {k.display || <Counter target={k.value} />}
        </div>
        <div className="flex items-baseline gap-2 mt-3">
          <span
            className="font-mono text-[13px] font-medium px-2 py-0.5 rounded"
            style={{
              color: `var(--${k.tone})`,
              background: `color-mix(in srgb, var(--${k.tone}) 14%, transparent)`,
            }}
          >
            {k.delta}
          </span>
          <span className="font-mono text-[10.5px]" style={{ color: 'var(--faint)' }}>
            from {k.from}
          </span>
        </div>
        {k.note && (
          <div className="font-mono text-[9.5px] mt-2" style={{ color: 'var(--faint)' }}>
            {k.note}
          </div>
        )}
        <div className="mt-4 h-[3px] rounded-full" style={{ background: 'var(--chart-track)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: inView ? '100%' : '0%',
              background: `linear-gradient(90deg, var(--${k.tone}), transparent)`,
              transition: REDUCED_MOTION ? 'none' : `width 1.3s cubic-bezier(0.22,1,0.36,1) ${i * 0.09}s`,
            }}
          />
        </div>
      </div>
    </Reveal>
  )
}

function MfcShowcase() {
  const tilt = useTilt(2)
  const sc = MFC.showcase

  return (
    <section
      id="mfc"
      className="py-16 md:py-28 border-y relative overflow-hidden"
      style={{ background: 'var(--bg-soft)', borderColor: 'var(--line)' }}
      aria-label="MFC Law organic search showcase"
    >
      <div
        className="aurora animate-float-a w-[520px] h-[400px] -top-[120px] right-[4%] pointer-events-none"
        style={{ background: 'var(--glow)' }}
        aria-hidden
      />
      <div className="shell relative">
        <SectionHead
          eyebrow={MFC.eyebrow}
          index="03"
          lede={MFC.lede}
        >
          {MFC.title.split(' on Google')[0]} on <Italic>Google</Italic>
        </SectionHead>

        <Reveal className="flex flex-wrap items-center justify-center gap-2.5 mb-10 -mt-6">
          <span className="chip">{MFC.channel}</span>
          <span className="chip">{MFC.period}</span>
        </Reveal>

        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 mb-3.5">
          {MFC.kpis.map((k, i) => (
            <KpiCard key={k.label} k={k} i={i} />
          ))}
        </div>

        {/* Trend */}
        <Reveal className="surface p-5 sm:p-7 md:p-9 mb-3.5">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-12 items-start">
            <div>
              <h3 className="font-display font-bold text-[clamp(22px,2.8vw,30px)] tracking-[-0.02em] leading-tight mb-4">
                Three months, one direction
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: 'var(--dim)' }}>
                {MFC.trend.takeaway}
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {MFC.reputation.slice(0, 2).map(([term, rank]) => (
                  <span key={term} className="chip">
                    <b>{rank}</b> &ldquo;{term}&rdquo;
                  </span>
                ))}
              </div>
            </div>
            <TrendGrid config={MFC.trend} />
          </div>
        </Reveal>

        {/* Showcase: hit-and-run */}
        <Reveal as="article" className="surface surface-glow p-5 sm:p-7 md:p-9 mb-3.5" {...tilt}>
          <span className="tag-outline mb-4">{sc.tag}</span>
          <h3 className="font-display font-bold text-[clamp(22px,3vw,33px)] tracking-[-0.025em] leading-tight mb-3 max-w-[22ch]">
            {sc.title}
          </h3>
          <p className="text-[15px] leading-relaxed max-w-[720px] mb-7" style={{ color: 'var(--dim)' }}>
            {sc.body}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {sc.stats.map(([v, l]) => (
              <div
                key={l}
                className="rounded-2xl px-5 py-5"
                style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)' }}
              >
                <div className="stat-num text-[30px]" style={{ color: 'var(--accent-ink)' }}>
                  {v}
                </div>
                <div className="text-[13px] mt-2 leading-snug" style={{ color: 'var(--dim)' }}>
                  {l}
                </div>
              </div>
            ))}
          </div>

          {/* real SERP screenshot */}
          <figure className="m-0 mb-7">
            <figcaption
              className="font-mono text-[10px] uppercase tracking-[0.16em] mb-3"
              style={{ color: 'var(--faint)' }}
            >
              The result Google returned
            </figcaption>
            <img
              src={sc.image}
              alt={sc.imageAlt}
              loading="lazy"
              width="1400"
              height="290"
              className="w-full h-auto rounded-2xl"
              style={{ border: '1px solid var(--line-strong)' }}
            />
          </figure>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            <RankList rows={sc.ranking} caption="Law firms, in the order Google listed them" />
            <div>
              <div
                className="font-mono text-[10px] uppercase tracking-[0.16em] mb-3"
                style={{ color: 'var(--faint)' }}
              >
                The snippet earning the clicks
              </div>
              <blockquote
                className="m-0 rounded-2xl px-6 py-6 text-[16px] leading-relaxed italic"
                style={{
                  background: 'color-mix(in srgb, var(--ember) 8%, transparent)',
                  borderLeft: '3px solid var(--ember)',
                  color: 'var(--text)',
                }}
              >
                &ldquo;{sc.snippet}&rdquo;
              </blockquote>
              <p className="text-[13.5px] leading-relaxed mt-4" style={{ color: 'var(--dim)' }}>
                {sc.snippetNote}
              </p>
            </div>
          </div>

          <p
            className="font-mono text-[10px] uppercase tracking-[0.08em] mt-8 pt-6 border-t leading-loose"
            style={{ color: 'var(--faint)', borderColor: 'var(--line)' }}
          >
            {sc.disclaimer}
          </p>
        </Reveal>

        {/* Pages + reach */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-3.5">
          <Reveal as="article" className="surface surface-glow p-5 sm:p-7" {...tilt}>
            <PageBars config={MFC.pages} />
          </Reveal>

          <Reveal as="article" delay={0.06} className="surface surface-glow p-5 sm:p-7" {...tilt}>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="stat-num text-[clamp(38px,5vw,54px)]" style={{ color: 'var(--ember)' }}>
                {MFC.reach.headline}
              </span>
              <span className="text-[13.5px] leading-snug" style={{ color: 'var(--dim)' }}>
                {MFC.reach.headlineLabel}
              </span>
            </div>
            <p className="text-[14px] leading-relaxed mb-6" style={{ color: 'var(--dim)' }}>
              {MFC.reach.body}
            </p>
            <div className="flex flex-col gap-5">
              {MFC.reach.groups.map((g) => (
                <div key={g.name}>
                  <div
                    className="font-mono text-[9.5px] uppercase tracking-[0.16em] mb-2"
                    style={{ color: 'var(--accent-ink)' }}
                  >
                    {g.name}
                  </div>
                  <ul className="list-none m-0 p-0">
                    {g.terms.map(([term, pos, shown]) => (
                      <li
                        key={term}
                        className="flex items-baseline justify-between gap-3 py-1.5 border-t"
                        style={{ borderColor: 'var(--line)' }}
                      >
                        <span className="text-[13px]" style={{ color: 'var(--dim)' }}>
                          {term}
                        </span>
                        <span
                          className="font-mono text-[11px] tabular-nums shrink-0"
                          style={{ color: pos <= 3 ? 'var(--ember)' : 'var(--faint)' }}
                        >
                          #{pos} · {shown.toLocaleString('en-US')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="font-mono text-[10px] mt-5 leading-relaxed" style={{ color: 'var(--faint)' }}>
              {MFC.reach.note}
            </p>
          </Reveal>
        </div>

        {/* Opportunity + plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          <Reveal as="article" className="surface surface-glow p-5 sm:p-7" {...tilt}>
            <h3 className="font-display font-bold text-[23px] tracking-[-0.02em] mb-3">
              Where the next wins are
            </h3>
            <p className="text-[14px] leading-relaxed mb-6" style={{ color: 'var(--dim)' }}>
              {MFC.opportunity.body}
            </p>
            <Opportunity config={MFC.opportunity} />
          </Reveal>

          <Reveal as="article" delay={0.06} className="surface surface-glow p-5 sm:p-7" {...tilt}>
            <h3 className="font-display font-bold text-[23px] tracking-[-0.02em] mb-5">
              What we do next
            </h3>
            <ol className="list-none m-0 p-0 counter-reset">
              {MFC.plan.map(([head, rest], i) => (
                <li
                  key={head}
                  className="relative py-4 pl-11 border-t"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <span
                    className="absolute left-0 top-4 w-7 h-7 rounded-full inline-flex items-center justify-center font-mono text-[11px]"
                    style={{
                      color: 'var(--accent-ink)',
                      border: '1px solid color-mix(in srgb, var(--ember) 40%, transparent)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <strong className="block font-semibold text-[15px] mb-1">{head}</strong>
                  <span className="text-[13.5px] leading-relaxed" style={{ color: 'var(--dim)' }}>
                    {rest}
                  </span>
                </li>
              ))}
            </ol>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.1em] mt-6 pt-5 border-t"
              style={{ color: 'var(--faint)', borderColor: 'var(--line)' }}
            >
              {MFC.source}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   PROCESS
   ========================================================================== */

function Process() {
  return (
    <section id="process" className="py-16 md:py-28 relative overflow-hidden" aria-label="How I work">
      <div
        className="aurora animate-float-b w-[420px] h-[340px] top-[10%] -right-[80px] pointer-events-none"
        style={{ background: 'var(--glow)' }}
        aria-hidden
      />
      <div className="shell relative">
        <SectionHead
          eyebrow="How I Work"
          index="04"
          align="left"
          lede="Most accounts do not have a budget problem. They have a measurement problem. This is the order I fix things in."
        >
          Four moves, in <Italic>this order</Italic>
        </SectionHead>

        <ol className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {PROCESS.map((p, i) => (
            <Reveal as="li" key={p.step} delay={i * 0.08} className="surface surface-glow p-5 sm:p-7 relative overflow-hidden">
              <span
                className="absolute -top-5 -right-2 font-display font-bold text-[86px] leading-none pointer-events-none select-none"
                style={{ color: 'var(--text)', opacity: 0.05 }}
                aria-hidden
              >
                {i + 1}
              </span>
              <span
                className="font-mono text-[9.5px] uppercase tracking-[0.16em]"
                style={{ color: 'var(--faint)' }}
              >
                {p.marker}
              </span>
              <h3
                className="font-mono text-[11px] uppercase tracking-[0.2em] mt-3 mb-3"
                style={{ color: 'var(--accent-ink)' }}
              >
                {p.step}
              </h3>
              <p className="font-display font-bold text-[19px] tracking-[-0.02em] leading-snug mb-3">
                {p.title}
              </p>
              <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--dim)' }}>
                {p.body}
              </p>
              <div className="mt-6 flex items-center gap-1.5" aria-hidden>
                {PROCESS.map((_, j) => (
                  <span
                    key={j}
                    className="h-[3px] rounded-full flex-1"
                    style={{
                      background: j <= i ? 'var(--ember)' : 'var(--chart-track)',
                      opacity: j <= i ? 1 - j * 0.15 : 1,
                    }}
                  />
                ))}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ==========================================================================
   ABOUT
   ========================================================================== */

function About() {
  return (
    <section id="about" className="py-16 md:py-28" aria-label="About Tanzim">
      <div className="shell">
        <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.35fr] gap-10 md:gap-16 items-center">
          <Reveal
            className="relative rounded-card overflow-hidden border max-w-[430px] w-full mx-auto group"
            style={{ aspectRatio: '4 / 4.6', background: 'var(--card)', borderColor: 'var(--line)' }}
          >
            <img
              src="/about.jpg"
              alt="Tanzim Shahriar, Digital Marketing Lead at Social Engagement Group"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, var(--overlay) 0%, transparent 45%)' }}
              aria-hidden
            />
            <div
              className="absolute z-[2] bottom-4 left-4 right-4 rounded-2xl px-5 py-4 text-[13px] backdrop-blur-md border"
              style={{ background: 'var(--overlay)', borderColor: 'var(--line-strong)', color: 'var(--dim)' }}
            >
              <b className="block font-display font-bold text-[15.5px]" style={{ color: 'var(--text)' }}>
                Tanzim Shahriar
              </b>
              Digital Marketing Lead, Social Engagement Group LLC
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <span className="eyebrow">About Me</span>
            <h2 className="font-display font-bold leading-[1.04] tracking-[-0.03em] text-[clamp(33px,5vw,56px)] mb-6">
              Who is <Italic>Tanzim?</Italic>
            </h2>
            <p className="mb-4 text-[16.5px] leading-relaxed" style={{ color: 'var(--dim)' }}>
              I&apos;m a paid-media strategist who lives in ad accounts. I know where every dollar
              goes, and I treat client budgets like my own, because{' '}
              <strong className="font-semibold" style={{ color: 'var(--text)' }}>
                spending money on ads that may not work is a real anxiety
              </strong>
              , and I never minimize it.
            </p>
            <p className="mb-6 text-[16.5px] leading-relaxed" style={{ color: 'var(--dim)' }}>
              Most accounts I audit don&apos;t have a budget problem. They have a tracking problem:
              broad match bleed, missing negative keywords, audiences that click but never convert.{' '}
              <strong className="font-semibold" style={{ color: 'var(--text)' }}>
                I fix the measurement first, then scale what&apos;s proven.
              </strong>{' '}
              Recovered waste funds real growth.
            </p>

            <div className="rule-gradient my-7" aria-hidden />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                ['Tracking', 'before budget'],
                ['Every dollar', 'has a job'],
                ['Creative', 'is targeting'],
              ].map(([a, b]) => (
                <div
                  key={a}
                  className="rounded-2xl px-4 py-4"
                  style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)' }}
                >
                  <span className="block font-display font-bold text-[16px]" style={{ color: 'var(--accent-ink)' }}>
                    {a}
                  </span>
                  <span className="block text-[13.5px] mt-0.5" style={{ color: 'var(--dim)' }}>
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   PLAYBOOKS
   ========================================================================== */

function Playbooks() {
  const tilt = useTilt(2)
  return (
    <section id="playbooks" className="py-16 md:py-28" aria-label="Platform playbooks">
      <div className="shell">
        <SectionHead
          eyebrow="Platform Playbooks"
          index="05"
          lede="Each network rewards different behavior. These are the methodologies I deploy, balancing organic engagement with optimized paid media buying."
        >
          Omni-channel growth, <Italic>one platform at a time</Italic>
        </SectionHead>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {PLAYBOOKS.map((p, i) => (
            <Reveal
              as="article"
              key={p.platform}
              delay={(i % 2) * 0.07}
              className="surface surface-glow px-5 sm:px-7 py-7 sm:py-8"
              {...tilt}
            >
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="tag-outline">{p.platform}</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--faint)' }}>
                  {String(i + 1).padStart(2, '0')} / {String(PLAYBOOKS.length).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-display font-bold text-[23px] tracking-[-0.02em] mb-4">{p.title}</h3>
              <ul className="list-none m-0 p-0">
                {p.items.map(([head, rest]) => (
                  <li
                    key={head}
                    className="relative text-[14.5px] leading-relaxed py-3.5 pl-6 border-t"
                    style={{ color: 'var(--dim)', borderColor: 'var(--line)' }}
                  >
                    <svg
                      className="absolute left-0 top-[17px] w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--ember)"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                    <strong className="font-semibold" style={{ color: 'var(--text)' }}>
                      {head}
                    </strong>{' '}
                    {rest}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   FRAMEWORKS
   ========================================================================== */

function Frameworks() {
  return (
    <section id="frameworks" className="py-16 md:py-28" aria-label="Paid search frameworks">
      <div className="shell">
        <SectionHead
          eyebrow="Search Frameworks"
          index="06"
          lede="High-intent paid search is where wasted spend hurts most and discipline pays best. Frameworks I've designed and deployed for targeted lead acquisition."
        >
          Built for buyers, priced with <Italic>discipline</Italic>
        </SectionHead>

        <Reveal
          className="flex justify-between flex-wrap gap-2 font-mono text-[10.5px] uppercase tracking-[0.1em] mb-3"
          style={{ color: 'var(--faint)' }}
        >
          <span>Deployed lead-acquisition frameworks</span>
          <span>Volumes and bids: estimated monthly ranges</span>
        </Reveal>

        {/* Phones: stacked cards. A 820px-wide table in a scroll region is a
            worse read than definition lists on a 390px screen. */}
        <div className="md:hidden flex flex-col gap-3">
          {FRAMEWORKS.map((f) => (
            <Reveal key={f.vertical} className="surface p-5" style={{ background: 'var(--card)' }}>
              <h3 className="font-display font-bold text-[19px] leading-snug mb-4">{f.vertical}</h3>
              <dl className="m-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--faint)' }}>
                  Strategic keyword bids
                </dt>
                <dd className="m-0 mt-1.5 mb-4 font-mono text-[12.5px] leading-7" style={{ color: 'var(--dim)' }}>
                  {f.keywords.map((k) => (
                    <div key={k}>{k}</div>
                  ))}
                </dd>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--faint)' }}>
                      Monthly vol.
                    </dt>
                    <dd className="m-0 mt-1 font-mono text-[13.5px]">{f.volume}</dd>
                  </div>
                  <div className="flex-1">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--faint)' }}>
                      Bid range
                    </dt>
                    <dd className="m-0 mt-1 font-mono text-[13.5px]" style={{ color: 'var(--accent-ink)' }}>
                      {f.bids}
                    </dd>
                  </div>
                </div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--faint)' }}>
                  Ad copy hook
                </dt>
                <dd className="m-0 mt-1.5 italic text-[15px] leading-relaxed">{f.hook}</dd>
              </dl>
            </Reveal>
          ))}
        </div>

        <Reveal
          className="hidden md:block overflow-x-auto rounded-card border"
          style={{ borderColor: 'var(--line-strong)', background: 'var(--card)' }}
        >
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr>
                {['Target vertical', 'Strategic keyword bids', 'Monthly vol.', 'Bid range', 'Ad copy hook strategy'].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="text-left font-mono font-medium text-[10px] uppercase tracking-[0.16em] px-6 py-5 border-b"
                    style={{ color: 'var(--faint)', borderColor: 'var(--line-strong)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FRAMEWORKS.map((f, i) => {
                const bt = i < FRAMEWORKS.length - 1 ? 'border-b' : ''
                return (
                  <tr key={f.vertical} className="transition-colors">
                    <td className={`px-6 py-7 align-top font-display font-bold text-[20px] leading-snug ${bt}`} style={{ borderColor: 'var(--line)' }}>
                      {f.vertical}
                    </td>
                    <td className={`px-6 py-7 align-top font-mono text-[12.5px] leading-8 ${bt}`} style={{ color: 'var(--dim)', borderColor: 'var(--line)' }}>
                      {f.keywords.map((k) => (
                        <div key={k}>{k}</div>
                      ))}
                    </td>
                    <td className={`px-6 py-7 align-top font-mono text-[13.5px] whitespace-nowrap ${bt}`} style={{ borderColor: 'var(--line)' }}>
                      {f.volume}
                    </td>
                    <td className={`px-6 py-7 align-top font-mono text-[13.5px] whitespace-nowrap ${bt}`} style={{ color: 'var(--accent-ink)', borderColor: 'var(--line)' }}>
                      {f.bids}
                    </td>
                    <td className={`px-6 py-7 align-top italic text-[15.5px] leading-relaxed ${bt}`} style={{ borderColor: 'var(--line)' }}>
                      {f.hook}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  )
}

/* ==========================================================================
   CREATIVE
   ========================================================================== */

function Creative() {
  const tilt = useTilt(2)
  return (
    <section id="work" className="py-16 md:py-28" aria-label="Creative work">
      <div className="shell">
        <SectionHead
          eyebrow="Creative Work"
          index="07"
          lede="A few of the structural campaigns and concepts the SEG creative engine has executed under my direction."
        >
          Assets built for <Italic>retention</Italic>, not decoration
        </SectionHead>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {CREATIVE.map(([tag, title, body], i) => (
            <Reveal
              as="article"
              key={title}
              delay={(i % 2) * 0.07}
              className="surface surface-glow p-5 sm:p-7 md:p-8 relative overflow-hidden"
              {...tilt}
            >
              <span
                className="absolute right-6 top-6 font-mono text-[11px]"
                style={{ color: 'var(--faint)' }}
                aria-hidden
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="block font-mono text-[10px] uppercase tracking-[0.16em] mb-4"
                style={{ color: 'var(--accent-ink)' }}
              >
                {tag}
              </span>
              <h3 className="font-display font-bold text-[21px] tracking-[-0.02em] mb-3 pr-8">{title}</h3>
              <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--dim)' }}>
                {body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   CLIENTS
   ========================================================================== */

function Clients() {
  return (
    <section
      id="clients"
      className="py-16 md:py-28 border-y"
      style={{ background: 'var(--bg-soft)', borderColor: 'var(--line)' }}
      aria-label="Clients"
    >
      <div className="shell">
        <SectionHead eyebrow="Client Roster" index="08" lede="Tap through to the brands themselves.">
          Frameworks proven across <Italic>nine brands</Italic>
        </SectionHead>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CLIENTS.map(([name, sector, url], i) => {
            const inner = (
              <>
                <span className="flex items-start justify-between gap-3">
                  <span className="font-display font-bold text-[16.5px] leading-snug">{name}</span>
                  {url && (
                    <svg
                      className="w-4 h-4 shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--ember)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  )}
                </span>
                <span
                  className="block font-mono text-[10px] uppercase tracking-[0.12em] mt-2"
                  style={{ color: 'var(--faint)' }}
                >
                  {sector}
                </span>
              </>
            )
            const cls =
              'group block rounded-2xl px-5 py-5 no-underline transition-all duration-300 border h-full'
            const style = { color: 'var(--text)', borderColor: 'var(--line)', background: 'var(--card)' }
            return (
              <Reveal key={name} delay={(i % 3) * 0.05}>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cls} hover:-translate-y-1`}
                    style={style}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--ember)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
                  >
                    {inner}
                  </a>
                ) : (
                  <span className={cls} style={style}>
                    {inner}
                  </span>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   CONTACT
   ========================================================================== */

function Contact() {
  return (
    <section id="contact" className="pt-16 md:pt-28 pb-0" aria-label="Contact">
      <div className="shell">
        <Reveal
          className="relative overflow-hidden rounded-[32px] text-center px-6 md:px-16 py-14 md:py-24"
          style={{ background: 'linear-gradient(140deg, var(--ember) 0%, #b5453f 55%, #7c4342 100%)' }}
        >
          <div
            className="pointer-events-none absolute -top-[140px] -right-[140px] w-[380px] h-[380px] rounded-full border-[64px]"
            style={{ borderColor: 'rgba(255,255,255,0.09)' }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-[120px] -left-[100px] w-[300px] h-[300px] rounded-full border-[40px]"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            aria-hidden
          />

          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Contact
          </span>
          <h2 className="font-display font-bold leading-[1.02] tracking-[-0.035em] text-[clamp(34px,5.6vw,64px)] max-w-[14em] mx-auto mb-5 text-white">
            Ask me where your ad spend is <span className="italic">leaking</span>
          </h2>
          <p className="max-w-[560px] mx-auto mb-10 text-[16.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
            If you&apos;re spending on Google or Meta and can&apos;t name your cost per lead,
            that&apos;s the first conversation to have. It costs nothing to find out.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="mailto:tanzim@socialengagementgroup.com"
              className="pill w-full sm:w-auto !px-4 sm:!px-6 text-[13.5px] sm:text-[14.5px]"
              style={{ background: '#14100e', color: '#f7f1ea' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
                <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              tanzim@socialengagementgroup.com
            </a>
            <a
              href="https://www.linkedin.com/in/tanzim-shahriar-utsab-575014356/"
              target="_blank"
              rel="noopener noreferrer"
              className="pill text-white"
              style={{ border: '1px solid rgba(255,255,255,0.5)' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95C20.5 8.75 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.3-2.02-3.3-2.02 0-2.33 1.57-2.33 3.2V21H9z" />
              </svg>
              LinkedIn
            </a>
            <a href="tel:+8801617410513" className="pill text-white" style={{ border: '1px solid rgba(255,255,255,0.5)' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
                <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z" />
              </svg>
              +880 1617-410513
            </a>
          </div>
        </Reveal>

        <footer
          className="flex justify-between flex-wrap items-center gap-4 font-mono text-[10.5px] uppercase tracking-[0.12em] py-12 mt-6 border-t"
          style={{ color: 'var(--faint)', borderColor: 'var(--line)' }}
        >
          <span>© 2026 Tanzim Shahriar</span>
          <a
            href="https://www.socialengagementgroup.com"
            target="_blank"
            rel="noopener noreferrer"
            className="tap-safe gap-2.5 no-underline transition-colors hover:opacity-80"
            style={{ color: 'inherit' }}
          >
            <svg viewBox="0 0 44 50" className="w-[22px] h-6" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <polygon points="22,2 40,12 40,26 22,36 4,26 4,12" />
              <polygon points="22,14 40,24 40,38 22,48 4,38 4,24" />
            </svg>
            <span>Social Engagement Group</span>
          </a>
        </footer>
      </div>
    </section>
  )
}

/* ==========================================================================
   APP
   ========================================================================== */

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch (e) {
    /* storage unavailable */
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const progressRef = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      /* storage unavailable */
    }
  }, [theme])

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const denom = h.scrollHeight - h.clientHeight
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${denom > 0 ? h.scrollTop / denom : 0})`
      }
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div id="top" className="noise font-sans text-[17px] leading-relaxed">
      <div
        ref={progressRef}
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
        style={{ background: 'linear-gradient(90deg, var(--ember), var(--gold), var(--violet))', transform: 'scaleX(0)' }}
        aria-hidden
      />
      <a href="#services" className="skip-link">
        Skip to content
      </a>
      <Nav theme={theme} toggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} />
      <main className="relative z-[2]">
        <Hero />
        <Marquee />
        <Services />
        <Results />
        <MfcShowcase />
        <Process />
        <About />
        <Playbooks />
        <Frameworks />
        <Creative />
        <Clients />
        <Contact />
      </main>
    </div>
  )
}
