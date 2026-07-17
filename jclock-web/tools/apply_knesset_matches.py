import json
import re
from pathlib import Path


LAWS_DATA = Path("public/HebrewClock13/public/woman/me/he/js/LawsData.js")
MATCHES = Path("tmp/knesset-match/matches.json")


def clean_file_url(value):
    value = (value or "").replace("\\", "/")
    return value.replace("https://fs.knesset.gov.il//", "https://fs.knesset.gov.il/")


def load_laws_data():
    text = LAWS_DATA.read_text(encoding="utf-8")
    match = re.search(r"window\.HEBREW_CLOCK_LAWS\s*=\s*(\[.*\]);?\s*$", text, re.S)
    if not match:
        raise RuntimeError(f"Could not parse {LAWS_DATA}")
    return json.loads(match.group(1))


def main():
    laws = load_laws_data()
    matches = json.loads(MATCHES.read_text(encoding="utf-8"))
    by_index = {row["index"]: row for row in matches}
    changed = 0

    for index, law in enumerate(laws, 1):
        row = by_index.get(index)
        if not row:
            continue
        if law.get("name") != row.get("name") or law.get("date") != row.get("date"):
            raise RuntimeError(f"Index mismatch at {index}: {law.get('name')} != {row.get('name')}")
        url = clean_file_url(row["knessetPdfUrl"])
        if law.get("knessetPdfUrl") != url:
            law["knessetPdfUrl"] = url
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
