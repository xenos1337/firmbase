# Contributing to Firmbase

Thanks for your interest in contributing!

## Adding a Merchant

1. Create a JSON file in `src/data/merchants/` named after the brand (e.g., `walmart.json`)
2. Follow the schema below
3. Ensure aliases are **pre-normalized** (lowercase, no punctuation, no diacritics)
4. Test locally with `npm run dev`
5. Submit a PR

### Merchant Schema

```json
{
    "id": "walmart",
    "name": "Walmart",
    "category": "GROCERIES",
    "subcategory": "SUPERMARKET",
    "merchant_channel": "HYBRID",
    "merchant_scope": "GLOBAL",
    "subscription_likely": false,
    "is_marketplace": true,
    "risk_level": "LOW",
    "aliases": [
        "walmart",
        "walmart store",
        "wal mart"
    ],
    "regex": [
        "^walmart"
    ],
    "website": "https://walmart.com",
    "logo_hint": {
        "type": "DOMAIN",
        "value": "walmart.com"
    }
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (lowercase, underscores) |
| `name` | string | Display name |
| `category` | enum | See taxonomy |
| `subcategory` | enum | See taxonomy |
| `merchant_channel` | enum | `PHYSICAL`, `ONLINE`, `HYBRID` |
| `merchant_scope` | enum | `LOCAL`, `NATIONAL`, `GLOBAL` |
| `subscription_likely` | boolean | Typically charges subscriptions? |
| `is_marketplace` | boolean | Multiple sellers? |
| `risk_level` | enum | `LOW`, `MEDIUM`, `HIGH` |
| `aliases` | string[] | Pre-normalized matching strings |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `regex` | string[] | Regex patterns for matching |
| `website` | string | Official website URL |
| `logo_hint` | object | `{ type: "DOMAIN", value: "domain.com" }` |

## Alias Rules

Aliases must be pre-normalized:

- Lowercase only
- No punctuation (spaces allowed)
- No diacritics or special characters

```
"starbucks"        ✓
"Starbucks"        ✗ (uppercase)
"starbucks.com"    ✗ (punctuation)
"café"             ✗ (diacritic)
```

## Regex Rules

Keep regex simple — match the brand family, not specific products:

```
"^walmart"         ✓ (matches all Walmart transactions)
"walmart grocery"  ✗ (too specific, use aliases)
```

## One File Per Brand

Products resolve to the parent brand. Don't create separate files for sub-brands:

- `uber.json` includes Uber, Uber Eats, Uber Lime
- `amazon.json` includes Amazon, Prime, Fresh, etc.

## Code Changes

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check for errors
5. Submit a PR

## Questions?

Open an issue if you're unsure about anything.
