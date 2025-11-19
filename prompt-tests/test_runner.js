    #!/usr/bin/env node
    /**
     * Vibeify Prompt Test Runner
     *
     * Responsibilities:
     *  - Load the canonical prompt schema
     *  - Discover all prompt YAML files under services/**/prompts
     *  - Validate each prompt against the schema (via AJV)
     *  - Run linter rules on each prompt
     *  - Exit with non-zero status on failure
     */

    const fs = require("fs");
    const path = require("path");
    const yaml = require("js-yaml");
    const glob = require("glob");
    const Ajv = require("ajv");
    const { lintPrompt } = require("../tools/prompt-linter");

    const rootDir = path.resolve(__dirname, "..");

    function loadSchema() {
      const schemaPath = path.join(rootDir, "registry", "prompt-schema.json");
      const raw = fs.readFileSync(schemaPath, "utf8");
      return JSON.parse(raw);
    }

    function loadPrompt(filePath) {
      const content = fs.readFileSync(filePath, "utf8");
      return yaml.load(content);
    }

    function main() {
      const schema = loadSchema();
      const ajv = new Ajv({ allErrors: true, strict: false });
      const validate = ajv.compile(schema);

      const pattern = path.join(rootDir, "services", "**", "prompts", "*.yaml");
      const files = glob.sync(pattern);

      if (!files.length) {
        console.warn("No prompt files found under services/**/prompts. Nothing to test.");
        process.exit(0);
      }

      let errorCount = 0;
      let warningCount = 0;

      for (const file of files) {
        const rel = path.relative(rootDir, file);
        console.log(`
=== Testing prompt: ${rel} ===`);

        const prompt = loadPrompt(file);

        // Schema validation
        const valid = validate(prompt);
        if (!valid) {
          console.error("Schema validation failed:");
          for (const err of validate.errors) {
            console.error(`  - ${err.instancePath || "<root>"} ${err.message}`);
          }
          errorCount++;
        } else {
          console.log("✓ Schema validation passed");
        }

        // Linting
        const { warnings, errors } = lintPrompt(prompt, rel);
        warnings.forEach(w => console.warn("WARN", w));
        errors.forEach(e => console.error("ERROR", e));
        warningCount += warnings.length;
        errorCount += errors.length;

        if (valid && !errors.length) {
          console.log("✓ Lint checks passed");
        }
      }

      console.log(`
Prompt test summary: ${errorCount} error(s), ${warningCount} warning(s).`);

      if (errorCount > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    }

    if (require.main === module) {
      main();
    }
