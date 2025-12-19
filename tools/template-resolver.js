const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Vibeify Template Resolution Module
 * 
 * Implements the canonical template resolution algorithm as specified in:
 * - TemplateResolutionAlgorithm.md
 * - TemplateResolutionAndInheritanceRequirements.md
 * 
 * This module resolves template inheritance to produce a fully flattened template
 * with no inheritance metadata remaining.
 * 
 * The specification defines a 7-phase resolution algorithm. In this implementation,
 * the work of conceptual "Phase 3" (Initialize resolution state) is performed as
 * part of the function labeled "Phase 4" (mergeTemplates), so the concrete phase
 * functions are numbered 0, 1, 2, 4, 5, and 6.
 */

/**
 * Error class for template resolution failures
 */
class TemplateResolutionError extends Error {
  constructor(message, category, templateRef = null) {
    super(message);
    this.name = "TemplateResolutionError";
    this.category = category;
    this.templateRef = templateRef;
  }
}

/**
 * Load a template from a file path
 * @param {string} templateRef - Path to the template file
 * @param {string} baseDir - Base directory for resolving relative paths
 * @returns {object} Parsed template object
 */
function loadTemplate(templateRef, baseDir = process.cwd()) {
  let absPath;
  
  if (path.isAbsolute(templateRef)) {
    absPath = templateRef;
  } else {
    absPath = path.resolve(baseDir, templateRef);
  }

  if (!fs.existsSync(absPath)) {
    throw new TemplateResolutionError(
      `Template not found: ${templateRef}`,
      "TEMPLATE_NOT_FOUND",
      templateRef
    );
  }

  try {
    const content = fs.readFileSync(absPath, "utf8");
    const template = yaml.load(content);
    
    if (!template || typeof template !== "object") {
      throw new TemplateResolutionError(
        `Invalid template: root must be an object`,
        "INVALID_TEMPLATE",
        templateRef
      );
    }
    
    return { template, absPath };
  } catch (error) {
    if (error instanceof TemplateResolutionError) {
      throw error;
    }
    throw new TemplateResolutionError(
      `Failed to load template: ${error.message}`,
      "LOAD_ERROR",
      templateRef
    );
  }
}

/**
 * Phase 0: Pre-validation of a single template
 * @param {object} template - Template to validate
 * @param {string} templateRef - Reference for error reporting
 */
function preValidateTemplate(template, templateRef) {
  // Check for unsupported inheritance keys first (more specific error)
  const unsupportedInheritanceKeys = ['inherits', 'parentRef'];
  for (const key of unsupportedInheritanceKeys) {
    if (template[key] !== undefined) {
      throw new TemplateResolutionError(
        `Template uses unsupported inheritance key '${key}'. Use 'extends' instead.`,
        "UNSUPPORTED_INHERITANCE_KEY",
        templateRef
      );
    }
  }
  
  // Validate extends format (must be a string, not an object)
  if (template.extends !== undefined) {
    if (typeof template.extends !== 'string') {
      throw new TemplateResolutionError(
        `Template 'extends' must be a string path, not ${typeof template.extends}`,
        "INVALID_EXTENDS_FORMAT",
        templateRef
      );
    }
    if (template.extends.trim() === '') {
      throw new TemplateResolutionError(
        `Template 'extends' cannot be empty`,
        "INVALID_EXTENDS_FORMAT",
        templateRef
      );
    }
  }
  
  // Enforce strict allowlist of permitted top-level keys
  const allowedKeys = ["metadata", "placeholders", "template", "extends"];
  const templateKeys = Object.keys(template);
  
  for (const key of templateKeys) {
    if (!allowedKeys.includes(key)) {
      throw new TemplateResolutionError(
        `Template contains unknown top-level key: '${key}'. Only ${allowedKeys.join(", ")} are permitted.`,
        "UNKNOWN_FIELD",
        templateRef
      );
    }
  }
  
  // Validate placeholders if present
  if (template.placeholders) {
    if (typeof template.placeholders !== "object") {
      throw new TemplateResolutionError(
        "Template 'placeholders' must be an object",
        "INVALID_PLACEHOLDERS",
        templateRef
      );
    }
    
    for (const [name, meta] of Object.entries(template.placeholders)) {
      if (!meta || typeof meta !== "object") {
        throw new TemplateResolutionError(
          `Placeholder '${name}' must be an object`,
          "INVALID_PLACEHOLDER",
          templateRef
        );
      }
      
      if (!meta.type) {
        throw new TemplateResolutionError(
          `Placeholder '${name}' is missing required 'type' field`,
          "MISSING_TYPE",
          templateRef
        );
      }
      
      const validTypes = ["string", "array", "number", "boolean", "object"];
      if (!validTypes.includes(meta.type)) {
        throw new TemplateResolutionError(
          `Placeholder '${name}' has invalid type '${meta.type}'`,
          "INVALID_TYPE",
          templateRef
        );
      }
      
      if (meta.type === "array" && !meta.items) {
        throw new TemplateResolutionError(
          `Placeholder '${name}' of type 'array' must declare 'items'`,
          "MISSING_ITEMS",
          templateRef
        );
      }
    }
  }
}

