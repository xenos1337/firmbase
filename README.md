# Firmbase

A simple, self-hostable API for resolving messy merchant strings (e.g., from bank statements) to canonical merchant objects.

## What it does

Given a messy transaction descriptor like `UBER * EATS PENDING`, the API returns a structured merchant object:

```json
{
  "merchant_id": "uber",
  "name": "Uber",
  "category": "TRANSPORT",
  "subcategory": "RIDE_SHARING",
  "merchant_channel": "HYBRID",
  "merchant_scope": "GLOBAL",
  "subscription_likely": false,
  "is_marketplace": true,
  "risk_level": "LOW",
  "website": "https://uber.com",
  "logo_hint": {
    "type": "DOMAIN",
    "value": "uber.com"
  },
  "confidence": 0.85
}
```

**Note:** Products (Uber Eats, Uber Lime, etc.) resolve to the parent brand (Uber). There is one canonical merchant per brand.

## Self-hosting

### Requirements

- Node.js 22+

### Installation

```bash
npm install
```

### Running

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

The server listens on port 3000 by default. Set the `PORT` environment variable to change it.

## API

### Resolve a merchant

```
GET /v1/merchant/resolve?q=<string>
```

**Parameters:**
- `q` (required): The merchant string to resolve

**Response (match found):**
```json
{
  "merchant_id": "uber",
  "name": "Uber",
  "category": "TRANSPORT",
  "subcategory": "RIDE_SHARING",
  "merchant_channel": "HYBRID",
  "merchant_scope": "GLOBAL",
  "subscription_likely": false,
  "is_marketplace": true,
  "risk_level": "LOW",
  "website": "https://uber.com",
  "logo_hint": {
    "type": "DOMAIN",
    "value": "uber.com"
  },
  "confidence": 0.96
}
```

**Response (no match / low confidence):**
```json
{
  "merchant_id": null,
  "confidence": 0.42
}
```

### Health check

```
GET /health
```

Returns `{ "status": "ok", "merchants": <count> }`

## Adding a new merchant

### One file per brand

Each brand gets exactly one JSON file. Do NOT create separate files for products or sub-brands:

- `uber.json` - includes aliases for Uber, Uber Eats, Uber Lime, etc.
- `amazon.json` - includes aliases for Amazon, Amazon Prime, Amazon Fresh, etc.

Product differentiation is handled via aliases and regex patterns, not separate merchant files.

### Merchant file format

Create a new JSON file in `src/data/merchants/`:

```json
{
  "id": "acme",
  "name": "ACME Corp",
  "category": "SHOPPING",
  "subcategory": "E_COMMERCE",
  "merchant_channel": "ONLINE",
  "merchant_scope": "NATIONAL",
  "subscription_likely": false,
  "is_marketplace": false,
  "risk_level": "LOW",
  "aliases": [
    "acme",
    "acme corp",
    "acme corporation"
  ],
  "regex": [
    "^acme"
  ],
  "website": "https://acme.com",
  "logo_hint": {
    "type": "DOMAIN",
    "value": "acme.com"
  }
}
```

### Field reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique identifier (lowercase, underscores) |
| `name` | Yes | string | Display name |
| `category` | Yes | enum | See categories below |
| `subcategory` | Yes | enum | See subcategories below |
| `merchant_channel` | Yes | enum | `PHYSICAL`, `ONLINE`, `HYBRID` |
| `merchant_scope` | Yes | enum | `LOCAL`, `NATIONAL`, `GLOBAL` |
| `subscription_likely` | Yes | boolean | Whether this merchant typically charges subscriptions |
| `is_marketplace` | Yes | boolean | Whether this is a marketplace (multiple sellers) |
| `risk_level` | Yes | enum | `LOW`, `MEDIUM`, `HIGH` |
| `aliases` | Yes | string[] | Pre-normalized strings to match against |
| `regex` | No | string[] | Regex patterns to match against normalized input |
| `website` | No | string | Official website URL |
| `logo_hint` | No | object | `{ type: "DOMAIN", value: "domain.com" }` |

### Alias requirements

Aliases must be **pre-normalized**:

- Lowercase only (no uppercase)
- No punctuation (spaces allowed)
- No diacritics or special characters
- No noise words (pending, ref, transaction, etc.)

Examples:
- `"uber eats"` (correct)
- `"Uber Eats"` (wrong - uppercase)
- `"netflix.com"` (wrong - punctuation)

### Regex requirements

Regex patterns should identify **brand families**, not specific products:

- `"^uber"` (correct - matches all Uber products)
- `"^amazon"` (correct - matches all Amazon products)
- `"uber eats"` (wrong - too specific, use aliases instead)

### Categories

- `ATM` - ATM transactions
- `AUTOMOTIVE` - Gas stations, car washes, repairs, parts
- `DIGITAL_SERVICES` - Software, cloud services
- `EDUCATION` - Tuition, courses, books
- `ENTERTAINMENT` - Streaming, gaming, movies, music
- `FEES_AND_CHARGES` - Bank fees, service fees
- `FINANCE` - Banking, investments, loans
- `FOOD_AND_DRINK` - Cafes, restaurants, bars, fast food
- `GIFTS_AND_DONATIONS` - Charity, gifts
- `GOVERNMENT` - Taxes, licenses, fines
- `GROCERIES` - Supermarkets, convenience stores
- `HEALTHCARE` - Hospitals, dental, vision, pharmacy
- `HOME` - Improvement, furniture, appliances, rent
- `INSURANCE` - Auto, health, home, life insurance
- `PERSONAL_CARE` - Salons, spas, cosmetics
- `PET_CARE` - Veterinary, pet supplies, grooming
- `SERVICES` - Professional, household, legal
- `SHOPPING` - E-commerce, department stores, clothing
- `SPORTS_AND_FITNESS` - Gyms, equipment, events
- `TRANSPORT` - Ride-sharing, taxis, public transport
- `TRAVEL` - Hotels, flights, vacation rentals
- `UTILITIES` - Electricity, gas, water, internet, phone

### Merchant channels

- `PHYSICAL` - Brick-and-mortar only
- `ONLINE` - Online only
- `HYBRID` - Both physical and online

### Scope

- `LOCAL` - Single city/region
- `NATIONAL` - Single country
- `GLOBAL` - Multiple countries

### Risk levels

- `LOW` - Well-known, reputable merchant
- `MEDIUM` - Less established or niche
- `HIGH` - Higher fraud risk category

## How matching works

1. Input is normalized: Unicode normalization, diacritic folding, lowercase, removal of noise words (pending, ref, transaction, etc.)
2. Each merchant's regex patterns are tested against the normalized input
3. Each merchant's aliases are compared using token similarity
4. A confidence score is calculated
5. If confidence >= 0.70, the best match is returned
6. Otherwise, a no-match response with the best confidence is returned

## Contributing

1. Fork the repo
2. Add your merchant JSON file to `src/data/merchants/`
3. Ensure aliases are pre-normalized
4. Test locally with `npm run dev`
5. Submit a PR

## License

Free to use, modify, and self-host. No commercial use. See [LICENSE](LICENSE.md).
