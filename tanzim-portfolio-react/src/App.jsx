import { useEffect, useRef, useState, useCallback } from 'react'
import Chart from 'chart.js/auto'

/* ============================== DATA ============================== */

const NAV = [
  ['#services', 'Services'],
  ['#results', 'Results'],
  ['#about', 'About'],
  ['#playbooks', 'Playbooks'],
  ['#work', 'Work'],
  ['#clients', 'Clients'],
]

const MARQUEE = ['Google Ads', 'Paid Social', 'Meta', 'TikTok', 'SEO', 'Landing Pages', 'ROAS', 'Lead Generation', 'Creative Testing', 'Retargeting']

const SERVICES = [
  {
    title: 'Digital Advertising',
    body: "High-yielding campaigns across Google, Meta, TikTok, LinkedIn, and Bing, with precision targeting built on interests, demographics, and behavior. Continuous A/B testing and retargeting capture the traffic that didn't convert the first time.",
    tags: ['Google Search & PMax', 'Meta Ads Manager', 'TikTok Ads', 'Retargeting'],
  },
  {
    title: 'Content Creation & Management',
    body: "Thumb-stopping creative tailored to each platform's algorithm: graphic design, TikTok content, 3D animation, and Instagram Reels. Creative that earns attention before it asks for a click.",
    tags: ['Graphic Design', 'Reels & TikTok', '3D Animation'],
  },
  {
    title: 'Niche Engagement Strategy',
    body: 'Direct community communication inside the spaces where your customers already gather. Organic growth built on genuine bonds between brands and their audiences, not automation.',
    tags: ['Community Building', 'Influencer Campaigns', 'Organic Growth'],
  },
  {
    title: 'Web Development & SEO',
    body: 'High-converting landing pages and expert search engine optimization: keyword mapping, organic search analysis, and link equity generation. The infrastructure that makes paid traffic pay off.',
    tags: ['Landing Pages', 'Technical SEO', 'Keyword Mapping'],
  },
]

const KPIS = [
  { target: 152405, suffix: '+', label: <>TikTok followers gained<br />Ari Rastegar, 2 months</> },
  { target: 1846, label: <>Leads in one month<br />Silver Mountain Finance</> },
  { target: 605, label: <>Phone calls generated<br />Xtreme Wireless, Google Ads</> },
  { target: 0.16, money: true, prefix: '$', label: <>Cost per follower<br />BPI Sports, TikTok</> },
]

const ACCENT = '#975554'
const ACCENT_SOFT = 'rgba(151,85,84,0.4)'

const CASES = [
  {
    client: 'Ari Rastegar',
    channel: 'TikTok · 2 months',
    title: '152,405 followers for a real-estate executive brand',
    body: <>A trend-driven follower growth campaign built on engaging content and active community engagement. <strong>5.49M impressions, 5.16M video views</strong>, at an average <strong>$0.37 per follower</strong>.</>,
    stats: [['$0.37', 'avg cost / follow'], ['$10.28', 'avg CPM']],
    chart: {
      horizontal: true,
      labels: ['Impressions', 'Video views', 'Followers'],
      data: [5492837, 5162922, 152405],
      colors: [ACCENT_SOFT, ACCENT_SOFT, ACCENT],
    },
  },
  {
    client: 'Silver Mountain Finance',
    channel: 'Facebook Lead Gen · 1 month',
    title: '1,846 B2B leads at $2.14 each',
    body: <>Facebook lead generation for business financing. Application form fill-ups, not clicks: <strong>1,846 leads from 230K impressions</strong> in a single month, at a <strong>$2.14 cost per lead</strong>.</>,
    stats: [['$2.14', 'cost / lead'], ['123,680', 'reach']],
    chart: {
      horizontal: true,
      labels: ['Impressions', 'Reach', 'Link clicks', 'Leads'],
      data: [230194, 123680, 3910, 1846],
      colors: [ACCENT_SOFT, ACCENT_SOFT, ACCENT_SOFT, ACCENT],
    },
  },
  {
    client: 'Xtreme Wireless',
    channel: 'Google Ads · Boost Mobile retail',
    title: '605 phone calls for a local retailer',
    body: <>High-intent search campaigns for phone sales and repairs. 4,840 clicks produced <strong>605 phone calls and 155 tracked conversions</strong> — a <strong>3.2% conversion rate</strong> with every phone call costing under $11.</>,
    stats: [['3.2%', 'conversion rate'], ['$42', 'cost / conversion'], ['$10.78', 'cost / phone call']],
    chart: {
      horizontal: true,
      labels: ['Clicks', 'Phone calls', 'Conversions'],
      data: [4840, 605, 155],
      colors: [ACCENT_SOFT, ACCENT, ACCENT],
    },
  },
  {
    client: 'Managed Accounts',
    channel: 'Organic Social Growth',
    title: 'Organic reach lifts up to +2,700%',
    body: <>Paid gets the spotlight, but disciplined organic engagement compounds. Reach growth across six accounts under SEG management, from <strong>+85.9% to +2,700%</strong> against prior periods.</>,
    stats: [['63,907', 'FB reach (peak account)'], ['+120.9%', 'IG reach']],
    chart: {
      horizontal: false,
      logarithmic: true,
      labels: ['Acct A', 'Acct B', 'Acct C', 'Acct D', 'Acct E', 'Acct F'],
      data: [85.9, 98.6, 120.9, 249.8, 680.9, 2700],
      colors: ACCENT,
      tooltipFmt: (v) => `+${v.toLocaleString('en-US')}% reach growth`,
    },
  },
]

