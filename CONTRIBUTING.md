# Contributing

## Adding a new component

Run the scaffold script and follow the prompts:

    npm run create:component MyComponent

Open a PR. You will automatically become the CODEOWNER of your component,
meaning all future changes to it require your approval.

## Modifying an existing component

Check `.github/CODEOWNERS` to find the owner and open an issue to discuss
the change before submitting a PR. Unsolicited edits to another contributor's
component will not be merged without owner sign-off.

## Rules

- Never push directly to `main` — all changes go through a PR
- All CI checks must pass before merging
- One component per PR where possible
