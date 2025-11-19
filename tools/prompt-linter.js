#!/usr/bin/env node
/**
 * Simple prompt linter for Vibeify.
 *
 * This module exports a single function:
 *   lintPrompt(prompt, filePath) -> { warnings: string[], errors: string[] }
 *
 * Rules implemented here are intentionally lightweight and fast. Extend as needed.
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function lintPromptObject(prompt, filePath) {
  const warnings = [];
  const errors = [];

  const location = filePath || "<memory>";

  function err(msg) {
    errors.push(`${location}: ${msg}`);
  }
  function warn(msg) {
    warnings.push(`${location}: ${msg}`);
  }

  // Basic presence checks (schema should already enforce most of these)
  if (!prompt.description || typeof prompt.description !== "string" || !prompt.description.trim()) {
    err("description must be a non-empty string");
  } else {
    const desc = prompt.description.toLowerCase();
    if (desc.includes("tbd") || desc.includes("todo")) {
      err("description must not contain TBD/TODO placeholders");
    }
  }

  if (!prompt.instructions || !Array.isArray(prompt.instructions.steps) || prompt.instructions.steps.length === 0) {
    err("instructions.steps must contain at least one step");
  }

  // Tag recommendations
  if (!Array.isArray(prompt.tags) || prompt.tags.length === 0) {
    warn("tags array is empty; consider adding 2–5 descriptive tags");
  }

  // Basic ID convention check
  if (typeof prompt.id === "string") {
    if (!prompt.id.match(/^[a-z0-9_.-]+$/)) {
      warn("id should use lowercase letters, digits, dots and hyphens only (e.g. user.create.v1)");
    }
  }

  // Service name recommendation
  if (typeof prompt.service === "string") {
    if (!prompt.service.match(/^[a-z0-9-]+$/)) {
      warn("service should be in kebab-case (e.g. user-service)");
    }
  }

  return { warnings, errors };
}

function lintFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const doc = yaml.load(content);
  return lintPromptObject(doc, filePath);
}

// CLI usage: node tools/prompt-linter.js [fileOrFolder ...]
if (require.main === module) {
  const args = process.argv.slice(2);
  const targets = args.length ? args : ["services"];

  const glob = require("glob");

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const target of targets) {
    const stat = fs.existsSync(target) ? fs.statSync(target) : null;
    if (!stat) continue;

    let files = [];
    if (stat.isDirectory()) {
      files = glob.sync(path.join(target, "**/prompts/*.yaml"));
    } else {
      files = [target];
    }

    for (const file of files) {
      const { warnings, errors } = lintFile(file);
      warnings.forEach(w => console.warn("WARN", w));
      errors.forEach(e => console.error("ERROR", e));
      totalWarnings += warnings.length;
      totalErrors += errors.length;
    }
  }

  if (totalErrors > 0) {
    console.error(`Prompt linter finished with ${totalErrors} error(s) and ${totalWarnings} warning(s).`);
    process.exit(1);
  } else {
    console.log(`Prompt linter finished with ${totalWarnings} warning(s) and 0 errors.`);
  }
}

module.exports = { lintPrompt: lintPromptObject };
