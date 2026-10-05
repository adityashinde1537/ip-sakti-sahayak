from app.models.schemas import Jurisdiction
from app.services.retrieval import retrieve


def test_india_query_does_not_return_international_only_sources():
    results = retrieve("patent prior art traditional knowledge", Jurisdiction.INDIA, ["patents", "traditional knowledge / TKDL"])
    assert results
    assert all(item.jurisdiction in {"India", "Both"} for item in results)


def test_international_query_does_not_return_india_only_sources():
    results = retrieve("genetic resources traditional knowledge treaty", Jurisdiction.INTERNATIONAL, ["traditional knowledge / TKDL"])
    assert results
    assert all(item.jurisdiction in {"International", "Both"} for item in results)
