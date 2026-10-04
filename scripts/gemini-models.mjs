// Lists the Gemini models available to GEMINI_API_KEY (Flash models first).
// Usage: npm run gemini:models
import { readFileSync, existsSync } from "node:fs";

function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

loadEnvLocal();
const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error("GEMINI_API_KEY is not set. Add it to .env.local first.");
  process.exit(1);
}

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000&key=${key}`);
if (!res.ok) {
  console.error(`Request failed (${res.status}): ${await res.text()}`);
  process.exit(1);
}

const { models = [] } = await res.json();
const usable = models
  .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
  .map((m) => m.name.replace(/^models\//, ""));
const flash = usable.filter((n) => n.includes("flash") && !/tts|image|audio|live/.test(n));

console.log("Flash models available to your key:");
for (const name of flash) console.log(`  ${name}`);
console.log(`\nSet GEMINI_MODEL in .env.local to pick one (default tries gemini-3.8-flash, then gemini-3.5-flash).`);
