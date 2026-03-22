import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    // Bundle all internal @package/* workspace packages into the output
    noExternal: [/@package\/.*/],
    // Keep runtime peer/deps as external
    external: ['viem', 'zod'],
});
