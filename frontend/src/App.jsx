import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Globe2,
  Landmark,
  LibraryBig,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react'
import { askAssistant, getSources } from './api'

const scenarios = [
  {
    title: 'New Ayurvedic formulation',
    subtitle: 'IP + product route',
    jurisdiction: 'india',
    question: 'How should I begin checking patent protection and prior art for a newly developed Ayurvedic formulation?',
    formulation: 'A newly developed herbal formulation that is not copied from a classical Ayurvedic text.',
  },
  {
    title: 'Traditional knowledge check',
    subtitle: 'TKDL + prior art',
    jurisdiction: 'india',
    question: 'Which official sources should I review for traditional knowledge and prior art before claiming an Ayurvedic innovation?',
    formulation: 'A formulation based partly on traditional Ayurvedic knowledge.',
  },
  {
    title: 'Biological resources',
    subtitle: 'ABS + biodiversity',
    jurisdiction: 'india',
    question: 'I use biological resources in an Ayurvedic product. Where should I start for ABS-related guidance?',
    formulation: 'A proprietary Ayurvedic product using plant-based biological resources.',
  },
  {
    title: 'International filing',
    subtitle: 'PCT + treaty view',
    jurisdiction: 'international',
    question: 'What official international source families should I check when planning patent protection across multiple countries?',
    formulation: 'A newly developed Ayurvedic formulation intended for international markets.',
  },
]

