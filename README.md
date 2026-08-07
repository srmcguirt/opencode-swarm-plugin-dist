# opencode-swarm-plugin (distribution build)

**This repo is build output, not source.** It exists so that
`bun add -g opencode-swarm-plugin` (via a git dependency) installs a working,
fixed binary instead of npm's stale/broken `0.63.2` release.

## Why this exists

npm's published `opencode-swarm-plugin@0.63.2` silently corrupts the swarm
memory database — no error, `healthy: true`, queries just return nothing.
Bun does not run `prepare`/`postinstall` build steps usefully on git
dependencies (bin-linking happens before lifecycle scripts and does not
retry — reproduced across multiple clean installs), so a git install only
works if `dist/` is already committed. This repo commits `dist/` on purpose.

## Where the source lives

Development happens in [`srmcguirt/swarm-tools`](https://github.com/srmcguirt/swarm-tools)
(a fork tracking `joelhooks/swarm-tools`), specifically
`packages/opencode-swarm-plugin`. **Do not send PRs here.** File issues and
send patches against `swarm-tools`.

This repo mirrors the *build output* of that package at repo root (rather
than a subdirectory) because subdirectory refs are broken for every
`bun add -g github:owner/repo/path` syntax tested — the package must sit at
the repo root for a git install to work.

## What's actually load-bearing

`dist/bin/swarm.js` (the `swarm` CLI binary) is fully self-contained —
`swarm-mail` and `swarm-queue` are bundled directly into it. Its only real
runtime dependencies are `@clack/prompts` and `@libsql/client`, which is why
`package.json` here only lists those two — everything else `swarm-tools`
depends on for building/testing is intentionally left out.

`dist/plugin.js` and `dist/index.js` are also present (for npm-style
`import` consumers) but are **not** self-contained and are not the
integration point most setups use. The real OpenCode integration point is a
hand-authored wrapper at `~/.config/opencode/plugin/swarm.ts` that shells
out to the `swarm` CLI rather than importing this package directly.

## Install

```sh
bun add -g github:srmcguirt/opencode-swarm-plugin
```

Verify:

```sh
swarm doctor
```

## Release procedure

When `swarm-tools` ships a fix that needs to reach the global install:

1. In `~/Development/swarm-tools` (or wherever the source checkout lives),
   build in dependency order:
   ```sh
   cd packages/swarm-queue && bun run build
   cd ../swarm-mail && bun run build
   cd ../opencode-swarm-plugin && bun run build
   ```
2. Copy the package contents into this repo's working tree, mirroring
   `packages/opencode-swarm-plugin`'s `files` field (`dist/`, `claude-plugin/`,
   `examples/`, `global-skills/`, `README.md`) — **do not** copy `src/`,
   `.hive/`, `.changeset/`, or other dev-only workspace files.
3. Confirm `dist/` is staged (it's normally gitignored upstream — this repo
   intentionally does not ignore it):
   ```sh
   git status
   git add -A
   ```
4. Bump `version` in `package.json` to reflect the new build (e.g. append
   the upstream commit SHA as build metadata: `0.63.2-fix.N+<sha>`).
5. Commit and push:
   ```sh
   git commit -m "build: sync dist from swarm-tools@<sha>"
   git push
   ```
6. Reinstall globally and re-verify:
   ```sh
   bun remove -g opencode-swarm-plugin
   bun add -g github:srmcguirt/opencode-swarm-plugin
   swarm doctor
   ```

## Rollback

If a published build breaks something, reinstall the last known-good
tarball or pin to a previous commit SHA of this repo:

```sh
bun add -g github:srmcguirt/opencode-swarm-plugin#<previous-good-sha>
```

Never fall back to npm's `opencode-swarm-plugin@0.63.2` — that build is the
broken one this repo exists to replace.
