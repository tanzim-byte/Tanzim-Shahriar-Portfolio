/* ==========================================================================
   CONTENT  —  every figure here comes from SEG campaign reporting
   ========================================================================== */

export const NAV = [
  ['#services', 'Services'],
  ['#results', 'Results'],
  ['#mfc', 'MFC Law'],
  ['#process', 'Process'],
  ['#about', 'About'],
  ['#playbooks', 'Playbooks'],
  ['#work', 'Work'],
  ['#clients', 'Clients'],
]

export const MARQUEE_A = [
  'Google Ads',
  'Paid Social',
  'Meta',
  'TikTok',
  'SEO',
  'Landing Pages',
  'ROAS',
  'Lead Generation',
  'Creative Testing',
  'Retargeting',
]

export const MARQUEE_B = [
  'Cost per lead',
  'Negative keywords',
  'Conversion tracking',
  'Audience testing',
  'Pixel hygiene',
  'Search terms audit',
  'Bid discipline',
  'Creative refresh',
  'Attribution',
  'Landing page speed',
]

/* Rotating proof line under the hero */
export const SIGNALS = [
  ['152,405', 'TikTok followers in 2 months', 'Ari Rastegar'],
  ['1,846', 'B2B leads in 30 days', 'Silver Mountain Finance'],
  ['605', 'phone calls from search', 'Xtreme Wireless'],
  ['$0.16', 'cost per follower', 'BPI Sports'],
  ['+2,700%', 'organic reach lift', 'Managed account'],
]

export const SERVICES = [
  {
    title: 'Digital Advertising',
    body: "High-yielding campaigns across Google, Meta, TikTok, LinkedIn, and Bing, with precision targeting built on interests, demographics, and behavior. Continuous A/B testing and retargeting capture the traffic that didn't convert the first time.",
    tags: ['Google Search & PMax', 'Meta Ads Manager', 'TikTok Ads', 'Retargeting'],
    metric: ['5', 'ad platforms managed'],
  },
  {
    title: 'Content Creation & Management',
    body: "Thumb-stopping creative tailored to each platform's algorithm: graphic design, TikTok content, 3D animation, and Instagram Reels. Creative that earns attention before it asks for a click.",
    tags: ['Graphic Design', 'Reels & TikTok', '3D Animation'],
    metric: ['5.16M', 'video views delivered'],
  },
  {
    title: 'Niche Engagement Strategy',
    body: 'Direct community communication inside the spaces where your customers already gather. Organic growth built on genuine bonds between brands and their audiences, not automation.',
    tags: ['Community Building', 'Influencer Campaigns', 'Organic Growth'],
    metric: ['+2,700%', 'peak organic reach lift'],
  },
  {
    title: 'Web Development & SEO',
    body: 'High-converting landing pages and expert search engine optimization: keyword mapping, organic search analysis, and link equity generation. The infrastructure that makes paid traffic pay off.',
    tags: ['Landing Pages', 'Technical SEO', 'Keyword Mapping'],
    metric: ['3.2%', 'search conversion rate'],
  },
]

export const KPIS = [
  {
    target: 152405,
    suffix: '+',
    label: 'TikTok followers gained',
    sub: 'Ari Rastegar · 2 months',
    tone: 'ember',
  },
  {
    target: 1846,
    label: 'Leads in one month',
    sub: 'Silver Mountain Finance',
    tone: 'gold',
  },
  {
    target: 605,
    label: 'Phone calls generated',
    sub: 'Xtreme Wireless · Google Ads',
    tone: 'cyan',
  },
  {
    target: 0.16,
    money: true,
    prefix: '$',
    label: 'Cost per follower',
    sub: 'BPI Sports · TikTok',
    tone: 'violet',
  },
]

/* Cross-campaign cost efficiency — real reported costs, log scale */
export const EFFICIENCY = {
  note: 'Log scale. Lower is better. Each bar is a different outcome type, so compare within a channel, not across.',
  rows: [
    { label: 'Cost / follower', value: 0.16, client: 'BPI Sports · TikTok', tone: 'violet' },
    { label: 'Cost / follower', value: 0.22, client: 'Sporcle · TikTok', tone: 'violet' },
    { label: 'Cost / follower', value: 0.37, client: 'Ari Rastegar · TikTok', tone: 'ember' },
    { label: 'Cost / lead', value: 2.14, client: 'Silver Mountain · Meta', tone: 'gold' },
    { label: 'Cost / phone call', value: 10.78, client: 'Xtreme Wireless · Google', tone: 'cyan' },
  ],
}

