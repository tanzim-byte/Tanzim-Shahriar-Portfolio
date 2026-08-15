# Tanzim Shahriar: Portfolio

React 18 + Vite + Tailwind CSS. Single-page, dual-theme (SEG brand palette), animated case-study charts.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel (free subdomain)

**Option A: CLI (fastest)**

```bash
npm i -g vercel
vercel login          # use tanzim@socialengagementgroup.com
vercel --prod
```

When prompted for a project name, enter `tanzim-shahriar`. Vercel auto-detects Vite, so accept the defaults. The site goes live at `tanzim-shahriar.vercel.app`.

**Option B: Dashboard**

1. Push this folder to a GitHub repo.
2. At vercel.com, click *Add New → Project*, import the repo.
3. Framework preset: **Vite** (auto-detected). Build: `npm run build`. Output: `dist`.
4. Under *Settings → Domains*, confirm the subdomain is `tanzim-shahriar`.

## Editing content

All copy and data live in the arrays at the top of `src/App.jsx`. No markup changes needed:

| Constant | Controls |
|---|---|
| `NAV` | Navbar links |
| `MARQUEE` | Scrolling keyword band |
| `SERVICES` | Numbered accordion |
| `KPIS` | Four animated counters |
| `CASES` | Case-study cards and their charts |
| `PLAYBOOKS` | Per-platform methodology cards |
| `FRAMEWORKS` | Paid-search ledger table |
| `CREATIVE` | Creative work grid |
| `CLIENTS` | Client pills (third value is the URL, `null` = unlinked) |

## Brand system

Defined in `tailwind.config.js` and `src/index.css`, per the SEG Brand Guideline (2025):

- **Brick Red** `#975554` (accent), deep variant `#7c4342`
- **Black** `#1d1d1b` / **Beige** `#f1e9e3` / **White** `#ffffff`
- **Inter** for all type; JetBrains Mono for small data labels
- Theme tokens are CSS variables under `:root[data-theme="dark"]` and `[data-theme="light"]`

Theme follows the visitor's system preference and persists to `localStorage`.

## Open items

- `Sona Chandi` in the `CLIENTS` array has no URL and renders unlinked.
- No ROAS figure appears anywhere. The hero copy promises "qualified leads and ROAS." Either add revenue data to a case study, or change that line to "cost per acquisition" so the claim matches the evidence.
