/**
 * dev.mjs
 *
 * Starts a local dev server that bundles src/test/test.ts and serves it in
 * a minimal HTML shell. Edit test.ts to load the components you want to test.
 *
 * Usage:
 *   node scripts/dev.mjs          # default port 3000
 *   node scripts/dev.mjs --port 4000
 */

import esbuild from 'esbuild';
import { mkdirSync, writeFileSync } from 'fs';

const portArg = process.argv.indexOf('--port');
const port = portArg !== -1 ? Number(process.argv[portArg + 1]) : 3000;

const OUT_DIR = '.dev';

// ---------------------------------------------------------------------------
// Write the HTML shell into the serve directory
// ---------------------------------------------------------------------------

mkdirSync(OUT_DIR, { recursive: true });

writeFileSync(
  `${OUT_DIR}/index.html`,
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UI Components — Dev</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #f5f5f5; }
    #root { padding: 2rem; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="/bundle.js"></script>
</body>
</html>`,
);

// ---------------------------------------------------------------------------
// esbuild: bundle test.tsx and watch for changes
// ---------------------------------------------------------------------------

const ctx = await esbuild.context({
  entryPoints: ['src/test/test.tsx'],
  bundle: true,
  sourcemap: true,
  jsx: 'automatic',
  // Treat .ts files as TSX so JSX is allowed inside test.tsx
  loader: { '.ts': 'tsx', '.css': 'css' },
  target: ['es2020'],
  outfile: `${OUT_DIR}/bundle.js`,
  logLevel: 'silent',
  plugins: [
    {
      name: 'dev-notify',
      setup(build) {
        build.onEnd(result => {
          if (result.errors.length) {
            console.error('❌  Build failed:');
            result.errors.forEach(e => console.error(' ', e.text));
          } else {
            console.log(`🔄  Rebuilt at ${new Date().toLocaleTimeString()}`);
          }
        });
      },
    },
  ],
});

await ctx.watch();

const { host, port: servedPort } = await ctx.serve({
  servedir: OUT_DIR,
  port,
});

console.log(`\n🚀  Dev server → http://${host}:${servedPort}`);
console.log(`    Edit src/test/test.tsx — the browser will reload on save.\n`);
console.log('    Press Ctrl+C to stop.\n');
