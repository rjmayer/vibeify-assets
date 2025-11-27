#!/usr/bin/env node
/**
 * generate-manifest.js
 *
 * Migration script that reads the existing template repository structure
 * and generates a baseline manifest.yaml file.
 *
 * Usage:
 *   node tools/generate-manifest.js [--output <path>] [--dry-run]
 *
 * Options:
 *   --output <path>  Output path for the manifest (default: manifest.yaml)
 *   --dry-run        Print the manifest to stdout without writing to file
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Directories to exclude from manifest generation
const EXCLUDED_DIRS = [
  ".git",
  "node_modules",
  ".github/agents", // Agent instructions are not part of template
];

// Files to exclude from manifest generation (repo-specific, not template files)
const EXCLUDED_FILES = [
  ".gitignore",
  "package.json",
  "package-lock.json",
  "README.md",
  "CI.md",
  "assets-schema.json",
  "manifest.yaml",
  "manifest.schema.json",
];

// Files that should not be user-editable (tools, tests, CI)
const NON_EDITABLE_PATTERNS = [
  /^tools\//,
  /^prompt-tests\/test_runner\.js$/,
  /^xtras\/github\/workflows\//,
  /^xtras\/github\/copilot\//,
  /prompt-schema\.json$/,
];

// Files that should use 'skip' update strategy (examples, outputs)
const SKIP_PATTERNS = [/^inbox\//, /^outbox\//];

// Files that should use 'overwrite' update strategy
const OVERWRITE_PATTERNS = [
  /^tools\//,
  /^prompt-tests\/test_runner\.js$/,
  /^xtras\/github\/workflows\//,
  /^xtras\/github\/copilot\//,
  /prompt-schema\.json$/,
];

// Conditional installation rules
const CONDITIONAL_RULES = [
  { pattern: /^xtras\/github\//, when: { env: "github" } },
  { pattern: /^xtras\/default\//, when: { env: "github" } },
];

/**
 * Recursively find all files in a directory
 */
function findFiles(dir, baseDir = dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    // Skip excluded directories
    if (entry.isDirectory()) {
      const shouldExclude = EXCLUDED_DIRS.some(
        (excluded) =>
          relativePath === excluded || relativePath.startsWith(excluded + "/")
      );
      if (!shouldExclude) {
        findFiles(fullPath, baseDir, files);
      }
    } else {
      // Skip excluded files
      if (!EXCLUDED_FILES.includes(relativePath)) {
        files.push(relativePath);
      }
    }
  }

  return files;
}

/**
 * Determine the target path for a source file
 */
function getTargetPath(sourcePath) {
  // GitHub-specific files go to .github/
  if (sourcePath.startsWith("xtras/github/workflows/")) {
    return sourcePath.replace("xtras/github/workflows/", ".github/workflows/");
  }
  if (sourcePath.startsWith("xtras/github/copilot/examples/")) {
    return sourcePath.replace("xtras/github/copilot/examples/", ".github/");
  }
  if (sourcePath.startsWith("xtras/default/")) {
    return sourcePath.replace("xtras/default/", ".github/");
  }

  // Context files from templates go to registry root
  if (sourcePath.startsWith("registry/templates/context/")) {
    return sourcePath.replace(
      "registry/templates/context/",
      "vibeify/registry/"
    );
  }

  // Instructions from templates
  if (sourcePath.startsWith("registry/templates/instructions/")) {
    return sourcePath.replace(
      "registry/templates/instructions/",
      "vibeify/registry/instructions/"
    );
  }

  // Issue and PR templates
  if (sourcePath.startsWith("registry/templates/issue/")) {
    return "vibeify/" + sourcePath.replace("registry/templates/", "registry/");
  }
  if (sourcePath.startsWith("registry/templates/pull-request/")) {
    return "vibeify/" + sourcePath.replace("registry/templates/", "registry/");
  }

  // Prompt schema goes to registry root
  if (sourcePath === "registry/prompts/prompt-schema.json") {
    return "vibeify/registry/prompt-schema.json";
  }

  // Default: place under vibeify/
  return "vibeify/" + sourcePath;
}

/**
 * Determine if a file is user-editable
 */
function isUserEditable(sourcePath) {
  return !NON_EDITABLE_PATTERNS.some((pattern) => pattern.test(sourcePath));
}

/**
 * Determine the update strategy for a file
 */
