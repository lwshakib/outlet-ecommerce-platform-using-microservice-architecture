import { prisma as catalogPrisma } from "../../catalog-service/src/db";
import { prisma as inventoryPrisma } from "../src/db";

async function syncSeeding() {
  console.log("Synchronizing Seeding between Catalog and Inventory...");

  try {
    const products = await catalogPrisma.product.findMany();
    
    if (products.length === 0) {
      console.log("No products found in Catalog Service. Seed Catalog first.");
      return;
    }

    await inventoryPrisma.inventory.deleteMany();

    for (const prod of products) {
      await inventoryPrisma.inventory.create({
        data: {
          productId: prod.id,
          stock: Math.floor(Math.random() * 100) + 10,
          location: "Global Warehouse"
        }
      });
    }

    console.log(`Synced inventory for ${products.length} products!`);
  } catch (err) {
    console.error("Sync Seeding Failed:", err);
  } finally {
    await catalogPrisma.$disconnect();
    await inventoryPrisma.$disconnect();
  }
}

syncSeeding();
