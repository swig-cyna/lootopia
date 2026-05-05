import esbuild from "esbuild"
import { readdirSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "../..")
const migrationsDir = path.join(root, "packages/db/src/migrations")

const migrationFiles = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".ts"))
  .sort()

const migrationsPlugin = {
  name: "migrations-virtual",
  setup(build) {
    build.onResolve({ filter: /^migrations:all$/ }, () => ({
      path: "migrations:all",
      namespace: "migrations",
    }))

    build.onLoad({ filter: /.*/, namespace: "migrations" }, () => {
      const imports = migrationFiles
        .map(
          (f, i) =>
            `import * as m${i} from ${JSON.stringify(path.join(migrationsDir, f))};`,
        )
        .join("\n")

      const entries = migrationFiles
        .map((f, i) => `"${f.replace(/\.ts$/, "")}": m${i}`)
        .join(",\n  ")

      return {
        contents: `${imports}\nexport default { ${entries} }`,
        loader: "ts",
        resolveDir: migrationsDir,
      }
    })
  },
}

const sharedConfig = {
  bundle: true,
  minify: true,
  platform: "node",
  sourcemap: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  alias: {
    "@lootopia/api": path.join(__dirname, "src"),
    "@lootopia/auth": path.join(root, "packages/auth/src"),
    "@lootopia/db": path.join(root, "packages/db/src"),
  },
}

await Promise.all([
  esbuild.build({
    ...sharedConfig,
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.cjs",
  }),
  esbuild.build({
    ...sharedConfig,
    entryPoints: [path.join(root, "packages/db/src/migrate.ts")],
    outfile: path.join(root, "packages/db/dist/migrate.cjs"),
    plugins: [migrationsPlugin],
  }),
])
