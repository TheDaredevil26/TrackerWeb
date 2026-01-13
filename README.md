
# Knowledge Tracker

Personal knowledge tracker for capturing topics as structured "knowledge units" with status, difficulty, and confidence. Built so I could stop drowning in scattered notes and keep a tight feedback loop on what to revisit next.

Try it out here :- https://knowledge-tracker.onrender.com/

## What it does
- Capture knowledge units with title, category, difficulty, status, confidence, and notes.
- Update and delete units safely per user; everything is session-protected.
- Filter by status, difficulty, or category to find the next thing to study.
- Dashboard highlights recent units; list view shows everything with inline edit/delete.

## Tech stack
- Backend: Node.js, Express 5, MongoDB, Mongoose, express-session, bcrypt, dotenv, CORS.
- Frontend: HTML, CSS, Tailwind CSS 4 (CLI), vanilla JavaScript.

## Architecture at a glance
- Express serves the static frontend and exposes REST endpoints.
- Sessions are cookie-based (httpOnly, sameSite=none, secure=true) via express-session.
- MongoDB stores users and knowledge units with per-user scoping.

## Local setup
1) Prereqs: Node 18+ and access to MongoDB (local or Atlas).
2) Install backend deps:
   - `cd backend`
   - `npm install`
3) Install frontend deps (for Tailwind builds):
   - `cd frontend`
   - `npm install`
4) Configure environment in backend/.env:
   - `MONGO_URI=mongodb+srv://...`
   - `SESSION_SECRET=your-secret`
   - `FRONTEND_ORIGIN=http://localhost:3000` (comma-separated list if needed)
   - Optional: `PORT=3000`, `BASE_URL=http://localhost:3000`
5) Point the frontend to your backend origin by updating the BASE_URL constant in [frontend/js/api.js](frontend/js/api.js#L1-L2).

## Run it
- Start the server (serves API and static frontend):
  - `cd backend && npm start`
- Open http://localhost:3000 to register/login and start tracking.
- If you edit Tailwind styles, rebuild once or watch:
  - `cd frontend && npx tailwindcss -i src/input.css -o styles/output.css --watch`

## API quick reference
- `POST /auth/register` - create user (sets session).
- `POST /auth/login` - authenticate (sets session).
- `POST /auth/logout` - destroy session.
- `GET /me` - session check.
- `POST /knowledge/add` - create knowledge unit (auth).
- `GET /knowledge/all` - list user units (auth).
- `PATCH /knowledge/:id` - update selected fields (auth).
- `DELETE /knowledge/del/:id` - delete a unit (auth).

## Frontend flows
- Dashboard shows up to six recent units with difficulty/status badges and a confidence bar.
- Knowledge Units page lists all entries with filters; inline modals handle create/update/delete.

## Deployment notes
- For hosted environments, set FRONTEND_ORIGIN to your deployed frontend and update the frontend BASE_URL to that origin so cookies work across origins.

## Personal note
I built this because my study notes were fragmented across docs and sticky notes. This app keeps me honest about what I actually know (and what I only think I know) by forcing a status, confidence score, and a revision history. Hope it helps you build the same habit.