export const CASES = [
  {
    client: 'Ari Rastegar',
    channel: 'TikTok · 2 months',
    title: '152,405 followers for a real-estate executive brand',
    body: 'A trend-driven follower growth campaign built on engaging content and active community engagement. 5.49M impressions, 5.16M video views, at an average $0.37 per follower.',
    highlights: ['5.49M impressions', '5.16M video views', '$0.37 per follower'],
    stats: [
      ['$0.37', 'avg cost / follow'],
      ['$10.28', 'avg CPM'],
    ],
    chart: {
      kind: 'scale',
      caption: 'Reach to follower conversion',
      series: [
        { label: 'Impressions', value: 5492837, tone: 'muted' },
        { label: 'Video views', value: 5162922, tone: 'muted' },
        { label: 'Followers', value: 152405, tone: 'ember' },
      ],
    },
  },
  {
    client: 'Silver Mountain Finance',
    channel: 'Facebook Lead Gen · 1 month',
    title: '1,846 B2B leads at $2.14 each',
    body: 'Facebook lead generation for business financing. Application form fill-ups, not clicks: 1,846 leads from 230K impressions in a single month, at a $2.14 cost per lead.',
    highlights: ['1,846 leads', '230K impressions', '$2.14 cost per lead'],
    stats: [
      ['$2.14', 'cost / lead'],
      ['123,680', 'reach'],
    ],
    chart: {
      kind: 'funnel',
      caption: 'Impression to application funnel',
      stages: [
        { label: 'Impressions', value: 230194 },
        { label: 'Reach', value: 123680 },
        { label: 'Link clicks', value: 3910 },
        { label: 'Leads', value: 1846 },
      ],
    },
  },
  {
    client: 'Xtreme Wireless',
    channel: 'Google Ads · Boost Mobile retail',
    title: '605 phone calls for a local retailer',
    body: 'High-intent search campaigns for phone sales and repairs. 4,840 clicks produced 605 phone calls and 155 tracked conversions, a 3.2% conversion rate with every phone call costing under $11.',
    highlights: ['4,840 clicks', '605 phone calls', '155 conversions'],
    stats: [
      ['3.2%', 'conversion rate'],
      ['$42', 'cost / conversion'],
      ['$10.78', 'cost / phone call'],
    ],
    chart: {
      kind: 'gauge',
      caption: 'Click quality, two ways',
      rings: [
        { label: 'Calls from clicks', pct: 12.5, detail: '605 of 4,840 clicks', tone: 'ember' },
        { label: 'Tracked conversions', pct: 3.2, detail: '155 of 4,840 clicks', tone: 'cyan' },
      ],
    },
  },
  {
    client: 'Managed Accounts',
    channel: 'Organic Social Growth',
    title: 'Organic reach lifts up to +2,700%',
    body: 'Paid gets the spotlight, but disciplined organic engagement compounds. Reach growth across six accounts under SEG management, from +85.9% to +2,700% against prior periods.',
    highlights: ['6 accounts', '+85.9% floor', '+2,700% peak'],
    stats: [
      ['63,907', 'FB reach (peak account)'],
      ['+120.9%', 'IG reach'],
    ],
    chart: {
      kind: 'ladder',
      caption: 'Reach growth vs prior period, six accounts',
      note: 'Log scale',
      rows: [
        { label: 'Account A', value: 85.9 },
        { label: 'Account B', value: 98.6 },
        { label: 'Account C', value: 120.9 },
        { label: 'Account D', value: 249.8 },
        { label: 'Account E', value: 680.9 },
        { label: 'Account F', value: 2700 },
      ],
    },
  },
]

