import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

// Publish the reviewed historical output without rebuilding it in Vercel.
// Hostinger uses npm run build and never calls this script.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const archiveDir = join(root, "deploy/bachelor");
const archivePath = join(archiveDir, "site.tar.gz");
const output = join(root, "dist-bachelor");
const snapshot = JSON.parse(readFileSync(join(archiveDir, "snapshot.json"), "utf8"));
const expectedHash = readFileSync(join(archiveDir, "site.sha256"), "utf8").trim();
const actualHash = createHash("sha256").update(readFileSync(archivePath)).digest("hex");

if (!/^[a-f0-9]{40}$/.test(snapshot.commit) || actualHash !== expectedHash) {
  throw new Error("The bachelor archive does not match its reviewed manifest.");
}

const paths = execFileSync("tar", ["-tzf", archivePath], { encoding: "utf8" })
  .trim().split("\n");
if (paths.some((path) => path.startsWith("/") || path.split("/").includes(".."))) {
  throw new Error("The bachelor archive contains an invalid output path.");
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
execFileSync("tar", ["-xzf", archivePath, "-C", output], { stdio: "inherit" });

if (!existsSync(join(output, "index.html")) ||
    readFileSync(join(output, "version.txt"), "utf8").trim() !==
      `${snapshot.commit} bachelor-submission`) {
  throw new Error("The extracted site is not the expected bachelor version.");
}

// Owner-provided originals of the external Lovable assets (see originale/MANIFEST.json).
// They are copied to the paths the historical build already references.
// The reviewed archive above stays unchanged.
const originalsDir = join(archiveDir, "originale");
const manifestPath = join(originalsDir, "MANIFEST.json");
let originals = 0;
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (manifest.snapshot_commit !== snapshot.commit) {
    throw new Error("The originals manifest belongs to a different snapshot.");
  }
  for (const entry of manifest.files) {
    const destination = normalize(entry.destination);
    if (!destination.startsWith("__l5e/assets-v1/") || destination.split("/").includes("..")) {
      throw new Error(`Invalid destination for ${entry.file}.`);
    }
    const data = readFileSync(join(originalsDir, entry.file));
    const hash = createHash("sha256").update(data).digest("hex");
    if (data.length !== entry.size || hash !== entry.sha256) {
      throw new Error(`Original ${entry.file} does not match its manifest.`);
    }
    mkdirSync(dirname(join(output, destination)), { recursive: true });
    copyFileSync(join(originalsDir, entry.file), join(output, destination));
    originals += 1;
  }
}

console.log(`Publishing reviewed bachelor version ${snapshot.commit} (${paths.length} files, ${originals} original assets).`);
