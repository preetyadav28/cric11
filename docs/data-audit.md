# Data audit

Phase 3 findings. All numbers come from Cricsheet downloads, Wikipedia and Wikidata, taken on 26 October 2026, men's matches only. The decisions that follow from this audit are in [DECISIONS.md](../DECISIONS.md).

## Summary

Cricsheet is reliable for the eight leagues, but it can't be the only source for international cricket:

- It withholds every Afghanistan international.
- International matches only start in 2003 and are incomplete until about 2011.

Wikipedia's caps lists and squad pages fill both gaps. Wikidata links them to Cricsheet IDs. Each source does one job:

| Source | License | Used for |
|---|---|---|
| Cricsheet | ODC-BY | League matches, international matches from 2003, player ID register, finals, player of the match |
| Wikipedia | CC BY-SA | National caps for every era (including Afghanistan), international career totals and debut years, full tournament squads |
| Wikidata | CC0 | Joining Wikipedia articles to Cricsheet IDs through the ESPNcricinfo ID (P2697) |

## Cricsheet match files

Each match is a JSON file with three parts: `meta` (data version), `info` (match details) and `innings` (ball by ball). We only need `info`. The ball-by-ball data can be thrown away after import.

Fields in `info`, with how many league files have each one:

| Field | Present | Notes |
|---|---|---|
| `teams`, `players`, `registry.people` | always | `registry.people` maps each player's name in the file to their Cricsheet ID |
| `season`, `dates`, `outcome`, `toss`, `venue` | always | `season` format varies: "2007/08" for IPL 2008, "2022/23" for SA20 2023. Normalize to the year of the final |
| `event.name` | always in leagues | International event names vary over time ("World T20", "ICC World Twenty20", "ICC Men's T20 World Cup") and need a mapping |
| `event.stage` | only on knockout games | "Final", "Qualifier 1", "Eliminator", "Semi Final" and others. Group matches have `match_number` instead |
| `player_of_match` | 99% of league matches | Missing on abandoned games and some older internationals |

**Finals are labelled.** Every season of all eight leagues has exactly one match with `event.stage = "Final"`. Men's ICC finals since 2003 are labelled too. (PSL 2019/20 was the only gap, and the PSL is out of scope.)

## Coverage

### Leagues

| League | Seasons | Matches | Teams (Cricsheet names) |
|---|---|---|---|
| IPL | 2008–2026 (19) | 1,243 | 19 |
| BBL | 2011/12–2025/26 (15) | 662 | 8 |
| CPL | 2013–2026 (14) | 445 | 13 |
| SA20 | 2023–2026 (4) | 130 | 6 |
| ILT20 | 2023–2026 (4) | 134 | 7 |
| MLC | 2023–2026 (4) | 109 | 6 |
| The Hundred | 2021–2026 (6) | 201 | 11 |
| LPL | 2020–2026 (6) | 143 | 19 |

The leagues are complete from their first season.

### Internationals

Matches in Cricsheet compared with Cricsheet's own list of missing matches:

| Year | Tests present | ODIs present |
|---|---|---|
| 2001–2002 | 3 in total | 3 in total |
| 2003 | 20 of 41 (49%) | 119 of 146 (82%) |
| 2004 | 17 of 49 (35%) | 79 of 124 (64%) |
| 2005 | 24 of 48 (50%) | 67 of 106 (63%) |
| 2006 | 39 of 46 (85%) | 119 of 157 (76%) |
| 2007–2010 | about 95% | about 80–84% |
| 2011 onward | nearly complete | about 95% or better |

T20Is start in 2005. The missing-matches list itself undercounts 2001–2002, so the real gaps there are bigger than it suggests.

Because of this, national-team membership, career totals and debut years come from Wikipedia caps lists, not from Cricsheet. Deriving them from Cricsheet would miss any player whose internationals fell in these gaps.

### Withheld matches (Afghanistan)

383 matches are withheld: all matches involving the Afghanistan men's team, plus the Afghanistan Premier League. The maintainer removed them in November 2024 as a protest over the ICC's treatment of Afghan women's cricket ([article](https://cricsheet.org/article/explanation-for-withholding-of-afghanistani-matches)).

Afghan players are still in the register, and their matches in other leagues are still there. Rashid Khan, for example, has 153 IPL matches. Afghanistan's international caps come from Wikipedia's lists.

## Register and names