/* How an account actually gets run — drawn from the About narrative */
export const PROCESS = [
  {
    step: 'Audit',
    title: 'Read the account, not the pitch',
    body: 'Search terms, negative keywords, broad match bleed, audience overlap. I find where the money is leaving before anyone talks about budget.',
    marker: 'Week 1',
  },
  {
    step: 'Instrument',
    title: 'Fix measurement first',
    body: 'Conversion tracking, pixel hygiene, call tracking, form events. If a lead cannot be counted, it cannot be optimized toward.',
    marker: 'Week 1–2',
  },
  {
    step: 'Scale',
    title: 'Feed only what is proven',
    body: 'Budget moves toward the campaigns, keywords, and creatives with a measured cost per lead. Recovered waste funds the growth.',
    marker: 'Week 3+',
  },
  {
    step: 'Compound',
    title: 'Creative is targeting',
    body: 'Continuous creative testing and retargeting keeps cost per outcome falling while volume rises. Organic engagement compounds underneath it.',
    marker: 'Ongoing',
  },
]

export const PLAYBOOKS = [
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

export const FRAMEWORKS = [
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

export const CREATIVE = [
  ['Promotional Graphic', 'Hotspot high-speed data campaign', 'A behavior-targeted promotional graphic built on immediacy and value incentives ("When You Switch"), designed to convert comparison shoppers at the moment of decision.'],
  ['Seasonal Engine', 'Scary Treats & holiday touchpoints', 'Milestone-driven creative systems for Christmas, New Year, and localized viral holidays like National Fritters Day, keeping brands present when audiences are most engaged.'],
  ['Organic Lead Magnet', 'Floral business activation guide', 'Educational carousel content ("Ideas to easily promote your floral business") engineered for high share-and-save rates, turning helpfulness into reach.'],
  ['Thought Leadership', 'Founder story & brand advocacy series', 'Clean, minimalist quote layouts and executive positioning blocks, bringing back the "social" in "social media" through high-authority personal storytelling.'],
]

export const CLIENTS = [
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

/* ==========================================================================
   MFC LAW — ORGANIC SEARCH SHOWCASE
   Source: MFC_Law_organic_search_report_July2026.pptx (Google Search Console,
   last 3 months through 27 Jul 2026). Figures transcribed from the report.
   ========================================================================== */

export const MFC = {
  eyebrow: 'Monthly report · mfclaw.com',
  channel: 'Organic Google Search',
  title: 'How Rhode Island is finding your firm on Google',
  lede: 'A quarter of organic search work for a Providence personal-injury firm. Every metric moved the right way, and the wins are on searches strangers type, not just the firm name.',
  period: 'Last 3 months · through Jul 27, 2026',

  kpis: [
    { label: 'Visits from search', value: 202, from: '114', delta: '+77%', tone: 'ember' },
    { label: 'Times shown', value: 134960, display: '135K', from: '113K', delta: '+19%', tone: 'gold' },
    { label: 'Click rate', value: 0.15, display: '0.15%', from: '0.10%', delta: '+48%', tone: 'cyan' },
    { label: 'Average position', value: 24.7, display: '24.7', from: '28.3', delta: '↑ 3.6', tone: 'violet', note: 'lower is better' },
  ],

  trend: {
    caption: 'Three months, one direction',
    note: 'July measured to the 27th',
    months: ['May', 'June', 'July'],
    series: [
      { key: 'Visits', values: [114, 159, 202], fmt: (v) => v.toLocaleString('en-US'), tone: 'ember' },
      { key: 'Times shown', values: [113077, 109927, 134960], fmt: (v) => `${Math.round(v / 1000)}K`, tone: 'gold' },
      { key: 'Click rate', values: [0.101, 0.145, 0.15], fmt: (v) => `${v}%`, tone: 'cyan' },
      { key: 'Avg. position', values: [28.3, 25.7, 24.7], fmt: (v) => `${v}`, tone: 'violet', invert: true },
    ],
    takeaway:
      'More people are seeing the firm, a larger share of them are clicking, and the site sits higher on the page than it did in May. Those three compound.',
  },

  showcase: {
    tag: 'Showcase · Hit-and-run',
    title: 'Page one for Rhode Island hit-and-run, and first law firm in this search',
    body: 'For "RI hit and run accidents," mfclaw.com came back as the first law-firm result, ahead of every competing firm on the page. Across the quarter the page averages position 7.71.',
    stats: [
      ['29', 'visits from hit-and-run searches'],
      ['1.67%', 'click rate — 12× the site-wide average'],
      ['7.71', 'average position across the quarter'],
    ],
    image: '/serp-mfc.png',
    imageAlt:
      'Google result for mfclaw.com titled "Hit-and-Run Accident in Rhode Island: What to Do | MFC Law"',
    competitorsImage: '/serp-competitors.png',
    competitorsAlt:
      'The three competing law firm results listed below MFC Law on the same Google page',
    ranking: [
      { pos: 1, name: 'MFC Law', us: true },
      { pos: 2, name: 'Marin & Murphy' },
      { pos: 3, name: 'Gemma Law' },
      { pos: 4, name: 'Louis Grande' },
    ],
    snippet:
      'Leaving the scene of a crash involving injury is a felony in Rhode Island, punishable by up to five years in prison, fines, and license revocation.',
    snippetNote:
      'That is the exact answer to the top question Google lists for this search, which is why the page earns clicks well above the site average.',
    disclaimer:
      'Screenshots: one search on Jul 29, 2026. Google personalises results by location and history, so a Rhode Island searcher may see a different order.',
  },

  pages: {
    caption: 'The pages doing the work',
    note: 'visits from Google search, last 3 months',
    rows: [
      { label: 'Homepage', value: 195 },
      { label: 'Guide: Personal Injury Protection in MA', value: 63 },
      { label: 'Guide: MA Tort Threshold Rules', value: 47 },
      { label: 'RI Hit-and-Run Accidents', value: 29 },
      { label: 'Guide: Insurance Bad Faith in RI', value: 9 },
    ],
  },

  reach: {
    headline: '114',
    headlineLabel: 'non-branded searches ranking in the top 10',
    body: 'Not just the firm name. These are searches strangers type, grouped by the kind of case they describe.',
    groups: [
      {
        name: 'Injury & premises',
        terms: [
          ['personal injury attorney', 1.3, 1752],
          ['injury lawyer', 1.1, 640],
          ['providence dog bite injury attorney', 9.4, 432],
          ['providence pedestrian accident attorney', 7.9, 391],
        ],
      },
      {
        name: 'Car accidents',
        terms: [
          ['car accident lawyer', 10.0, 1423],
          ['car accident attorney', 6.9, 871],
          ['cranston car accident attorneys', 7.1, 631],
          ['hit and run rhode island', 3.1, 46],
        ],
      },
      {
        name: 'Rideshare',
        terms: [
          ['uber & lyft accident lawyer', 10.0, 1450],
          ['lyft accident lawyer near me', 9.9, 1397],
          ['rideshare accident lawyer near me', 9.8, 1162],
        ],
      },
      {
        name: 'Product liability',
        terms: [
          ['product liability attorney', 9.3, 1187],
          ['providence product liability attorney', 7.0, 1016],
          ['product liability lawyer', 9.6, 1009],
          ['product liability law firm', 7.0, 454],
        ],
      },
    ],
    note: 'Most sit at the bottom of page one (positions 7–10), which is why they are not earning clicks yet.',
  },

  opportunity: {
    caption: 'Where the next wins are',
    body: 'Seen tens of thousands of times, but ranked on page 2–4, so the clicks go elsewhere. Moving these up is the biggest lever.',
    rows: [
      { term: 'providence car accident lawyer', shown: 16700, rank: 'page 4', page: 4 },
      { term: 'rhode island motorcycle accident lawyer', shown: 16200, rank: 'page 4', page: 4 },
      { term: 'warwick slip and fall lawyer', shown: 12560, rank: 'page 3', page: 3 },
      { term: 'providence Uber & Lyft accident lawyer', shown: 12040, rank: 'page 2', page: 2 },
    ],
  },

  reputation: [
    ['michael campopiano', '#1', '25 visits'],
    ['law offices of michael f. campopiano', '#1', 'branded'],
    ['campopiano law offices', '#2', 'branded'],
    ['hit and run rhode island', '#3', 'non-branded win'],
  ],

  plan: [
    ['Push page-2 pages to page 1', 'Car-accident, motorcycle and rideshare pages already getting seen.'],
    ['Keep publishing guides', 'The PIP and tort-threshold posts prove educational content earns visits.'],
    ['Strengthen city pages', 'Providence, Warwick and Pawtucket: high-intent, local searches.'],
    ['Protect the #1 rankings', 'Keep the firm name and hit-and-run searches locked at the top.'],
  ],

  source: 'Google Search Console · reported to the client, July 2026',
}
