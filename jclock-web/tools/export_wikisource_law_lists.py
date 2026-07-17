import json
import re
import sys
import time
import urllib.parse
import urllib.request
from urllib.error import HTTPError
from pathlib import Path


LAWS_DATA = Path("public/HebrewClock13/public/woman/me/he/js/LawsData.js")
API_URL = "https://he.wikisource.org/w/api.php"


def load_laws():
    text = LAWS_DATA.read_text(encoding="utf-8")
    text = re.sub(r"^window\.HEBREW_CLOCK_LAWS\s*=\s*", "", text)
    text = re.sub(r";\s*$", "", text)
    return json.loads(text)


def wikisource_title(law):
    title = law.get("name", "")
    title = re.sub(r"\s*,\s*התש[^,]+?\s*[-–]\s*\d{4}\s*$", "", title)
    title = re.sub(r"\s+", "_", title)
    return title


def wikisource_url(title):
    return "https://he.wikisource.org/wiki/" + urllib.parse.quote(title)


def chunks(items, size):
    for i in range(0, len(items), size):
        yield items[i : i + size]


def query_existing(titles):
    params = {
        "action": "query",
        "format": "json",
        "redirects": "1",
        "titles": "|".join(titles),
    }
    data = urllib.parse.urlencode(params).encode("utf-8")
    request = urllib.request.Request(
        API_URL,
        data=data,
        headers={"User-Agent": "JClock law link exporter/1.0 (local data maintenance)"},
    )
    for attempt in range(5):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                data = json.loads(response.read().decode("utf-8"))
            break
        except HTTPError as exc:
            if exc.code != 429 or attempt == 4:
                raise
            time.sleep(5 * (attempt + 1))

    normalized = {
        item["from"]: item["to"]
        for item in data.get("query", {}).get("normalized", [])
    }
    redirects = {
        item["from"]: item["to"]
        for item in data.get("query", {}).get("redirects", [])
    }
    pages = data.get("query", {}).get("pages", {})
    existing = set()

    for page in pages.values():
        if "missing" not in page:
            existing.add(page.get("title", "").replace(" ", "_"))

    result = {}
    for title in titles:
        candidate = title
        candidate = normalized.get(candidate, candidate).replace(" ", "_")
        candidate = redirects.get(candidate, candidate).replace(" ", "_")
        result[title] = candidate in existing

    return result


def main():
    if len(sys.argv) != 2:
        print("Usage: export_wikisource_law_lists.py <output-dir>", file=sys.stderr)
        raise SystemExit(2)

    out_dir = Path(sys.argv[1])
    out_dir.mkdir(parents=True, exist_ok=True)
    cache_path = out_dir / "wikisource_check_cache.json"

    laws = load_laws()
    rows = []
    for index, law in enumerate(laws, 1):
        title = wikisource_title(law)
        rows.append(
            {
                "index": index,
                "date": law.get("date", ""),
                "name": law.get("name", ""),
                "title": title,
                "url": wikisource_url(title),
            }
        )

    if cache_path.exists():
        status = json.loads(cache_path.read_text(encoding="utf-8"))
    else:
        status = {}

    unique_titles = sorted({row["title"] for row in rows})
    pending_titles = [title for title in unique_titles if title not in status]
    for index, group in enumerate(chunks(pending_titles, 20), 1):
        status.update(query_existing(group))
        cache_path.write_text(json.dumps(status, ensure_ascii=False), encoding="utf-8")
        print(f"checked {len(unique_titles) - len(pending_titles) + min(index * 20, len(pending_titles))}/{len(unique_titles)}", flush=True)
        time.sleep(1.5)

    valid = [row for row in rows if status.get(row["title"])]
    missing = [row for row in rows if not status.get(row["title"])]

    valid_path = out_dir / "חוקים_עם_קישור_תקין_בויקיטקסט.txt"
    missing_path = out_dir / "חוקים_שאין_להם_חוק_מלא_בויקיטקסט.txt"

    header = "מספר\tתאריך\tשם החוק\tקישור ויקיטקסט\n"
    valid_path.write_text(
        header
        + "\n".join(f"{row['index']}\t{row['date']}\t{row['name']}\t{row['url']}" for row in valid)
        + "\n",
        encoding="utf-8",
    )
    missing_path.write_text(
        header
        + "\n".join(f"{row['index']}\t{row['date']}\t{row['name']}\t{row['url']}" for row in missing)
        + "\n",
        encoding="utf-8",
    )

    print(f"total: {len(rows)}")
    print(f"valid: {len(valid)}")
    print(f"missing: {len(missing)}")
    print(valid_path)
    print(missing_path)


if __name__ == "__main__":
    main()
