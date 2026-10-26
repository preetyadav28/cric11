# Project checklist

Progress tracker for the cric11 build. Tick an item by changing `[ ]` to `[x]`. Phases 0 to 3 are complete (44 of 121 items).

## Phase 0: Repo setup (frontend and backend)

- [x] Create an empty public GitHub repo (e.g., cricket-grid) with a README, a Node .gitignore and a license
- [x] Open it in a Codespace (Code button, then Codespaces, then Create); stop the Codespace whenever you’re idle
- [x] Set the Codespaces spending limit to $0 in your GitHub billing settings
- [x] In the Codespace terminal run: corepack enable (this gives you pnpm), then mkdir frontend backend
- [x] Frontend: cd frontend, run pnpm create vite . --template react-ts, then pnpm install and pnpm dev; open the forwarded port
- [x] Frontend: pnpm add -D vitest and add a test script (vitest) to package.json
- [x] Backend: cd backend, run pnpm init, pnpm add express, then pnpm add -D typescript tsx vitest @types/node @types/express, then npx tsc --init
- [x] Backend: create src/index.ts with a GET /health route; export the Express app and call listen only when running locally
- [x] Backend scripts: dev (tsx watch src/index.ts) and test (vitest); confirm /health works on the forwarded port
- [x] Backend: add Prisma 7 (pnpm add -D -E prisma@7 and @types/pg; pnpm add -E @prisma/client@7 @prisma/adapter-pg@7 pg dotenv; then prisma init --output ../generated/prisma). Stay on 7, not the 8 release candidate
- [x] Add backend/.env.example listing DATABASE_URL; keep .env in .gitignore and never commit secrets
- [x] Write a root README: what each folder is and how to run it
- [x] Commit and push; confirm both apps run in a fresh Codespace

## Phase 1: Cloud infrastructure

- [x] Create a Neon account and project; choose the region closest to you and your players
- [x] Copy the pooled connection string from Neon and save it as DATABASE_URL in backend/.env
- [x] Add DATABASE_URL as a Codespaces secret (GitHub settings, Codespaces, Secrets) so it survives rebuilds
- [x] Create a Vercel account by signing in with GitHub (the Hobby plan is for non-commercial use)
- [x] Vercel project 1: import the repo and set Root Directory to frontend; Vite should be detected
- [x] Vercel project 2: import the same repo and set Root Directory to backend; Express is detected automatically
- [x] In the backend project, add DATABASE_URL under Environment Variables
- [x] In the frontend project, add VITE_API_URL pointing to the backend’s Vercel URL
- [x] Enable CORS in Express for your frontend URL and localhost
- [x] Check it live: open the backend /health URL, then confirm the frontend can call it
- [x] Add a GitHub Actions workflow that runs pnpm test in frontend and backend on every push
- [x] Add DATABASE_URL as a GitHub Actions secret for the weekly sync job (it runs there, because the Vercel backend can’t run background jobs)
- [x] Turn on auto-deploy from the main branch and put the live URLs in the README

## Phase 2: Decisions and setup

- [x] Save the locked decisions in DECISIONS.md: Cricsheet data, men’s Tests/ODIs/T20Is, eight leagues (IPL, BBL, CPL, SA20, ILT20, MLC, The Hundred, LPL; PSL dropped in Phase 3), layered enrichment, React + Vite, Express, Neon Postgres + Prisma, pnpm, Vitest, Vercel for both, women’s later via a toggle
- [x] Define “belongs to a club or country”: decided, 1 match is enough
- [x] Define “trophy winner”: the full official squad from Wikipedia (revised in Phase 3)
- [x] Set the minimum valid answers per grid cell: decided, easy 10, medium 5, hard 3
- [x] Decide: no player photos in v1 (initials avatars), and team colors and initials instead of kits or logos
- [x] Define the Legacy rule: decided, any player who fits every revealed hint is correct
- [x] Write the “not in v1” list (Legacy, Wordle, Connections, accounts, women’s, rarity stats, photos)

## Phase 3: Cricsheet data audit

- [x] Download one league zip and one international zip; inspect the JSON structure
- [x] Download people.csv and names.csv; check what the name fields contain
- [x] Confirm which seasons each of the eight leagues covers
- [x] Find out why some matches show as “withheld” on the downloads page
- [x] Check which match fields exist (event name, stage, outcome, player of the match)
- [x] Build a franchise rename mapping (e.g., Delhi Daredevils to Delhi Capitals)
- [x] Check identity problems: duplicate spellings, same name for different people
- [x] Count players, teams and matches; estimate database size
- [x] Record findings in docs/data-audit.md
- [x] Evaluate second sources (Wikipedia, Wikidata, Cricbuzz, paid APIs) and update DECISIONS.md
- [x] Verify the franchise mapping (LPL and CPL entries confirmed)

## Phase 4: Second layer (player enrichment)

- [ ] Run the one-time R export of player_meta in the cloud (Codespace or GitHub Action) and commit the CSV
- [ ] Note the dataset’s snapshot date (March 2025) and the license caveats in your docs
- [ ] Join it to your players via the Cricsheet ID; list the unmatched players
- [ ] Write a Wikidata query using the ESPNcricinfo ID (P2697) to fill gaps
- [ ] Create the manual override file (always wins over imports), prioritized by fame score
- [ ] Normalize styles into structured fields: batting hand, bowling arm, bowling category, role
- [ ] Store source and retrieved_at with every attribute value
- [ ] Coverage audit weighted by fame: full name, country, DOB, role, batting hand, bowling style
- [ ] Gate: all well-known players have those fields; the rest can improve over time
- [ ] Optional: if gaps remain, try a one-month paid API after checking its terms on storing data
- [ ] Optional, later: audit Wikimedia Commons photo coverage

