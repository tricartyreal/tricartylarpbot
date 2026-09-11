---
name: Root package installs
description: Why dependencies for the monorepo root need explicit pnpm workspace-root handling.
---

Dependencies that belong to the monorepo root must be added with explicit workspace-root intent; the package installer otherwise refuses to modify the root package.

**Why:** The workspace intentionally protects against accidentally adding a dependency to the root when a package-local dependency was intended.

**How to apply:** When a root-level script needs a runtime dependency, use the package manager's explicit workspace-root flow and verify that both package.json and pnpm-lock.yaml changed.