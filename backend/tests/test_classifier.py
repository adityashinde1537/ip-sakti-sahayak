from app.models.schemas import FormulationCategory
from app.services.classifier import classify_formulation


def test_new_formulation_classification():
    result = classify_formulation("A newly developed herbal formulation not copied from a classical text")
    assert result.category == FormulationCategory.NEW_NON_CLASSICAL
    assert result.confidence > 0.5


def test_uncertain_requests_clarification():
    result = classify_formulation("Herbal product")
    assert result.category == FormulationCategory.UNCERTAIN
    assert result.clarifying_questions
