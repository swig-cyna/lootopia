import esbuild from "esbuild"

esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  outfile: "dist/index.cjs",
  sourcemap: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
})
