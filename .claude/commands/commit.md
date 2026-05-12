Analyze `git diff HEAD` and `git status`, then generate a commit message following these rules:

**Format:** `type(scope): short description`

**Types:**

- `feat` — new feature
- `fix` — bug fix
- `refactor` — restructuring without behavior change
- `style` — visual/CSS changes only
- `chore` — config, deps, scripts
- `docs` — documentation only
- `test` — adding or modifying tests

**Scope:** the name of the feature or module involved (e.g. `auth`, `map`, `ui`, `api`)

**Rules:**

- Description in English, imperative mood, no capital letter, no trailing period
- Maximum 72 characters total
- If changes touch multiple distinct domains, suggest 2-3 alternative messages
- Never invent anything not present in the diff

Output only the proposed commit message(s), with no additional explanation.
