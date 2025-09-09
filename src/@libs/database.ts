import "server-only";

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  database: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const database = globalThis.database ?? prismaClientSingleton();

export default database;

if (process.env.APP_MODE !== "production") globalThis.database = database;
