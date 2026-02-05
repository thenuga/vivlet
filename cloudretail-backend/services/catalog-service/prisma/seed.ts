import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Moose Men’s Assorted Polo T-Shirts",
        description: "Comfort cotton polo t-shirt",
        price: 990,
        imageUrl:
          "https://www.jimthompson.com/cdn/shop/files/BetalPalmCottonJacquardSimilanMediumBag-Blue-1.jpg",
        stock: 50,
      },
      {
        name: "Nike T-Shirt",
        description: "Original Nike sports t-shirt",
        price: 3700,
        imageUrl:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        stock: 20,
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
