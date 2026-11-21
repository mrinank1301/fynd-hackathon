# Mini Checkout and Browser Test Suite

A small routed shop built with React and TypeScript. Customers browse six fixed-price products with local SVG artwork, use the quantity badge in the header to open a two-column cart, edit their items, then submit checkout and arrive at a thank-you page with an order reference. The demo uses a local Vite middleware response, so it needs no backend, payment provider, database, or external service. Functional browser tests replace that order endpoint with controlled mocks.

## Requirements

- Node.js 20 or newer and npm
- Playwright Chromium for the browser suites (`npx playwright install chromium` locally; CI installs the Linux browser and OS dependencies)

## Run the checkout

```bash
npm ci
npm run dev
```

Open <http://127.0.0.1:5173/products>. Browse the six products with local artwork, add products and watch the header cart count update. Open the cart to adjust quantities, remove products, review the subtotal/free-shipping/total breakdown, enter a name, and place the order. Success routes to `/thank-you`. The local demo endpoint responds with reference `NS-20481`.

## Project structure

```text
src/
  components/       Header/cart icon, cart list, order breakdown, form, confirmation
  data/             Six-product fixed catalog
  pages/            Products, cart, thank-you, and route/state orchestration
  services/         HTTP boundary for order submission
  utils/            Currency formatting
public/
  products/         Six local SVG product illustrations
tests/
  regression/        Product → cart → thank-you and cart-edit journeys
  functional/        Order API contract, errors, empty cart, duplicate submit
  component/         Cart badge, breakdown, interactions, accessibility, snapshots
playwright/          Component-test harness
.github/workflows/   Quality, automatic tests, and manually dispatched regression
```

## Test suites

Each suite uses its own Playwright config and report folder. Every test navigates to or mounts a new page/component, giving it a clean state.

Browser suites pin a 1280×900 viewport, device scale, locale, timezone, color scheme, and reduced-motion preference. Each suite uses two workers to reduce load-related timing variance; assertions wait on visible state instead of fixed delays.

### Regression: `npm run test:regression`

Runs browser-level customer journeys against the local demo: catalog and image loading, successful product → cart → thank-you checkout, missing-name validation, quantity arithmetic, and removing one item while keeping the other. This is also the **manual CI stage**: in GitHub Actions, start “Checkout quality gates” using **Run workflow** to include this suite.

### Functional: `npm run test:functional`

Runs automatically on pushes and pull requests. The tests intercept `/api/orders` and assert the trimmed request body, successful response handling, retry after service failure, empty-cart and whitespace-name rejection, and rapid double submission. They assert visible outcomes and service-call counts rather than relying on a production service.

### Component: `npm run test:component`

Runs automatically on pushes and pull requests using Playwright Component Testing. It covers all six product images, cart count/navigation, empty and populated cart snapshots, quantity/removal interactions, order breakdown totals, and required-field accessibility. PNG snapshots live beside the component test files. Refresh them intentionally with `npm run test:component:update` and review the image diff.

On Linux, install the browser first:

```bash
npx playwright install --with-deps chromium
```

### Reports and commands

```bash
npm run test:all           # regression, functional, then component
npm run lint
npm run format:check
npm run build
```

Playwright HTML reports are written to `playwright-report/<suite>/`. Failure traces and screenshots are retained by Playwright in `test-results/`.

## CI stages

The workflow runs lint, formatting verification, and the production build first. Functional and component jobs then run in parallel on Ubuntu with Chromium. The regression job is gated behind those stages and runs only when a workflow is manually dispatched. Reports are uploaded as workflow artifacts.

## Test plan and priorities

| Priority | Risk / scenario                           | Check and expected result                                                                               | Suite                               |
| -------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| P0       | Wrong checkout amount                     | Change quantity; line and order totals equal unit price × quantity exactly                              | Regression + component              |
| P0       | Invalid order accepted                    | Blank/whitespace name or empty bag cannot submit; a clear alert appears and entered data stays in place | Regression + functional + component |
| P0       | Duplicate orders from fast repeated input | Double click during delayed response; one POST and one confirmation only                                | Functional                          |
| P1       | Order service fails                       | Clear error appears, name and bag survive, and retry is available                                       | Functional                          |
| P1       | Cart navigation and edits                 | Badge reflects quantity, cart opens as two columns, and removing a product recalculates the total       | Regression + component              |
| P1       | Product catalog clarity                   | All six products have loaded local artwork, clear names, and fixed prices                               | Regression + component              |
| P1       | Confirmation is unclear                   | Success shows customer name and exactly one order reference                                             | Regression + functional             |
| P2       | Responsive checkout usability             | At narrow viewport, product cards and checkout panels stack and controls remain usable                  | Manual follow-up                    |

### Manual test results

Manual UI checks were **not completed** in this environment. The browser-control layer stopped before navigation because it could not determine Chrome’s current URL. No manual observation is claimed. Empty-cart and rapid double-click behavior were verified by the automated functional suite (4/4 passing).

## Results

Local Windows checks used Node.js 22.6.0 and Playwright 1.49.1 / Chromium 131. The Linux CI simulation used the pinned `mcr.microsoft.com/playwright:v1.49.1-noble` image and Chromium.

| Command                   | Result                                        |
| ------------------------- | --------------------------------------------- |
| `npm run format:check`    | Pass                                          |
| `npm run lint`            | Pass                                          |
| `npm run build`           | Pass                                          |
| `npm run test:regression` | Pass — 6 tests                                |
| `npm run test:functional` | Pass — 5 tests                                |
| `npm run test:component`  | Pass — 6 tests, screenshot baselines verified |

Linux Docker CI simulation ran the quality stage and all three browser suites with `CI=1`:

| Stage / suite                               | Result         |
| ------------------------------------------- | -------------- |
| Format check, lint, production build        | Pass           |
| Functional                                  | Pass — 5 tests |
| Component, Linux Chromium snapshots         | Pass — 6 tests |
| Regression (manual workflow-dispatch stage) | Pass — 6 tests |

The GitHub Actions workflow targets Ubuntu Linux with Chromium. Component visual snapshots and the Playwright component build cache are stored separately by operating system because Chromium font rasterization and absolute module paths differ between Windows and Linux. CI uses the Linux Chromium snapshot set. The checkout-form snapshot permits at most 100 differing pixels; refresh snapshots with `npm run test:component:update` in the same OS and Chromium environment used for that baseline, then review the diffs.

## About unit tests

In the agentic era, producing isolated Jest tests is easy, so a green unit suite alone can offer little confidence that a customer journey works. Playwright component tests exercise rendered output, props, browser interactions, accessibility state, and visual snapshots; the functional suite covers the order-service boundary. Jest can still help with pure helper logic, but it is not a substitute for these customer-visible checks.
