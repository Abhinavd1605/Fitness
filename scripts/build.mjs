import { spawnSync } from "node:child_process";

function resolveDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  );
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = resolveDatabaseUrl();
}

if (!process.env.DATABASE_URL) {
  console.error(
    "Missing database URL. Set DATABASE_URL or one of the Neon/Vercel Postgres fallbacks.",
  );
  process.exit(1);
}

const steps = [
  ["prisma", ["migrate", "deploy"]],
  ["next", ["build"]],
];

for (const [command, args] of steps) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}