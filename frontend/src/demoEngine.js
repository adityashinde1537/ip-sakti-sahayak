const SOURCES = [
  {
    source_id: 'ip-india',
    title: 'IP India public databases and registries',
    authority: 'Office of the Controller General of Patents, Designs & Trade Marks',
    jurisdiction: 'India',
    topics: ['patent', 'prior art', 'trademark', 'trade mark', 'design', 'geographical indication', 'gi', 'registry', 'brand'],
    summary: 'Official registry and search source lead for patents, trade marks, designs and GI records.',
    url: 'https://ipindia.gov.in/',
  },
  {
    source_id: 'tkdl',
    title: 'Traditional Knowledge Digital Library (TKDL)',
    authority: 'Traditional Knowledge Digital Library',
    jurisdiction: 'India',
    topics: ['traditional knowledge', 'tkdl', 'prior art', 'classical', 'misappropriation'],
    summary: 'Traditional-knowledge and prior-art source lead highlighted for protecting codified Indian knowledge.',
    url: 'https://www.tkdl.res.in/',
  },
  {
    source_id: 'nba-abs',
    title: 'Biological diversity and Access & Benefit Sharing resources',
    authority: 'National Biodiversity Authority',
    jurisdiction: 'India',
    topics: ['abs', 'biodiversity', 'biological resource', 'benefit sharing', 'genetic resource'],
    summary: 'Official source lead for biodiversity and Access & Benefit Sharing questions.',
    url: 'https://nbaindia.org/',
  },
  {
    source_id: 'india-code-ip',
    title: 'Indian statutes and rules relevant to IP and product regulation',
    authority: 'India Code / Government of India',
    jurisdiction: 'India',
    topics: ['patent', 'copyright', 'design', 'regulation', 'statute', 'rule', 'drug', 'cosmetic', 'food'],
    summary: 'Official statutory source lead for Indian IP and regulatory instruments.',
    url: 'https://www.indiacode.nic.in/',
  },
  {
    source_id: 'ayush-product-regulation',
    title: 'Ayurvedic product classification and drug-regulatory sources',
    authority: 'Government of India / AYUSH regulatory framework',
    jurisdiction: 'India',
    topics: ['classification', 'classical', 'proprietary', 'new drug', 'phytopharmaceutical', 'regulation', 'formulation'],
    summary: 'Source family for identifying the relevant Ayurvedic product route.',
    url: null,
  },
  {
    source_id: 'fssai-ayurveda-aahar',
    title: 'Ayurveda-Aahar / food regulatory sources',
    authority: 'Food Safety and Standards Authority of India',
    jurisdiction: 'India',
    topics: ['food', 'ayurveda-aahar', 'nutraceutical', 'label', 'market access'],
    summary: 'Official source family for Ayurveda-Aahar and related food-route questions.',
    url: null,
  },
  {
    source_id: 'international-trips',
    title: 'TRIPS framework',
    authority: 'International treaty framework',
    jurisdiction: 'International',
    topics: ['trips', 'patent', 'trademark', 'international ip', 'market access'],
    summary: 'International IP framework. Its guidance must remain separate from Indian national requirements.',
    url: null,
  },
  {
    source_id: 'international-cbd-nagoya',
    title: 'Convention on Biological Diversity and Nagoya Protocol',
    authority: 'International biodiversity framework',
    jurisdiction: 'International',
    topics: ['biodiversity', 'abs', 'nagoya', 'genetic resource', 'traditional knowledge'],
    summary: 'International biodiversity and ABS source family.',
    url: null,
  },
  {
    source_id: 'wipo-gratk',
    title: 'WIPO Treaty on IP, Genetic Resources and Associated Traditional Knowledge',
    authority: 'WIPO treaty framework',
    jurisdiction: 'International',
    topics: ['wipo', 'genetic resource', 'traditional knowledge', 'patent', 'disclosure'],
    summary: 'International treaty source lead for genetic resources and associated traditional knowledge.',
    url: null,
  },
  {
    source_id: 'wipo-filing-systems',
    title: 'PCT, Madrid, Hague and Budapest systems',
    authority: 'International filing and treaty systems',
    jurisdiction: 'International',
    topics: ['pct', 'madrid', 'hague', 'budapest', 'patent', 'trademark', 'design', 'international filing'],
    summary: 'International filing-system source family listed in SIH26045.',
    url: null,
  },
]

