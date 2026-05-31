# @jrapps/ui-components

A community-built React component library. Each component is owned and maintained by its original contributor.

---

## Installation

```bash
npm install @jrapps/ui-components
```

React 17 or higher is required as a peer dependency.

```bash
npm install react react-dom
```

---

## Usage

```tsx
import { Button, Box } from '@jrapps/ui-components';

export default function App() {
  return (
    <Button variant="primary" onClick={() => console.log('clicked')}>
      Click me
    </Button>
  );
}
```

---

## Contributing

We welcome new components! Each component you contribute becomes yours — you are listed as its CODEOWNER and all future changes require your approval.

### Adding a new component

1. Fork the repo and create a branch:
   ```bash
   git checkout -b feat/my-component
   ```

2. Scaffold your component using the built-in script:
   ```bash
   npm run create:component MyComponent
   ```
   This creates all the necessary files and registers the component in the barrel export automatically.

3. Build your component across the generated files:
   ```
   src/components/MyComponent/
   ├── MyComponent.tsx        # JSX and structure
   ├── MyComponent.css        # Styles
   ├── MyComponent.types.ts   # Prop types
   ├── useMyComponent.ts      # Hook logic
   └── index.ts               # Exports
   ```

4. Verify the build passes locally:
   ```bash
   npm run build
   ```

5. Open a pull request against `main`.

### Rules

- Only modify components you own. Check [`.github/CODEOWNERS`](.github/CODEOWNERS) to find the owner of an existing component.
- Do not edit another contributor's component without first opening an issue to discuss it.
- All CI checks must pass before a PR can be merged.
- One component per PR where possible.

### What happens after your PR is merged

- You are added to `.github/CODEOWNERS` for your component directory.
- Future PRs that touch your component will require your review before merging.

---

## Development

```bash
# Install dependencies
npm install

# Build ESM, CJS and type declarations
npm run build

# Rebuild on file change
npm run build:watch
```

### Output structure

```
dist/
├── esm/        # ES modules (tree-shakeable)
├── cjs/        # CommonJS
└── types/      # TypeScript declarations (.d.ts)
```

---

## Project structure

```
.
├── .github/
│   ├── workflows/
│   │   ├── ci.yml           # Runs on every PR
│   │   └── publish.yml      # Publishes to npm on release
│   ├── CODEOWNERS           # Component ownership
│   └── pull_request_template.md
├── scripts/
│   └── create-component.mjs # Component scaffold script
├── src/
│   ├── components/
│   │   └── ComponentName/
│   └── index.ts
├── build.mjs
├── tsconfig.json
└── tsconfig.build.json
```
