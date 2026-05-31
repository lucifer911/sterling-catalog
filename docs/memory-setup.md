# Memory Setup — Full Bootstrap Steps

Run this once at the start of every new project.

## Step 1 — Confirm auto memory is on

Type `/memory` in the session and check the toggle is enabled.
Requires Claude Code v2.1.59+. Check with: `claude --version`

## Step 2 — Seed MEMORY.md

Scan the project files (package.json, Makefile, go.mod, etc.) and create:

```
~/.claude/projects/<project-slug>/memory/MEMORY.md
```

With this structure:

```markdown
## Project: <name>
- Stack: <detected stack>
- Entry point: <main file>
- Build: <build command>
- Test: <test command>
- Lint: <lint command>
- Key dirs: src/, tests/, docs/ (adjust to actual)
- Last updated: <date>
```

## Step 3 — Create topic files as work progresses

Claude will automatically create and update these as needed:

```
memory/
├── MEMORY.md          ← index, keep under 150 lines
├── architecture.md    ← design decisions
├── debugging.md       ← known issues and fixes
├── conventions.md     ← naming rules, code style
└── workflow.md        ← deploy steps, gotchas
```

## Step 4 — Optional: MCP vector memory (cross-project search)

Only set up if you want memories searchable across multiple projects or agents.
Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "memsearch": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "memsearch-mcp"],
      "env": {
        "MILVUS_URI": "http://localhost:19530"
      }
    }
  }
}
```

Requires a running Milvus instance. Skip this if auto memory (markdown) is enough.

## Memory hygiene

- Keep MEMORY.md under 150 lines — move detail into topic files
- Never delete memory files without asking the user
- Run `/memory` → "Dream" to consolidate stale notes
