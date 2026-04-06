  # STYLE.md

## Project: Star Stalker — NBA Team Flight Tracker

This document defines coding standards, formatting conventions, and design principles for this project.

---

## 1. General principles

- Optimize for **readability** and **maintainability**.
- Keep functions small (≤ 40 lines when practical).
- Prefer clear, explicit code over “clever” code.
- Avoid premature abstraction; refactor when repetition appears.
- Validate all external data; never assume API responses are correct.

---

## 2. Naming conventions

| Element | Convention | Example |
|---|---|---|
| Variables | `camelCase` | `teamName`, `startDate` |
| Functions | `camelCase` | `getFlightLogs()`, `filterByAirport()` |
| Classes/Types | `PascalCase` | `FlightLog`, `TeamProfile` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RESULTS`, `DEFAULT_PAGE_SIZE` |
| Files | `kebab-case` (preferred) | `flight-service.ts`, `date-utils.js` |
| Directories | `kebab-case` | `data-access/`, `api/` |

Notes:
- Names should convey intent: prefer `departureAirportCode` over `dep`.
- Booleans should read naturally: `isValid`, `hasResults`, `shouldCache`.

---

## 3. Formatting

### 3.1 Indentation & whitespace
- JavaScript (React): **2 spaces** indentation.
- Java (Spring Boot): **4 spaces** indentation.
- No trailing whitespace.
- One blank line between logical sections.
- Max line length: **100** characters (unless a URL forces longer).

### 3.2 Quotes
- JavaScript: single quotes `'` unless the string contains `'`.
- Java: double quotes `"` (language default).

---

## 4. Documentation

### 4.1 Public APIs
All exported/public functions must have:
- Purpose
- Parameters
- Return value
- Errors thrown / error shape

JS/TS example:

```js
/**
 * Fetch flight logs for a given subject within an optional date range.
 * @param {string} subjectId - Internal identifier for the subject.
 * @param {string} [from] - ISO date `YYYY-MM-DD` inclusive.
 * @param {string} [to] - ISO date `YYYY-MM-DD` inclusive.
 * @returns {Promise<FlightLog[]>} Flight logs sorted newest -> oldest.
 * @throws {NotFoundError} When the subject does not exist.
 */
```

### 4.2 Inline comments
- Comment **why**, not what.
- Prefer self-documenting code; comments should clarify decisions and edge cases.

---

## 5. Error handling

- Never silently fail.
- Prefer typed/structured errors, e.g. `{ code, message, details }`.
- Do not expose secrets or raw stack traces to users; log them server-side.
- Always include context in logs (request id, subject id, filters).

Example shape:

```json
{
  "code": "INVALID_DATE_RANGE",
  "message": "from must be <= to",
  "details": { "from": "2026-02-01", "to": "2026-01-31" }
}
```

---

## 6. Data handling & validation

- Treat all external input as untrusted:
  - user search terms
  - query params
  - API responses
  - uploaded files
- Validate:
  - date formats (ISO 8601)
  - airport codes (IATA/ICAO if applicable)
  - tail numbers (format per data source)
- Normalize internal representations:
  - store dates in ISO `YYYY-MM-DD`
  - store timestamps in UTC

Security:
- Store secrets in environment variables; never commit `.env` files.
- Apply input sanitization to prevent injection (SQL/NoSQL, logs, HTML, etc.).
- Use least privilege for any data access credentials.

---

## 7. Project structure

The repository is split into two independently runnable apps:

**Backend** (`backend/src/main/java/…`):
```
controllers/    REST endpoint handlers — no business logic
services/       Business logic (flight refresh, scheduling, mock data)
repositories/   Spring Data JPA interfaces
entities/       JPA entity classes (Team, Flight, Airport, …)
dto/            External API response shapes (AirplanesLive)
config/         Spring configuration (Flyway, CORS, RestTemplate)
```

**Frontend** (`frontend/src/`):
```
components/
  common/       Header, Footer, skeletons, error messages
  flight/       TeamCard, TeamList, FlightSearch, FlightStatus, FlightMap
context/        AppContext (shared loading/error/search state)
hooks/          useFavorites, useDarkMode
pages/          HomePage, SearchPage, FlightDetailsPage, TrackingPage
services/       teamService (API calls)
styles/         App.css, Common.css, Flight.css, dark-mode.css
utils/          mockData, teamApiMapper, constants, formatters, validators
```

Rules:
- Controllers must not contain business logic.
- Services must not import UI code.
- Keep modules acyclic when possible.

---

## 8. Testing

- New features must include tests.
- Prefer deterministic tests; avoid reliance on live external APIs.
- Use fixtures/mocks for provider responses.
- Cover edge cases:
  - no results
  - invalid dates
  - unknown subject
  - pagination boundaries
  - provider timeouts / failures

Test naming:
- “returns empty list when …”
- “throws INVALID_DATE_RANGE when …”

---

## 9. Git & commits

Follow Conventional Commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `refactor:` internal code change without behavior change
- `test:` tests only
- `chore:` tooling/build

Examples:
- `feat: add filtering by airport code`
- `fix: handle provider timeout with retry backoff`
- `docs: clarify tail number normalization`

---

## 10. UI/display conventions (if applicable)

- Default sort: newest → oldest.
- Show dates in ISO format (`YYYY-MM-DD`) and times in UTC unless user selects otherwise.
- Clearly label:
  - departure / arrival airports
  - aircraft type
  - tail number
  - duration / distance (if available)
- Indicate data source(s) and last updated timestamp.

---

## 11. Ethical & legal note

This project is intended for educational/demo use.
- Use **only** publicly available data sources and comply with their terms.
- Do not attempt to access non-public, private, or restricted information.
- Avoid presenting data in a way that facilitates harassment or stalking.