function App() {
  const [activeView, setActiveView] = useState('assistant')
  const [jurisdiction, setJurisdiction] = useState('india')
  const [language, setLanguage] = useState('en')
  const [question, setQuestion] = useState(scenarios[0].question)
  const [formulation, setFormulation] = useState(scenarios[0].formulation)
  const [result, setResult] = useState(null)
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)
  const [sourceLoading, setSourceLoading] = useState(true)

  useEffect(() => {
    getSources()
      .then((items) => setSources(items))
      .finally(() => setSourceLoading(false))
  }, [])

  const confidenceLabel = useMemo(() => {
    if (!result) return ''
    if (result.confidence >= 0.7) return 'High'
    if (result.confidence >= 0.5) return 'Moderate'
    return 'Low'
  }, [result])

  const filteredSources = useMemo(() => {
    const label = jurisdiction === 'india' ? 'India' : 'International'
    return sources.filter((source) => source.jurisdiction === label)
  }, [sources, jurisdiction])

  function chooseScenario(item) {
    setJurisdiction(item.jurisdiction)
    setQuestion(item.question)
    setFormulation(item.formulation)
    setActiveView('assistant')
    setResult(null)
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    const data = await askAssistant({
      question,
      jurisdiction,
      language,
      formulation_description: formulation || null,
    })
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand brand-button" onClick={() => setActiveView('assistant')}>
          <div className="brand-mark">IP</div>
          <div>
            <strong>IP-SAKTI Sahayak</strong>
            <span>JanSetu · SIH26045</span>
          </div>
        </button>

        <nav className="nav-tabs">
          <button className={activeView === 'assistant' ? 'nav-tab active' : 'nav-tab'} onClick={() => setActiveView('assistant')}>Assistant</button>
          <button className={activeView === 'sources' ? 'nav-tab active' : 'nav-tab'} onClick={() => setActiveView('sources')}>Source Library</button>
          <button className={activeView === 'how' ? 'nav-tab active' : 'nav-tab'} onClick={() => setActiveView('how')}>How it works</button>
        </nav>

        <div className="topbar-note"><ShieldCheck size={16} /> Information, not legal advice</div>
      </header>

      <main>
        {activeView === 'assistant' && (
          <>
            <section className="hero prototype-hero">
              <div>
                <div className="eyebrow"><Sparkles size={15} /> Smart India Hackathon 2026 prototype</div>
                <h1>Ayurveda IP guidance you can trace back to sources.</h1>
                <p>Choose a jurisdiction, describe the formulation, ask the IP or regulatory question, and follow a source-backed research path with confidence and safe escalation.</p>
              </div>
              <div className="prototype-badge">
                <span>PROTOTYPE</span>
                <strong>Source-cited RAG flow</strong>
                <small>React · FastAPI · pgvector-ready · Bhashini-ready</small>
              </div>
            </section>

            <section className="scenario-strip">
              {scenarios.map((item) => (
                <button key={item.title} className="scenario-card" onClick={() => chooseScenario(item)}>
                  <span>{item.subtitle}</span>
                  <strong>{item.title}</strong>
                  <ArrowRight size={16} />
                </button>
              ))}
            </section>

            <section className="flow-strip" aria-label="Prototype workflow">
              <div><b>1</b><span>User question</span></div>
              <ArrowRight size={15} />
              <div><b>2</b><span>Jurisdiction</span></div>
              <ArrowRight size={15} />
              <div><b>3</b><span>Formulation class</span></div>
              <ArrowRight size={15} />
              <div><b>4</b><span>Official sources</span></div>
              <ArrowRight size={15} />
              <div><b>5</b><span>Cited guidance</span></div>
            </section>

            <section className="workspace">
              <form className="query-card" onSubmit={submit}>
                <div className="card-heading">
                  <div>
                    <span className="step-label">STEP 1</span>
                    <h2>Set the context</h2>
                  </div>
                  <span className="mini-safe"><ShieldCheck size={14}/> Jurisdiction separated</span>
                </div>

                <div className="jurisdiction-grid">
                  <button type="button" className={jurisdiction === 'india' ? 'jurisdiction active' : 'jurisdiction'} onClick={() => setJurisdiction('india')}>
                    <Landmark size={20}/><span><strong>India</strong><small>IP · AYUSH · ABS · product routes</small></span>
                  </button>
                  <button type="button" className={jurisdiction === 'international' ? 'jurisdiction active' : 'jurisdiction'} onClick={() => setJurisdiction('international')}>
                    <Globe2 size={20}/><span><strong>International</strong><small>Treaties · filing systems · market access</small></span>
                  </button>
                </div>

                <div className="field-row">
                  <label>Language
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <option value="en">English</option>
                      <option value="hi">Hindi — Bhashini-ready</option>
                      <option value="mr">Marathi — Bhashini-ready</option>
                      <option value="bn">Bengali — Bhashini-ready</option>
                    </select>
                  </label>
                  <div className="voice-placeholder"><Mic size={17}/> Voice integration boundary</div>
                </div>

                <label className="field">
                  <span className="step-label">STEP 2</span>
                  Ask your question
                  <textarea rows="5" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about patents, GI, trade marks, prior art, ABS or market access…" />
                </label>

                <label className="field">
                  <span className="step-label">STEP 3</span>
                  Describe the formulation
                  <span className="optional">optional, but improves routing</span>
                  <textarea rows="4" value={formulation} onChange={(e) => setFormulation(e.target.value)} placeholder="Example: newly developed herbal formulation, not copied from a classical text" />
                </label>

                <button className="primary" disabled={loading || question.trim().length < 3}>
                  <Search size={18}/>{loading ? 'Retrieving official source leads…' : 'Run IP-SAKTI guidance'}
                </button>

                <p className="form-footnote">The prototype abstains when it cannot retrieve enough grounded evidence.</p>
              </form>

              <aside className="answer-card">
                {!result ? (
                  <div className="empty-state">
                    <div className="empty-icon"><BookOpenCheck size={28}/></div>
                    <h2>Ready for a judge demo.</h2>
                    <p>Choose one of the example scenarios or enter your own question. The result will show classification, IP/regulatory routing, source leads, next steps, confidence and escalation.</p>
                    <div className="empty-checks">
                      <span><CheckCircle2 size={14}/> Mandatory source leads</span>
                      <span><CheckCircle2 size={14}/> Confidence indicator</span>
                      <span><CheckCircle2 size={14}/> Safe abstention</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="answer-header">
                      <div>
                        <span className="kicker">{result.jurisdiction.toUpperCase()} · {result.prototype_mode ? 'DEMO ENGINE' : 'FASTAPI'}</span>
                        <h2>{result.abstained ? 'Human review path' : 'Guidance path generated'}</h2>
                      </div>
                      <div className={`confidence ${confidenceLabel.toLowerCase()}`}>
                        <strong>{Math.round(result.confidence * 100)}%</strong>
                        <span>{confidenceLabel} confidence</span>
                      </div>
                    </div>

                    <p className="answer-text">{result.answer}</p>

                    {result.formulation && (
                      <div className="classification-card">
                        <div className="classification-icon"><FileSearch size={19}/></div>
                        <div>
                          <span>Formulation classification</span>
                          <strong>{result.formulation.label}</strong>
                          <small>{Math.round(result.formulation.confidence * 100)}% classifier confidence</small>
                        </div>
                      </div>
                    )}

                    <div className="route-list">
                      <span>Query routed across</span>
                      <div>{result.routes.map((route) => <b key={route}>{route}</b>)}</div>
                    </div>

                    <section className="next-steps">
                      <h3>Recommended research path</h3>
                      {(result.next_steps || []).map((step, index) => (
                        <div className="next-step" key={step}>
                          <b>{index + 1}</b>
                          <p>{step}</p>
                        </div>
                      ))}
                    </section>

                    <div className="citations">
                      <h3>Official source leads</h3>
                      {result.citations.length === 0 && <p>No grounded sources retrieved.</p>}
                      {result.citations.map((source, index) => (
                        <article key={source.source_id}>
                          <div className="cite-number">{index + 1}</div>
                          <div>
                            <strong>{source.title}</strong>
                            <span>{source.authority} · {source.jurisdiction}</span>
                            <p>{source.summary}</p>
                            {source.url && <a href={source.url} target="_blank" rel="noreferrer">Open official source <ExternalLink size={11}/></a>}
                          </div>
                        </article>
                      ))}
                    </div>

                    {result.needs_human && (
                      <div className="human-box">
                        <UserRoundCheck size={20}/>
                        <div>
                          <strong>Human facilitator recommended</strong>
                          <span>{result.escalation_message || 'Confirm material filing or compliance decisions with a qualified IP/regulatory facilitator.'}</span>
                        </div>
                      </div>
                    )}

                    <div className="disclaimer">{result.disclaimer}</div>
                  </>
                )}
              </aside>
            </section>
          </>
        )}

        {activeView === 'sources' && (
          <section className="page-section">
            <div className="page-title">
              <div className="eyebrow"><LibraryBig size={15}/> Version-tracked corpus design</div>
              <h1>Official source library</h1>
              <p>The prototype starts from the official source families identified in SIH26045. Production ingestion should store exact versions, effective dates and citation locators.</p>
            </div>

            <div className="library-toolbar">
              <button className={jurisdiction === 'india' ? 'filter-button active' : 'filter-button'} onClick={() => setJurisdiction('india')}><Landmark size={16}/> India</button>
              <button className={jurisdiction === 'international' ? 'filter-button active' : 'filter-button'} onClick={() => setJurisdiction('international')}><Globe2 size={16}/> International</button>
              <span>{sourceLoading ? 'Loading…' : `${filteredSources.length} source families`}</span>
            </div>

            <div className="source-grid">
              {filteredSources.map((source) => (
                <article className="source-card" key={source.id || source.source_id}>
                  <div className="source-topline">
                    <span>{source.jurisdiction}</span>
                    <BookOpenCheck size={17}/>
                  </div>
                  <h3>{source.title}</h3>
                  <strong>{source.authority}</strong>
                  <p>{source.summary}</p>
                  {source.url ? <a href={source.url} target="_blank" rel="noreferrer">Official source <ExternalLink size={12}/></a> : <span className="source-note">Exact production URL/version to be ingested</span>}
                </article>
              ))}
            </div>
          </section>
        )}

        {activeView === 'how' && (
          <section className="page-section">
            <div className="page-title">
              <div className="eyebrow"><Sparkles size={15}/> Proposed system flow</div>
              <h1>How the prototype works</h1>
              <p>The implementation follows the SIH26045 technical approach and keeps legal/regulatory uncertainty visible instead of hiding it.</p>
            </div>

            <div className="how-grid">
              {[
                ['01', 'Multilingual question', 'User types a question and selects a language. Bhashini STT/TTS is kept behind a clean integration boundary.'],
                ['02', 'Jurisdiction switch', 'India and International sources are filtered before answer generation, reducing accidental mixing of regimes.'],
                ['03', 'Formulation classification', 'The prototype routes classical, proprietary, new/non-classical, phytopharmaceutical, Ayurveda-Aahar/nutraceutical and cosmetic descriptions.'],
                ['04', 'IP + compliance routing', 'Questions are routed across patents, trade marks, GI, designs, copyright, trade secrets, ABS, TKDL and market-access topics.'],
                ['05', 'Official source retrieval', 'Only curated source families for the selected jurisdiction are returned as citation leads.'],
                ['06', 'Confidence + abstention', 'If evidence is weak, the assistant abstains and recommends a human facilitator rather than fabricating authority.'],
              ].map(([number, title, text]) => (
                <article className="how-card" key={number}>
                  <b>{number}</b>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer>
        <span>Team JanSetu · SIH26045 · MedTech / BioTech / HealthTech</span>
        <span>IP-SAKTI Sahayak provides information, not legal advice.</span>
      </footer>
    </div>
  )
}

export default App
