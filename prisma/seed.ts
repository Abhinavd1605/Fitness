import { seedWorkoutCatalog } from "../lib/flexRepository";

seedWorkoutCatalog()
  .then(() => {
    console.log("Seeded FLEX workout catalog and default profile.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
