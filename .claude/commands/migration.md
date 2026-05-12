Create a new Kysely migration with the name provided as argument: $ARGUMENTS

Run the following command from the project root:

```bash
pnpm --filter @lootopia/db kysely migrate:make '$ARGUMENTS'
```

Then display the path of the created file in `packages/db/src/migrations/`.
