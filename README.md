<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b81e5612-2aa9-4d02-b489-e229e4a7c0fe

## Run Locally

**Prerequisites:** Node.js and a Postgres database

1. Install dependencies:
   `npm install`
2. Set `DATABASE_URL` and `GEMINI_API_KEY` in [.env.local](.env.local)
3. Create and seed the database:
   `npm run db:migrate && npm run db:seed`
4. Run the app:
   `npm run dev`

## Deploy on Vercel

Connect a Vercel Marketplace Postgres/Neon database to the project so `DATABASE_URL`
is available in Production. After that, normal git pushes run Prisma migrations
during the Vercel build and deploy the app.
