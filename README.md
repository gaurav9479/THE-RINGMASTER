## THE-RINGMASTER — AI-Assisted Travel Planning Platform

An end-to-end, production-style full‑stack web app for AI-driven trip planning, discovery, booking, reviews, social travel stories, and admin moderation.

This project demonstrates senior-level architecture across a modern React frontend, Node/Express backend, a Python FastAPI AI microservice, and a MongoDB datastore, all containerized with Docker.

### Highlights
- AI trip planning via a Python agent orchestrating OpenWeather, OSM Nominatim (geocoding), OSRM (routing) and Mongo data
- Role-based access control (user, hotel_owner, event_organizer, admin)
- Admin suite for analytics, user management, and content moderation
- UGC travel stories with images (ImageKit optional), likes, comments, tags, filtering, and pagination
- Reviews with verified badges (tied to bookings) and rating distributions
- Hardening via Joi validation, NoSQL-injection-safe search, auth rate limiting, and structured error handling
- Dev-friendly DX: Vite proxy, in-memory Mongo fallback, demo user seeding, health checks

---

## Monorepo Layout
```
/backend         # Node/Express 5 API (Mongo via Mongoose 8)
/frontend        # React 19 + Vite 7 SPA (Tailwind v4)
/python_agent    # FastAPI microservice for itinerary planning
docker-compose.yml
```

### Recommended Ports
- Backend API: `http://localhost:1234`
- Frontend (Vite dev): usually `http://localhost:5173` (proxy to backend)
- Python agent: `http://localhost:8001` (via Docker; defaults to 8001)

---

## Tech Stack
- Frontend:
  - React 19, Vite 7, React Router v7
  - Tailwind CSS v4 (`@tailwindcss/vite`), custom theme tokens (`src/index.css`)
  - Axios with auth interceptor, Error Boundary, Framer Motion, Lucide Icons, Toastify/Hot Toast
- Backend:
  - Node.js, Express 5, Mongoose 8
  - JWT auth (access/refresh), bcrypt hashing, cookies/headers support
  - Input validation via Joi; global error handler; `express-rate-limit` (auth)
  - Multer uploads; ImageKit SDK integration (optional)
  - CORS, cookie-parser, structured `ApiResponse`/`ApiError`, `AsyncHandler`
  - OS integrations: OpenWeather, OSM Nominatim, OSRM (routing)
- Python AI Agent:
  - FastAPI, Uvicorn, requests, python-dotenv, pymongo
  - Aggregates weather, routing, DB recommendations, and generates itineraries + budgets
- Infra/DevOps:
  - Dockerfiles for all services (multi-stage for frontend + Nginx)
  - Docker Compose for local orchestration (backend, frontend, python-agent, MongoDB)
  - Health checks (`/api/v1/health`) and env-driven config

---

## System Architecture
1. Client (React SPA) calls Backend Node API at `/api/v1/*` using Axios with an interceptor that attaches the JWT access token.
2. Backend handles:
   - Auth, RBAC, data CRUD (hotels, events, bookings, reviews, stories)
   - Search (with input sanitization), weather proxy, maps routing
   - Orchestration calls to Python AI Agent for trip planning (`/api/v1/ai/plan`)
3. Python Agent:
   - Fetches weather (OpenWeather), performs geocoding (OSM Nominatim), routing (OSRM), pulls context from Mongo (hotels/events), and returns itinerary + budget.
4. MongoDB:
   - Primary datastore, with model indexes for performance.
5. Dev convenience:
   - If `MONGODB_URL` fails, backend falls back to `mongodb-memory-server` and seeds a demo user.

Data Flow — AI Planner (high level):
- Frontend submits destination/days to `/api/v1/ai/plan` (requires auth)
- Backend forwards to Python Agent `/plan-trip`
- Agent composes data from weather/routing/DB and returns a structured plan
- Backend relays the result using standard `ApiResponse`

---

## Features
- Authentication & Authorization
  - Email/password registration and login (bcrypt hashed)
  - JWT-based sessions; tokens via Authorization header and cookies
  - Role-based access control middleware (`verifyRole`)
  - Auth rate limiting to prevent brute force (`express-rate-limit`)
- Admin Suite
  - Dashboard stats, user growth analytics
  - User management: get/update role/suspend/delete
  - Moderation queues for reviews, hotels, events
