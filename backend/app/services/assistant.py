from app.core.config import get_settings
from app.models.schemas import ChatRequest, ChatResponse
from app.services.classifier import classify_formulation
from app.services.guardrails import compute_confidence, should_abstain
from app.services.retrieval import retrieve
from app.services.routing import route_topics

settings = get_settings()


def _next_steps(routes: list[str], formulation, jurisdiction: str) -> list[str]:
    steps: list[str] = []

    if formulation:
        if formulation.label == "Needs clarification":
            steps.append("Clarify the formulation category before relying on a product-regulatory route.")
        else:
            steps.append(
                f'Record the working formulation class as "{formulation.label}" and verify it against the applicable official product-regulatory source.'
            )
    else:
        steps.append("Add formulation details if product classification affects the question.")

    if "patents" in routes:
        steps.append(
            "Begin with official prior-art and registry searches; include TKDL where traditional-knowledge prior art may be relevant."
        )

    if "ABS / biodiversity" in routes:
        if jurisdiction == "india":
            steps.append(
                "Review National Biodiversity Authority source material for the relevant biological-resource / ABS pathway."
            )
        else:
            steps.append(
                "Review the treaty-level CBD / Nagoya framework, then check national implementation for the intended market."
            )

    if "traditional knowledge / TKDL" in routes:
        steps.append(
            "Use TKDL and other official prior-art sources to check whether the knowledge is already documented."
        )

    if "market access / product regulation" in routes:
        steps.append(
            "Separate the IP question from product-classification and market-access questions, then verify each against its own official source."
        )

    if jurisdiction == "international" and "patents" in routes:
        steps.append(
            "Use the appropriate official international filing-system sources, then verify requirements for each intended market."
        )

    steps.append(
        "Save the exact source/version used and escalate material filing or compliance decisions to a qualified IP/regulatory facilitator."
    )

    return list(dict.fromkeys(steps))[:5]


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
        escalation = (
            "Escalate to a qualified IP/regulatory facilitator when the question affects a filing, "
            "compliance decision, or commercial launch."
        )
    else:
        route_text = ", ".join(routes)
        formulation_text = (
            f" The formulation classifier currently indicates: {formulation.label}." if formulation else ""
        )
        answer = (
            f"This {payload.jurisdiction.value} query is being routed to: {route_text}."
            f"{formulation_text} "
            "The prototype has retrieved the authoritative source leads listed below and built a safe research path. "
            "It intentionally avoids inventing statutory requirements that are not present in the curated corpus."
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
        next_steps=_next_steps(routes, formulation, payload.jurisdiction.value),
        prototype_mode=False,
    )
