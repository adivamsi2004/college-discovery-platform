# College Discovery Platform

A production-grade MVP for a college discovery and decision platform built with Next.js, Tailwind CSS, Prisma, and PostgreSQL.

## What is included

- College listing with search, location and course filtering, and pagination
- College detail page with overview, courses, placements, and reviews
- College comparison page for 2–3 colleges
- Simple rank predictor tool using rule-based recommendations
- Backend APIs with Prisma and a PostgreSQL data model

## Tech stack

- Frontend: Next.js 14 + React + Tailwind CSS
- Backend: Next.js API routes + Prisma
- Database: PostgreSQL (configured via `DATABASE_URL`)

## Getting started

1. Copy `.env.example` to `.env`
2. Update `DATABASE_URL` with your PostgreSQL connection string
3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client and push schema:

```bash
npx prisma generate
npx prisma db push
```

5. Seed the database:

```bash
npm run prisma:seed
```

6. Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`

## Deployment notes

- Frontend can deploy on Vercel
- Backend APIs are part of the same Next.js app
- PostgreSQL can deploy on Railway, Supabase, or Render

## Project structure

- `app/` – Next.js pages and routes
- `app/api/` – REST APIs for college listing and predictors
- `components/` – reusable UI components
- `lib/db.ts` – Prisma client wrapper
- `prisma/` – database schema and seed script

## Next steps

- Add authentication and saved colleges
- Add reviews and discussion features
- Deploy on Vercel + Railway for a live URL
