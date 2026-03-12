# NeoCortex OS
A full-stack personal life dashboard web application that helps manage your entire life including Islamic practices, learning, fitness, productivity, and personal development.

## Project Structure
This is a monorepo containing:
- `frontend/` - Next.js App Router application
- `backend/` - Node.js Express API
- `dev.db` - Local SQLite Database (created dynamically via Prisma)

## Tech Stack
- Frontend: Next.js 16+, Tailwind CSS, Framer Motion, Lucide React
- Backend: Node.js, Express, Prisma ORM
- Database: SQLite (easily swappable to PostgreSQL)
- Auth: Custom JWT email-based authentication

## Quick Start (Local Development)

### 1. Setup Backend
```bash
cd backend
npm install
npm run dev
```
*(The `dev` script uses `tsx` to run the server in watch mode and load `.env` variables)*
*The backend API will run on `http://localhost:5000`*

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:3000`*

## Environment Variables
Create a `.env` file in the `backend/` directory with the following:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-neocortex-key" # Change this in production
PORT=5000
```

## Features
- **Islamic Practices**: Track daily Salat, Quran reading, and tap Dhikr counter.
- **Study & Skills**: Use the live focus timer and track your learning sessions.
- **Fitness & Health**: Log your daily exercise routine and calorie intake.
- **Productivity**: Set goals with deadlines and track daily habits.
- **Personal Reflection**: Log your daily mood and journal your activities.
- **Global Analytics**: See aggregated metrics directly from your Neural Hub (dashboard).

## Deployment

To deploy this to production, you'll want to separate the frontend and backend deployments, or combine them using a platform like Render or Vercel.

**Updating Database for Production:**
Update your `schema.prisma` file provider from `sqlite` to `postgresql`, and update the `DATABASE_URL` in your `.env` to point to a managed PostgreSQL cluster (like Supabase, Neon, or AWS RDS).

**Running migrations:**
`npx prisma db push` or `npx prisma migrate deploy`

Enjoy using your new Personal Operating System!
