#!/usr/bin/env node
/**
 * Minimal prompt runner for Vibeify.
 *
 * This does NOT call any AI model. Instead, it:
 *  - loads a prompt YAML file
 *  - resolves referenced context files
 *  - prints a JSON payload that could be sent to an AI backend
 *
 * Usage:
 *   node tools/prompt-cli.js services/example/prompts/create_user.yaml \
 *        --example minimal_example
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function loadYaml(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return yaml.load(content);
}

function findExample(prompt, exampleName) {
  const examples = (prompt.inputs && prompt.inputs.examples) || [];
  if (!examples.length) return null;
  if (!exampleName) return examples[0];
  return examples.find(e => e.name === exampleName) || examples[0];
}

function loadContextFiles(context, baseDir) {
  const result = {};
  if (!context || !Array.isArray(context.files)) return result;
  for (const rel of context.files) {
    const full = path.resolve(baseDir, "..", "..", rel);
    if (fs.existsSync(full)) {
      result[rel] = fs.readFileSync(full, "utf8");
    }
  }
  return result;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error("Usage: node tools/prompt-cli.js <prompt.yaml> [--example <name>]");
    process.exit(1);
  }

  const promptPath = args[0];
  let exampleName = null;
  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--example" && args[i + 1]) {
      exampleName = args[i + 1];
      i++;
    }
  }

  const absPromptPath = path.resolve(promptPath);
  const prompt = loadYaml(absPromptPath);
  const example = findExample(prompt, exampleName);

  const contextFiles = loadContextFiles(prompt.context || {}, path.dirname(absPromptPath));

  const payload = {
    prompt_meta: {
      id: prompt.id,
      name: prompt.name,
      service: prompt.service,
      version: prompt.version,
      tags: prompt.tags || []
    },
    instructions: prompt.instructions,
    inputs: example ? example.payload : {},
    context: {
      inline: (prompt.context && prompt.context.inline) || {},
      files: contextFiles
    },
    output: prompt.output
  };

  console.log(JSON.stringify(payload, null, 2));
}
