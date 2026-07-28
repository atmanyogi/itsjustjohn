import { runHardenedTests } from "./analytics-hardening.test";

runHardenedTests().then((passed) => {
  if (passed) {
    console.log("🥇 RUN COMPLETED: Clean validation checks established.");
    process.exit(0);
  } else {
    console.error("💔 RUN FAILED: Code calculations logic verification failed.");
    process.exit(1);
  }
});
