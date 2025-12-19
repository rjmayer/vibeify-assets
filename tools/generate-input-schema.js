const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Derive a JSON Schema (Draft-07) from a fully resolved Vibeify prompt template, after
 * inheritance.
 *
 * Authoritative source: template.placeholders
 *
 * @param {string} templatePath - Absolute or relative path to prompt-template.yaml
 * @returns {object} JSON Schema
 *
 * Usage:
 *	const { derivePromptInputSchema } = require("./generate-input-schema.js");
 *	const fs = require("fs");
 *	
 *	const schema = derivePromptInputSchema(
 *	  "registry/templates/prompts/000-base/prompt-template.yaml"
 *	);
 *	
 *  // optional data persist, not strictly necessary
 *	fs.writeFileSync(
 *	  "registry/schemas/prompt-input.schema.derived.json",
 *	  JSON.stringify(schema, null, 2)
 *	);
 */
function derivePromptInputSchema(templatePath) {
  const absPath = path.resolve(templatePath);

  if (!fs.existsSync(absPath)) {
    throw new Error(`Template not found: ${absPath}`);
  }

  const template = yaml.load(fs.readFileSync(absPath, "utf8"));

  if (!template || typeof template !== "object") {
    throw new Error("Invalid YAML: template root must be an object");
  }

  const placeholders = template.placeholders;

  if (!placeholders || typeof placeholders !== "object") {
    throw new Error("Template must define a 'placeholders' object");
  }

  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Vibeify Prompt Input Schema (derived)",
    description: "Auto-derived from prompt-template.yaml",
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false
  };

  for (const [name, meta] of Object.entries(placeholders)) {
    if (!meta || typeof meta !== "object") {
      throw new Error(`Placeholder '${name}' must be an object`);
    }

    // ---- Validate placeholder metadata ----
    if (!meta.type) {
      throw new Error(`Placeholder '${name}' is missing required 'type'`);
    }

    if (!["string", "array", "number", "boolean", "object"].includes(meta.type)) {
      throw new Error(
        `Placeholder '${name}' has unsupported type '${meta.type}'`
      );
    }

    if (meta.type === "array") {
      if (!meta.items) {
        throw new Error(
          `Placeholder '${name}' of type 'array' must declare 'items'`
        );
      }
      if (meta.items !== "string") {
        throw new Error(
          `Placeholder '${name}' array items must currently be 'string'`
        );
      }
    }

    if ("default" in meta) {
      if (!isTypeCompatible(meta.default, meta.type)) {
        throw new Error(
          `Default value for '${name}' does not match declared type '${meta.type}'`
        );
      }
    }

    // ---- Build schema property ----
    const prop = {
      type: meta.type
    };

    if (meta.type === "array") {
      prop.items = { type: meta.items };
    }

    if (meta.format) {
      prop.format = meta.format;
    }

    if (meta.description) {
      prop.description = meta.description;
    }

    if ("default" in meta) {
      prop.default = meta.default;
    }

    schema.properties[name] = prop;

    // ---- Required handling ----
    const isRequired = meta.required === true;
    const injectedByRenderer = meta.injectedBy === "renderer";

    if (isRequired && !injectedByRenderer) {
      schema.required.push(name);
    }
  }

  return schema;
}

/**
 * Minimal type compatibility check
 */
function isTypeCompatible(value, type) {
  if (value === null) return true;

  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number";
    case "boolean":
      return typeof value === "boolean";
    case "array":
      return Array.isArray(value);
    case "object":
      return typeof value === "object" && !Array.isArray(value);
    default:
      return false;
  }
}

module.exports = {
  derivePromptInputSchema
};
