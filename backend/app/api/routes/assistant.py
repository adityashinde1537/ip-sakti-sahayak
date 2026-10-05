from fastapi import APIRouter

from app.models.schemas import (
    ChatRequest,
    ChatResponse,
    ClassificationRequest,
    ClassificationResponse,
)
from app.services.assistant import answer_question
from app.services.classifier import classify_formulation

router = APIRouter(tags=["assistant"])


@router.post("/classify", response_model=ClassificationResponse)
def classify(payload: ClassificationRequest) -> ClassificationResponse:
    return classify_formulation(payload.description)


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    return answer_question(payload)
