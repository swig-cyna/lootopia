Do an adversarial code review of the staged diff (`git diff --staged`) and modified files (`git status`).

Use the following skill references as the source of truth for all rules:

@.claude/skills/styling/SKILL.md
@.claude/skills/frontend-architecture/SKILL.md
@.claude/skills/data-fetching/SKILL.md
@.claude/skills/forms/SKILL.md
@.claude/skills/backend-architecture/SKILL.md
@.claude/skills/mapbox/SKILL.md
@.claude/skills/code-quality/SKILL.md

---

For each file changed, apply the rules from the relevant skill(s) above based on the file's location and purpose. For each problem found, indicate: the file + line number, what is wrong, and how to fix it.

---

Output format:

**If everything is correct:** "✅ Review OK — no issues found."

**If problems are found:**

```
❌ [file:line] — Description of the problem
→ Fix: what should be written instead
```

Sort problems by severity: architecture errors first, then conventions, then style.
