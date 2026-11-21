import { defineConfig, devices } from "@playwright/experimental-ct-react";

export default defineConfig({
  testDir: "./tests/component",
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report/component", open: "never" }],
  ],
  snapshotPathTemplate:
    "tests/component/{testFileName}-snapshots/{platform}/{arg}{ext}",
  use: {
    ...devices["Desktop Chrome"],
    ctCacheDir: `playwright/.cache/${process.platform}`,
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    locale: "en-US",
    timezoneId: "UTC",
    colorScheme: "light",
    contextOptions: { reducedMotion: "reduce" },
    actionTimeout: 5_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
