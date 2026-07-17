import json
import re
from pathlib import Path


LAWS_DATA = Path("public/HebrewClock13/public/woman/me/he/js/LawsData.js")
MATCHES = Path("tmp/olaw-match/matches.json")


def load_laws_data():
    text = LAWS_DATA.read_text(encoding="utf-8")
    match = re.search(r"window\.HEBREW_CLOCK_LAWS\s*=\s*(\[.*\]);?\s*$", text, re.S)
    if not match:
        raise RuntimeError(f"Could not parse {LAWS_DATA}")
    return json.loads(match.group(1))


def main():
    laws = load_laws_data()
    matches = json.loads(MATCHES.read_text(encoding="utf-8"))
    by_key = {(row["name"], row["date"]): row["olawPdfUrl"] for row in matches}
    changed = 0

    for law in laws:
        url = by_key.get((law.get("name"), law.get("date")))
        if url and law.get("olawPdfUrl") != url:
            law["olawPdfUrl"] = url
            changed += 1

    LAWS_DATA.write_text(
        "window.HEBREW_CLOCK_LAWS = "
        + json.dumps(laws, ensure_ascii=False, separators=(",", ":"))
        + ";",
        encoding="utf-8",
    )
    print(f"updated {changed} laws")


if __name__ == "__main__":
    main()
