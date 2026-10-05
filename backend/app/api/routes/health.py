from fastapi import APIRouter

router = APIRouter(tags=["system"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ip-sakti-sahayak"}


@router.get("/meta")
def meta() -> dict:
    return {
        "problem_statement": "SIH26045",
        "team": "JanSetu",
        "capabilities": [
            "jurisdiction separation",
            "formulation classification",
            "source-cited retrieval",
            "confidence and abstention",
            "human escalation",
            "multilingual and voice integration boundary",
        ],
        "disclaimer": "Information, not legal advice.",
    }
