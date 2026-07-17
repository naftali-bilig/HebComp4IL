import json
import time
import urllib.parse
import urllib.request


BASE_URL = "https://knesset.gov.il/OdataV4/ParliamentInfo/"


def get_json(entity, params):
    url = BASE_URL + entity + "?" + urllib.parse.urlencode(params, safe="$(),' ")
    url = url.replace(" ", "%20")
    req = urllib.request.Request(url, headers={"User-Agent": "JClock local maintenance"})
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def show(label, entity, params):
    print("\n===", label)
    print(BASE_URL + entity + "?" + urllib.parse.urlencode(params, safe="$(),' ").replace(" ", "%20"))
    started = time.time()
    data = get_json(entity, params)
    print("seconds", round(time.time() - started, 2))
    print("count", len(data.get("value", [])))
    print(json.dumps(data.get("value", [])[:5], ensure_ascii=False, indent=2))


for query in [
    "השעיית ראש רשות",
    "כתב אישום",
    "רשויות המקומיות",
]:
    show(
        f"KNS_Bill contains {query}",
        "KNS_Bill",
        {
            "$filter": f"contains(Name,'{query}')",
            "$top": "10",
        },
    )

show(
    "DocumentBill law publication",
    "KNS_DocumentBill",
    {
        "$filter": "GroupTypeDesc eq 'חוק - פרסום ברשומות'",
        "$top": "5",
    },
)

show(
    "Documents for example BillID 543665",
    "KNS_DocumentBill",
    {
        "$filter": "BillID eq 543665",
        "$orderby": "Id",
    },
)

show(
    "Knesset 19 publication laws",
    "KNS_Bill",
    {
        "$filter": "KnessetNum eq 19 and PublicationSeriesDesc eq 'ספר החוקים'",
        "$select": "Id,Name,PublicationDate,MagazineNumber,PageNumber",
        "$top": "5",
    },
)