const ROUTES = [
  ['Patents & prior art', ['patent', 'prior art', 'invent', 'novel', 'pct']],
  ['Trade marks & branding', ['trademark', 'trade mark', 'brand', 'logo', 'madrid']],
  ['Geographical indications', ['geographical indication', 'gi', 'regional name', 'origin']],
  ['Designs', ['design', 'shape', 'packaging appearance', 'hague']],
  ['Copyright', ['copyright', 'manual', 'content', 'artwork']],
  ['Trade secrets', ['trade secret', 'confidential', 'know-how', 'secret formula']],
  ['ABS / biodiversity', ['abs', 'benefit sharing', 'biodiversity', 'biological resource', 'genetic resource', 'nagoya']],
  ['Traditional knowledge / TKDL', ['traditional knowledge', 'tkdl', 'classical', 'misappropriation']],
  ['Product regulation & market access', ['regulation', 'classification', 'food', 'cosmetic', 'drug', 'label', 'market access', 'formulation']],
]

const tokenize = (text) => text.toLowerCase().match(/[a-z0-9-]+/g) || []

function routeTopics(question) {
  const text = question.toLowerCase()
  const routes = ROUTES.filter(([, terms]) => terms.some((term) => text.includes(term))).map(([name]) => name)
  return routes.length ? routes : ['IP & regulatory guidance']
}

