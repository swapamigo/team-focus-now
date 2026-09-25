import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Only Vercel calls this script. Hostinger keeps using the normal main build.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const configDir = join(root, "deploy/bachelor");
const snapshot = JSON.parse(readFileSync(join(configDir, "snapshot.json"), "utf8"));
const workspace = join(root, ".vercel-bachelor");
const source = join(workspace, "source");
const stage = process.argv[2];

if (!/^[a-f0-9]{40}$/.test(snapshot.commit)) {
  throw new Error("The bachelor snapshot must be a full immutable commit SHA.");
}
if (!["install", "build"].includes(stage)) {
  throw new Error("Usage: node scripts/build-bachelor.mjs install|build");
}

function run(command, args, cwd = root) {
  execFileSync(command, args, { cwd, stdio: "inherit" });
}

if (stage === "install") {
  try {
    execFileSync("git", ["cat-file", "-e", `${snapshot.commit}^{commit}`], {
      cwd: root,
      stdio: "ignore",
    });
  } catch {
    // Vercel normally checks out only recent history. Fetch exactly the pinned
    // commit, never the moving tip of main or of the verteidigung branch.
    run("git", ["fetch", "--no-tags", "--depth=1", "origin", snapshot.commit]);
  }

  rmSync(workspace, { recursive: true, force: true });
  mkdirSync(source, { recursive: true });
  const archive = join(workspace, "snapshot.tar");
  run("git", ["archive", "--format=tar", `--output=${archive}`, snapshot.commit]);
  run("tar", ["-xf", archive, "-C", source]);
  rmSync(archive);

  // The historical npm lock predates dependencies already used by this commit.
  // This separately committed compatibility lock makes installation repeatable;
  // the historical application source and package.json remain untouched.
  cpSync(join(configDir, "package-lock.json"), join(source, "package-lock.json"));
  run("npm", ["ci", "--include=dev", "--no-audit", "--no-fund"], source);
  writeFileSync(join(workspace, "prepared-commit"), snapshot.commit);
} else {
  if (readFileSync(join(workspace, "prepared-commit"), "utf8") !== snapshot.commit) {
    throw new Error("Install and build must use the same bachelor snapshot.");
  }
  // Keep the archived sitemap. The old prebuild used an unpinned bunx download.
  run(process.execPath, [join(source, "node_modules/vite/bin/vite.js"), "build"], source);
  const dist = join(source, "dist");
  if (!existsSync(join(dist, "index.html"))) {
    throw new Error("Bachelor build did not produce index.html; refusing to publish.");
  }
  writeFileSync(join(dist, "version.txt"), `${snapshot.commit} bachelor-submission\n`);
  writeFileSync(join(dist, "build-info.json"), `${JSON.stringify(snapshot, null, 2)}\n`);
}
