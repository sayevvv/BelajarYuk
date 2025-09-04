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

Environment variables

Add these to .env.local (or .env) as needed:

- PRISMA_DATABASE_URL (and/or DATABASE_URL)
- GOOGLE_API_KEY  # for Gemini generation
- GITHUB_TOKEN    # for GitHub Models (used by /api/generate-roadmap-gh)
- GITHUB_MODELS_ENDPOINT (optional, default: https://models.github.ai/inference)

After updating env, restart the dev server.
