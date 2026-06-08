import { PrismaClient } from "@prisma/client";

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

function maskDbUrl(url: string | undefined) {
  if (!url) return "(none)";
  try {
    const after = url.split("//")[1] ?? url;
    const parts = after.split("@");
    if (parts.length === 1) return "***@" + parts[0];
    return "***@" + parts[1];
  } catch {
    return "(masked)";
  }
}

if (process.env.NODE_ENV !== "production") {
  // Log a masked DB host so developers can verify which env var was used
  // without revealing credentials in logs.
  // eslint-disable-next-line no-console
  console.log("Prisma DATABASE_URL =>", maskDbUrl(process.env.DATABASE_URL));
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
