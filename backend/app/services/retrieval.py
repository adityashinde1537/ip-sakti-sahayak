import json
import re
from functools import lru_cache
from pathlib import Path

from app.models.schemas import Jurisdiction, SourceCitation, SourceRecord

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "source_catalog.json"
STOP = {"the", "a", "an", "and", "or", "to", "of", "in", "for", "on", "is", "are", "with", "how", "what", "my", "i"}


def _tokens(text: str) -> set[str]:
    return {t for t in re.findall(r"[a-z0-9-]+", text.lower()) if len(t) > 2 and t not in STOP}


@lru_cache
def get_source_catalog() -> list[SourceRecord]:
    raw = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    return [SourceRecord(**item) for item in raw]


def retrieve(question: str, jurisdiction: Jurisdiction, routes: list[str], limit: int = 5) -> list[SourceCitation]:
    q_tokens = _tokens(" ".join([question, *routes]))
    scored: list[tuple[float, SourceRecord]] = []

    for source in get_source_catalog():
        source_j = source.jurisdiction.lower()
        if jurisdiction == Jurisdiction.INDIA and source_j not in {"india", "both"}:
            continue
        if jurisdiction == Jurisdiction.INTERNATIONAL and source_j not in {"international", "both"}:
            continue

        haystack = " ".join([source.title, source.authority, source.summary, *source.topics])
        s_tokens = _tokens(haystack)
        overlap = len(q_tokens & s_tokens)
        topic_bonus = sum(1 for route in routes if any(token in source.topics for token in _tokens(route)))
        score = overlap / max(5, len(q_tokens)) + 0.12 * topic_bonus
        if score > 0:
            scored.append((score, source))

    scored.sort(key=lambda item: item[0], reverse=True)
    citations = []
    for score, source in scored[:limit]:
        citations.append(SourceCitation(
            source_id=source.id,
            title=source.title,
            authority=source.authority,
            jurisdiction=source.jurisdiction,
            summary=source.summary,
            url=source.url,
            version_note=source.version_note,
            retrieval_score=round(min(score, 1.0), 3),
        ))
    return citations