/**
 * Phase 1: Build inheritance chain
 * @param {string} templateRef - Root template reference
 * @param {string} baseDir - Base directory for resolving paths
 * @returns {Array} Array of {template, ref, absPath} objects in child-to-parent order
 */
function buildInheritanceChain(templateRef, baseDir) {
  const chain = [];
  const seen = new Set();
  let currentRef = templateRef;
  let currentBaseDir = baseDir;

  while (currentRef) {
    // Check for circular inheritance
    const normalizedRef = path.resolve(currentBaseDir, currentRef);
    if (seen.has(normalizedRef)) {
      throw new TemplateResolutionError(
        `Circular inheritance detected: ${currentRef}`,
        "CIRCULAR_INHERITANCE",
        currentRef
      );
    }
    seen.add(normalizedRef);

    // Load template
    const { template, absPath } = loadTemplate(currentRef, currentBaseDir);
    
    // Pre-validate
    preValidateTemplate(template, currentRef);
    
    // Add to chain
    chain.push({ template, ref: currentRef, absPath });
    
    // Check for parent - only support 'extends' as a string
    let parentRef = null;
    
    if (template.extends) {
      // Pre-validation ensures extends is a non-empty string
      parentRef = template.extends;
    }
    
    // Move to parent
    if (parentRef) {
      currentRef = parentRef;
      currentBaseDir = path.dirname(absPath);
    } else {
      currentRef = null;
    }
  }

  return chain;
}

/**
 * Check if two types are compatible for placeholder redeclaration
 * @param {string} parentType - Parent placeholder type
 * @param {string} childType - Child placeholder type
 * @returns {boolean} True if compatible
 */
function areTypesCompatible(parentType, childType) {
  // Exact match is always compatible
  if (parentType === childType) {
    return true;
  }
  
  // No other compatibility rules for now
  return false;
}

/**
 * Phase 4.2: Merge placeholders
 * @param {object} resolved - Resolved template being built
 * @param {object} childPlaceholders - Placeholders from child template
 * @param {string} templateRef - Reference for error reporting
 */
function mergePlaceholders(resolved, childPlaceholders, templateRef) {
  if (!childPlaceholders) {
    return;
  }
  
  for (const [name, childMeta] of Object.entries(childPlaceholders)) {
    const parentMeta = resolved.placeholders[name];
    
    if (!parentMeta) {
      // Case A: New placeholder - add verbatim
      resolved.placeholders[name] = { ...childMeta };
    } else {
      // Case B: Redeclared placeholder
      
      // Check type compatibility
      if (!areTypesCompatible(parentMeta.type, childMeta.type)) {
        throw new TemplateResolutionError(
          `Type conflict for placeholder '${name}': parent has '${parentMeta.type}', child has '${childMeta.type}'`,
          "TYPE_CONFLICT",
          templateRef
        );
      }
      
      // Check constraint weakening
      // If parent is required and child explicitly sets required to false, that's weakening
      if (parentMeta.required === true && childMeta.required === false) {
        throw new TemplateResolutionError(
          `Cannot weaken constraint for placeholder '${name}': parent is required, child is optional`,
          "CONSTRAINT_WEAKENING",
          templateRef
        );
      }
      
      // Merge metadata (child overrides parent)
      resolved.placeholders[name] = {
        ...parentMeta,
        ...childMeta,
        // If child explicitly declares required (true/false), use it; otherwise inherit from parent
        required: typeof childMeta.required === "boolean"
          ? childMeta.required
          : parentMeta.required
      };
    }
  }
}

/**
 * Phase 4.1: Merge sections
 * @param {object} resolved - Resolved template being built
 * @param {object} childTemplate - Child template
 */
function mergeSections(resolved, childTemplate) {
  if (!childTemplate.template) {
    return;
  }
  
  const childSections = childTemplate.template;
  
  for (const [sectionName, sectionContent] of Object.entries(childSections)) {
    // Check for explicit override
    if (typeof sectionContent === "object" && sectionContent.override === true) {
      // Explicit override - replace section, but strip inheritance metadata
      const { override, text, ...otherProps } = sectionContent;
      // If there's a 'text' property, use it as the section content
      // Otherwise, use the remaining properties (after removing 'override')
      resolved.template[sectionName] = text !== undefined ? text : (Object.keys(otherProps).length > 0 ? otherProps : sectionContent);
    } else if (typeof sectionContent === "object" && sectionContent.remove === true) {
      // Explicit removal
      delete resolved.template[sectionName];
    } else if (!(sectionName in resolved.template)) {
      // New section - add it
      resolved.template[sectionName] = sectionContent;
    } else {
      // Section exists and no explicit override - keep parent version
      // (child can only override with explicit override: true)
    }
  }
}

