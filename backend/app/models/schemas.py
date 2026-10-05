from enum import Enum
from pydantic import BaseModel, Field


class Jurisdiction(str, Enum):
    INDIA = "india"
    INTERNATIONAL = "international"


class FormulationCategory(str, Enum):
    CLASSICAL_GENERIC = "classical_generic"
    PATENT_PROPRIETARY = "patent_proprietary"
    NEW_NON_CLASSICAL = "new_non_classical"
    PHYTOPHARMACEUTICAL = "phytopharmaceutical"
    AYURVEDA_AAHAR_NUTRACEUTICAL = "ayurveda_aahar_nutraceutical"
    COSMETIC = "cosmetic"
    UNCERTAIN = "uncertain"


class SourceCitation(BaseModel):
    source_id: str
    title: str
    authority: str
    jurisdiction: str
    summary: str
    url: str | None = None
    version_note: str | None = None
    retrieval_score: float = 0.0


class ClassificationRequest(BaseModel):
    description: str = Field(min_length=2, max_length=4000)


class ClassificationResponse(BaseModel):
    category: FormulationCategory
    label: str
    confidence: float
    reasons: list[str]
    clarifying_questions: list[str]


class ChatRequest(BaseModel):
    question: str = Field(min_length=3, max_length=6000)
    jurisdiction: Jurisdiction
    language: str = Field(default="en", max_length=20)
    formulation_description: str | None = Field(default=None, max_length=4000)


class ChatResponse(BaseModel):
    answer: str
    jurisdiction: Jurisdiction
    formulation: ClassificationResponse | None = None
    routes: list[str]
    citations: list[SourceCitation]
    confidence: float
    abstained: bool
    needs_human: bool
    escalation_message: str | None = None
    next_steps: list[str] = []
    prototype_mode: bool = False
    disclaimer: str = "Information, not legal advice."


class SourceRecord(BaseModel):
    id: str
    title: str
    authority: str
    jurisdiction: str
    topics: list[str]
    summary: str
    url: str | None = None
    version_note: str | None = None
