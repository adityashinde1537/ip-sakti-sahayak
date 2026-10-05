import { useMemo, useState } from 'react'
import { BookOpenCheck, Globe2, Landmark, Mic, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { askAssistant } from './api'

const examples = [
  'How should I begin checking IP protection for a new Ayurvedic formulation?',
  'Which official sources should I review for traditional knowledge and prior art?',
  'I use biological resources. Where should I start for ABS-related guidance?',
]

function App() {
  const [jurisdiction, setJurisdiction] = useState('india')
  const [language, setLanguage] = useState('en')
  const [question, setQuestion] = useState(examples[0])
  const [formulation, setFormulation] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const confidenceLabel = useMemo(() => {
    if (!result) return ''
    if (result.confidence >= 0.7) return 'High'
    if (result.confidence >= 0.5) return 'Moderate'
    return 'Low'
  }, [result])

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await askAssistant({
        question,
        jurisdiction,
        language,
        formulation_description: formulation || null,
      })
      setResult(data)
    } catch (err) {
      setError('Could not reach the API. Start the FastAPI backend on port 8000 and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">IP</div>
          <div>
            <strong>IP-SAKTI Sahayak</strong>
            <span>JanSetu · SIH26045</span>
          </div>
        </div>
        <div className="topbar-note"><ShieldCheck size={16} /> Source-cited · Confidence-aware</div>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow"><Sparkles size={15} /> Ayurveda IP + Regulation + ABS</div>
          <h1>Traceable guidance for responsible Ayurvedic innovation.</h1>
          <p>Ask in simple language, choose the jurisdiction, classify the formulation, and retrieve authoritative source leads without mixing Indian and international regimes.</p>
          <div className="hero-pills">
            <span><BookOpenCheck size={15}/> Mandatory citations</span>
            <span><Globe2 size={15}/> Jurisdiction separation</span>
            <span><ShieldCheck size={15}/> Safe abstention</span>
          </div>
        </section>

        <section className="workspace">
          <form className="query-card" onSubmit={submit}>
            <div className="section-title">1. Choose jurisdiction</div>
            <div className="jurisdiction-grid">
              <button type="button" className={jurisdiction === 'india' ? 'jurisdiction active' : 'jurisdiction'} onClick={() => setJurisdiction('india')}>
                <Landmark size={20}/><span><strong>India</strong><small>National IP, ABS & product routes</small></span>
              </button>
              <button type="button" className={jurisdiction === 'international' ? 'jurisdiction active' : 'jurisdiction'} onClick={() => setJurisdiction('international')}>
                <Globe2 size={20}/><span><strong>International</strong><small>Treaties & filing systems</small></span>
              </button>
            </div>

            <div className="field-row">
              <label>Language
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="hi">Hindi (integration-ready)</option>
                  <option value="mr">Marathi (integration-ready)</option>
                  <option value="bn">Bengali (integration-ready)</option>
                </select>
              </label>
              <div className="voice-placeholder"><Mic size={17}/> Bhashini-ready voice</div>
            </div>

            <label className="field">2. Your question
              <textarea rows="5" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about IP, regulation, prior art, ABS or market access..." />
            </label>

            <label className="field">3. Formulation details <span className="optional">optional but recommended</span>
              <textarea rows="3" value={formulation} onChange={(e) => setFormulation(e.target.value)} placeholder="Example: newly developed herbal formulation, not copied from a classical text" />
            </label>

            <div className="examples">
              {examples.map((item) => <button key={item} type="button" onClick={() => setQuestion(item)}>{item}</button>)}
            </div>

            <button className="primary" disabled={loading || question.trim().length < 3}>
              <Search size={18}/>{loading ? 'Checking sources…' : 'Get cited guidance'}
            </button>
            {error && <p className="error">{error}</p>}
          </form>

          <aside className="answer-card">
            {!result ? (
              <div className="empty-state">
                <div className="empty-icon"><BookOpenCheck size={28}/></div>
                <h2>Your answer will stay traceable.</h2>
                <p>The assistant shows jurisdiction, route, formulation status, citations, confidence and whether human escalation is recommended.</p>
              </div>
            ) : (
              <>
                <div className="answer-header">
                  <div>
                    <span className="kicker">{result.jurisdiction.toUpperCase()}</span>
                    <h2>{result.abstained ? 'More evidence needed' : 'Grounded guidance'}</h2>
                  </div>
                  <div className={`confidence ${confidenceLabel.toLowerCase()}`}>
                    <strong>{Math.round(result.confidence * 100)}%</strong>
                    <span>{confidenceLabel} confidence</span>
                  </div>
                </div>

                <p className="answer-text">{result.answer}</p>

                {result.formulation && (
                  <div className="info-box">
                    <span>Formulation route</span>
                    <strong>{result.formulation.label}</strong>
                    <small>Classifier confidence: {Math.round(result.formulation.confidence * 100)}%</small>
                  </div>
                )}

                <div className="route-list">
                  <span>Query routes</span>
                  <div>{result.routes.map((route) => <b key={route}>{route}</b>)}</div>
                </div>

                <div className="citations">
                  <h3>Authoritative source leads</h3>
                  {result.citations.length === 0 && <p>No grounded sources retrieved.</p>}
                  {result.citations.map((source, index) => (
                    <article key={source.source_id}>
                      <div className="cite-number">{index + 1}</div>
                      <div>
                        <strong>{source.title}</strong>
                        <span>{source.authority} · {source.jurisdiction}</span>
                        <p>{source.summary}</p>
                        {source.url && <a href={source.url} target="_blank" rel="noreferrer">Open official source ↗</a>}
                      </div>
                    </article>
                  ))}
                </div>

                {result.needs_human && <div className="human-box"><ShieldCheck size={18}/><div><strong>Human review recommended</strong><span>{result.escalation_message || 'Confirm material filing or compliance decisions with a qualified facilitator.'}</span></div></div>}
                <div className="disclaimer">{result.disclaimer}</div>
              </>
            )}
          </aside>
        </section>
      </main>

      <footer>Built for Smart India Hackathon 2026 · Team JanSetu · Information, not legal advice.</footer>
    </div>
  )
}

export default App
