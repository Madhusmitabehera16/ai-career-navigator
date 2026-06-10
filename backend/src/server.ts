import "dotenv/config";
import app from "./app";
import { prisma } from "./config/prisma";

async function testDb() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected");
  } catch (err) {
    console.error("❌ Prisma connection failed", err);
  }
}

testDb();

const port = Number(process.env.PORT) || 5000;
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL:", process.env.DATABASE_URL?.slice(0, 60));

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