- **`people.csv`** has 18,683 people. It holds the Cricsheet ID, `name`, `unique_name` and external IDs. 18,638 people have an ESPNcricinfo ID, which is how we join to Wikidata and `player_meta`. Other ID columns are sparse (CricketArchive 4,508, Pulse 2,010, BCCI 1,321, Cricbuzz 50).
- **`names.csv`** has 7,551 other spellings for 5,583 people, for example "Jon Holland", "J Holland", "Jonathan Holland".
- **Names are scorecard-style** ("V Kohli"). Full display names come from enrichment (Wikidata label or Wikipedia title). Variants from `names.csv` feed player search.
- **`unique_name` separates people who share a name**, by adding initials or a suffix like "Abdul Rahman (2)". 348 people have a `unique_name` that differs from `name`.

## Identity problems

- **Same name, different people:** 58 names in our scope belong to more than one player, for example "Rashid Khan", "Mandeep Singh", "A Mishra" and "Abdul Samad". **Always match on the Cricsheet ID, never on the name.**
- **One person, several spellings:** handled by `names.csv` and the shared ID.
- **Joining Wikipedia to Cricsheet** (Wikipedia article → Wikidata → ESPNcricinfo ID → Cricsheet register): tested on India's Test list. All 295 parsed players matched, including 231 who debuted before 2001. The register covers old players even where it has no match data for them. The first parse read 295 of 318 rows; the rest had different table formatting, so the importer has to handle layout differences between pages.
- **Wikipedia coverage of league players:** 90–99% of each league's players have an English Wikipedia article, with MLC the lowest. Only 43% of all T20I players do, mostly associate-nation players who won't appear in grids.

## Franchise renames

[`backend/data/franchise-lineage.json`](../backend/data/franchise-lineage.json) maps all 89 team names in the eight leagues to one club each. It has been checked against the data: every name appears exactly once, and none are missing. Main merges:

- IPL: Delhi Daredevils → Delhi Capitals, Kings XI Punjab → Punjab Kings, Royal Challengers Bangalore → Bengaluru, Rising Pune Supergiants → Supergiant
- CPL: Trinidad & Tobago Red Steel → Trinbago Knight Riders, Barbados Tridents ↔ Barbados Royals (back to Tridents in 2026), St Lucia Zouks / Stars / Kings
- ILT20: Sharjah Warriors → Sharjah Warriorz
- The Hundred (2026 rebrands): Oval Invincibles → MI London, Northern Superchargers → Sunrisers Leeds, Manchester Originals → Manchester Super Giants
- LPL: grouped by city, because the franchises change name almost every season (confirmed)

These stay separate clubs: Deccan Chargers and Sunrisers Hyderabad, Gujarat Lions and Gujarat Titans, Antigua Hawksbills and Antigua and Barbuda Falcons.

The LPL city groups and the CPL entries (St Lucia as one club, Jamaica Kingsmen separate from Jamaica Tallawahs) have been confirmed by hand.

## Size

| | Count |
|---|---|
| Men's matches in scope (8 leagues + Tests, ODIs, T20Is) | 10,217 |
| Distinct players in those matches | 6,305 |
| Team names | 200 (89 in leagues) |
| Raw JSON | about 1.5 GB |

We keep match details and lineups, not ball-by-ball data. That's about 10,000 match rows and 225,000 player-in-match rows. Adding the Wikipedia caps lists brings in a few thousand more players and caps rows from before 2003. The whole database should be well under 100 MB, which fits the Neon free tier. The raw zips are downloaded during each sync and not stored.

## Sources considered and rejected

| Source | Why not |
|---|---|
| ESPNcricinfo / Statsguru scraping | Terms forbid scraping and republishing |
| Cricbuzz website and profiles | robots.txt blocks all crawlers. Terms allow only "non-commercial use only and private viewing only" and forbid redistributing or making derivative works. Profiles list team names but no match history |
| cricbuzz-live (GitHub) | Live scores only, no player data. Hosted version returns HTTP 402. Unmaintained since January 2024 |
| Unofficial Cricbuzz API on RapidAPI | Resells Cricbuzz's private API, with the same terms problem. Free tier is too small for a backfill, and it can disappear without notice |
| Paid cricket APIs | Cost money, and their terms usually forbid storing the data |
| CricketArchive | Paid and restrictive |
| Kaggle datasets | Mostly copies of Cricsheet or Cricinfo with unclear licenses |
| Wikipedia for everything | No per-match lineups for most matches, hand-edited tables that break parsers, stats updated irregularly. Used only for caps lists and squads |