## Phase 5: Schema design

- [ ] players: internal ID, Cricsheet ID, Cricinfo ID, other external IDs, display name, aliases
- [ ] attribute_definitions (key, type, allowed values, Wordle comparison rule) and player_attributes (value, source, retrieved_at)
- [ ] criteria: stable string key (e.g., club:ipl:mumbai-indians), type (club, national team, tournament win, record), name, gender, metadata JSON
- [ ] player_criteria: player, criterion, evidence (source, then a match, squad or caps-list row, plus season and count)
- [ ] matches, tournaments and seasons as the raw facts everything derives from
- [ ] fame_score on players, derived from matches played
- [ ] puzzles table (mode, date, difficulty, payload JSON, status); guesses table optional
- [ ] gender column wherever it applies, for the later toggle
- [ ] player_images table designed but deferred
- [ ] Set up migrations from day one (Prisma Migrate)
- [ ] Review the schema against all four modes before writing the importer

## Ready-to-code gate

- [ ] Phase 0 decisions are written down
- [ ] Data audit is done and recorded
- [ ] Coverage audit passes
- [ ] Schema is drafted and reviewed
- [ ] Repo, Codespace and task board are set up

## Phase 6: Pipeline and sync

- [ ] Importer that parses match files with zod validation
- [ ] Make it idempotent by tracking processed match IDs
- [ ] Discard raw ball-by-ball rows; store only derived facts
- [ ] Wikipedia caps-list importer for Tests, ODIs and T20Is, every country including Afghanistan, joined to Cricsheet IDs through Wikidata
- [ ] Wikipedia squad importer for tournament winners: ICC events and every season of the eight leagues
- [ ] Event-name mapping for international tournaments (e.g., World T20 and ICC Men's T20 World Cup)
- [ ] Re-runnable step that derives player_criteria
- [ ] Step that derives attributes: debut dates, active years, career totals, milestones, countries represented
- [ ] Apply enrichment first, then manual overrides
- [ ] Post-run validation: orphan players, unmapped teams, suspicious counts
- [ ] Weekly sync in GitHub Actions, with a run log and failure alerts
- [ ] Freeze published puzzles so later data fixes never change a live one

## Phase 7: Puzzle engine

- [ ] Common interface: generate(seed, difficulty) returns a puzzle; validate(puzzle, guess) returns a result
- [ ] Precompute the pairwise intersection matrix between criteria
- [ ] Grid generator: 3 + 3 criteria where all nine cells meet the minimum answer count
- [ ] Difficulty from the smallest answer count per cell
- [ ] Seed daily puzzles by date and avoid recent repeats
- [ ] Confirm the rule that a player can be used only once per grid
- [ ] Unit tests with hand-verified grids
- [ ] Milestone: a command-line script prints a valid grid with answer counts
- [ ] Leave extension points for Legacy, Wordle and Connections without building them

## Phase 8: API

- [ ] Generic endpoints: GET /v1/puzzles/:mode/today, POST /v1/puzzles/:id/guess, GET /v1/players?q=
- [ ] Validate every answer on the server only
- [ ] Rate limiting and input validation
- [ ] Fuzzy player search over names, aliases and variants, ranked by fame score

## Phase 9: Frontend

- [ ] Mode-agnostic shell (navigation, search, results) plus mode-specific screens
- [ ] Reusable player search component
- [ ] Grid UI: highlight every valid cell for multi-fit, auto-fill for single-fit
- [ ] Mobile-first layout with initials avatars
- [ ] Guest progress saved in localStorage
- [ ] Reserve space for the men’s/women’s toggle
- [ ] Rules page that lists the data limitations from DECISIONS.md

## Phase 10: Quality

- [ ] Unit tests for the importer, derivations and generators
- [ ] Data-quality report script (players without teams, odd counts)
- [ ] Manually play 20 generated grids and verify the answers
- [ ] Have 5 friends try it and note where search fails

## Phase 11: Light legal

- [ ] Footer disclaimer: unofficial fan project, not affiliated with BCCI, ICC or IPL
- [ ] Cricsheet attribution in the footer (ODC-BY)
- [ ] Wikipedia (CC BY-SA) and Wikidata (CC0) attribution in the footer
- [ ] Credit any enrichment source and confirm its terms
- [ ] No official logos, kits or player photos; free with no prizes

## Phase 12: Resume readiness

- [ ] README with architecture diagram, screenshots and a live demo link
- [ ] Document the key decisions: generic criteria model, layered enrichment with provenance, puzzle generator interface, idempotent sync
- [ ] CI running the tests
- [ ] Write two or three resume bullets once the grid works

## Future modes (after v1)

- [ ] Legacy: hints revealed in order (teams, country, debut year, role); answers limited by fame score
- [ ] Wordle-type: comparison rules from attribute_definitions
- [ ] Connections: groups of four across criterion types, checking that no decoy fits two groups
- [ ] Women’s toggle: import women’s data and filter everything by gender
- [ ] Photos: Wikimedia Commons only, with license and attribution stored per image