const PLAYBOOKS = [
  {
    platform: 'Instagram',
    title: 'Organic & influencer blueprint',
    items: [
      ['Niche hashtag engagement.', 'Substantive, paragraph-length comments inside community hashtags that draw creators and their audiences back to the brand.'],
      ['Pinned comment real estate.', 'First-to-engage positioning on thought leader profiles.'],
      ['Reels-to-DM conversion.', 'Relationship building via direct messages with users who engage.'],
      ['Tiered influencer campaigns.', 'Micro to mid-tier creators (5K–100K, sweet spot 5K–50K) for endorsements and collaborations.'],
    ],
  },
  {
    platform: 'Facebook / Meta',
    title: 'Paid & community architecture',
    items: [
      ['Targeted media buying.', 'Video, static, carousel, canvas, and 360-image formats in Meta Ads Manager. This system produced 1,846 leads at $2.14 for Silver Mountain.'],
      ['Continuous A/B testing.', 'Creative and demographic testing that retargets unconverted traffic instead of letting it walk.'],
      ['Group niche cultivation.', "Embedding within relevant Facebook Groups to guide high-intent prospects to the brand's page ecosystem."],
    ],
  },
  {
    platform: 'TikTok',
    title: 'Viral funnels',
    items: [
      ['Trend adaptation.', 'Active monitoring and rapid response to algorithmic trends. This engine produced 152K followers for Ari Rastegar and $0.16 follows for BPI Sports.'],
      ['Spokesperson creators.', 'Specialized talent that scales organic and paid TikTok formats with a consistent brand face.'],
    ],
  },
  {
    platform: 'Google Ads',
    title: 'High-intent search capture',
    items: [
      ['Transactional traffic first.', 'Campaigns built around active, ready-to-convert searches, not broad awareness clicks. See Xtreme Wireless: 605 phone calls.'],
      ['Vertical-specific frameworks.', 'Keyword strategy, bid discipline, and copy hooks engineered per industry. See below.'],
    ],
  },
]

const FRAMEWORKS = [
  {
    vertical: 'Law firms & attorneys',
    keywords: ['"law firm marketing agency"', '"seo for lawyers"', '"ppc management for attorneys"'],
    volume: '1,000–10,000',
    bids: '$18–$85',
    hook: '"Stop wasting billable hours on ads. We get you high-value cases, not just clicks."',
  },
  {
    vertical: 'Restaurants & hospitality',
    keywords: ['"restaurant marketing agency"', '"social media for restaurants"', '"restaurant lead generation"'],
    volume: '1,000–10,000',
    bids: '$2–$25',
    hook: 'Localized ROI, local traffic generation, and catering and event volume maximization.',
  },
]

