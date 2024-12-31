import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig, type UserConfigExport } from 'vite';

const baseConfig = {
  test: {
    globals: true,
    browser: {
      provider: 'playwright',
      enabled: true,
      name: 'chromium',
      screenshotFailures: false,
    },
    environment: 'happy-dom',
    setupFiles: ['./test/setup-test-env.ts'],
    include: ['./app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
} satisfies UserConfigExport;

export default defineConfig(() => {
  return mergeConfig(baseConfig, {
    /**
     * Custom configuration to merge into base config.
     * @example
     * plugins: [reactRouter(), tsconfigPaths()]
     **/
    plugins: [react(), tsconfigPaths()],
  } satisfies UserConfigExport);
});
