# CLAUDE.md

Guidance for AI agents working in this repository. [CONTRIBUTING.md](CONTRIBUTING.md) is the
authoritative contributor doc — this file is a quick-reference summary of it.

## What this is

Norigin Spatial Navigation — a library for directional (D-pad / remote control) focus management
on TVs and web apps. The core engine is framework-agnostic; a React binding wraps it.

## Repository layout

[Turborepo](https://turbo.build/) monorepo using [npm workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces):

```
apps/
  react-demo/        # Example React app for trying changes end-to-end
packages/
  core/              # @noriginmedia/norigin-spatial-navigation-core (the engine)
  react/             # @noriginmedia/norigin-spatial-navigation-react (useFocusable hook)
  legacy/            # @noriginmedia/norigin-spatial-navigation (re-exports core + react)
```

The bulk of the logic lives in `packages/core/src/SpatialNavigation.ts`. `legacy` is a thin
`export *` of core + react, so additive changes to those packages flow through automatically.

## Commands

Requires Node.js 20+ and npm 10+. Run everything **from the repository root** — Turbo and npm
workspaces handle cross-package symlinking, so there is no need to `npm install` inside packages.

| Command                | What it does                                          |
| ---------------------- | ----------------------------------------------------- |
| `npm install`          | Install all workspaces; also sets up the Husky hooks. |
| `npm run start`        | Build packages and run the demo app via Turbo.        |
| `npm run build`        | Build every package via Turbo.                        |
| `npm run test`         | Run the test suite for every package that has tests.  |
| `npm run lint`         | ESLint check across all workspaces.                   |
| `npm run prettier`     | Prettier format check across the repo.                |
| `npm run prettier:fix` | Auto-format files with Prettier.                      |
| `npm run changeset`    | Generate a changeset for user-visible changes.        |

## Code style

- **ESLint** — configured at the root (`.eslintrc.json`), inherited by each package.
- **Prettier** — configured at the root (`.prettierrc`).

Both run automatically on commit via a [Husky](https://typicode.github.io/husky/) `pre-commit`
hook (installed by `npm install`) and again in CI on every pull request. If a commit is rejected,
run `npm run lint` and `npm run prettier` to see what needs fixing.

## Testing

Jest + ts-jest, running in jsdom. Tests live in `**/__tests__/**/*.test.[jt]s?(x)` alongside the
source they cover (e.g. `packages/core/src/__tests__/SpatialNavigation.test.ts`). `domNodes.ts`
provides helpers for building focusable layouts in tests.

## Changesets

Any **user-visible** change needs a changeset. Run `npm run changeset` (interactive) or add a
markdown file under `.changeset/` directly. The format is YAML frontmatter mapping each affected
package name to its semver bump (`patch` / `minor` / `major`), followed by a one-paragraph summary
written for end users:

```markdown
---
'@noriginmedia/norigin-spatial-navigation-core': minor
'@noriginmedia/norigin-spatial-navigation-react': minor
'@noriginmedia/norigin-spatial-navigation': minor
---

Short, user-facing description of the change.
```

Versioning and publishing are handled by CI after merge. Changes to internal tooling, docs, tests,
CI, or the demo app do **not** need a changeset.

## Pull request process

1. Branch from `main`.
2. Make the change. If it touches the public API, update the docs under `docs/` (and the demo app
   in `apps/react-demo/` if applicable).
3. Run `npm run lint`, `npm run prettier`, and `npm run test` locally.
4. Generate a changeset (unless the change is tooling-only).
5. Open the PR; once approved, use "Squash and Merge" and delete the branch.

## Library usage reference

For how to _use_ the library (the `useFocusable` hook, `init` options, common patterns), see
`skills/norigin-spatial-navigation-react/SKILL.md` and the full docs under `docs/`.
