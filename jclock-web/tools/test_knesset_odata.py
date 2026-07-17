import json
import urllib.parse
import urllib.request


def get_json(entity, params):
    url = "https://knesset.gov.il/Odata/ParliamentInfo.svc/" + entity + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "JClock local maintenance"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


for q in ["השעיית", "ראש רשות", "כתב אישום", "2421"]:
    print("\nQUERY", q)
    for entity in ["KNS_Law", "KNS_IsraelLaw", "KNS_IsraelLawName"]:
        field = "Name"
        data = get_json(
            entity,
            {
                "$format": "json",
                "$filter": f"substringof('{q}',{field})",
                "$top": "10",
            },
        )
        print("===", entity, len(data["value"]))
        print(json.dumps(data["value"][:3], ensure_ascii=False, indent=2))

data = get_json(
    "KNS_Law",
    {
        "$format": "json",
        "$filter": "MagazineNumber eq '2421'",
        "$top": "20",
    },
)
print("\nMagazine 2421", len(data["value"]))
print(json.dumps(data["value"], ensure_ascii=False, indent=2))
