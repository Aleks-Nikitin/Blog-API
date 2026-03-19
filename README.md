# Blog-API

Express + Prisma (Postgres) backend + a single React + Vite + Tailwind frontend (`frontend/App`).

Some API routes exist but aren’t wired into the UI yet.

## Run locally

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
SECRET_KEY=your_jwt_secret
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
```

```bash
npx prisma generate
npx prisma migrate dev
node app.js
```

### Frontend

```bash
cd frontend/App
npm install
```

Create `frontend/App/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

## Frontend routes

- `/` — published posts
- `/posts/:postId` — full post + comments
- `/signup` — signup
- `/login` — login
- `/create` — create post (requires login)
