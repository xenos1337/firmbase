# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Firmbase is a self-hostable API for resolving messy merchant strings (e.g., from bank statements) to canonical merchant objects. It's a TypeScript/Fastify backend service using ES modules.

**Runtime:** Node.js 22+ | **Framework:** Fastify 5.x | **Language:** TypeScript 5.9+

## Commands

```bash
npm run dev        # Start dev server with hot-reload (tsx watch)
npm run build      # Compile TypeScript to dist/
npm run lint       # Type-check without emitting
npm start          # Run production build
```

## Architecture

### Request Flow
1. `server.ts` - Entry point, creates app via `buildApp()`, loads all merchant data on startup
2. `routes/merchant.ts` - Single endpoint `GET /v1/merchant/resolve?q=<string>`
3. `services/matcher.ts` - Core matching: normalizes input, tests regex patterns, calculates Jaccard similarity
4. `services/normalize.ts` - Text normalization pipeline (diacritics, UUIDs, dates, noise words)
5. `services/confidence.ts` - Scoring algorithm combining regex matches and alias similarity

### Key Components
- **Merchant Data:** 272 JSON files in `src/data/merchants/`, one per brand
- **Taxonomy:** Enums in `src/taxonomy/` define categories (23), subcategories (80+), channels, scope, risk levels
- **Schemas:** Fastify validation schemas in `src/schemas/`
- **Loader:** `utils/loadMerchants.ts` validates and loads all merchant files at startup

### Matching Algorithm
- Normalizes input through pipeline (lowercase, remove diacritics/noise/dates/UUIDs)
- Tests merchant regex patterns against normalized input
- Calculates Jaccard similarity between input tokens and aliases
- Returns match if confidence >= 0.70 threshold

## Merchant Data Format

Each merchant JSON file requires:
- `id`, `name`, `category`, `subcategory`, `merchant_channel`, `merchant_scope`
- `subscription_likely`, `is_marketplace`, `risk_level`
- `aliases` (string[]) - **Must be pre-normalized:** lowercase, no punctuation, no diacritics
- Optional: `website`, `logo_hint`, `regex` (string[])

**Critical:** Aliases are validated at load time. Invalid aliases (uppercase, punctuation, diacritics) cause startup failure.

## API Endpoints

```
GET /v1/merchant/resolve?q=<merchant_string>  # Returns merchant object + confidence
GET /health                                    # Health check with merchant count
```

## Environment Variables

- `PORT` (default: 3000)
- `HOST` (default: 127.0.0.1)

## Adding Merchants

1. Create one JSON file per brand in `src/data/merchants/`
2. Include all product variants as aliases/regex (e.g., `uber.json` covers Uber, Uber Eats, Uber Lime)
3. Pre-normalize all aliases before adding
4. Run `npm run lint` to validate
