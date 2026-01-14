#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// Read the generated wrangler.json
const generatedConfigPath = resolve("build/server/wrangler.json");
const config = JSON.parse(readFileSync(generatedConfigPath, "utf-8"));

// Override with staging-specific values
config.name = "kumo-docs-staging";
config.routes = [
  {
    pattern: "staging.kumo-ui.com/*",
    zone_name: "kumo-ui.com",
  },
];

// Write back
writeFileSync(generatedConfigPath, JSON.stringify(config, null, 2));
console.log("✅ Updated build/server/wrangler.json for staging deployment");
