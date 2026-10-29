"""
Fetches player data from the NHL API and writes two files:
  src/data/leafs_players.json   every player who has played for Toronto
  src/data/active_players.json  every player on a current NHL roster

Run it with: python scripts/fetch_players.py
"""

import json
import time
from collections import Counter
from pathlib import Path

import requests

API = "https://api-web.nhle.com/v1"
DRAFT_API = "https://records.nhl.com/site/api/draft?limit=-1"
DATA_DIR = Path(__file__).resolve().parent.parent / "src" / "data"

# If the API returns fewer players than this, something went wrong.
# We stop instead of overwriting good data with a broken file.
MIN_LEAFS_PLAYERS = 900
MIN_ACTIVE_PLAYERS = 600

session = requests.Session()


def get_json(url):
    """GET a URL, waiting and retrying if the API rate limits us."""
    for attempt in range(5):
        try:
            res = session.get(url, timeout=30)
            if res.status_code == 200:
                return res.json()
            if res.status_code == 404:
                return None
            if res.status_code == 429:
                # The API allows ~50 requests, then asks us to wait
                wait = int(res.headers.get("Retry-After", 60))
                print(f"  Rate limited, waiting {wait}s...")
                time.sleep(wait)
                continue
        except requests.RequestException:
            pass
        time.sleep(2 ** attempt * 2)  # Wait 2s, 4s, 8s, ... before retrying
    raise RuntimeError(f"NHL API request failed: {url}")


def roster_players(roster):
    """Flattens a roster response into one list of players."""
    if not roster:
        return []
    return roster["forwards"] + roster["defensemen"] + roster["goalies"]


def get_teams():
    """Returns {"TOR": {"division": "Atlantic", "conference": "Eastern"}, ...}"""
    standings = get_json(f"{API}/standings/now")["standings"]
    return {
        team["teamAbbrev"]["default"]: {
            "division": team["divisionName"],
            "conference": team["conferenceName"],
        }
        for team in standings
    }


def get_drafts():
    """Returns {player id: (draft year, draft team)} from the full NHL draft history."""
    drafts = {}
    # Sorted oldest first, so a player drafted twice keeps their latest draft
    for pick in sorted(get_json(DRAFT_API)["data"], key=lambda p: p["draftYear"]):
        if pick.get("playerId"):
            drafts[pick["playerId"]] = (pick["draftYear"], pick["triCode"])
    return drafts


def get_current_rosters(teams):
    """Returns {player id: (team, roster entry)} for everyone on an NHL roster today."""
    current = {}
    for team in teams:
        for p in roster_players(get_json(f"{API}/roster/{team}/current")):
            current[p["id"]] = (team, p)
    return current


def build_player(p, jersey_number, current, teams, drafts):
    """Builds one player record from a roster entry."""
    team, current_entry = current.get(p["id"], (None, None))
    draft_year, draft_team = drafts.get(p["id"], (None, "N/A"))
    team_info = teams.get(team, {})

    return {
        "id": p["id"],
        "name": f"{p['firstName']['default']} {p['lastName']['default']}",
        "position": p.get("positionCode", "N/A"),
        "jerseyNumber": jersey_number,
        "currentTeam": team or "Retired / Inactive",
        "division": team_info.get("division"),
        "conference": team_info.get("conference"),
        "draftYear": draft_year,
        "draftTeam": draft_team,
        "nationality": p.get("birthCountry", "N/A"),
        "isActive": team is not None,
        # Prefer the up-to-date photo from their current team
        "headshot": (current_entry or p).get("headshot", ""),
    }


def fetch_leafs_players(current, teams, drafts):
    print("Fetching every Leafs roster in history...")
    entries = {}  # player id -> their most recent Leafs roster entry
    numbers = {}  # player id -> every number they wore as a Leaf
    for season in get_json(f"{API}/roster-season/TOR"):
        for p in roster_players(get_json(f"{API}/roster/TOR/{season}")):
            entries[p["id"]] = p
            numbers.setdefault(p["id"], [])
            if p.get("sweaterNumber") is not None:
                numbers[p["id"]].append(p["sweaterNumber"])

    players = []
    for player_id, p in entries.items():
        # Use the number they wore most often in Toronto
        worn = numbers[player_id]
        jersey = Counter(worn).most_common(1)[0][0] if worn else None
        players.append(build_player(p, jersey, current, teams, drafts))
    return players


def fetch_active_players(current, teams, drafts):
    return [
        build_player(p, p.get("sweaterNumber"), current, teams, drafts)
        for team, p in current.values()
    ]


def save(players, filename, minimum):
    if len(players) < minimum:
        raise RuntimeError(
            f"Only got {len(players)} players for {filename} (expected {minimum}+). Not saving."
        )
    # Sorting by id keeps the order stable between runs, so the daily answer
    # doesn't jump around every time the data refreshes.
    players.sort(key=lambda p: p["id"])
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(DATA_DIR / filename, "w", encoding="utf-8") as f:
        json.dump(players, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(players)} players to src/data/{filename}")


def main():
    print("Fetching teams, draft history and current rosters...")
    teams = get_teams()
    drafts = get_drafts()
    current = get_current_rosters(teams)

    leafs = fetch_leafs_players(current, teams, drafts)
    active = fetch_active_players(current, teams, drafts)
    save(leafs, "leafs_players.json", MIN_LEAFS_PLAYERS)
    save(active, "active_players.json", MIN_ACTIVE_PLAYERS)


if __name__ == "__main__":
    main()