function classify(description) {
  if (!description?.trim()) return null
  const text = description.toLowerCase()
  const patterns = [
    ['New / non-classical Ayurvedic drug', ['newly developed', 'new formulation', 'novel formulation', 'non-classical', 'new drug']],
    ['Classical / generic Ayurvedic medicine', ['classical', 'authoritative text', 'first schedule', 'traditional formulation']],
    ['Patent or proprietary Ayurvedic medicine', ['proprietary', 'patent medicine']],
    ['Phytopharmaceutical', ['phytopharmaceutical', 'standardized botanical', 'standardised botanical']],
    ['Ayurveda-Aahar / nutraceutical', ['ayurveda aahar', 'ayurveda-aahar', 'nutraceutical', 'functional food', 'food supplement']],
    ['Cosmetic', ['cosmetic', 'skin care', 'skincare', 'hair care', 'personal care']],
  ]

  if (/(not|is not|isn't).{0,30}(classical|authoritative text|first schedule)/.test(text)) {
    const newHit = ['newly developed', 'new formulation', 'novel formulation', 'non-classical', 'new drug'].filter((term) => text.includes(term))
    if (newHit.length) {
      return {
        category: 'new_non_classical',
        label: 'New / non-classical Ayurvedic drug',
        confidence: 0.86,
        reasons: newHit.map((item) => `Matched description cue: ${item}`),
        clarifying_questions: [],
      }
    }
  }

  const matches = patterns
    .map(([label, terms]) => [label, terms.filter((term) => text.includes(term))])
    .filter(([, hits]) => hits.length)

  if (matches.length === 1) {
    const [label, hits] = matches[0]
    return {
      category: label.toLowerCase().replace(/[^a-z]+/g, '_'),
      label,
      confidence: Math.min(0.94, 0.74 + hits.length * 0.06),
      reasons: hits.map((item) => `Matched description cue: ${item}`),
      clarifying_questions: [],
    }
  }

  return {
    category: 'uncertain',
    label: 'Needs clarification',
    confidence: 0.28,
    reasons: ['The description is not specific enough for a safe classification.'],
    clarifying_questions: [
      'Is the formulation drawn from an authoritative classical Ayurvedic text?',
      'Is it newly developed or non-classical?',
      'Is the intended route medicinal, phytopharmaceutical, food/nutraceutical or cosmetic?',
    ],
  }
}

function retrieve(question, jurisdiction, routes) {
  const terms = new Set(tokenize(`${question} ${routes.join(' ')}`))
  return SOURCES
    .filter((source) => source.jurisdiction.toLowerCase() === jurisdiction)
    .map((source) => {
      const haystack = tokenize(`${source.title} ${source.summary} ${source.topics.join(' ')}`)
      const overlap = haystack.filter((token) => terms.has(token)).length
      return { ...source, retrieval_score: Math.min(1, overlap / Math.max(4, terms.size / 2)) }
    })
    .filter((source) => source.retrieval_score > 0)
    .sort((a, b) => b.retrieval_score - a.retrieval_score)
    .slice(0, 5)
}

function nextSteps(routes, formulation, jurisdiction) {
  const steps = []
  if (formulation) {
    steps.push(
      formulation.label === 'Needs clarification'
        ? 'Clarify the formulation category before relying on a product-regulatory route.'
        : `Record the working formulation class as “${formulation.label}” and verify it against the applicable official product-regulatory source.`,
    )
  } else {
    steps.push('Add formulation details if product classification affects the question.')
  }

  if (routes.some((route) => route.includes('Patents'))) {
    steps.push('Begin with official prior-art and registry searches; include TKDL where traditional-knowledge prior art may be relevant.')
  }
  if (routes.some((route) => route.includes('ABS'))) {
    steps.push(jurisdiction === 'india'
      ? 'Review National Biodiversity Authority source material for the relevant biological-resource / ABS pathway.'
      : 'Review the treaty-level CBD / Nagoya framework, then check the specific national implementation for the target country.')
  }
  if (routes.some((route) => route.includes('Traditional knowledge'))) {
    steps.push('Use TKDL and other official prior-art sources to check whether the knowledge is already documented.')
  }
  if (routes.some((route) => route.includes('Product regulation'))) {
    steps.push('Separate the IP question from the product-classification and market-access question, then verify each against its own official source.')
  }
  if (jurisdiction === 'international' && routes.some((route) => route.includes('Patents'))) {
    steps.push('Use the appropriate official international filing-system sources, then verify requirements for each intended market.')
  }

  steps.push('Save the exact source/version used and escalate material filing or compliance decisions to a qualified IP/regulatory facilitator.')
  return [...new Set(steps)].slice(0, 5)
}

export function runDemoAssistant(payload) {
  const routes = routeTopics(payload.question)
  const formulation = classify(payload.formulation_description)
  const citations = retrieve(payload.question, payload.jurisdiction, routes)
  const classificationFactor = formulation ? 0.72 + formulation.confidence * 0.28 : 1
  const sourceFactor = citations.length ? Math.min(0.82, 0.42 + citations.length * 0.08) : 0
  const confidence = Math.round(sourceFactor * classificationFactor * 100) / 100
  const abstained = citations.length === 0 || confidence < 0.42

  return {
    answer: abstained
      ? 'The prototype does not have enough grounded source coverage for this question. It is abstaining rather than inventing an answer. Refine the question, add formulation details, or route the case to a human facilitator.'
      : `The prototype routed this ${payload.jurisdiction} query to ${routes.join(', ')}. It found the authoritative source leads below and generated a safe research path without inventing legal requirements that are not present in the prototype corpus.`,
    jurisdiction: payload.jurisdiction,
    formulation,
    routes,
    citations,
    confidence,
    abstained,
    needs_human: abstained || confidence < 0.6,
    escalation_message: abstained
      ? 'Human review is recommended before any filing, compliance or commercial-launch decision.'
      : null,
    next_steps: nextSteps(routes, formulation, payload.jurisdiction),
    disclaimer: 'Information, not legal advice.',
    prototype_mode: true,
  }
}

export const demoSources = SOURCES
