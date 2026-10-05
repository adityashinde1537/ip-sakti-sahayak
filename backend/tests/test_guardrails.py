from app.services.guardrails import should_abstain


def test_abstains_without_citations():
    assert should_abstain(0.9, 0, 0.42)


def test_abstains_below_threshold():
    assert should_abstain(0.3, 3, 0.42)


def test_allows_grounded_answer_above_threshold():
    assert not should_abstain(0.7, 3, 0.42)
