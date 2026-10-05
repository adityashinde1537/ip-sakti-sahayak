# Architecture

## Design goals

The architecture follows the SIH26045 problem statement: source-cited retrieval, strict jurisdiction separation, formulation classification, multilingual delivery, confidence/abstention, controlled source access, and a phased path toward a relational knowledge graph and agentic orchestration.

## Request lifecycle

1. **Question + language** enter through the React client.
2. The user selects **India** or **International**.
3. If product details are supplied, the **formulation classifier** chooses a likely route or asks for clarification.
4. The **query router** identifies IP/regulatory topics such as patents, GI, trademarks, ABS, TKDL or market access.
5. The **retriever** searches only source records allowed for the selected jurisdiction.
6. The answer service calculates **confidence** from retrieved evidence and classification certainty.
7. If grounding is weak, the service **abstains** and recommends escalation.
8. Otherwise the system returns guidance plus **mandatory citations**.

## Components

### Frontend
- React + Vite
- responsive interface
- multilingual-ready input
- jurisdiction toggle
- confidence and citations display
- Bhashini-ready voice integration point

### Backend
- Python + FastAPI
- REST API
- classification and routing
- retrieval orchestration
- guardrails

### Knowledge layer
Production target:
- PostgreSQL + pgvector
- immutable source/version metadata
- citation locators
- audit events
- access-consent records

The repository currently ships a JSON-backed source registry so the MVP runs before a production corpus is ingested.

### RAG boundary
The current MVP deliberately stops short of generating detailed legal claims from incomplete source summaries. A production generator should receive only retrieved, version-tracked source chunks and must be constrained to cite those chunks.

## Jurisdiction isolation

Jurisdiction is a first-class request field, not a prompt hint. Retrieval filters source records before answer generation. This prevents Indian national requirements from being silently mixed with treaty-level or foreign-market guidance.

## Confidence and abstention

Confidence combines retrieval relevance and, when applicable, formulation-classification confidence. The threshold is configurable with `MIN_CONFIDENCE`.

The system abstains when:
- no supporting source is retrieved;
- confidence is below threshold;
- the query needs facts that the current corpus does not contain.

## Future extensions

- hybrid sparse + dense retrieval
- embedding model evaluation
- relational knowledge graph
- agentic multi-source orchestration
- Bhashini STT/TTS
- authenticated paid-source connectors with logged consent
- facilitator directory and escalation workflow
