import { prisma } from "../src/db";

async function seed() {
  console.log("Seeding Inventory Service...");

  await prisma.inventory.deleteMany();

  // We should ideally get IDs from catalog-service, but for seeding 
  // we can use deterministic IDs if we had them or just mock some.
  // For now, let's create some dummy inventory entries.
  
  const sampleProductIds = [
    "4c9412cc-7c36-49d9-a5ec-b62f25b03bd1",
    "229b6173-7122-46da-b36f-ae2c228f708f",
    "78b95b43-52f2-4e97-b68e-d8837d8eba15",
    "3bacf92c-b145-47bc-a0c2-04619c6a95fc",
    "d58a4dee-021a-454a-aef3-4c9580a70c65",
    "f9d7182d-bc93-4ef4-898b-5968ca02783c",
    "dc548f63-caa3-4478-8e63-dc735f07777d",
    "8f72cffe-14a6-4b16-bf5d-2471a86f12c2"
  ];

  for (const pid of sampleProductIds) {
    await prisma.inventory.upsert({
      where: { productId: pid },
      update: { stock: 100 },
      create: {
        productId: pid,
        stock: 100,
        location: "Main Warehouse",
      }
    });
  }

  console.log("Inventory Service Seeded!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
