import { PrismaClient } from "@prisma/client";

async function doSeed() {
  const prisma = new PrismaClient();

  await prisma.account.create({
    data: {
      id: "051cef90-ee3a-4046-a9dd-f5cdc303d073",
      email: "john.doe@example.com",
      hash: "$2b$10$5Z4G6eRXFw2KqEArn1eXNOlNGOZXQXcyZ2IkXYLcDhWNKfqyVJQkS", // Password is azertyuiop :)
      verified: true,
    },
  });
}

doSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});