const CREATIVE = [
  ['Promotional Graphic', 'Hotspot high-speed data campaign', 'A behavior-targeted promotional graphic built on immediacy and value incentives ("When You Switch"), designed to convert comparison shoppers at the moment of decision.'],
  ['Seasonal Engine', 'Scary Treats & holiday touchpoints', 'Milestone-driven creative systems for Christmas, New Year, and localized viral holidays like National Fritters Day, keeping brands present when audiences are most engaged.'],
  ['Organic Lead Magnet', 'Floral business activation guide', 'Educational carousel content ("Ideas to easily promote your floral business") engineered for high share-and-save rates, turning helpfulness into reach.'],
  ['Thought Leadership', 'Founder story & brand advocacy series', 'Clean, minimalist quote layouts and executive positioning blocks, bringing back the "social" in "social media" through high-authority personal storytelling.'],
]

const CLIENTS = [
  ['The Law Offices of Michael F. Campopiano', 'Personal injury law', 'https://mfclaw.com'],
  ['Flame Japanese Hibachi', 'Restaurant & hospitality', 'https://flamehibachi.com'],
  ['Boost Mobile · Xtreme Wireless', 'Telecom retail', 'https://www.boostmobile.com'],
  ['Sporcle', 'Media & entertainment', 'https://www.sporcle.com'],
  ['DeliverZe', 'Delivery services', 'https://apps.apple.com/us/app/deliverze/id1517390774'],
  ['Silver Mountain Finance', 'Financial services', 'https://smfinancegroup.com'],
  ['North Island Podiatry Associates, PC', 'Medical practice', 'https://northislandpc.com'],
  ['Ari Rastegar', 'Executive brand', 'https://www.rastegarproperty.com'],
  ['Sona Chandi', 'Retail', null],
]

/* ============================== HOOKS ============================== */

const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (REDUCED_MOTION) {
      el.classList.add('in')
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useReveal()
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}s`, ...style }} {...rest}>
      {children}
    </Tag>
  )
}

/* ============================== THEME ============================== */

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch (e) { /* storage unavailable */ }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

const chartTheme = (theme) =>
  theme === 'light'
    ? { dim: '#5f5a55', faint: '#8d857e', grid: 'rgba(29,29,27,0.08)', tooltipBg: '#ffffff', tooltipBorder: 'rgba(29,29,27,0.2)', tooltipText: '#1d1d1b' }
    : { dim: '#a89f98', faint: '#746c66', grid: 'rgba(240,233,226,0.08)', tooltipBg: '#232320', tooltipBorder: 'rgba(240,233,226,0.18)', tooltipText: '#f2ece5' }

/* ============================== WIDGETS ============================== */

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
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          io.unobserve(el)
          const t0 = performance.now()
          const dur = 1600
          const ease = (t) => 1 - Math.pow(1 - t, 4)
          const tick = (now) => {
            const p = Math.min((now - t0) / dur, 1)
            el.textContent = fmt(target * ease(p))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.6 }
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

const abbr = (v) =>
  v >= 1000000 ? `${Math.round(v / 100000) / 10}M` : v >= 1000 ? `${Math.round(v / 100) / 10}K` : v

function CaseChart({ config, theme }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (setVisible(true), io.disconnect())),
      { threshold: 0.3 }
    )
    io.observe(canvasRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const t = chartTheme(theme)
    const { horizontal, logarithmic, labels, data, colors, tooltipFmt } = config
    const fmt = tooltipFmt || ((v) => v.toLocaleString('en-US'))

    chartRef.current?.destroy()
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderRadius: 7, barThickness: horizontal ? 24 : 22 }],
      },
      options: {
        indexAxis: horizontal ? 'y' : 'x',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: REDUCED_MOTION ? 0 : 1100, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: t.tooltipBg,
            borderColor: t.tooltipBorder,
            titleColor: t.tooltipText,
            bodyColor: t.tooltipText,
            borderWidth: 1,
            padding: 10,
            titleFont: { family: "'Inter', sans-serif", size: 12 },
            callbacks: { label: (ctx) => fmt(horizontal ? ctx.parsed.x : ctx.parsed.y) },
          },
        },
        scales: {
          x: {
            grid: { color: horizontal ? t.grid : 'transparent' },
            border: { display: false },
            ticks: {
              color: t.faint,
              font: { family: "'JetBrains Mono', monospace", size: 10 },
              callback: function (v) { return horizontal ? abbr(v) : this.getLabelForValue(v) },
            },
          },
          y: {
            type: logarithmic ? 'logarithmic' : 'linear',
            grid: { color: horizontal ? 'transparent' : t.grid },
            border: { display: false },
            ticks: {
              color: t.faint,
              font: { family: "'JetBrains Mono', monospace", size: 10 },
              callback: function (v) {
                if (!horizontal && logarithmic) return v === 100 || v === 1000 ? `+${v.toLocaleString()}%` : null
                return horizontal ? this.getLabelForValue(v) : abbr(v)
              },
            },
          },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [visible, theme, config])

  return (
    <div className="relative h-[190px]">
      <canvas ref={canvasRef} role="img" aria-label={`${config.labels.join(', ')} chart`} />
    </div>
  )
}

function useTilt() {
  const onMove = useCallback((e) => {
    if (REDUCED_MOTION || !window.matchMedia('(pointer: fine)').matches) return
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-3px)`
  }, [])
  const onLeave = useCallback((e) => { e.currentTarget.style.transform = '' }, [])
  return { onMouseMove: onMove, onMouseLeave: onLeave }
}

