Crée une nouvelle migration Kysely avec le nom fourni en argument : $ARGUMENTS

Exécute la commande suivante depuis la racine du projet :

```bash
pnpm --filter @lootopia/db kysely migrate:make '$ARGUMENTS'
```

Puis affiche le chemin du fichier créé dans `packages/db/src/migrations/`.
