# BM Show — Minimal FSD-style scaffold

This workspace contains a minimal full-stack scaffold demonstrating an FSD-like component layout:

- backend — Express server with MySQL connection and simple `shows` / `bookings` endpoints
- frontend — Vite + React with small `shared`, `entities`, `features` folders showing FSD-style components

Quick start:

1. Start MySQL and create a database (or let the server create it if your MySQL user has privileges).
2. Backend:

```bash
cd backend
copy .env.example .env   # set DB creds
npm install
npm run start
```

3. Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend in the browser and try booking a show. If backend runs on a different host/port, update the fetch URLs in `frontend/src/App.jsx` and `frontend/src/features/Booking/ui/BookingForm/BookingForm.jsx`.

Docker quick start (MySQL):

If you have Docker installed you can run a local MySQL quickly:

```bash
docker compose up -d
```

This starts a MySQL server with database `bmshow` and root password `example` (see `docker-compose.yml`). Then copy `backend/.env.example` to `backend/.env` and set `DB_HOST=db` and `DB_PASSWORD=example`, then start the backend.

