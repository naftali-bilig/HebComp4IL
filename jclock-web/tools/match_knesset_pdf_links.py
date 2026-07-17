import json
import re
import time
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path
from urllib.error import HTTPError, URLError


BASE_URL = "https://knesset.gov.il/OdataV4/ParliamentInfo/"
LAWS_DATA = Path("public/HebrewClock13/public/woman/me/he/js/LawsData.js")
OUT_DIR = Path("tmp/knesset-match")
WIKISOURCE_CACHE = Path(
    r"C:\Users\nafta\OneDrive\Desktop\עבודה\naftalib\wikisource_check_cache.json"
)


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
    value = re.sub(r"\s+", " ", value.strip())
    value = re.sub(r"[^\u0590-\u05ff0-9A-Za-z]+", "", value)
    return value


def wikisource_title(law):
    title = law.get("name", "")
    title = re.sub(r"\s*,\s*התש[^,]+?\s*[-–]\s*\d{4}\s*$", "", title)
    title = re.sub(r"\s+", "_", title)
    return title


def clean_file_url(value):
    value = (value or "").replace("\\", "/")
    return value.replace("https://fs.knesset.gov.il//", "https://fs.knesset.gov.il/")


def get_json(entity, params):
    url = BASE_URL + entity + "?" + urllib.parse.urlencode(params, safe="$(),' ")
    url = url.replace(" ", "%20")
    request = urllib.request.Request(url, headers={"User-Agent": "JClock law link matcher/1.0"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                return json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError) as exc:
            if attempt == 4:
                raise
            wait = 2 + attempt * 3
            print(f"retry after {wait}s: {exc}", flush=True)
            time.sleep(wait)


def fetch_all(entity, params):
    rows = []
    page = 0
    page_size = 100
    while True:
        page_params = dict(params)
        page_params["$top"] = str(page_size)
        page_params["$skip"] = str(page * page_size)
        data = get_json(entity, page_params)
        batch = data.get("value", [])
        if not batch:
            return rows
        rows.extend(batch)
        print(f"{entity}: fetched {len(rows)}", flush=True)
        if len(batch) < page_size:
            return rows
        page += 1
        time.sleep(0.25)


def fetch_publication_bills():
    cache_path = OUT_DIR / "knesset_publication_bills.json"
    if cache_path.exists():
        return json.loads(cache_path.read_text(encoding="utf-8"))

    rows = []
    for knesset_num in range(16, 26):
        rows.extend(
            fetch_all(
                "KNS_Bill",
                {
                    "$filter": f"KnessetNum eq {knesset_num} and PublicationSeriesDesc eq 'ספר החוקים'",
                    "$select": "Id,Name,KnessetNum,PublicationDate,PublicationSeriesDesc,MagazineNumber,PageNumber",
                    "$orderby": "PublicationDate desc,Id desc",
                },
            )
        )
    cache_path.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
    return rows


def fetch_docs_for_bill(bill_id):
    data = get_json(
        "KNS_DocumentBill",
        {
            "$filter": f"BillID eq {bill_id}",
            "$select": "Id,BillID,GroupTypeID,GroupTypeDesc,ApplicationDesc,FilePath,LastUpdatedDate",
            "$orderby": "Id",
        },
    )
    return data.get("value", [])


def choose_publication_doc(docs):
    candidates = [
        doc
        for doc in docs
        if doc.get("GroupTypeID") == 9
        or doc.get("GroupTypeDesc") == "חוק - פרסום ברשומות"
    ]
    if not candidates:
        return None

    pdfs = [doc for doc in candidates if clean_file_url(doc.get("FilePath")).lower().endswith(".pdf")]
    candidates = pdfs or candidates
    candidates.sort(key=lambda doc: (0 if doc.get("ApplicationDesc") in {"PDF", "PPT"} else 1, doc.get("Id", 0)))
    return candidates[0]


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    laws = load_laws()

    wiki_status = {}
    if WIKISOURCE_CACHE.exists():
        wiki_status = json.loads(WIKISOURCE_CACHE.read_text(encoding="utf-8"))

    broken_titles = {
        title for title, exists in wiki_status.items() if exists is False
    }

    bills = fetch_publication_bills()
    docs_by_bill = {}

    bills_by_name = {}
    for bill in bills:
        key = normalize(bill.get("Name"))
        if key:
            bills_by_name.setdefault(key, []).append(bill)

    matches = []
    misses = []
    ambiguous = []
    skipped_wiki_valid = 0

    for index, law in enumerate(laws, 1):
        title = wikisource_title(law)
        if wiki_status and title not in broken_titles:
            skipped_wiki_valid += 1
            continue

        key = normalize(law.get("name"))
        candidates = bills_by_name.get(key, [])
        if not candidates:
            misses.append({"index": index, "name": law.get("name"), "date": law.get("date"), "reason": "no exact KNS_Bill name"})
            continue

        law_year = int((law.get("date") or "0000")[:4])
        year_candidates = [
            bill for bill in candidates
            if not bill.get("PublicationDate")
            or abs(int(bill["PublicationDate"][:4]) - law_year) <= 1
        ]
        candidates = year_candidates or candidates

        with_docs = []
        for bill in candidates:
            bill_id = bill.get("Id")
            if bill_id not in docs_by_bill:
                docs_by_bill[bill_id] = fetch_docs_for_bill(bill_id)
                time.sleep(0.1)
            doc = choose_publication_doc(docs_by_bill.get(bill.get("Id"), []))
            if doc:
                with_docs.append((bill, doc))

        if len(with_docs) != 1:
            ambiguous.append(
                {
                    "index": index,
                    "name": law.get("name"),
                    "date": law.get("date"),
                    "candidates": with_docs,
                    "reason": "no publication PDF" if not with_docs else "multiple exact KNS_Bill candidates",
                }
            )
            continue

        bill, doc = with_docs[0]
        matches.append(
            {
                "index": index,
                "name": law.get("name"),
                "date": law.get("date"),
                "knessetBillId": bill.get("Id"),
                "knessetPdfUrl": clean_file_url(doc.get("FilePath")),
                "publicationDate": bill.get("PublicationDate"),
                "magazineNumber": bill.get("MagazineNumber"),
                "pageNumber": bill.get("PageNumber"),
                "documentId": doc.get("Id"),
            }
        )

    (OUT_DIR / "matches.json").write_text(json.dumps(matches, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT_DIR / "misses.json").write_text(json.dumps(misses, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT_DIR / "ambiguous.json").write_text(json.dumps(ambiguous, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"laws: {len(laws)}")
    print(f"wiki cache entries: {len(wiki_status)}")
    print(f"broken wiki titles: {len(broken_titles)}")
    print(f"skipped wiki-valid/unchecked: {skipped_wiki_valid}")
    print(f"knesset bills: {len(bills)}")
    print(f"knesset docs queried: {len(docs_by_bill)}")
    print(f"matches: {len(matches)}")
    print(f"misses: {len(misses)}")
    print(f"ambiguous: {len(ambiguous)}")
    for row in matches[:10]:
        print(f"{row['knessetPdfUrl']} <- {row['name']}")


if __name__ == "__main__":
    main()
