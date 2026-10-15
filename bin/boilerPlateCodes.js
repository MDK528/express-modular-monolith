export const mongodbConnectionCode = `import mongoose from "mongoose";

export const connectionDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
    }catch (error) { 
        console.error("MongoDB connection failed", error);
        process.exit(1);
    }
};`


export const drizzlePostgresCode = `import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";


export const db = drizzle(process.env.DATABASE_URL);`


export const drizzleConfigCode = `import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/modules/**/*.model.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
});`


export const prismaConfigCode = `import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src",
  migrations: { 
    path: "src/common/prisma/migrations" 
  },
  datasource: { 
    url: process.env.DATABASE_URL!
  },
});`