function getUpdateStrategy(sourcePath) {
  if (SKIP_PATTERNS.some((pattern) => pattern.test(sourcePath))) {
    return "skip";
  }
  if (OVERWRITE_PATTERNS.some((pattern) => pattern.test(sourcePath))) {
    return "overwrite";
  }
  return "preserve-changes";
}

/**
 * Get conditional rules for a file
 */
function getConditionalRules(sourcePath) {
  for (const rule of CONDITIONAL_RULES) {
    if (rule.pattern.test(sourcePath)) {
      return rule.when;
    }
  }
  return null;
}

/**
 * Generate a description for a file based on its path
 */
function generateDescription(sourcePath) {
  const basename = path.basename(sourcePath, path.extname(sourcePath));
  const dirname = path.dirname(sourcePath);

  // Common descriptions
  const descriptions = {
    "tools/prompt-linter.js": "Static checks for prompt quality",
    "tools/prompt-cli.js": "Simple runner that assembles prompt + context",
    "prompt-tests/test_runner.js":
      "Test runner for validating prompts against schema",
    "registry/prompts/prompt-schema.json":
      "JSON Schema for validating prompt YAML structure",
  };

  if (descriptions[sourcePath]) {
    return descriptions[sourcePath];
  }

  // Generate based on path
  if (sourcePath.includes("/issue/")) {
    return `Issue template: ${basename.replace(/-/g, " ")}`;
  }
  if (sourcePath.includes("/pull-request/")) {
    return `Pull request template: ${basename.replace(/-/g, " ")}`;
  }
  if (sourcePath.includes("/prompts/text/")) {
    return `Text prompt: ${basename.replace(/-/g, " ")}`;
  }
  if (sourcePath.includes("/context/")) {
    return `Context file: ${basename.replace(/-/g, " ")}`;
  }
  if (sourcePath.includes("/fixtures/")) {
    return `Test fixture: ${basename.replace(/-/g, " ")}`;
  }

  return null;
}

/**
 * Generate manifest from repository structure
 */
function generateManifest(repoRoot) {
  const files = findFiles(repoRoot).sort();
  const manifest = {
    version: 1,
    files: [],
  };

  for (const sourcePath of files) {
    const entry = {
      source: sourcePath,
      target: getTargetPath(sourcePath),
    };

    const userEditable = isUserEditable(sourcePath);
    if (!userEditable) {
      entry.user_editable = false;
    }

    const updateStrategy = getUpdateStrategy(sourcePath);
    if (updateStrategy !== "preserve-changes") {
      entry.update_strategy = updateStrategy;
    }

    const description = generateDescription(sourcePath);
    if (description) {
      entry.description = description;
    }

    const when = getConditionalRules(sourcePath);
    if (when) {
      entry.when = when;
    }

    manifest.files.push(entry);
  }

  return manifest;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  let outputPath = "manifest.yaml";
  let dryRun = false;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--output" && args[i + 1]) {
      outputPath = args[i + 1];
      i++;
    } else if (args[i] === "--dry-run") {
      dryRun = true;
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(`
Usage: node tools/generate-manifest.js [options]

Options:
  --output <path>  Output path for the manifest (default: manifest.yaml)
  --dry-run        Print the manifest to stdout without writing to file
  --help, -h       Show this help message
`);
      process.exit(0);
    }
  }

  // Find repository root (where package.json is)
  let repoRoot = process.cwd();
  while (!fs.existsSync(path.join(repoRoot, "package.json"))) {
    const parent = path.dirname(repoRoot);
    if (parent === repoRoot) {
      console.error("Error: Could not find repository root (package.json)");
      process.exit(1);
    }
    repoRoot = parent;
  }

  // Generate manifest
  const manifest = generateManifest(repoRoot);

  // Add YAML header comment
  const yamlContent =
    `# yaml-language-server: $schema=./manifest.schema.json
# Vibeify Template Manifest
# Generated by tools/generate-manifest.js
# This manifest defines all template files and their installation behavior

` + yaml.dump(manifest, { lineWidth: -1, noRefs: true, quotingType: '"' });

  if (dryRun) {
    console.log(yamlContent);
  } else {
    const fullOutputPath = path.isAbsolute(outputPath)
      ? outputPath
      : path.join(repoRoot, outputPath);
    fs.writeFileSync(fullOutputPath, yamlContent, "utf8");
    console.log(`Manifest written to: ${fullOutputPath}`);
    console.log(`Total files: ${manifest.files.length}`);
  }
}

main();
