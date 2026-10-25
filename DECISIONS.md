# Project decisions

## Data
- Primary source: Cricsheet (ODC-BY license, attribution in the footer)
- Second layer for full names and attributes: `player_meta` seed, then Wikidata fill, then a manual override file
- Country is derived from Cricsheet international matches, with enriched data as fallback
- Scope: men's Tests, ODIs and T20Is, plus IPL, BBL, PSL, CPL, SA20, ILT20, MLC, The Hundred and LPL
- Women's cricket comes later, as a separate toggle in the UI

## Rules
- A player counts as belonging to a club or country after at least 1 match
- "Won a tournament" means played in the final for the winning team (playing XI only), with full squads added later
- The UI must say that trophy wins are based on the final's playing XI until full squads are added
- Minimum valid answers per grid cell depends on difficulty: easy 10, medium 5, hard 3
- Difficulty counts only answers above a fame threshold, so obscure one-match players don't make a cell look easy
- Legacy mode: any player who fits every revealed hint is correct

## Tech
- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript
- Database: Neon Postgres with Prisma 7 (staying off Prisma 8 for now)
- Package manager: pnpm. Tests: Vitest
- Hosting: Vercel for both apps. Data sync runs in GitHub Actions
- Development: GitHub Codespaces

## Not in v1
Legacy, Wordle and Connections modes, accounts, women's cricket, rarity stats, and player photos (initials avatars instead).