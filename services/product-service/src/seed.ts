import { prisma } from "./lib/prisma";
import logger from "./logger/winston.logger";

const categories = [
  { name: "watch", keywords: ["luxury-watch", "rolex", "omega", "patek-philippe", "audemars-piguet"] },
  { name: "motorcycle", keywords: ["ducati", "harley-davidson", "superbike", "mv-agusta"] },
  { name: "car", keywords: ["ferrari", "lamborghini", "luxury-car", "bentley", "rolls-royce", "porsche"] },
  { name: "helicopter", keywords: ["helicopter", "chopper", "bell-helicopter"] },
  { name: "private-jet", keywords: ["private-jet", "gulfstream", "airplane", "bombardier"] },
  { name: "yacht", keywords: ["yacht", "superyacht", "luxury-boat"] }
];

const companyNames = [
  "Elite Luxuries", "Apex Motors", "Skyline Aviation", "Oceans Eleven Yachts", 
  "Precision Timepieces", "Velocity Supercars", "Nomad Adventures", "Grandeur Estates",
  "Heritage Motors", "Zenith Watches", "Cloud Nine Jets", "Vanguard Marine",
  "Aura Lux", "Prism Products", "Summit Gear", "Legacy Wheels"
];

const getImageUrl = (keyword: string) => `https://loremflickr.com/800/600/${keyword}`;

async function seed() {
  try {
    logger.info("Starting enhanced seed...");

    // Clean existing data
    await prisma.product.deleteMany();
    await prisma.company.deleteMany();
    logger.info("Cleaned existing products and companies.");

    // Create companies
    const createdCompanies = [];
    for (const name of companyNames) {
      const company = await prisma.company.create({
        data: {
          name,
          description: `Premier provider of ${name.toLowerCase()} and high-end lifestyle products.`,
          ownerId: "default-owner-id", // In a real app, this would be a real user ID
        },
      });
      createdCompanies.push(company);
      logger.info(`Created company: ${company.name}`);
    }

    // Create products for each company
    for (const company of createdCompanies) {
      // Each company handles 3 random categories
      const shuffledCats = [...categories].sort(() => 0.5 - Math.random());
      const selectedCats = shuffledCats.slice(0, 3);

      for (const cat of selectedCats) {
        // Create 1-3 products per category for this company
        const numProducts = Math.floor(Math.random() * 3) + 1;
        for (let i = 1; i <= numProducts; i++) {
          const keyword = cat.keywords[Math.floor(Math.random() * cat.keywords.length)];
          const product = await prisma.product.create({
            data: {
              name: `${company.name} ${keyword.replace(/-/g, ' ')} ${i}`,
              description: `An exquisite representation of luxury and performance. This ${cat.name} from ${company.name} defines excellence.`,
              price: Math.floor(Math.random() * 5000000) + 50000,
              images: [getImageUrl(keyword), getImageUrl(cat.name)],
              category: cat.name,
              companyId: company.id,
            },
          });
          logger.info(`Created product: ${product.name} for ${company.name}`);
        }
      }
    }

    logger.info("Enhanced seed completed successfully!");
  } catch (error) {
    logger.error("Seed error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
