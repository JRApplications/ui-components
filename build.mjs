/**
 * build.mjs
 *
 * Produces three output formats in /dist:
 *   - ESM  (dist/esm/)       — tree-shakeable ES modules
 *   - CJS  (dist/cjs/)       — CommonJS for older tooling / Node
 *   - Types (dist/types/)    — .d.ts files via tsc
 *
 * Usage:
 *   node build.mjs            # full build
 *   node build.mjs --watch    # rebuild on file change (ESM + CJS only)
 */

import esbuild from 'esbuild';
import { execSync } from 'child_process';
import { readFileSync, readdirSync, rmSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8'));
const isWatch = process.argv.includes('--watch');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
}

function clean() {
  if (existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
    log('🧹', 'Cleaned dist/');
  }
}

/**
 * Collect every component entry point so esbuild produces one chunk per
 * component (better tree-shaking) plus the root barrel.
 */
function entryPoints() {
  const entries = { 'index': 'src/index.ts' };

  try {
    readdirSync('src/components', { withFileTypes: true })
      .filter(d => d.isDirectory())
      .forEach(d => {
        const entry = `src/components/${d.name}/index.ts`;
        if (existsSync(entry)) {
          entries[`components/${d.name}/index`] = entry;
        }
      });
  } catch {
    // src/components doesn't exist yet — that's fine
  }

  return entries;
}

// ---------------------------------------------------------------------------
// CSS inject plugin — converts CSS imports into runtime <style> injection
// so consumers don't need to import a separate .css file.
// ---------------------------------------------------------------------------

const cssInjectPlugin = {
  name: 'css-inject',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, (args) => {
      const css = readFileSync(args.path, 'utf8');
      const id = 'jrapps-style-' + createHash('sha1').update(args.path).digest('hex').slice(0, 8);
      const escaped = JSON.stringify(css);
      const escapedId = JSON.stringify(id);
      return {
        contents: [
          `if (typeof document !== 'undefined' && !document.getElementById(${escapedId})) {`,
          `  const s = document.createElement('style');`,
          `  s.id = ${escapedId};`,
          `  s.textContent = ${escaped};`,
          `  document.head.appendChild(s);`,
          `}`,
        ].join('\n'),
        loader: 'js',
      };
    });
  },
};

// Packages that should never be bundled into the output
const external = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.dependencies ?? {}),
];

// ---------------------------------------------------------------------------
// Shared esbuild config
// ---------------------------------------------------------------------------

const sharedConfig = {
  entryPoints: entryPoints(),
  bundle: true,
  sourcemap: true,
  external,
  // Transform JSX at build time so published .js files contain no raw JSX syntax
  jsx: 'automatic',
  target: ['es2018'],
  logLevel: 'info',
  plugins: [cssInjectPlugin],
};

// ---------------------------------------------------------------------------
// ESM build
// ---------------------------------------------------------------------------

async function buildESM() {
  log('📦', 'Building ESM…');
  await esbuild.build({
    ...sharedConfig,
    format: 'esm',
    outdir: 'dist/esm',
    splitting: true,  // enables code-splitting across components
    chunkNames: 'chunks/[name]-[hash]',
  });
  log('✅', 'ESM done  →  dist/esm/');
}

// ---------------------------------------------------------------------------
// CJS build
// ---------------------------------------------------------------------------

async function buildCJS() {
  log('📦', 'Building CJS…');
  await esbuild.build({
    ...sharedConfig,
    format: 'cjs',
    outdir: 'dist/cjs',
    // Splitting is not supported for CJS; each entry is self-contained
  });
  log('✅', 'CJS done  →  dist/cjs/');
}

// ---------------------------------------------------------------------------
// TypeScript declarations
// ---------------------------------------------------------------------------

function buildTypes() {
  log('🔷', 'Generating TypeScript declarations…');
  try {
    execSync('tsc --project tsconfig.build.json', { stdio: 'inherit' });
    log('✅', 'Types done →  dist/types/');
  } catch {
    // tsc exits non-zero on type errors; surface the message but keep going
    // so CI can report both type errors and bundle results together.
    console.error('⚠️   TypeScript reported errors above. Fix them before publishing.');
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// Watch mode  (ESM + CJS only; tsc --watch can be run separately)
// ---------------------------------------------------------------------------

async function watch() {
  log('👀', 'Watch mode — rebuilding on changes…');

  const watchConfig = {
    ...sharedConfig,
    plugins: [
      cssInjectPlugin,
      {
        name: 'rebuild-notify',
        setup(build) {
          build.onEnd(result => {
            if (result.errors.length) {
              console.error('❌  Build failed:', result.errors);
            } else {
              log('🔄', `Rebuilt at ${new Date().toLocaleTimeString()}`);
            }
          });
        },
      },
    ],
  };

  const [esmCtx, cjsCtx] = await Promise.all([
    esbuild.context({ ...watchConfig, format: 'esm', outdir: 'dist/esm', splitting: true }),
    esbuild.context({ ...watchConfig, format: 'cjs', outdir: 'dist/cjs' }),
  ]);

  await Promise.all([esmCtx.watch(), cjsCtx.watch()]);
  log('💡', 'Watching for changes. Ctrl-C to stop.');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (isWatch) {
    await watch();
    return;
  }

  clean();
  await Promise.all([buildESM(), buildCJS()]);
  buildTypes();

  log('🎉', 'Build complete!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
