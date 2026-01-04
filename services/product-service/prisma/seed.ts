import { prisma } from "../src/lib/prisma";

async function seed() {
  console.log("Seeding Product Service...");

  await prisma.product.deleteMany();
  await prisma.company.deleteMany();

  const companies = [
    { name: "Acme Luxury", description: "Global leader in high-end retail.", ownerId: "user-1" },
    { name: "Zenith Brands", description: "Exclusive manufacturer of fine goods.", ownerId: "user-1" },
  ];

  for (const comp of companies) {
    const company = await prisma.company.create({
      data: comp,
    });

    const products = [
      {
        name: `${company.name} Signature Watch`,
        description: "A timeless masterpiece.",
        price: 15000,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
        category: "Watches",
        companyId: company.id,
      },
      {
        name: `${company.name} Executive Suit`,
        description: "Tailored to perfection.",
        price: 2500,
        images: ["https://images.unsplash.com/photo-1594932224010-7566467dce8f"],
        category: "Apparel",
        companyId: company.id,
      }
    ];

    for (const prod of products) {
      await prisma.product.create({
        data: prod,
      });
    }
  }

  console.log("Product Service Seeded!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
