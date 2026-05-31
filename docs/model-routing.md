# Model Routing — Full Reference

## Routing Table

| Task | Model |
|------|-------|
| Chat, Q&A, brainstorming | claude-haiku-4-5 |
| Planning, architecture discussion | claude-haiku-4-5 |
| Reading/explaining existing code | claude-haiku-4-5 |
| Writing new code | claude-sonnet-4-6 |
| Debugging, fixing bugs | claude-sonnet-4-6 |
| Refactoring (more than 2 files) | claude-sonnet-4-6 |
| Security-sensitive or irreversible changes | claude-sonnet-4-6 |

## Rules

1. Default to Haiku. Escalate to Sonnet only when actually writing code.
2. Drop back to Haiku immediately after the coding task is done.
3. If unsure, ask yourself: "Am I producing code that will be committed?" Yes → Sonnet. No → Haiku.
4. Label each response: [Haiku — Planning] or [Sonnet — Coding]

## Anti-patterns

- Do NOT use Sonnet to answer a simple question
- Do NOT stay on Sonnet after coding wraps up
- Do NOT use Haiku to write production code
