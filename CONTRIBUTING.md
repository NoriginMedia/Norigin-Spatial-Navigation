# Contributing

Thanks for your interest in contributing to Norigin Spatial Navigation! Before making a change, please first discuss it via an issue, email, or another channel with the repository owners.

Please also follow our [Code of Conduct](#code-of-conduct) in all project interactions.

## Repository layout

This repo is a [Turborepo](https://turbo.build/) monorepo managed with [npm workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces):

```
apps/
  react-demo/        # Example React app for trying changes end-to-end
packages/
  core/              # @noriginmedia/norigin-spatial-navigation-core
  react/             # @noriginmedia/norigin-spatial-navigation-react
  legacy/            # @noriginmedia/norigin-spatial-navigation (legacy, pre-split)
```

## Getting started

You need Node.js 20+ and npm 10+.

1. Fork the repository and clone your fork.
2. Install dependencies **from the repository root**:

   ```bash
   npm install
   ```

   This installs dependencies for every workspace in one go. Turbo and npm workspaces handle symlinking between packages automatically — for example, `apps/react-demo` will resolve `@noriginmedia/norigin-spatial-navigation` straight from `packages/legacy/` in your local checkout, so changes you make in the packages are picked up instantly. There is no need to run `npm install` inside individual packages.

3. Start the example app to verify your setup:

   ```bash
   npm run start
   ```

   This builds the packages and runs the demo via Turbo.

Other useful scripts (all run from the repo root):

| Command                | What it does                                         |
| ---------------------- | ---------------------------------------------------- |
| `npm run build`        | Build every package via Turbo.                       |
| `npm run test`         | Run the test suite for every package that has tests. |
| `npm run lint`         | ESLint check across all workspaces.                  |
| `npm run prettier`     | Prettier format check across the repo.               |
| `npm run prettier:fix` | Auto-format files with Prettier.                     |

## Code style

The repo enforces two things:

- **ESLint** — configured at the root (`.eslintrc.json`) and inherited by each package. Run `npm run lint`.
- **Prettier** — configured at the root (`.prettierrc`). Run `npm run prettier` to check, or `npm run prettier:fix` to auto-fix.

Both checks run automatically on every commit via a [Husky](https://typicode.github.io/husky/) `pre-commit` hook, and again in CI on every pull request. The hook is set up for you the first time you run `npm install` — there is no manual step. If you ever see a commit rejected locally, run `npm run lint` and `npm run prettier` to see exactly what needs fixing.

## Changesets

We use [Changesets](https://github.com/changesets/changesets) to version and publish the packages. **As a contributor, the only thing you need to do is generate a changeset for any user-visible change.** Versioning and publishing are handled by CI after your PR is merged, so you do not need to run `changeset version` or `changeset publish` yourself.

After making your changes, run:

```bash
npm run changeset
```

This starts an interactive prompt that walks you through:

1. **Which packages changed** — select every package affected by your PR (for example, a change to both `core` and `react`).
2. **What kind of bump each package needs** — `patch` for bug fixes, `minor` for new features, `major` for breaking changes, following [Semantic Versioning](https://semver.org/).
3. **A short summary** — this ends up in each package's `CHANGELOG.md`. Write it for end users of the library, not fellow maintainers.

A new markdown file will be created under `.changeset/`. Commit it alongside your code changes.

A few tips:

- If a PR contains multiple logically separate changes, it's fine to generate multiple changesets.
- Changes to internal tooling, docs, tests, CI, or the demo app (anything that does not affect the published packages) do **not** need a changeset.
- If you forget, CI will flag it — the changeset bot comments on the PR.

## Pull request process

1. Create a branch from `main`.
2. Make your changes.
3. If your change touches the public API, update the documentation under `docs/` and the example in `apps/react-demo/` if applicable.
4. Run `npm run lint`, `npm run prettier`, and `npm run test` locally — these are the same checks CI runs.
5. Generate a changeset with `npm run changeset` (unless the change is tooling-only).
6. Open a PR. Once it's reviewed and approved it will be merged — please use "Squash and Merge" and delete your branch afterwards.

## Code of Conduct

See [Code of Conduct](https://github.com/NoriginMedia/react-spatial-navigation/blob/master/CODE_OF_CONDUCT.md).
