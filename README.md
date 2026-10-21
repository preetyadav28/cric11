# cric11

A cricket grid trivia game. Fill a 3x3 grid by naming players who fit both the row and the column, for example someone who played for Mumbai Indians and for India. Work in progress.

## Structure

- `frontend/`: React + Vite + TypeScript app
- `backend/`: Express + TypeScript API, with Prisma and PostgreSQL (Neon)

Each folder has its own `package.json` and is set up independently.

## Run locally

Use a GitHub Codespace, or any machine with Node and pnpm.

Frontend: `cd frontend`, then `pnpm install`, then `pnpm dev`.

Backend: `cd backend`, then `pnpm install`. Copy `.env.example` to `.env` and fill in `DATABASE_URL`. Then run `pnpm dev` and open `/health` to check it works.

Tests: run `pnpm test` inside either folder.

## Data

Match data comes from [Cricsheet](https://cricsheet.org) under the ODC-BY license. This is an unofficial fan project and is not affiliated with the BCCI, ICC, IPL or any other cricket league and board.