import { execSync } from "node:child_process";
import net from "node:net";

function isDevServerRunning(port = 3000) {
  return new Promise((resolve) => {
    const probe = net.createServer();

    probe.once("error", () => resolve(true));
    probe.once("listening", () => {
      probe.close(() => resolve(false));
    });

    probe.listen(port);
  });
}

if (await isDevServerRunning()) {
  console.error(
    "Build blocked: dev server is running on port 3000.\n" +
      "Stop it first (Ctrl+C) or run `npm run dev:clean` after the build.\n" +
      "Building while `next dev` is active corrupts .next and breaks Tailwind CSS in dev."
  );
  process.exit(1);
}

execSync("rm -rf .next && next build", { stdio: "inherit" });
