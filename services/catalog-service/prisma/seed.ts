import { prisma } from "../src/db";

async function seed() {
  console.log("Seeding Catalog Service...");

  // Clear existing data
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = [
    { name: "Luxury Apparel", description: "Premium clothing from top designers" },
    { name: "High-End Watches", description: "Exclusive timepieces" },
    { name: "Designer Bags", description: "Luxury handbags and accessories" },
    { name: "Fine Jewelry", description: "Exquisite jewelry items" },
  ];

  for (const cat of categories) {
    const category = await prisma.category.create({
      data: cat,
    });

    // Create some products for each category
    const products = [
      {
        name: `${cat.name} Item 1`,
        description: `Premium quality ${cat.name.toLowerCase()} for the elite.`,
        price: Math.floor(Math.random() * 500000) + 1000,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
        categoryId: category.id,
        companyName: "Acme Luxury",
        companyId: "company-1",
      },
      {
        name: `${cat.name} Item 2`,
        description: `Exclusively crafted ${cat.name.toLowerCase()} piece.`,
        price: Math.floor(Math.random() * 2000000) + 10000,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
        categoryId: category.id,
        companyName: "Zenith Brands",
        companyId: "company-2",
      },
    ];

    for (const prod of products) {
      await prisma.product.create({
        data: prod,
      });
    }
  }

  console.log("Catalog Service Seeded!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