- AI Trip Planner
  - Destination + days → Itinerary + budget + weather + route + recommendations
  - Python agent integration with external APIs and Mongo context
- Maps & Routing
  - Geocoding (OSM Nominatim) and driving distances/durations (OSRM)
  - Endpoint: `GET /api/v1/map/route?origin=<city>&destination=<city>&mode=driving`
- Search & Discovery
  - City search across hotels, restaurants, events with weather enrichment
  - NoSQL injection-safe regex and input sanitization
- Reviews & Ratings
  - Create/read/update/delete reviews; mark helpful
  - Verified badge via booking linkage
  - Rating distributions + pagination
- Travel Stories (UGC)
  - Create/read/update/delete stories with images (ImageKit optional)
  - Likes, comments, tags, filtering, pagination
  - Author-only updates; admin delete support
- Bookings
  - Polymorphic booking model for Hotel/Restaurant/Events
  - Status tracking and indexes for efficient lookups
- UX
  - Protected routes with role gating
  - Themed UI, motion effects, toasts, error boundaries

---

## Backend (Node/Express)
Location: `backend`

### Install
```bash
cd /Users/admin/Desktop/THE-RINGMASTER/backend
npm install
```

### Environment
Create `backend/.env`:
```env
# Server
PORT=1234
# Comma-separated list or wildcard; dev allows localhost:* by default
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Database
MONGODB_URL=mongodb://127.0.0.1:27017
# DB name is fixed in code as DB_NAME="RINGMASTER"

# Auth (JWT)
ACCESS_TOKEN_SECRET=replace_me_access
REFRESH_TOKEN_SECRET=replace_me_refresh
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

# External APIs
OPEN_WHEATHER_API_KEY=your_openweather_api_key

# Optional ImageKit (if configured, uploads enabled)
IMAGE_KIT_PUBLIC_KEY=
IMAGE_KIT_PRIVATE_KEY=
IMAGE_KIT_URL=
```

Notes:
- If Mongo connection fails, the app starts an in-memory MongoDB and seeds:
  - Demo user: `test@test.com` / `Test@123`
- CORS:
  - Backend allows `CORS_ORIGIN` list or any `http://localhost:<port>` for dev.

### Run (development)
```bash
cd /Users/admin/Desktop/THE-RINGMASTER/backend
npm run dev
# server listens on PORT (default 1234)
```

### Health Check
```
GET /api/v1/health
```

### Key Routes (non-exhaustive)
- Auth:
  - `POST /api/v1/user/register`
  - `POST /api/v1/user/login`
  - `POST /api/v1/user/logout`
- Weather:
  - `GET /api/v1/wheather/forecast?destination=Delhi&startDate=2025-01-01&endDate=2025-01-03` (legacy `/wheather` kept for compatibility), also mounted as `/weather`
- Maps:
  - `GET /api/v1/map/route?origin=New Delhi&destination=Jaipur&mode=driving`
- Search:
  - `GET /api/v1/search/city?destination=Jaipur`
- AI Planner:
  - `POST /api/v1/ai/plan` (requires auth) → delegates to Python agent
- Reviews, Bookings, Stories, Admin:
  - `/api/v1/reviews`, `/api/v1/bookings`, `/api/v1/travel-stories`, `/api/v1/admin`

### API Conventions
- All responses follow:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "message": "..."
}
```
- Errors are centralized via `ApiError` and returned by the global error handler with stack traces in development.

### Security & Validation
- Joi validation middleware (`validate`) for body/query/params
- NoSQL-injection-safe search by escaping regex meta-characters
- Rate limiting for auth endpoints
- RBAC middleware (`verifyRole`) for admin routes

### Performance Optimizations
- Mongo indexes on hot paths (users, hotels, bookings, reviews)
- `.lean()` queries for listing endpoints
- Pagination utilities with meta info
- In-memory Mongo fallback for frictionless dev and demos

---

## Python AI Agent (FastAPI)
Location: `python_agent`

### Responsibilities
- `/plan-trip`:
  - Weather (OpenWeather)
  - Geocoding (OSM Nominatim)
  - Routing (OSRM)
  - DB context (hotels/events via Mongo)
  - Itinerary generation + budget estimation

### Run (Docker via Compose) or Locally
```bash
cd /Users/admin/Desktop/THE-RINGMASTER/python_agent
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001
```

### Env
```env
MONGO_URI=mongodb://127.0.0.1:27017/ringmaster
OPENWEATHER_API_KEY=your_openweather_api_key
```

---

## Frontend (React/Vite)
Location: `frontend`

### Install
```bash
cd /Users/admin/Desktop/THE-RINGMASTER/frontend
npm install
```

### Dev Server
```bash
npm run dev
# Visit the printed URL, typically http://localhost:5173
```

### Backend Base URL
- Vite env: `VITE_API_URL` (Compose sets it)
- Axios client (`src/utils/axios.auth.jsx`) defaults to `http://localhost:1234/api/v1`
- Request interceptor attaches `Authorization: Bearer <token>` from `localStorage`

