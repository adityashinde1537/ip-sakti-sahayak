from app.core.config import get_settings
from app.models.schemas import ChatRequest, ChatResponse
from app.services.classifier import classify_formulation
from app.services.guardrails import compute_confidence, should_abstain
from app.services.retrieval import retrieve
from app.services.routing import route_topics

settings = get_settings()


def answer_question(payload: ChatRequest) -> ChatResponse:
    routes = route_topics(payload.question)
    formulation = None
    if payload.formulation_description:
        formulation = classify_formulation(payload.formulation_description)

    citations = retrieve(payload.question, payload.jurisdiction, routes)
    confidence = compute_confidence(citations, formulation)
    abstained = should_abstain(confidence, len(citations), settings.min_confidence)

    if abstained:
        answer = (
            "I do not have enough grounded evidence in the current curated corpus to give a reliable answer. "
            "The system is designed to abstain rather than invent authority. Review the cited source leads below, "
            "add the missing facts, or escalate the query to an IP facilitator."
        )
        escalation = "Escalate to a qualified IP/regulatory facilitator when the question affects a filing, compliance decision, or commercial launch."
    else:
        route_text = ", ".join(routes)
        formulation_text = (
            f" The formulation classifier currently indicates: {formulation.label}." if formulation else ""
        )
        answer = (
            f"This {payload.jurisdiction.value} query is being routed to: {route_text}."
            f"{formulation_text} "
            "The MVP has retrieved the authoritative source leads listed below. A production answer should be generated only from "
            "the full text of those version-tracked sources and must preserve exact citations. This demo intentionally avoids "
            "inventing statutory requirements that are not present in the curated corpus."
        )
        escalation = None

    return ChatResponse(
        answer=answer,
        jurisdiction=payload.jurisdiction,
        formulation=formulation,
        routes=routes,
        citations=citations,
        confidence=confidence,
        abstained=abstained,
        needs_human=abstained or confidence < 0.6,
        escalation_message=escalation,
    )
