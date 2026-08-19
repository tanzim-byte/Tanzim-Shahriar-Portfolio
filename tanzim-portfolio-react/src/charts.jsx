import { useEffect, useRef, useState } from 'react'

/* ==========================================================================
   CHART KIT — dependency-free SVG + CSS visualisations
   Every chart ships a visually hidden data table so the numbers are
   available to screen readers and never depend on colour alone.
   ========================================================================== */

export const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const TONE = {
  ember: 'var(--ember)',
  gold: 'var(--gold)',
  cyan: 'var(--cyan)',
  violet: 'var(--violet)',
  brick: 'var(--brick)',
  muted: 'var(--chart-track)',
}

const toneOf = (t) => TONE[t] || TONE.ember

export function useInView(threshold = 0.25) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (REDUCED_MOTION) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true)
            io.disconnect()
          }
        }),
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ---------- formatting ---------- */

export const compact = (v) =>
  v >= 1e6
    ? `${(v / 1e6).toFixed(2).replace(/\.?0+$/, '')}M`
    : v >= 1e3
      ? `${(v / 1e3).toFixed(1).replace(/\.0$/, '')}K`
      : `${v}`

const full = (v) => v.toLocaleString('en-US')
const money = (v) => `$${v < 1 ? v.toFixed(2) : v.toFixed(2).replace(/\.00$/, '')}`

/* ---------- shared frame ---------- */

