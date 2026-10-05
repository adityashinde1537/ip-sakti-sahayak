import json
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "app" / "data" / "source_catalog.json"
items = json.loads(path.read_text(encoding="utf-8"))
required = {"id", "title", "authority", "jurisdiction", "topics", "summary"}

seen = set()
for item in items:
    missing = required - item.keys()
    if missing:
        raise SystemExit(f"{item.get('id', '<unknown>')}: missing {sorted(missing)}")
    if item["id"] in seen:
        raise SystemExit(f"Duplicate source id: {item['id']}")
    seen.add(item["id"])

print(f"Validated {len(items)} source records")