/**
 * Phase 4: Merge templates (core algorithm)
 * This function also performs Phase 3 (Initialize resolution state)
 * @param {Array} resolutionOrder - Templates in base-first order
 * @returns {object} Merged template
 */
function mergeTemplates(resolutionOrder) {
  // Phase 3/4: Initialize resolution state (content-only fields)
  const resolved = {
    metadata: {},
    placeholders: {},
    template: {}
  };
  
  // Merge each template in order (base first, most specific last)
  for (const { template, ref } of resolutionOrder) {
    // Merge metadata (child overrides parent)
    if (template.metadata) {
      resolved.metadata = { ...resolved.metadata, ...template.metadata };
    }
    
    // Merge placeholders
    if (template.placeholders) {
      mergePlaceholders(resolved, template.placeholders, ref);
    }
    
    // Merge sections
    if (template.template) {
      mergeSections(resolved, template);
    }
  }
  
  return resolved;
}

/**
 * Phase 5: Post-merge validation
 * @param {object} resolved - Resolved template
 */
function postMergeValidation(resolved) {
  // Ensure no inheritance metadata remains
  if (resolved.extends) {
    throw new TemplateResolutionError(
      "Resolved template still contains inheritance metadata",
      "INVALID_RESOLVED_TEMPLATE"
    );
  }
  
  // Ensure only content fields are present
  const allowedResolvedKeys = ["metadata", "placeholders", "template"];
  const resolvedKeys = Object.keys(resolved);
  for (const key of resolvedKeys) {
    if (!allowedResolvedKeys.includes(key)) {
      throw new TemplateResolutionError(
        `Resolved template contains non-content field: '${key}'`,
        "NON_CONTENT_FIELD"
      );
    }
  }
  
  // Ensure placeholders section exists (even if empty for static templates)
  // Templates without placeholders are valid (e.g., static templates)
  if (!resolved.placeholders) {
    resolved.placeholders = {};
  }
  
  // Check for duplicate placeholder names (should be impossible, but defensive)
  const placeholderNames = Object.keys(resolved.placeholders);
  const uniqueNames = new Set(placeholderNames);
  if (placeholderNames.length !== uniqueNames.size) {
    throw new TemplateResolutionError(
      "Resolved template contains duplicate placeholder names",
      "DUPLICATE_PLACEHOLDERS"
    );
  }
}

/**
 * Main template resolution function
 * Implements the canonical algorithm from TemplateResolutionAlgorithm.md
 * 
 * @param {string} templateRef - Path to the template to resolve
 * @param {string} baseDir - Base directory for resolving relative paths (optional)
 * @returns {object} Fully resolved template with no inheritance metadata
 * @throws {TemplateResolutionError} If resolution fails for any reason
 */
function resolveTemplate(templateRef, baseDir = process.cwd()) {
  try {
    // Phase 1: Build inheritance chain
    const chain = buildInheritanceChain(templateRef, baseDir);
    
    // Phase 2: Linearization (reverse chain for base-first order)
    const resolutionOrder = [...chain].reverse();
    
    // Phase 4: Merge templates
    const resolved = mergeTemplates(resolutionOrder);
    
    // Phase 5: Post-merge validation
    postMergeValidation(resolved);
    
    // Phase 6: Finalization
    // No need to explicitly remove inheritance metadata because:
    // - mergeTemplates() only copies content fields (metadata, placeholders, template)
    // - The 'extends' key from source templates is never copied to the resolved output
    // - Post-merge validation ensures no inheritance metadata remains
    
    return resolved;
  } catch (error) {
    if (error instanceof TemplateResolutionError) {
      throw error;
    }
    throw new TemplateResolutionError(
      `Unexpected error during template resolution: ${error.message}`,
      "UNKNOWN_ERROR",
      templateRef
    );
  }
}

/**
 * Convenience function: Resolve template and return just the result
 * (without throwing on error - returns error object instead)
 * 
 * @param {string} templateRef - Path to template
 * @param {string} baseDir - Base directory
 * @returns {{ success: boolean, template?: object, error?: TemplateResolutionError }}
 */
function safeResolveTemplate(templateRef, baseDir = process.cwd()) {
  try {
    const template = resolveTemplate(templateRef, baseDir);
    return { success: true, template };
  } catch (error) {
    return { success: false, error };
  }
}

module.exports = {
  resolveTemplate,
  safeResolveTemplate,
  TemplateResolutionError
};
