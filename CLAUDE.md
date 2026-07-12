# CLAUDE.md

## Project: Farmi

Medication price comparison platform for Colombia. Retrieves prices, availability,
and product details from pharmacy sources in near real-time via web scraping and
APIs (when available), normalizes the data, and groups equivalent medications by
active ingredient so users find the cheapest option without depending on a single
source.

Current stage: working product in production on Vercel. Public landing with live
search, results comparison across 6 pharmacies, nearby-pharmacy map (OpenStreetMap),
and pages for cart, list, and favorites. Active work is shifting from "make search
work" to trust, retention, and growth features.

## Active work (current priorities)

- Per-price timestamp on results ("actualizado hace X min") to reinforce real-time trust.
- Owned-data social proof: stats endpoint and per-search savings ("ahorras hasta $X").
- Retention: price-alert capture (email or WhatsApp) plus a notification path.
- Share/referral: shareable results URL with the medication preloaded.
- Multi-medication list comparison for chronic patients (consolidated total per pharmacy).

When working on these, do not redesign existing UI. Add features inside the current
palette and components.

## Stack and structure

Verified from the live site. Confirm package-level details against the repo before
relying on them; do not assume.

- Framework: Next.js, deployed on Vercel.
- Maps: OpenStreetMap.
- Pharmacies covered: Drogas La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam, Olimpica,
  Farmacia Pasteur, Farmacenter (its online store is farmaexpress.com, by Coopidrogas).
- Routes in production: /, /cercanas, /carrito, /lista, /sobre-nosotros, /contacto, /terminos, /privacidad.

Read these before editing, to confirm current reality instead of assuming:

- package.json: scripts, dependencies, exact versions.
- The scraping/data layer: how each pharmacy source is fetched and normalized.
- The existing API routes: endpoints already present and their data contracts.

## Commands

Confirm against package.json before running; do not assume a script exists.

- Dev: verify (commonly npm run dev).
- Build: verify (commonly npm run build).
- Lint: verify (commonly npm run lint).
- Test: verify whether a test runner is configured at all.

## Domain rules (do not violate)

- Normalize and group by active ingredient (principio activo / INN), not by brand.
  Generico-vs-marca comparison is the core feature.
- Prices are referential and obtained in near real-time. Always preserve the fetch
  timestamp per price and surface it in the UI.
- Never introduce medical claims. Farmi is a data tool, not medical or pharmaceutical
  advice. Keep the existing legal disclaimer intact.
- Farmi does not sell medication and does not intervene in purchase. It links out to
  the pharmacy.
- Independence: no copy or feature may imply affiliation with or sponsorship by any
  pharmacy.
- Personal data (email / WhatsApp for alerts) is handled under Ley 1581 de 2012
  (Habeas Data). Do not log, expose, or leak personal data.

## Conventions

- Language: all user-facing copy in Spanish (Colombia). Tone: direct, no medical
  jargon, no advertising hyperbole.
- Currency: Colombian pesos, no decimals, thousands separator with a period ($8.400).
- Mobile-first: 80%+ of traffic is Android mobile. Validate every change at ~360px.
- React: no native <form> tags; use onClick / onChange handlers.
- New data endpoints: document the request/response contract in the same change.
- A stats or counter component must hide itself when data is null or trivially low,
  instead of rendering zeros.

## Agent behavior

- Read existing files before writing. Do not re-read unchanged files.
- Thorough in reasoning, concise in output.
- Skip files over 100KB unless required for the task.
- No sycophantic openers or closing fluff. No emojis or em-dashes.
- Do not guess APIs, versions, flags, commit SHAs, or package names. Verify by reading
  code or docs before asserting.
- When a fact cannot be verified from the repo, state that instead of inventing it.

## Git workflow

- Fill in: branch convention, commit message format, and whether PRs are required.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
