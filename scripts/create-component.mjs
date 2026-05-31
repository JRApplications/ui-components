#!/usr/bin/env node
/**
 * create-component.mjs
 *
 * Scaffolds a new UI component and registers it in src/components/index.ts.
 *
 * Usage:
 *   node scripts/create-component.mjs MyComponent
 *   node scripts/create-component.mjs MyComponent --dir src/components
 *
 * What it creates:
 *   src/components/MyComponent/
 *     ├── MyComponent.tsx
 *     ├── MyComponent.css
 *     ├── MyComponent.types.ts
 *     ├── useMyComponent.ts
 *     └── index.ts
 *
 * It also appends an export line to src/components/index.ts.
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync, appendFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

if (!args.length || args[0].startsWith('-')) {
  console.error('Usage: node scripts/create-component.mjs <ComponentName> [--dir path/to/components]');
  process.exit(1);
}

const name = args[0];

// Validate PascalCase
if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error(`❌  Component name must be PascalCase (e.g. "MyButton"), got: "${name}"`);
  process.exit(1);
}

const dirFlagIndex = args.indexOf('--dir');
const componentsDir = dirFlagIndex !== -1 && args[dirFlagIndex + 1]
  ? resolve(ROOT, args[dirFlagIndex + 1])
  : resolve(ROOT, 'src/components');

const componentDir = join(componentsDir, name);
const barrelFile   = join(componentsDir, 'index.ts');

// Derived helpers
const hookName     = `use${name}`;        // e.g. useMyComponent
const propsType    = `${name}Props`;      // e.g. MyComponentProps
const cssClass     = name                 // e.g. myComponent
  .replace(/([A-Z])/g, (m, l, i) => (i === 0 ? l.toLowerCase() : `-${l.toLowerCase()}`));

// ---------------------------------------------------------------------------
// Guard: already exists?
// ---------------------------------------------------------------------------

if (existsSync(componentDir)) {
  console.error(`❌  Component "${name}" already exists at ${componentDir}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// File templates
// ---------------------------------------------------------------------------

const files = {

  // ── ComponentName.types.ts ────────────────────────────────────────────────
  [`${name}.types.ts`]: `\
import type { HTMLAttributes } from 'react';

export interface ${propsType} extends HTMLAttributes<HTMLDivElement> {
  // Add your props here
}
`,

  // ── ComponentName.css ─────────────────────────────────────────────────────
  [`${name}.css`]: `\
.${cssClass} {
  /* ${name} base styles */
}
`,

  // ── ComponentName.tsx ─────────────────────────────────────────────────────
  [`${name}.tsx`]: `\
import React from 'react';
import type { ${propsType} } from './${name}.types';
import { ${hookName} } from './${hookName}';
import './${name}.css';

export const ${name} = React.forwardRef<HTMLDivElement, ${propsType}>(
  ({ className, children, ...rest }, ref) => {
    const { } = ${hookName}();

    return (
      <div
        ref={ref}
        className={[className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

${name}.displayName = '${name}';
`,

  // ── useComponentName.ts ───────────────────────────────────────────────────
  [`${hookName}.ts`]: `\
/**
 * ${hookName}
 *
 * Internal hook that encapsulates the logic for ${name}.
 * Keep this file focused on state and side-effects; keep JSX in ${name}.tsx.
 */
export function ${hookName}() {
  // Add state and derived values here

  return {};
}
`,

  // ── index.ts ──────────────────────────────────────────────────────────────
  [`index.ts`]: `\
export { ${name} } from './${name}';
export type { ${propsType} } from './${name}.types';
`,

};

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------

mkdirSync(componentDir, { recursive: true });

for (const [filename, content] of Object.entries(files)) {
  const filePath = join(componentDir, filename);
  writeFileSync(filePath, content, 'utf8');
  console.log(`  ✅  Created ${filename}`);
}

// ---------------------------------------------------------------------------
// Register in barrel
// ---------------------------------------------------------------------------

const exportLine = `export * from './${name}';\n`;

if (!existsSync(barrelFile)) {
  // Create a fresh barrel
  writeFileSync(barrelFile, exportLine, 'utf8');
  console.log(`  ✅  Created src/components/index.ts`);
} else {
  const existing = readFileSync(barrelFile, 'utf8');

  if (existing.includes(`'./${name}'`)) {
    console.warn(`  ⚠️  ${name} already exported in src/components/index.ts — skipping`);
  } else {
    // Insert in alphabetical order
    const lines  = existing.trimEnd().split('\n');
    const marker = `export * from './${name}';`;

    const insertAt = lines.findIndex(l => {
      const m = l.match(/from '\.\/([^']+)'/);
      return m && m[1].toLowerCase() > name.toLowerCase();
    });

    if (insertAt === -1) {
      lines.push(marker);
    } else {
      lines.splice(insertAt, 0, marker);
    }

    writeFileSync(barrelFile, lines.join('\n') + '\n', 'utf8');
    console.log(`  ✅  Registered ${name} in src/components/index.ts`);
  }
}

// ---------------------------------------------------------------------------
// Done
// ---------------------------------------------------------------------------

console.log(`
🎉  Component "${name}" created at:
    ${componentDir}

Next steps:
  1. Add your props to  ${name}.types.ts
  2. Write your styles  ${name}.css
  3. Build your logic   ${hookName}.ts
  4. Compose your JSX   ${name}.tsx
`);
