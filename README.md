Roadmap AI — development notes

Quick start

- Copy .env.example to .env and fill in values (auth providers, PRISMA_DATABASE_URL)
- Install dependencies
- Run the dev server

Ratings & metrics schema

This repo includes community ratings, saves, and fork counters. After pulling, run a migration and regenerate Prisma Client so new models are available:

- pnpm prisma migrate dev -n add_ratings_metrics
- pnpm prisma generate

If you use npm or yarn, replace pnpm with your tool. Ensure PRISMA_DATABASE_URL is set.
