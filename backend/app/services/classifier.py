import re

from app.models.schemas import ClassificationResponse, FormulationCategory


LABELS = {
    FormulationCategory.CLASSICAL_GENERIC: "Classical / generic Ayurvedic medicine",
    FormulationCategory.PATENT_PROPRIETARY: "Patent or proprietary Ayurvedic medicine",
    FormulationCategory.NEW_NON_CLASSICAL: "New / non-classical Ayurvedic drug",
    FormulationCategory.PHYTOPHARMACEUTICAL: "Phytopharmaceutical",
    FormulationCategory.AYURVEDA_AAHAR_NUTRACEUTICAL: "Ayurveda-Aahar / nutraceutical",
    FormulationCategory.COSMETIC: "Cosmetic",
    FormulationCategory.UNCERTAIN: "Needs clarification",
}

PATTERNS: list[tuple[FormulationCategory, tuple[str, ...]]] = [
    (FormulationCategory.CLASSICAL_GENERIC, ("classical", "first schedule", "authoritative text", "traditional formulation")),
    (FormulationCategory.PATENT_PROPRIETARY, ("proprietary", "patent medicine", "proprietary medicine")),
    (FormulationCategory.NEW_NON_CLASSICAL, ("new drug", "new formulation", "non-classical", "novel formulation", "newly developed")),
    (FormulationCategory.PHYTOPHARMACEUTICAL, ("phytopharmaceutical", "standardized botanical", "standardised botanical")),
    (FormulationCategory.AYURVEDA_AAHAR_NUTRACEUTICAL, ("ayurveda aahar", "ayurveda-aahar", "nutraceutical", "functional food", "food supplement")),
    (FormulationCategory.COSMETIC, ("cosmetic", "skin care", "skincare", "hair care", "personal care")),
]


def classify_formulation(description: str) -> ClassificationResponse:
    text = re.sub(r"\s+", " ", description.strip().lower())
    explicit_new = [cue for cue in ("newly developed", "new formulation", "novel formulation", "new drug", "non-classical") if cue in text]
    if explicit_new:
        return ClassificationResponse(
            category=FormulationCategory.NEW_NON_CLASSICAL,
            label=LABELS[FormulationCategory.NEW_NON_CLASSICAL],
            confidence=round(min(0.95, 0.78 + 0.04 * len(explicit_new)), 2),
            reasons=[f"Matched description cue: {item}" for item in explicit_new],
            clarifying_questions=[],
        )

    matches: list[tuple[FormulationCategory, list[str]]] = []
    negated_classical = bool(re.search(r"\b(?:not|isn't|is not|without)\b.{0,35}\b(?:classical|authoritative text|first schedule)\b", text))

    for category, keywords in PATTERNS:
        hit = [keyword for keyword in keywords if keyword in text]
        if category == FormulationCategory.CLASSICAL_GENERIC and negated_classical:
            hit = []
        if hit:
            matches.append((category, hit))

    if len(matches) == 1:
        category, hit = matches[0]
        confidence = min(0.95, 0.72 + 0.06 * len(hit))
        return ClassificationResponse(
            category=category,
            label=LABELS[category],
            confidence=round(confidence, 2),
            reasons=[f"Matched description cue: {item}" for item in hit],
            clarifying_questions=[],
        )

    if len(matches) > 1:
        return ClassificationResponse(
            category=FormulationCategory.UNCERTAIN,
            label=LABELS[FormulationCategory.UNCERTAIN],
            confidence=0.35,
            reasons=["The description contains signals for more than one formulation route."],
            clarifying_questions=_clarifying_questions(),
        )

    return ClassificationResponse(
        category=FormulationCategory.UNCERTAIN,
        label=LABELS[FormulationCategory.UNCERTAIN],
        confidence=0.2,
        reasons=["The description does not contain enough information for a safe classification."],
        clarifying_questions=_clarifying_questions(),
    )


def _clarifying_questions() -> list[str]:
    return [
        "Is the formulation and method drawn from a First-Schedule authoritative Ayurvedic text?",
        "Is it a newly developed or non-classical formulation?",
        "Is the intended product route medicinal, phytopharmaceutical, food/nutraceutical, or cosmetic?",
        "Are you adapting traditional knowledge or introducing a genuinely new technical feature?",
    ]
