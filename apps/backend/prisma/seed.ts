import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { ensureAdminSeed } from "../src/services/auth.service";

async function main() {
  await ensureAdminSeed({
    email: "admin@onlinehealth.local",
    password: "Admin123!",
    fullName: "Default Admin",
  });

  console.log("✅ Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

