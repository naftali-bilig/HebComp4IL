import json
import os
import re
import sys
import unicodedata
from pathlib import Path

import pypdf


LAWS_DATA = Path("public/HebrewClock13/public/woman/me/he/js/LawsData.js")
DEFAULT_OLAW_DIR = Path(
    r"C:\Users\nafta\OneDrive\Desktop\עבודה\אלחנן\מאגר החקיקה הישראלי\olaw_לפי_תיקיות_האתר\05_laws_חקיקה_ראשית"
)
OUT_DIR = Path("tmp/olaw-match")


def load_laws():
    text = LAWS_DATA.read_text(encoding="utf-8")
    match = re.search(r"window\.HEBREW_CLOCK_LAWS\s*=\s*(\[.*\]);?\s*$", text, re.S)
    if not match:
        raise RuntimeError(f"Could not parse {LAWS_DATA}")
    return json.loads(match.group(1))


def strip_hebrew_marks(value):
    return "".join(ch for ch in value if unicodedata.category(ch) != "Mn")


def normalize(value):
    value = strip_hebrew_marks(value or "")
    value = value.replace("־", "-").replace("–", "-").replace("—", "-")
    value = value.replace("״", '"').replace("׳", "'").replace("`", "'")
    value = re.sub(r"\s+", " ", value)
    value = re.sub(r"[^\u0590-\u05ff0-9A-Za-z]+", "", value)
    return value


def title_tokens(value):
    normalized = strip_hebrew_marks(value or "")
    normalized = normalized.replace("־", "-").replace("–", "-").replace("—", "-")
    tokens = re.findall(r"[\u0590-\u05ff0-9A-Za-z]+", normalized)
    stop = {
        "חוק",
        "לתיקון",
        "תיקון",
        "מס",
        "התש",
        "התשע",
        "תש",
        "של",
        "על",
        "ידי",
        "או",
        "ו",
        "הוראת",
        "שעה",
    }
    return [token for token in tokens if len(token) > 1 and token not in stop and not token.isdigit()]


def law_core_name(name):
    value = name or ""
    value = re.sub(r"\s*,\s*התש[^,]*?[-–]\s*\d{4}\s*$", "", value)
    value = re.sub(r"\s*,\s*תש[^,]*?[-–]\s*\d{4}\s*$", "", value)
    return value


def pdf_text(path, max_pages=2):
    try:
        reader = pypdf.PdfReader(str(path))
        pages = reader.pages[:max_pages]
        return "\n".join(page.extract_text() or "" for page in pages)
    except Exception as exc:
        return f"__PDF_ERROR__ {exc}"


def extract_pdf_year(text):
    years = [int(y) for y in re.findall(r"(?:19|20)\d{2}", text)]
    years = [y for y in years if 1948 <= y <= 2035]
    return min(years) if years else None


def index_pdfs(olaw_dir):
    cache_path = OUT_DIR / "pdf_title_index.json"
    if cache_path.exists():
        return json.loads(cache_path.read_text(encoding="utf-8"))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    index = []
    files = sorted(olaw_dir.glob("law-*.pdf"))
    files = [p for p in files if re.fullmatch(r"law-\d{4}\.pdf", p.name)]

    for i, path in enumerate(files, 1):
        text = pdf_text(path, max_pages=2)
        norm_text = normalize(text)
        index.append(
            {
                "file": path.name,
                "url": f"https://olaw.org.il/laws/{path.name}",
                "year": extract_pdf_year(text[:3000]),
                "text": norm_text,
            }
        )
        if i % 100 == 0:
            print(f"indexed {i}/{len(files)}", flush=True)

    cache_path.write_text(json.dumps(index, ensure_ascii=False), encoding="utf-8")
    return index


def score_match(law, doc):
    core = normalize(law_core_name(law["name"]))
    full = normalize(law["name"])
    text = doc["text"]
    law_year = int(law["date"][:4])

    if doc.get("year") and abs(doc["year"] - law_year) > 1:
        return 0

    if full and full in text:
        return 100
    if core and core in text:
        return 95

    compact_core = re.sub(r"(תיקוןמס|מס)(\d+)", r"\2", core)
    if len(compact_core) >= 24 and compact_core in text:
        return 88

    return 0


def match_laws(laws, index):
    matches = []
    misses = []
    ambiguous = []
    docs_by_year = {}

    for doc in index:
        year = doc.get("year")
        if year:
            docs_by_year.setdefault(year, []).append(doc)

    fallback_docs = [doc for doc in index if not doc.get("year")]

    for i, law in enumerate(laws, 1):
        law_year = int(law["date"][:4])
        candidate_docs = []
        for year in range(law_year - 1, law_year + 2):
            candidate_docs.extend(docs_by_year.get(year, []))
        candidate_docs.extend(fallback_docs)

        candidates = []
        for doc in candidate_docs:
            score = score_match(law, doc)
            if score:
                candidates.append((score, doc))

        candidates.sort(key=lambda item: (-item[0], item[1]["file"]))

        if not candidates:
            misses.append(law)
            continue

        best_score = candidates[0][0]
        best = [doc for score, doc in candidates if score == best_score]

        if len(best) > 1:
            ambiguous.append({"law": law, "score": best_score, "candidates": best[:10]})
            continue

        doc = best[0]
        matches.append(
            {
                "name": law["name"],
                "date": law["date"],
                "olawPdf": doc["file"],
                "olawPdfUrl": doc["url"],
                "score": best_score,
            }
        )

        if i % 250 == 0:
            print(f"matched {i}/{len(laws)}", flush=True)

    return matches, misses, ambiguous


def main():
    olaw_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OLAW_DIR
    laws = load_laws()
    index = index_pdfs(olaw_dir)
    matches, misses, ambiguous = match_laws(laws, index)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "matches.json").write_text(json.dumps(matches, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT_DIR / "misses.json").write_text(json.dumps(misses, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT_DIR / "ambiguous.json").write_text(json.dumps(ambiguous, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"laws: {len(laws)}")
    print(f"pdfs: {len(index)}")
    print(f"matches: {len(matches)}")
    print(f"misses: {len(misses)}")
    print(f"ambiguous: {len(ambiguous)}")
    for row in matches[:5]:
        print(f"{row['olawPdf']} <- {row['name']}")


if __name__ == "__main__":
    os.environ.setdefault("PYTHONIOENCODING", "utf-8")
    main()
