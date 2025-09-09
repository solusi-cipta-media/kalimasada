import { parseArgs } from "node:util";

import { PrismaClient } from "@prisma/client";

import dummySeeder from "./dummy";
import PermissionSeeder from "./data/Permission.seed";

async function seed() {
  // your seed code here
  const {
    values: { mode }
  } = parseArgs({
    options: {
      mode: {
        type: "string",
        short: "m"
      }
    }
  });

  const db = new PrismaClient({ log: ["query", "info", "warn", "error"] });

  if (mode === "dummy") {
    await dummySeeder(db);
  }

  await PermissionSeeder(db);
  await db.$disconnect();
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {});