/* ============================== SECTIONS ============================== */

function SectionHead({ eyebrow, children, lede }) {
  return (
    <Reveal className="text-center mb-14">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="font-bold leading-[1.08] tracking-tight text-[clamp(32px,4.6vw,52px)]">{children}</h2>
      {lede && <p className="max-w-[580px] mx-auto mt-[18px]" style={{ color: 'var(--dim)' }}>{lede}</p>}
    </Reveal>
  )
}

const Italic = ({ children }) => (
  <span className="italic font-bold" style={{ color: 'var(--accent-ink)' }}>{children}</span>
)

function Nav({ theme, toggleTheme }) {
  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-xl" style={{ background: 'var(--nav-bg)', borderColor: 'var(--line)' }}>
      <div className="max-w-[1080px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5 font-extrabold text-[21px] tracking-tight no-underline">
          <span className="w-3 h-3 rounded-full bg-brick inline-block" />
          Tanzim.
        </a>
        <nav className="hidden md:flex gap-6" aria-label="Sections">
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className="text-[14.5px] font-medium no-underline transition-colors hover:!text-[var(--text)]" style={{ color: 'var(--dim)' }}>
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            className="w-10 h-10 rounded-full inline-flex items-center justify-center cursor-pointer bg-transparent transition-all hover:rotate-[20deg] hover:border-brick"
            style={{ border: '1px solid var(--line-strong)', color: 'var(--text)' }}
          >
            {theme === 'dark' ? (
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            ) : (
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
            )}
          </button>
          <a href="#contact" className="pill pill-accent">Hire Me</a>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  const photoRef = useRef(null)
  useEffect(() => {
    if (REDUCED_MOTION) return
    const onScroll = () => {
      if (photoRef.current) {
        photoRef.current.style.transform = `translateY(${Math.min(window.scrollY, 600) * 0.12}px)`
      }
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="hero-stagger relative text-center px-6 pt-[88px] pb-16" aria-label="Introduction">
      <div className="pointer-events-none absolute -top-[180px] left-1/2 -translate-x-1/2 w-[720px] h-[520px]" style={{ background: 'radial-gradient(closest-side, var(--glow), transparent 70%)' }} />
      <div className="inline-flex items-center gap-2 rounded-full px-[18px] py-[9px] mb-[34px] font-mono text-[11.5px] uppercase tracking-[0.12em]" style={{ color: 'var(--dim)', border: '1px solid var(--line-strong)' }}>
        <span className="w-[7px] h-[7px] rounded-full bg-brick animate-pulse-dot" />
        Digital Marketing Lead · Social Engagement Group
      </div>
      <h1 className="font-extrabold mx-auto mb-2.5 max-w-[11em] leading-[1.02] tracking-[-0.03em] text-[clamp(44px,7.4vw,92px)]">
        I'm <span className="accent-name">Tanzim Shahriar</span>
      </h1>
      <p className="italic font-medium mb-[22px] text-[clamp(21px,2.8vw,30px)]" style={{ color: 'var(--dim)' }}>
        and I turn ad spend into measurable growth.
      </p>
      <p className="max-w-[560px] mx-auto mb-9 text-[17.5px]" style={{ color: 'var(--dim)' }}>
        I build and manage Google and paid social campaigns for law firms, medical practices, restaurants, and local businesses. I report back in qualified leads and ROAS, not impressions.
      </p>
      <div className="flex justify-center gap-3.5 flex-wrap mb-12">
        <a href="#results" className="pill pill-accent">See the results <span aria-hidden>↓</span></a>
        <a href="#contact" className="pill pill-ghost">Hire Me</a>
      </div>
      <div className="flex justify-center flex-wrap gap-2.5">
        <span className="chip"><b>152K+</b> followers gained in one campaign</span>
        <span className="chip"><b>1,846</b> leads in 30 days</span>
        <span className="chip"><b>5</b> paid channels managed</span>
      </div>
      <div ref={photoRef} className="relative w-[168px] h-[168px] mx-auto mt-[54px] rounded-full border-2 border-brick p-1.5 will-change-transform">
        <img src="/hero.jpg" alt="Tanzim Shahriar" className="w-full h-full object-cover rounded-full" />
        <div className="absolute -inset-3 rounded-full border border-dashed animate-spin-slow" style={{ borderColor: 'var(--line-strong)' }} />
      </div>
    </section>
  )
}

function Marquee() {
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div className="marquee-band bg-brick -rotate-[1.6deg] -mx-10 mt-[26px] overflow-hidden py-[15px]" aria-hidden>
      <div className="animate-marquee flex w-max">
        {items.map((label, i) => (
          <span key={i} className="inline-flex items-center gap-9 px-[18px] font-bold text-[17px] uppercase tracking-wide text-white whitespace-nowrap">
            {label} <span className="text-[13px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Services() {
  const [open, setOpen] = useState(0)
  return (
    <section id="services" className="py-[104px]" aria-label="Services">
      <div className="max-w-[1080px] mx-auto px-6">
        <SectionHead eyebrow="My Services" lede="Four service pillars, one outcome: a predictable pipeline of qualified leads with a return you can point to.">
          How I turn spend into <Italic>leads</Italic>
        </SectionHead>
        <div className="flex flex-col gap-3.5">
          {SERVICES.map((s, i) => {
            const isOpen = open === i
            return (
              <Reveal as="article" key={s.title} delay={i * 0.08} className="rounded-card overflow-hidden border transition-colors"
                style={{
                  background: isOpen ? ACCENT : 'var(--bg-soft)',
                  borderColor: isOpen ? ACCENT : 'var(--line)',
                }}>
                <button
                  className="w-full flex items-center gap-4 md:gap-[22px] px-6 md:px-[30px] py-[22px] md:py-[26px] text-left cursor-pointer bg-transparent border-none"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="font-mono text-[13px] min-w-[34px]" style={{ color: isOpen ? 'rgba(255,255,255,0.7)' : 'var(--faint)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 font-bold tracking-tight text-[clamp(20px,2.6vw,28px)]" style={{ color: isOpen ? '#fff' : 'var(--text)' }}>
                    {s.title}
                  </span>
                  <span
                    className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[17px] shrink-0 transition-all duration-300"
                    style={isOpen
                      ? { background: '#fff', color: ACCENT, border: '1px solid #fff', transform: 'rotate(45deg)' }
                      : { color: 'var(--dim)', border: '1px solid var(--line-strong)' }}
                    aria-hidden
                  >+</span>
                </button>
                <div className="overflow-hidden transition-all duration-[450ms]" style={{ maxHeight: isOpen ? '400px' : '0px' }}>
                  <div className="px-6 md:pl-[86px] md:pr-[30px] pb-[30px]">
                    <p className="max-w-[640px] mb-[18px] text-base" style={{ color: isOpen ? 'rgba(255,255,255,0.88)' : 'var(--dim)' }}>{s.body}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="chip"
                          style={isOpen ? { background: 'rgba(0,0,0,0.22)', color: '#fff', borderColor: 'transparent' } : undefined}
                        >{t}</span>
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

function Results({ theme }) {
  const tilt = useTilt()
  return (
    <section id="results" className="py-[104px] border-y" style={{ background: 'var(--bg-soft)', borderColor: 'var(--line)' }} aria-label="Results and case studies">
      <div className="max-w-[1080px] mx-auto px-6">
        <SectionHead eyebrow="Case Studies & Results" lede="Numbers pulled straight from the ad accounts I've managed. Every figure below comes from SEG campaign reporting.">
          Proof, not <Italic>promises</Italic>
        </SectionHead>

        <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-card overflow-hidden mb-6 border" style={{ background: 'var(--line)', borderColor: 'var(--line)' }}>
          {KPIS.map((k, i) => (
            <div key={i} className="px-[26px] py-[34px] text-center" style={{ background: 'var(--bg)' }}>
              <div className="font-extrabold leading-[1.1] tracking-tight tabular-nums text-[clamp(30px,4vw,46px)]">
                <Counter {...k} />
              </div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] mt-2.5 leading-[1.6]" style={{ color: 'var(--faint)' }}>
                {k.label}
              </div>
            </div>
          ))}
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {CASES.map((c, i) => (
            <Reveal as="article" key={c.client} delay={(i % 2) * 0.08} className="card-surface p-[30px]" style={{ background: 'var(--bg)' }} {...tilt}>
              <div className="flex justify-between items-start gap-3.5 mb-2">
                <span className="tag-outline whitespace-nowrap">{c.client}</span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] pt-2 text-right" style={{ color: 'var(--faint)' }}>{c.channel}</span>
              </div>
              <h3 className="font-bold text-[22px] tracking-tight mt-2.5 mb-2">{c.title}</h3>
              <p className="text-[15px] mb-[18px] [&>strong]:font-semibold [&>strong]:!text-[var(--text)]" style={{ color: 'var(--dim)' }}>{c.body}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {c.stats.map(([v, l]) => (
                  <span key={l} className="chip"><b>{v}</b> {l}</span>
                ))}
              </div>
              <CaseChart config={c.chart} theme={theme} />
            </Reveal>
          ))}
        </div>

        <p className="text-center font-mono text-[11px] uppercase tracking-[0.08em] mt-[26px] leading-loose" style={{ color: 'var(--faint)' }}>
          Also proven on TikTok: Sporcle — 753K video views, 927 clicks, $0.22 per paid follower · BPI Sports — 6,119 follows at $0.16 each
        </p>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-[104px]" aria-label="About Tanzim">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.4fr] gap-9 md:gap-14 items-center">
          <Reveal className="relative rounded-card overflow-hidden border max-w-[420px] w-full mx-auto group" style={{ aspectRatio: '4 / 4.6', background: 'var(--card)', borderColor: 'var(--line)' }}>
            <img src="/about.jpg" alt="Tanzim Shahriar, Digital Marketing Lead at Social Engagement Group" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.04]" />
            <div className="absolute z-[2] bottom-[18px] left-[18px] right-[18px] rounded-[14px] px-[18px] py-3.5 text-[13.5px] backdrop-blur-md border" style={{ background: 'var(--overlay)', borderColor: 'var(--line)', color: 'var(--dim)' }}>
              <b className="block font-semibold text-[15px]" style={{ color: 'var(--text)' }}>Tanzim Shahriar</b>
              Digital Marketing Lead, Social Engagement Group LLC
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <span className="eyebrow">About Me</span>
            <h2 className="font-bold leading-[1.08] tracking-tight text-[clamp(32px,4.6vw,52px)] mb-5">Who is <Italic>Tanzim?</Italic></h2>
            <p className="mb-4" style={{ color: 'var(--dim)' }}>
              I'm a paid-media strategist who lives in ad accounts. I know where every dollar goes, and I treat client budgets like my own, because <strong className="font-semibold" style={{ color: 'var(--text)' }}>spending money on ads that may not work is a real anxiety</strong>, and I never minimize it.
            </p>
            <p className="mb-4" style={{ color: 'var(--dim)' }}>
              Most accounts I audit don't have a budget problem. They have a tracking problem: broad match bleed, missing negative keywords, audiences that click but never convert. <strong className="font-semibold" style={{ color: 'var(--text)' }}>I fix the measurement first, then scale what's proven.</strong> Recovered waste funds real growth.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-[26px]">
              <span className="chip"><b>Tracking</b> before budget</span>
              <span className="chip"><b>Every dollar</b> has a job</span>
              <span className="chip"><b>Creative</b> is targeting</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Playbooks() {
  const tilt = useTilt()
  return (
    <section id="playbooks" className="py-[104px]" aria-label="Platform playbooks">
      <div className="max-w-[1080px] mx-auto px-6">
        <SectionHead eyebrow="Platform Playbooks" lede="Each network rewards different behavior. These are the methodologies I deploy, balancing organic engagement with optimized paid media buying.">
          Omni-channel growth, <Italic>one platform at a time</Italic>
        </SectionHead>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          {PLAYBOOKS.map((p, i) => (
            <Reveal as="article" key={p.platform} delay={(i % 2) * 0.08} className="card-surface px-[30px] py-8" {...tilt}>
              <span className="tag-outline mb-[18px]">{p.platform}</span>
              <h3 className="font-bold text-[23px] tracking-tight mb-4">{p.title}</h3>
              <ul className="list-none">
                {p.items.map(([head, rest]) => (
                  <li key={head} className="relative text-[15px] py-[11px] pl-[22px] border-t" style={{ color: 'var(--dim)', borderColor: 'var(--line)' }}>
                    <span className="absolute left-0 top-3 text-[10px]" style={{ color: 'var(--accent-ink)' }}>✦</span>
                    <strong className="font-semibold" style={{ color: 'var(--text)' }}>{head}</strong> {rest}
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

function Frameworks() {
  return (
    <section id="frameworks" className="py-[104px]" aria-label="Paid search frameworks">
      <div className="max-w-[1080px] mx-auto px-6">
        <SectionHead eyebrow="Search Frameworks" lede="High-intent paid search is where wasted spend hurts most and discipline pays best. Frameworks I've designed and deployed for targeted lead acquisition:">
          Built for buyers, priced with <Italic>discipline</Italic>
        </SectionHead>
        <Reveal className="flex justify-between flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.08em] mb-3.5" style={{ color: 'var(--faint)' }}>
          <span>Deployed lead-acquisition frameworks</span>
          <span>Volumes and bids: estimated monthly ranges</span>
        </Reveal>
        <Reveal className="overflow-x-auto rounded-card border" style={{ borderColor: 'var(--line-strong)', background: 'var(--bg-soft)' }}>
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                {['Target vertical', 'Strategic keyword bids', 'Monthly vol.', 'Bid range', 'Ad copy hook strategy'].map((h) => (
                  <th key={h} scope="col" className="text-left font-mono font-medium text-[10px] uppercase tracking-[0.16em] px-6 py-[18px] border-b" style={{ color: 'var(--faint)', borderColor: 'var(--line-strong)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FRAMEWORKS.map((f, i) => (
                <tr key={f.vertical} className="transition-colors hover:bg-black/5">
                  <td className={`px-6 py-[26px] align-top font-bold text-[20px] leading-[1.3] ${i < FRAMEWORKS.length - 1 ? 'border-b' : ''}`} style={{ borderColor: 'var(--line)' }}>{f.vertical}</td>
                  <td className={`px-6 py-[26px] align-top font-mono text-[12.5px] leading-8 ${i < FRAMEWORKS.length - 1 ? 'border-b' : ''}`} style={{ color: 'var(--dim)', borderColor: 'var(--line)' }}>
                    {f.keywords.map((k) => <div key={k}>{k}</div>)}
                  </td>
                  <td className={`px-6 py-[26px] align-top font-mono text-[13.5px] whitespace-nowrap ${i < FRAMEWORKS.length - 1 ? 'border-b' : ''}`} style={{ borderColor: 'var(--line)' }}>{f.volume}</td>
                  <td className={`px-6 py-[26px] align-top font-mono text-[13.5px] whitespace-nowrap ${i < FRAMEWORKS.length - 1 ? 'border-b' : ''}`} style={{ borderColor: 'var(--line)' }}>{f.bids}</td>
                  <td className={`px-6 py-[26px] align-top italic text-[16px] leading-normal ${i < FRAMEWORKS.length - 1 ? 'border-b' : ''}`} style={{ borderColor: 'var(--line)' }}>{f.hook}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  )
}

function Creative() {
  const tilt = useTilt()
  return (
    <section id="work" className="py-[104px]" aria-label="Creative work">
      <div className="max-w-[1080px] mx-auto px-6">
        <SectionHead eyebrow="Creative Work" lede="A few of the structural campaigns and concepts the SEG creative engine has executed under my direction:">
          Assets built for <Italic>retention</Italic>, not decoration
        </SectionHead>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          {CREATIVE.map(([tag, title, body], i) => (
            <Reveal as="article" key={title} delay={(i % 2) * 0.08} className="card-surface p-[30px]" {...tilt}>
              <span className="block font-mono text-[10.5px] uppercase tracking-[0.14em] mb-3" style={{ color: 'var(--accent-ink)' }}>{tag}</span>
              <h3 className="font-bold text-[21px] tracking-tight mb-3">{title}</h3>
              <p className="text-[15px]" style={{ color: 'var(--dim)' }}>{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Clients() {
  return (
    <section id="clients" className="py-[104px]" aria-label="Clients">
      <div className="max-w-[1080px] mx-auto px-6">
        <SectionHead eyebrow="Client Roster" lede="Tap through to the brands themselves.">
          Frameworks proven across <Italic>nine brands</Italic>
        </SectionHead>
        <Reveal className="flex flex-wrap justify-center gap-3">
          {CLIENTS.map(([name, sector, url]) => {
            const inner = (
              <>
                {name}
                <small className="block font-mono font-normal text-[10px] uppercase tracking-[0.1em] mt-0.5" style={{ color: 'var(--faint)' }}>
                  {sector}{url && <span style={{ color: 'var(--accent-ink)' }}> ↗</span>}
                </small>
              </>
            )
            const cls = 'inline-block rounded-[18px] px-[26px] py-3.5 font-semibold text-base no-underline transition-all duration-[250ms] border'
            const style = { color: 'var(--dim)', borderColor: 'var(--line-strong)', background: 'var(--bg-soft)' }
            return url ? (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" className={`${cls} hover:-translate-y-[3px] hover:!border-brick hover:!text-[var(--text)]`} style={style}>
                {inner}
              </a>
            ) : (
              <span key={name} className={cls} style={style}>{inner}</span>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="py-[104px] pb-0" aria-label="Contact">
      <div className="max-w-[1080px] mx-auto px-6">
        <Reveal className="relative overflow-hidden rounded-[30px] bg-brick text-white text-center px-7 md:px-[72px] py-12 md:py-[84px]">
          <div className="pointer-events-none absolute -top-[120px] -right-[120px] w-[340px] h-[340px] rounded-full border-[60px] border-white/[0.08]" />
          <span className="eyebrow !text-white">Contact</span>
          <h2 className="font-bold leading-[1.08] tracking-tight text-[clamp(32px,4.6vw,52px)] max-w-[15em] mx-auto mb-[18px]">
            Ask me where your ad spend is <span className="italic">leaking</span>
          </h2>
          <p className="max-w-[540px] mx-auto mb-9 text-white/[0.88]">
            If you're spending on Google or Meta and can't name your cost per lead, that's the first conversation to have. It costs nothing to find out.
          </p>
          <div className="flex justify-center gap-3.5 flex-wrap">
            <a href="mailto:tanzim@socialengagementgroup.com" className="pill" style={{ background: '#1d1d1b', color: '#f2ece5' }}>
              tanzim@socialengagementgroup.com
            </a>
            <a href="https://www.linkedin.com/in/tanzim-shahriar-utsab-575014356/" target="_blank" rel="noopener noreferrer" className="pill border !border-white/[0.55] text-white hover:!border-white">
              LinkedIn
            </a>
            <a href="tel:+8801617410513" className="pill border !border-white/[0.55] text-white hover:!border-white">
              +880 1617-410513
            </a>
          </div>
        </Reveal>
        <footer className="flex justify-between flex-wrap gap-3 font-mono text-[10.5px] uppercase tracking-[0.12em] py-11 mt-5 border-t" style={{ color: 'var(--faint)', borderColor: 'var(--line)' }}>
          <span>© 2026 Tanzim Shahriar</span>
          <a href="https://www.socialengagementgroup.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 no-underline" style={{ color: 'inherit' }}>
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

/* ============================== APP ============================== */

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const progressRef = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch (e) { /* storage unavailable */ }
  }, [theme])

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      if (progressRef.current) {
        progressRef.current.style.width = `${(h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100}%`
      }
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div id="top" className="font-sans text-[17px] leading-relaxed">
      <div ref={progressRef} className="fixed top-0 left-0 h-[3px] w-0 bg-brick z-[60]" aria-hidden />
      <Nav theme={theme} toggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Results theme={theme} />
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
