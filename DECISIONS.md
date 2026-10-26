# Project decisions

## Data
- Three sources, each with one job. Every stored fact records which source it came from
  - Cricsheet (ODC-BY): all men's match data and the player ID register. Leagues are complete from their first season; Tests, ODIs and T20Is only start in 2003 and are patchy until about 2011
  - Wikipedia (CC BY-SA): national-team caps lists for every era (Tests from 1877), international career totals and debut years, and full squads for tournament winners
  - Wikidata (CC0): links Wikipedia articles to Cricsheet IDs through the ESPNcricinfo ID (P2697)
- National-team membership comes from the Wikipedia caps lists, not from Cricsheet matches, because Cricsheet is missing too many internationals before 2011
- Afghanistan is included through Wikipedia. Cricsheet withholds every Afghanistan international and the Afghanistan Premier League; Afghan players' matches in our leagues are still in Cricsheet
- Second layer for full names and attributes: `player_meta` seed, then Wikidata fill, then a manual override file
- Scope: men's Tests, ODIs and T20Is, plus IPL, BBL, CPL, SA20, ILT20, MLC, The Hundred and LPL. PSL is not covered
- Renamed franchises count as one club, using `backend/data/franchise-lineage.json`
- Not used: Cricbuzz, ESPNcricinfo scraping or paid cricket APIs. Their terms forbid republishing the data
- Women's cricket comes later, as a separate toggle in the UI

## Rules
- A player counts as belonging to a club after at least 1 match, and to a country after at least 1 cap
- "Won a tournament" means being in the winning team's official squad, whether or not the player played in the final
- The rules page must list the data limitations below, in plain words
- Minimum valid answers per grid cell depends on difficulty: easy 10, medium 5, hard 3
- Difficulty counts only answers above a fame threshold, so obscure one-match players don't make a cell look easy
- Legacy mode: any player who fits every revealed hint is correct

## Data limitations (shown on the rules page)
- Match-by-match data starts in 2003 for internationals and is incomplete until about 2011. Earlier players are covered through national caps lists and squads, not individual matches
- International caps, career totals and debut years come from Wikipedia and can lag recent matches by a few weeks
- Tournament winners are the full official squad, so a player counts even if they didn't play in the final
- Afghanistan's international record comes from Wikipedia only, and the Afghanistan Premier League isn't covered
- Only the eight listed leagues count. Other leagues (including the PSL) and domestic cricket don't
- Renamed franchises count as one team, for example Delhi Daredevils and Delhi Capitals
- Data updates once a week

## Tech
- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript
- Database: Neon Postgres with Prisma 7 (staying off Prisma 8 for now)
- Package manager: pnpm. Tests: Vitest
- Hosting: Vercel for both apps. Data sync runs in GitHub Actions
- Development: GitHub Codespaces

## Not in v1
Legacy, Wordle and Connections modes, accounts, women's cricket, rarity stats, and player photos (initials avatars instead).
