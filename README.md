## THE-RINGMASTER — Local Setup Guide

This guide helps a beginner get the project running locally for both backend (Node/Express/MongoDB) and frontend (React/Vite).

### Prerequisites
- **Node.js**: Recommend Node 20 LTS (minimum Node 18). Use `nvm` if possible.
- **npm**: Comes with Node.
- **MongoDB**: Local instance or MongoDB Atlas connection string.
- An editor/terminal.

```bash
# macOS with nvm
brew install nvm
mkdir -p ~/.nvm && echo 'export NVM_DIR="$HOME/.nvm"\n. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc && source ~/.zshrc
nvm install 20 && nvm use 20
node -v && npm -v
```

### Monorepo layout
```
/backend
/frontend
```

### Recommended ports
- Backend API: `http://localhost:1234` (set `PORT=1234` to match frontend default base URL)
- Frontend (Vite dev): `http://localhost:5173`

---

## Backend (Node/Express)

Location: `backend`

### Install dependencies
```bash
cd /Users/admin/Desktop/THE-RINGMASTER/backend
npm install
```

### Environment variables
Create `backend/.env` with the following keys. Values are examples; replace with your own.

```env
# Server
PORT=1234
CORS_ORIGIN=http://localhost:5173

# Database
MONGODB_URL=mongodb://127.0.0.1:27017

# Database name is fixed in code as DB_NAME="RINGMASTER"

# Auth (JWT)
ACCESS_TOKEN_SECRET=superlongrandomstring_access
REFRESH_TOKEN_SECRET=superlongrandomstring_refresh
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

# External APIs
OPEN_WHEATHER_API_KEY=your_openweather_api_key
```

Notes:
- The app connects to MongoDB at `${MONGODB_URL}/RINGMASTER`.
- CORS defaults to `http://localhost:5173` if not set.

### Start MongoDB (required)
You must have a running MongoDB for the backend to start successfully.

Local MongoDB (Homebrew on macOS):
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

Local MongoDB (generic):
```bash
# Ensure mongod service is running
mongod --config /usr/local/etc/mongod.conf
```

Using MongoDB Atlas:
```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-host>/
```
Make sure your IP is allowlisted in Atlas and credentials are correct.

### Start the backend (development)
Use the dev script (nodemon) because the `start` script points to a non-existent path.

```bash
cd /Users/admin/Desktop/THE-RINGMASTER/backend
npm run dev
# Server listens on PORT or 7000 by default. We recommend PORT=1234.
```

API base path: `/api/v1`

Verify connection:
- On successful DB connect, you should see: `MONGO_DB connected!!DB Host ✅ :<host>`
- On server start, you should see: `server is running at port: <PORT>`

Key routes (non-exhaustive):
- `POST /api/v1/user/register`
- `POST /api/v1/user/login`
- `POST /api/v1/user/logout`
- `POST /api/v1/weather` (OpenWeather-backed)
- `POST /api/v1/route` (routing via OSRM + OSM geocoding)
- `GET  /api/v1/search/city?destination=Jaipur`

---

## Frontend (React/Vite)

Location: `frontend`

### Install dependencies
```bash
cd /Users/admin/Desktop/THE-RINGMASTER/frontend
npm install
```

### Backend base URL (important)
The frontend expects the backend at `http://localhost:1234/api/v1` by default. Ensure the backend `PORT=1234` or update this line in `frontend/src/utils/axios.auth.jsx`:

```js
const API = axios.create({
  baseURL: "http://localhost:1234/api/v1",
  headers: { "Content-Type": "application/json" },
});
```

### Start the frontend (development)
```bash
cd /Users/admin/Desktop/THE-RINGMASTER/frontend
npm run dev
# Visit the printed URL, typically http://localhost:5173
```

---

## Running everything together
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

Visit the frontend in your browser (usually `http://localhost:5173`).

---

## Troubleshooting
- **Port mismatch**: If the backend isn’t on `1234`, update `frontend/src/utils/axios.auth.jsx` `baseURL` to match your backend port.
- **CORS errors**: Make sure `CORS_ORIGIN` in `backend/.env` matches your frontend URL (e.g., `http://localhost:5173`). Restart the backend after changes.
- **Mongo connection errors**: Verify `MONGODB_URL` is reachable and your DB is running. For Atlas, use your connection string and IP allowlist.
- **JWT issues**: Ensure `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, and expiry values are set; delete old cookies/localStorage when changing secrets.
- **Weather API errors**: Set a valid `OPEN_WHEATHER_API_KEY`.

---

## Useful scripts

Backend (`/backend/package.json`):
- `npm run dev` — Starts server with nodemon at `src/server.js`.

Frontend (`/frontend/package.json`):
- `npm run dev` — Starts Vite dev server.
- `npm run build` — Builds production assets.
- `npm run preview` — Previews production build locally.

---

## System info
- Tested with: macOS, Node 20 (works with Node >= 18), npm >= 9



