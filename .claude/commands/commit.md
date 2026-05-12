Analyse le résultat de `git diff --staged` et `git status`, puis génère un message de commit en suivant ces règles :

**Format :** `type(scope): description courte`

**Types :**
- `feat` — nouvelle fonctionnalité
- `fix` — correction de bug
- `refactor` — restructuration sans changement de comportement
- `style` — changements visuels/CSS uniquement
- `chore` — config, deps, scripts
- `docs` — documentation uniquement
- `test` — ajout ou modification de tests

**Scope :** le nom de la feature ou du module concerné (ex: `auth`, `map`, `ui`, `api`)

**Règles :**
- Description en anglais, à l'infinitif, sans majuscule, sans point final
- Maximum 72 caractères au total
- Si les changements touchent plusieurs domaines distincts, propose 2-3 messages alternatifs
- N'invente rien qui ne soit pas dans le diff

Affiche uniquement le ou les messages de commit proposés, sans explication supplémentaire.
