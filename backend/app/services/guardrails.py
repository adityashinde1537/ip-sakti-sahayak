from app.models.schemas import ClassificationResponse, SourceCitation


def compute_confidence(citations: list[SourceCitation], formulation: ClassificationResponse | None) -> float:
    if not citations:
        return 0.0
    retrieval = sum(c.retrieval_score for c in citations[:3]) / min(3, len(citations))
    formulation_factor = 1.0
    if formulation is not None:
        formulation_factor = 0.65 + 0.35 * formulation.confidence
    return round(max(0.0, min(0.98, retrieval * formulation_factor + 0.15)), 2)


def should_abstain(confidence: float, citation_count: int, threshold: float) -> bool:
    return citation_count == 0 or confidence < threshold
