import prisma from "../src/lib/prisma.js";

const categories = [
  "Web Development",
  "Mobile Development",
  "Graphic Design",
  "UI/UX Design",
  "Digital Marketing",
  "Video & Animation",
  "Writing & Translation",
  "laptop",
  "Mobile"
];

async function main() {
  for (const name of categories) {
    await prisma.Category.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });
  }

  console.log("Categories seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