### Key UI Components
- `AiPlanner.jsx`: wizard to collect preferences and display generated itinerary
- `ProtectedRoute.jsx`: guards private routes and enforces roles
- Dashboards for user/vendor/admin; moderation screens
- Reusable UI (cards, rating, forms, comment section, image gallery)

---

## Running Everything (without Docker)
Open two terminals:

1) Backend
```bash
cd /Users/admin/Desktop/THE-RINGMASTER/backend
npm run dev
```

2) Frontend
```bash
cd /Users/admin/Desktop/THE-RINGMASTER/frontend
npm run dev
```

Optional 3) Python Agent (if running locally)
```bash
cd /Users/admin/Desktop/THE-RINGMASTER/python_agent
uvicorn main:app --host 0.0.0.0 --port 8001
```

---

## Docker & Compose
- Multi-service stack:
  - `backend` (Node), `frontend` (Nginx), `python-agent` (FastAPI), `mongodb`
- Health checks and envs configured in `docker-compose.yml`
- Frontend served by Nginx (multi-stage build) at `http://localhost:3000`
- Backend at `http://localhost:1234`
- Python Agent at `http://localhost:8001`

Start:
```bash
docker compose up --build
```

---

## Example Requests (cURL)
Login:
```bash
curl -s http://localhost:1234/api/v1/user/login \
  -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123"}'
```

City Search:
```bash
curl "http://localhost:1234/api/v1/search/city?destination=Jaipur"
```

Route (GET with query):
```bash
curl "http://localhost:1234/api/v1/map/route?origin=New%20Delhi&destination=Jaipur&mode=driving"
```

AI Plan (requires auth token):
```bash
curl -s http://localhost:1234/api/v1/ai/plan \
  -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"destination":"Jaipur","days":3}'
```

---

## Troubleshooting
- Port mismatch:
  - If backend isn’t on `1234`, update `VITE_API_URL` or `axios` base URL.
- CORS errors:
  - Backend allows `CORS_ORIGIN` list and any `http://localhost:<port>` for dev.
  - Restart backend after env changes.
- Mongo connection:
  - Verify `MONGODB_URL` or use Atlas (allowlist your IP).
  - If local Mongo fails, in-memory DB boots and seeds a demo user.
- JWT issues:
  - Ensure secrets/expiries are set; clear `localStorage` when changing secrets.
- External APIs:
  - Set `OPEN_WHEATHER_API_KEY` (OpenWeather).
- Image uploads:
  - Configure ImageKit keys (optional). Without keys, uploads are no-ops by design.

---

## Useful Scripts
Backend (`/backend/package.json`):
- `npm run dev` — Starts server with nodemon at `src/server.js`.

Frontend (`/frontend/package.json`):
- `npm run dev` — Starts Vite dev server.
- `npm run build` — Builds production assets.
- `npm run preview` — Previews production build locally.

Python Agent:
- `uvicorn main:app --host 0.0.0.0 --port 8001`

---

## System Info
- Tested with macOS, Node 20 (works with Node >= 18), npm >= 9

---

## Notes on Design Decisions & Optimizations
- Consistent API shape (`ApiResponse`/`ApiError`) and `AsyncHandler` simplify error propagation
- Rate limiting around auth endpoints increases security posture
- Input validation and sanitized regex queries mitigate common attack vectors
- Mongo indexes added on high-cardinality fields for snappy queries
- `.lean()` used for collections to reduce hydration overhead where appropriate
- In-memory DB fallback enables quick demos and resilience for local dev; seeds a known demo user
- Vite dev proxy and Axios interceptor streamline DX and auth
- Health endpoint + Docker healthchecks improve observability and container orchestration robustness