import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolsDir, "..");
const audioDir = path.join(repoRoot, "assets", "audio");
const manifestPath = path.join(audioDir, "music-v2-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const dryRun = args.has("--dry-run");
const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",").map((value) => value.trim()).filter(Boolean)) : null;
const apiKey = process.env.ELEVENLABS_API_KEY;

function outputPathFor(track) {
  return path.join(audioDir, track.file);
}

function selectedTracks() {
  return manifest.tracks.filter((track) => !only || only.has(track.id) || only.has(track.originalId) || only.has(track.file));
}

async function generateTrack(track) {
  const outputPath = outputPathFor(track);
  if (!force && fs.existsSync(outputPath)) {
    console.log(`skip ${track.id}: ${path.relative(repoRoot, outputPath)} already exists`);
    return;
  }

  console.log(`generate ${track.id}: ${track.musicLengthMs}ms -> ${path.relative(repoRoot, outputPath)}`);
  if (dryRun) {
    console.log(track.prompt);
    return;
  }

  const response = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_48000_192", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      prompt: track.prompt,
      music_length_ms: track.musicLengthMs,
      model_id: manifest.modelId || "music_v2",
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`ElevenLabs ${response.status} for ${track.id}: ${message}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, bytes);
  console.log(`wrote ${path.relative(repoRoot, outputPath)} (${bytes.length.toLocaleString()} bytes)`);
}

if (!dryRun && !apiKey) {
  console.error("ELEVENLABS_API_KEY is required. Set it in the environment, then rerun this command.");
  process.exit(1);
}

const tracks = selectedTracks();
if (!tracks.length) {
  console.error("No matching tracks selected.");
  process.exit(1);
}

for (const track of tracks) {
  await generateTrack(track);
}
