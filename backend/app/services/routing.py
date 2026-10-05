from collections import OrderedDict

ROUTES = OrderedDict({
    "patents": ("patent", "novel", "invent", "prior art", "pct"),
    "trademarks": ("trademark", "trade mark", "brand", "logo", "madrid"),
    "geographical indications": ("geographical indication", "gi", "origin", "regional name"),
    "designs": ("design", "shape", "packaging appearance", "hague"),
    "copyright": ("copyright", "content", "manual", "artwork"),
    "plant variety rights": ("plant variety", "seed", "cultivar", "variety"),
    "trade secrets": ("trade secret", "confidential", "know-how", "formula secret"),
    "ABS / biodiversity": ("abs", "benefit sharing", "biodiversity", "biological resource", "nagoya", "nba"),
    "traditional knowledge / TKDL": ("traditional knowledge", "tkdl", "classical", "misappropriation"),
    "market access / product regulation": ("regulation", "classification", "label", "advertising", "food", "cosmetic", "drug", "market access"),
})


def route_topics(question: str) -> list[str]:
    text = question.lower()
    routes = [name for name, keywords in ROUTES.items() if any(keyword in text for keyword in keywords)]
    return routes or ["IP and regulatory guidance"]