function DataTable({ caption, head, rows }) {
  return (
    <div className="sr-only-table">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {c}
                  </th>
                ) : (
                  <td key={j}>{c}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Frame({ caption, note, children }) {
  return (
    <figure className="m-0">
      {/* Stacks on phones: side-by-side caption and note collide once the
          caption wraps to several lines at narrow widths. */}
      <figcaption className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-3 mb-4">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.16em] leading-snug"
          style={{ color: 'var(--faint)' }}
        >
          {caption}
        </span>
        {note && (
          <span
            className="font-mono text-[9.5px] uppercase tracking-[0.14em] shrink-0"
            style={{ color: 'var(--accent-ink)', opacity: 0.75 }}
          >
            {note}
          </span>
        )}
      </figcaption>
      {children}
    </figure>
  )
}

/* ==========================================================================
   1. SCALE BARS — magnitude comparison (impressions → views → followers)
   ========================================================================== */

export function ScaleBars({ config }) {
  const [ref, inView] = useInView(0.3)
  const max = Math.max(...config.series.map((s) => s.value))

  return (
    <Frame caption={config.caption}>
      <div ref={ref} className="flex flex-col gap-3.5">
        {config.series.map((s, i) => {
          const pct = (s.value / max) * 100
          const isHi = s.tone !== 'muted'
          return (
            <div
              key={s.label}
              className="grid grid-cols-[minmax(72px,auto)_1fr_58px] items-center gap-3"
            >
              <span
                className="font-mono text-[10.5px] uppercase tracking-[0.1em]"
                style={{ color: isHi ? 'var(--text)' : 'var(--faint)' }}
              >
                {s.label}
              </span>
              <div className="relative">
                <div className="h-9 rounded-lg w-full" style={{ background: 'var(--chart-track)' }} />
                <div
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{
                    width: inView ? `${Math.max(pct, 2)}%` : '0%',
                    background: isHi
                      ? `linear-gradient(90deg, ${toneOf(s.tone)}, var(--gold))`
                      : 'color-mix(in srgb, var(--ember) 26%, transparent)',
                    boxShadow: isHi ? `0 0 26px -6px ${toneOf(s.tone)}` : 'none',
                    transition: REDUCED_MOTION
                      ? 'none'
                      : `width 1.1s cubic-bezier(0.22,1,0.36,1) ${i * 0.12}s`,
                  }}
                />
              </div>
              <span
                className="font-mono text-[12px] font-medium tabular-nums text-right"
                style={{ color: isHi ? 'var(--text)' : 'var(--dim)' }}
              >
                {compact(s.value)}
              </span>
            </div>
          )
        })}
      </div>
      <DataTable
        caption={config.caption}
        head={['Metric', 'Value']}
        rows={config.series.map((s) => [s.label, full(s.value)])}
      />
    </Frame>
  )
}

/* ==========================================================================
   2. FUNNEL — sequential drop-off with step conversion rates
   ========================================================================== */

export function Funnel({ config }) {
  const [ref, inView] = useInView(0.3)
  const stages = config.stages
  const max = stages[0].value
  // Compressed width scale keeps the smallest stage legible.
  // Printed values are always exact.
  const widthOf = (v) => 12 + 88 * Math.pow(v / max, 0.55)

  return (
    <Frame caption={config.caption} note="widths compressed">
      <div ref={ref} className="flex flex-col">
        {stages.map((s, i) => {
          const wTop = widthOf(s.value)
          const wBot = i === stages.length - 1 ? wTop * 0.9 : widthOf(stages[i + 1].value)
          const step = i === 0 ? null : (s.value / stages[i - 1].value) * 100
          return (
            <div key={s.label}>
              <div className="grid grid-cols-[minmax(70px,auto)_1fr_minmax(64px,auto)] items-center gap-3">
                <span
                  className="font-mono text-[10.5px] uppercase tracking-[0.1em] leading-tight"
                  style={{ color: i === stages.length - 1 ? 'var(--text)' : 'var(--faint)' }}
                >
                  {s.label}
                </span>
                <div
                  className="h-[44px]"
                  style={{
                    background: `linear-gradient(90deg, var(--ember), var(--gold))`,
                    opacity: inView ? 0.35 + (i / (stages.length - 1)) * 0.65 : 0,
                    clipPath: `polygon(${50 - wTop / 2}% 0%, ${50 + wTop / 2}% 0%, ${50 + wBot / 2}% 100%, ${50 - wBot / 2}% 100%)`,
                    transition: REDUCED_MOTION
                      ? 'none'
                      : `opacity 0.7s ease ${i * 0.13}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.13}s`,
                    transform: inView ? 'scaleY(1)' : 'scaleY(0.2)',
                    transformOrigin: 'top center',
                  }}
                />
                <div className="text-right">
                  <div className="font-mono text-[12.5px] font-medium tabular-nums leading-none">
                    {compact(s.value)}
                  </div>
                  {step !== null && (
                    <div
                      className="font-mono text-[9.5px] tabular-nums mt-1"
                      style={{ color: 'var(--accent-ink)' }}
                    >
                      {step < 10 ? step.toFixed(1) : Math.round(step)}%
                    </div>
                  )}
                </div>
              </div>
              {i < stages.length - 1 && <div className="h-2" />}
            </div>
          )
        })}
      </div>
      <DataTable
        caption={config.caption}
        head={['Stage', 'Value', 'Conversion from previous stage']}
        rows={stages.map((s, i) => [
          s.label,
          full(s.value),
          i === 0 ? '—' : `${((s.value / stages[i - 1].value) * 100).toFixed(1)}%`,
        ])}
      />
    </Frame>
  )
}

/* ==========================================================================
   3. DUAL GAUGE — two rates on one dial
   ========================================================================== */

export function DualGauge({ config }) {
  const [ref, inView] = useInView(0.35)
  const SWEEP = 0.75 // 270 degrees
  const radii = [58, 42]

  return (
    <Frame caption={config.caption}>
      <div ref={ref} className="flex items-center gap-6 flex-wrap sm:flex-nowrap">
        <svg viewBox="0 0 150 150" className="w-[142px] h-[142px] shrink-0" role="presentation">
          <g transform="rotate(135 75 75)">
            {config.rings.map((r, i) => {
              const R = radii[i]
              const C = 2 * Math.PI * R
              return (
                <g key={r.label}>
                  <circle
                    cx="75"
                    cy="75"
                    r={R}
                    fill="none"
                    stroke="var(--chart-track)"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeDasharray={`${C * SWEEP} ${C}`}
                  />
                  <circle
                    cx="75"
                    cy="75"
                    r={R}
                    fill="none"
                    stroke={toneOf(r.tone)}
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeDasharray={`${inView ? C * SWEEP * (r.pct / 100) : 0} ${C}`}
                    style={{
                      transition: REDUCED_MOTION
                        ? 'none'
                        : `stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 0.18}s`,
                      filter: `drop-shadow(0 0 8px ${toneOf(r.tone)})`,
                    }}
                  />
                </g>
              )
            })}
          </g>
          <text
            x="75"
            y="72"
            textAnchor="middle"
            className="font-display"
            style={{ fill: 'var(--text)', fontSize: '25px', fontWeight: 700 }}
          >
            {config.rings[0].pct}%
          </text>
          <text
            x="75"
            y="88"
            textAnchor="middle"
            className="font-mono"
            style={{ fill: 'var(--faint)', fontSize: '8px', letterSpacing: '0.1em' }}
          >
            CALL RATE
          </text>
        </svg>

        <ul className="flex-1 min-w-[150px] list-none m-0 p-0 flex flex-col gap-3.5">
          {config.rings.map((r) => (
            <li key={r.label} className="flex items-start gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                style={{ background: toneOf(r.tone) }}
                aria-hidden
              />
              <span>
                <span className="block text-[13.5px] font-semibold leading-tight">
                  {r.pct}% <span style={{ color: 'var(--dim)' }}>{r.label}</span>
                </span>
                <span
                  className="block font-mono text-[10.5px] mt-0.5"
                  style={{ color: 'var(--faint)' }}
                >
                  {r.detail}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <DataTable
        caption={config.caption}
        head={['Measure', 'Rate', 'Detail']}
        rows={config.rings.map((r) => [r.label, `${r.pct}%`, r.detail])}
      />
    </Frame>
  )
}

/* ==========================================================================
   4. GROWTH LADDER — log-scale lollipop
   ========================================================================== */

export function GrowthLadder({ config }) {
  const [ref, inView] = useInView(0.3)
  const vals = config.rows.map((r) => r.value)
  const lo = Math.log10(Math.min(...vals) * 0.8)
  const hi = Math.log10(Math.max(...vals) * 1.12)
  const posOf = (v) => ((Math.log10(v) - lo) / (hi - lo)) * 100

  return (
    <Frame caption={config.caption} note={config.note}>
      <div ref={ref} className="flex flex-col gap-3">
        {config.rows.map((r, i) => {
          const p = posOf(r.value)
          const hue = i / (config.rows.length - 1)
          const col = `color-mix(in srgb, var(--gold) ${hue * 100}%, var(--ember))`
          return (
            <div
              key={r.label}
              className="grid grid-cols-[minmax(62px,auto)_1fr_66px] items-center gap-3"
            >
              <span
                className="font-mono text-[10px] uppercase tracking-[0.1em]"
                style={{ color: 'var(--faint)' }}
              >
                {r.label}
              </span>
              <div className="relative h-6 flex items-center">
                <div
                  className="absolute left-0 right-0 h-px"
                  style={{ background: 'var(--chart-track)' }}
                />
                <div
                  className="absolute left-0 h-[3px] rounded-full"
                  style={{
                    width: inView ? `${p}%` : '0%',
                    background: `linear-gradient(90deg, transparent, ${col})`,
                    transition: REDUCED_MOTION
                      ? 'none'
                      : `width 1s cubic-bezier(0.22,1,0.36,1) ${i * 0.09}s`,
                  }}
                />
                <span
                  className="absolute w-2.5 h-2.5 rounded-full -translate-x-1/2 block"
                  style={{
                    left: inView ? `${p}%` : '0%',
                    background: col,
                    boxShadow: `0 0 12px ${col}`,
                    transition: REDUCED_MOTION
                      ? 'none'
                      : `left 1s cubic-bezier(0.22,1,0.36,1) ${i * 0.09}s`,
                  }}
                  aria-hidden
                />
              </div>
              <span
                className="font-mono text-[11.5px] font-medium tabular-nums text-right whitespace-nowrap"
                style={{ color: 'var(--text)' }}
              >
                +{full(r.value)}%
              </span>
            </div>
          )
        })}
      </div>
      <DataTable
        caption={config.caption}
        head={['Account', 'Reach growth vs prior period']}
        rows={config.rows.map((r) => [r.label, `+${full(r.value)}%`])}
      />
    </Frame>
  )
}

/* ==========================================================================
   5. EFFICIENCY — cross-campaign cost per outcome, log scale
   ========================================================================== */

export function Efficiency({ config }) {
  const [ref, inView] = useInView(0.25)
  const vals = config.rows.map((r) => r.value)
  const lo = Math.log10(Math.min(...vals) * 0.55)
  const hi = Math.log10(Math.max(...vals) * 1.5)
  const posOf = (v) => ((Math.log10(v) - lo) / (hi - lo)) * 100
  const ticks = [0.1, 1, 10]

  return (
    <Frame caption="Cost per outcome across five campaigns" note="log scale · lower is better">
      <div ref={ref}>
        <div className="grid grid-cols-[1fr_72px] gap-3">
          <div className="relative mb-3 h-4">
            {ticks.map((t) => (
              <span
                key={t}
                className="absolute font-mono text-[9.5px] -translate-x-1/2"
                style={{ left: `${posOf(t)}%`, color: 'var(--faint)' }}
              >
                ${t < 1 ? t.toFixed(2) : t}
              </span>
            ))}
          </div>
          <span />
        </div>

        <div className="flex flex-col gap-4">
          {config.rows.map((r, i) => {
            const p = posOf(r.value)
            return (
              <div key={`${r.client}-${i}`} className="relative">
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <span className="text-[13px] font-semibold">{r.label}</span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.1em] text-right"
                    style={{ color: 'var(--faint)' }}
                  >
                    {r.client}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_72px] items-center gap-3">
                  <div className="relative h-5 flex items-center">
                    {ticks.map((t) => (
                      <span
                        key={t}
                        className="absolute top-0 bottom-0 w-px"
                        style={{ left: `${posOf(t)}%`, background: 'var(--chart-track)' }}
                        aria-hidden
                      />
                    ))}
                    <div
                      className="absolute left-0 h-[5px] rounded-full"
                      style={{
                        width: inView ? `${p}%` : '0%',
                        background: `linear-gradient(90deg, transparent, ${toneOf(r.tone)})`,
                        transition: REDUCED_MOTION
                          ? 'none'
                          : `width 1.05s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
                      }}
                    />
                    <span
                      className="absolute w-3 h-3 rounded-full -translate-x-1/2 block"
                      style={{
                        left: inView ? `${p}%` : '0%',
                        background: toneOf(r.tone),
                        boxShadow: `0 0 14px ${toneOf(r.tone)}`,
                        transition: REDUCED_MOTION
                          ? 'none'
                          : `left 1.05s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
                      }}
                      aria-hidden
                    />
                  </div>
                  <span className="font-display text-[15px] font-bold tabular-nums text-right whitespace-nowrap">
                    {money(r.value)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-6 text-[12.5px] leading-relaxed" style={{ color: 'var(--faint)' }}>
          {config.note}
        </p>
      </div>
      <DataTable
        caption="Cost per outcome across five campaigns"
        head={['Outcome', 'Cost', 'Campaign']}
        rows={config.rows.map((r) => [r.label, money(r.value), r.client])}
      />
    </Frame>
  )
}

/* ==========================================================================
   6. KEYWORD SPEND — where the money went, and what it returned
   ========================================================================== */

export function KeywordSpend({ config }) {
  const [ref, inView] = useInView(0.25)
  const max = Math.max(...config.rows.map((r) => r.value))

  return (
    <Frame caption={config.caption} note={config.note}>
      <div ref={ref} className="flex flex-col gap-4">
        {config.rows.map((r, i) => {
          const pct = (r.value / max) * 100
          return (
            <div key={r.label}>
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <span className="font-mono text-[12px]" style={{ color: 'var(--text)' }}>
                  {r.label}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.1em] shrink-0"
                  style={{ color: 'var(--accent-ink)' }}
                >
                  {r.verdict}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_86px] items-center gap-3">
                <div className="relative h-6">
                  <div className="absolute inset-0 rounded-md" style={{ background: 'var(--chart-track)' }} />
                  <div
                    className="absolute inset-y-0 left-0 rounded-md"
                    style={{
                      width: inView ? `${Math.max(pct, 1.5)}%` : '0%',
                      background: 'linear-gradient(90deg, var(--red-ink, #e5544b), var(--ember))',
                      transition: REDUCED_MOTION
                        ? 'none'
                        : `width 1.05s cubic-bezier(0.22,1,0.36,1) ${i * 0.09}s`,
                    }}
                  />
                </div>
                <span className="font-mono text-[12.5px] tabular-nums text-right whitespace-nowrap">
                  ${r.value.toFixed(2)}
                </span>
              </div>
              <div
                className="font-mono text-[10px] mt-1.5"
                style={{ color: 'var(--faint)' }}
              >
                {r.calls} {r.calls === 1 ? 'call' : 'calls'} · 0 qualified
              </div>
            </div>
          )
        })}
      </div>
      <DataTable
        caption={config.caption}
        head={['Keyword', 'Spend', 'Calls', 'Qualified cases', 'Recommended action']}
        rows={config.rows.map((r) => [r.label, `$${r.value.toFixed(2)}`, String(r.calls), '0', r.verdict])}
      />
    </Frame>
  )
}

/* ==========================================================================
   7. SIGNAL GAP — reported conversions vs real outcomes
   ========================================================================== */

export function SignalGap({ config }) {
  const [ref, inView] = useInView(0.35)
  return (
    <Frame caption={config.caption}>
      <div ref={ref} className="grid grid-cols-2 gap-3">
        <div
          className="rounded-2xl px-5 py-6 text-center"
          style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)' }}
        >
          <div
            className="font-display font-bold text-[40px] leading-none tabular-nums"
            style={{
              color: 'var(--dim)',
              opacity: inView ? 1 : 0,
              transition: REDUCED_MOTION ? 'none' : 'opacity .6s ease',
            }}
          >
            {config.reported}
          </div>
          <div
            className="font-mono text-[9.5px] uppercase tracking-[0.14em] mt-3 leading-relaxed"
            style={{ color: 'var(--faint)' }}
          >
            Conversions
            <br />
            Google reported
          </div>
        </div>
        <div
          className="rounded-2xl px-5 py-6 text-center"
          style={{
            background: 'color-mix(in srgb, var(--ember) 9%, transparent)',
            border: '1px solid color-mix(in srgb, var(--ember) 40%, transparent)',
          }}
        >
          <div
            className="font-display font-bold text-[40px] leading-none tabular-nums"
            style={{
              color: 'var(--ember)',
              opacity: inView ? 1 : 0,
              transition: REDUCED_MOTION ? 'none' : 'opacity .6s ease .2s',
            }}
          >
            {config.real}
          </div>
          <div
            className="font-mono text-[9.5px] uppercase tracking-[0.14em] mt-3 leading-relaxed"
            style={{ color: 'var(--accent-ink)' }}
          >
            Cases the
            <br />
            firm took
          </div>
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed" style={{ color: 'var(--dim)' }}>
        {config.note}
      </p>
      <DataTable
        caption={config.caption}
        head={['Measure', 'Count']}
        rows={[['Conversions Google reported', String(config.reported)], ['Cases the firm took', String(config.real)]]}
      />
    </Frame>
  )
}

/* ==========================================================================
   8. PAIRED BARS — two measured windows side by side
   ========================================================================== */

export function PairedBars({ caption, note, groups }) {
  const [ref, inView] = useInView(0.25)
  return (
    <Frame caption={caption} note={note}>
      <div ref={ref} className="flex flex-col gap-5">
        {groups.map((g, i) => {
          const max = Math.max(g.a, g.b)
          return (
            <div key={g.label}>
              <div
                className="font-mono text-[10px] uppercase tracking-[0.1em] mb-2"
                style={{ color: 'var(--dim)' }}
              >
                {g.label}
              </div>
              {[
                { v: g.a, name: g.aName, hi: false },
                { v: g.b, name: g.bName, hi: true },
              ].map((row, j) => (
                <div key={j} className="grid grid-cols-[64px_1fr_74px] items-center gap-3 mb-1.5">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.1em]" style={{ color: 'var(--faint)' }}>
                    {row.name}
                  </span>
                  <div className="relative h-[22px]">
                    <div className="absolute inset-0 rounded-md" style={{ background: 'var(--chart-track)' }} />
                    <div
                      className="absolute inset-y-0 left-0 rounded-md"
                      style={{
                        width: inView ? `${(row.v / max) * 100}%` : '0%',
                        background: row.hi
                          ? 'linear-gradient(90deg, var(--ember), var(--gold))'
                          : 'color-mix(in srgb, var(--ember) 28%, transparent)',
                        boxShadow: row.hi ? '0 0 20px -8px var(--ember)' : 'none',
                        transition: REDUCED_MOTION
                          ? 'none'
                          : `width 1.05s cubic-bezier(0.22,1,0.36,1) ${(i * 2 + j) * 0.07}s`,
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-[12px] tabular-nums text-right whitespace-nowrap"
                    style={{ color: row.hi ? 'var(--text)' : 'var(--dim)' }}
                  >
                    {g.fmt ? g.fmt(row.v) : compact(row.v)}
                  </span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
      <DataTable
        caption={caption}
        head={['Metric', groups[0].aName, groups[0].bName]}
        rows={groups.map((g) => [g.label, g.fmt ? g.fmt(g.a) : String(g.a), g.fmt ? g.fmt(g.b) : String(g.b)])}
      />
    </Frame>
  )
}

/* ==========================================================================
   9. TREND GRID — several metrics across the same months, as sparks
   ========================================================================== */

export function TrendGrid({ config }) {
  const [ref, inView] = useInView(0.25)
  return (
    <Frame caption={config.caption} note={config.note}>
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {config.series.map((ser, si) => {
          const lo = Math.min(...ser.values)
          const hi = Math.max(...ser.values)
          const span = hi - lo || 1
          // For "lower is better" metrics, flip so improvement always rises.
          const norm = (v) => {
            const t = (v - lo) / span
            return ser.invert ? 1 - t : t
          }
          const pts = ser.values.map((v, i) => {
            const x = (i / (ser.values.length - 1)) * 100
            const y = 34 - norm(v) * 28
            return `${x},${y}`
          })
          const col = toneOf(ser.tone)
          return (
            <div key={ser.key}>
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--faint)' }}>
                  {ser.key}
                </span>
                <span className="font-mono text-[13px] font-medium tabular-nums" style={{ color: col }}>
                  {ser.fmt(ser.values[ser.values.length - 1])}
                </span>
              </div>
              {/* Line is stretched to fill the card, so the dots are HTML —
                  circles inside a preserveAspectRatio="none" SVG distort. */}
              <div className="relative w-full h-[44px]">
                <svg
                  viewBox="0 0 100 40"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full"
                  role="presentation"
                  style={{
                    clipPath: inView || REDUCED_MOTION ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                    transition: REDUCED_MOTION ? 'none' : `clip-path 1.1s cubic-bezier(0.22,1,0.36,1) ${si * 0.12}s`,
                  }}
                >
                  <polyline
                    points={pts.join(' ')}
                    fill="none"
                    stroke={col}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                {ser.values.map((v, i) => {
                  const last = i === ser.values.length - 1
                  return (
                    <span
                      key={i}
                      className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${(i / (ser.values.length - 1)) * 100}%`,
                        top: `${((34 - norm(v) * 28) / 40) * 100}%`,
                        width: last ? 7 : 4,
                        height: last ? 7 : 4,
                        background: last ? col : 'var(--chart-track)',
                        boxShadow: last ? `0 0 10px ${col}` : 'none',
                        opacity: inView ? 1 : 0,
                        transition: REDUCED_MOTION
                          ? 'none'
                          : `opacity .5s ease ${si * 0.12 + i * 0.1}s`,
                      }}
                      aria-hidden
                    />
                  )
                })}
              </div>
              <div className="flex justify-between mt-1">
                {config.months.map((m, i) => (
                  <span
                    key={m}
                    className="font-mono text-[9.5px]"
                    style={{ color: i === config.months.length - 1 ? 'var(--dim)' : 'var(--faint)' }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <DataTable
        caption={config.caption}
        head={['Metric', ...config.months]}
        rows={config.series.map((ser) => [ser.key, ...ser.values.map((v) => ser.fmt(v))])}
      />
    </Frame>
  )
}

/* ==========================================================================
   10. RANK LIST — the order Google listed the firms
   ========================================================================== */

export function RankList({ rows, caption }) {
  const [ref, inView] = useInView(0.3)
  return (
    <Frame caption={caption}>
      <ol ref={ref} className="list-none m-0 p-0 flex flex-col gap-2">
        {rows.map((r, i) => (
          <li
            key={r.name}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{
              background: r.us ? 'color-mix(in srgb, var(--ember) 12%, transparent)' : 'var(--bg-soft)',
              border: r.us
                ? '1px solid color-mix(in srgb, var(--ember) 45%, transparent)'
                : '1px solid var(--line)',
              opacity: inView ? 1 : 0,
              transform: inView || REDUCED_MOTION ? 'none' : 'translateX(-10px)',
              transition: REDUCED_MOTION ? 'none' : `opacity .5s ease ${i * 0.09}s, transform .5s ease ${i * 0.09}s`,
            }}
          >
            <span
              className="w-7 h-7 rounded-full inline-flex items-center justify-center font-mono text-[12px] font-medium shrink-0"
              style={{
                background: r.us ? 'var(--ember)' : 'transparent',
                color: r.us ? 'var(--on-ember)' : 'var(--faint)',
                border: r.us ? 'none' : '1px solid var(--line-strong)',
              }}
            >
              {r.pos}
            </span>
            <span
              className="text-[14.5px] font-semibold"
              style={{ color: r.us ? 'var(--text)' : 'var(--dim)' }}
            >
              {r.name}
            </span>
            {r.us && (
              <span
                className="ml-auto font-mono text-[9.5px] uppercase tracking-[0.14em]"
                style={{ color: 'var(--accent-ink)' }}
              >
                the client
              </span>
            )}
          </li>
        ))}
      </ol>
      <DataTable
        caption={caption}
        head={['Position', 'Law firm']}
        rows={rows.map((r) => [String(r.pos), r.name])}
      />
    </Frame>
  )
}

/* ==========================================================================
   11. PAGE BARS — top landing pages by visits
   ========================================================================== */

export function PageBars({ config }) {
  const [ref, inView] = useInView(0.25)
  const max = Math.max(...config.rows.map((r) => r.value))
  return (
    <Frame caption={config.caption} note={config.note}>
      <div ref={ref} className="flex flex-col gap-3">
        {config.rows.map((r, i) => (
          <div key={r.label} className="grid grid-cols-[1fr_52px] items-center gap-3">
            <div>
              <div className="text-[13.5px] mb-1.5" style={{ color: i === 0 ? 'var(--text)' : 'var(--dim)' }}>
                {r.label}
              </div>
              <div className="relative h-[10px]">
                <div className="absolute inset-0 rounded-full" style={{ background: 'var(--chart-track)' }} />
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: inView ? `${(r.value / max) * 100}%` : '0%',
                    background:
                      i === 0
                        ? 'linear-gradient(90deg, var(--ember), var(--gold))'
                        : 'color-mix(in srgb, var(--ember) 55%, transparent)',
                    transition: REDUCED_MOTION
                      ? 'none'
                      : `width 1s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s`,
                  }}
                />
              </div>
            </div>
            <span className="font-mono text-[14px] tabular-nums text-right">{r.value}</span>
          </div>
        ))}
      </div>
      <DataTable
        caption={config.caption}
        head={['Page', 'Visits']}
        rows={config.rows.map((r) => [r.label, String(r.value)])}
      />
    </Frame>
  )
}

/* ==========================================================================
   12. OPPORTUNITY — high volume, low rank
   ========================================================================== */

export function Opportunity({ config }) {
  const [ref, inView] = useInView(0.25)
  const max = Math.max(...config.rows.map((r) => r.shown))
  return (
    <Frame caption={config.caption} note="times shown vs current rank">
      <div ref={ref} className="flex flex-col gap-4">
        {config.rows.map((r, i) => (
          <div key={r.term}>
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <span className="text-[13.5px] font-medium">&ldquo;{r.term}&rdquo;</span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.1em] shrink-0 px-2 py-1 rounded"
                style={{
                  color: 'var(--red-ink)',
                  background: 'color-mix(in srgb, var(--red-ink) 12%, transparent)',
                }}
              >
                {r.rank}
              </span>
            </div>
            <div className="grid grid-cols-[1fr_62px] items-center gap-3">
              <div className="relative h-[8px]">
                <div className="absolute inset-0 rounded-full" style={{ background: 'var(--chart-track)' }} />
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: inView ? `${(r.shown / max) * 100}%` : '0%',
                    background: 'linear-gradient(90deg, var(--violet), var(--cyan))',
                    transition: REDUCED_MOTION
                      ? 'none'
                      : `width 1s cubic-bezier(0.22,1,0.36,1) ${i * 0.09}s`,
                  }}
                />
              </div>
              <span className="font-mono text-[12.5px] tabular-nums text-right">
                {(r.shown / 1000).toFixed(1)}K
              </span>
            </div>
          </div>
        ))}
      </div>
      <DataTable
        caption={config.caption}
        head={['Search term', 'Times shown', 'Current rank']}
        rows={config.rows.map((r) => [r.term, r.shown.toLocaleString('en-US'), r.rank])}
      />
    </Frame>
  )
}

/* ==========================================================================
   ROUTER
   ========================================================================== */

export function CaseChart({ config }) {
  if (config.kind === 'funnel') return <Funnel config={config} />
  if (config.kind === 'gauge') return <DualGauge config={config} />
  if (config.kind === 'ladder') return <GrowthLadder config={config} />
  return <ScaleBars config={config} />
}
