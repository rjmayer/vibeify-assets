#!/usr/bin/env node
/**
 * validate-manifest.js
 *
 * Validates manifest.yaml against the JSON Schema and checks that all
 * source files exist in the repository.
 *
 * Usage:
 *   node tools/validate-manifest.js [--manifest <path>]
 *
 * Options:
 *   --manifest <path>  Path to the manifest file (default: manifest.yaml)
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const Ajv = require("ajv");

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  let manifestPath = "manifest.yaml";

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--manifest" && args[i + 1]) {
      manifestPath = args[i + 1];
      i++;
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(`
Usage: node tools/validate-manifest.js [options]

Options:
  --manifest <path>  Path to the manifest file (default: manifest.yaml)
  --help, -h         Show this help message
`);
      process.exit(0);
    }
  }

  // Find repository root
  let repoRoot = process.cwd();
  while (!fs.existsSync(path.join(repoRoot, "package.json"))) {
    const parent = path.dirname(repoRoot);
    if (parent === repoRoot) {
      console.error("Error: Could not find repository root (package.json)");
      process.exit(1);
    }
    repoRoot = parent;
  }

  const fullManifestPath = path.isAbsolute(manifestPath)
    ? manifestPath
    : path.join(repoRoot, manifestPath);

  const schemaPath = path.join(repoRoot, "manifest.schema.json");

  // Check files exist
  if (!fs.existsSync(fullManifestPath)) {
    console.error(`Error: Manifest file not found: ${fullManifestPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(schemaPath)) {
    console.error(`Error: Schema file not found: ${schemaPath}`);
    process.exit(1);
  }

  // Load schema
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  } catch (err) {
    console.error(`Error parsing schema: ${err.message}`);
    process.exit(1);
  }

  // Load manifest
  let manifest;
  try {
    const manifestContent = fs.readFileSync(fullManifestPath, "utf8");
    manifest = yaml.load(manifestContent);
  } catch (err) {
    console.error(`Error parsing manifest: ${err.message}`);
    process.exit(1);
  }

  // Validate against schema
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(manifest);

  let hasErrors = false;

  if (!valid) {
    console.error("Schema validation errors:");
    for (const error of validate.errors) {
      console.error(`  - ${error.instancePath}: ${error.message}`);
    }
    hasErrors = true;
  } else {
    console.log("✓ Schema validation passed");
  }

  // Check that all source files exist
  const missingFiles = [];
  const duplicateSources = new Map();
  const duplicateTargets = new Map();

  for (const entry of manifest.files) {
    const sourcePath = path.join(repoRoot, entry.source);
    if (!fs.existsSync(sourcePath)) {
      missingFiles.push(entry.source);
    }

    // Check for duplicate sources
    if (duplicateSources.has(entry.source)) {
      duplicateSources.get(entry.source).push(entry.target);
    } else {
      duplicateSources.set(entry.source, [entry.target]);
    }

    // Check for duplicate targets
    if (duplicateTargets.has(entry.target)) {
      duplicateTargets.get(entry.target).push(entry.source);
    } else {
      duplicateTargets.set(entry.target, [entry.source]);
    }
  }

  if (missingFiles.length > 0) {
    console.error("\nMissing source files:");
    for (const file of missingFiles) {
      console.error(`  - ${file}`);
    }
    hasErrors = true;
  } else {
    console.log("✓ All source files exist");
  }

  // Report duplicate sources
  const dupSources = [...duplicateSources.entries()].filter(
    ([, targets]) => targets.length > 1
  );
  if (dupSources.length > 0) {
    console.warn("\nWarning: Duplicate source files:");
    for (const [source, targets] of dupSources) {
      console.warn(`  - ${source} -> ${targets.join(", ")}`);
    }
  }

  // Report duplicate targets (this is an error)
  const dupTargets = [...duplicateTargets.entries()].filter(
    ([, sources]) => sources.length > 1
  );
  if (dupTargets.length > 0) {
    console.error("\nDuplicate target files (error):");
    for (const [target, sources] of dupTargets) {
      console.error(`  - ${target} <- ${sources.join(", ")}`);
    }
    hasErrors = true;
  } else {
    console.log("✓ No duplicate targets");
  }

  // Summary
  console.log(`\nManifest contains ${manifest.files.length} file entries`);

  if (hasErrors) {
    console.error("\n✗ Validation failed");
    process.exit(1);
  } else {
    console.log("\n✓ Validation successful");
  }
}

main();
