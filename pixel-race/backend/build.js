require("esbuild").build({
    entryPoints: ["src/server.ts"],
    bundle: true,
    platform: "node",
    outfile: "build/server.js",
    minify: true,
    tsconfig: "tsconfig.json",
    external: ["express"],
  }).catch(() => process.exit(1));