# Checkout test plan and results

## Scope

Validate the six-product image catalog, product/cart math, required-field handling, empty-cart protection, order submission and retry, one-time confirmation, and visible component states. Prices are fixed; no live payment or backend integration is in scope.

## Priorities

1. **P0 — Amount accuracy:** line total and grand total equal fixed unit price multiplied by quantity.
2. **P0 — Invalid checkout protection:** empty cart and missing/whitespace name do not create an order; feedback is clear and user input is preserved.
3. **P0 — Duplicate submission:** repeated fast input yields one service request and one confirmation.
4. **P1 — Service failure recovery:** user sees an error and can retry without losing cart/name.
5. **P1 — Cart edits:** add, remove, and quantity changes keep item count and totals in sync.
6. **P1 — Success clarity:** customer sees a single confirmation with one reference.
7. **P2 — Responsive layout:** controls remain visible and operable at mobile width.

## Automated coverage

| ID   | Setup / action                                                           | Expected assertion                                                                              | Test                                      |
| ---- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------- |
| R-01 | Fresh browser, add Field Notes, open cart, enter Jamie Park, place order | Badge increments, cart route opens, thank-you route shows name and reference; one status region | `tests/regression/checkout.spec.ts`       |
| R-02 | Fresh browser, add Trail Bottle, leave name blank, submit                | Required-name alert appears; cart and quantity remain intact                                    | `tests/regression/checkout.spec.ts`       |
| R-03 | Fresh browser, add Field Notes, set quantity to 3                        | Line total and order total both show `$36.00`                                                   | `tests/regression/checkout.spec.ts`       |
| R-04 | Add both products, remove Field Notes                                    | Field Notes disappears, Trail Bottle remains, total becomes `$28.00`                            | `tests/regression/checkout.spec.ts`       |
| R-05 | Open the catalog and inspect every product                               | Six products and all local SVG images load                                                      | `tests/regression/checkout.spec.ts`       |
| R-06 | Add Field Notes twice and open cart                                      | Badge, quantity, line total, and order total all equal 2 / `$24.00`                             | `tests/regression/checkout.spec.ts`       |
| F-01 | Mock POST response and place order                                       | Request JSON contains trimmed customer name; mocked reference is displayed                      | `tests/functional/checkout-api.spec.ts`   |
| F-02 | Mock 503, then retry with 201                                            | Error preserves form/cart; retry succeeds and produces the mocked reference                     | `tests/functional/checkout-api.spec.ts`   |
| F-03 | Delay response and double-click                                          | One request and one success status                                                              | `tests/functional/checkout-api.spec.ts`   |
| F-04 | Remove all items and submit                                              | Empty-cart alert; no service request                                                            | `tests/functional/checkout-api.spec.ts`   |
| F-05 | Submit whitespace-only name                                              | Validation appears; entered spaces/cart remain; no service request                              | `tests/functional/checkout-api.spec.ts`   |
| C-01 | Mount empty cart                                                         | Empty message and screenshot baseline                                                           | `tests/component/CartSummary.spec.tsx`    |
| C-02 | Mount cart with two notebooks, edit to four, remove                      | Exact totals update; empty state returns; screenshot baseline covers populated state            | `tests/component/CartSummary.spec.tsx`    |
| C-03 | Submit blank form                                                        | Alert, `aria-invalid`, and validation screenshot                                                | `tests/component/CheckoutForm.spec.tsx`   |
| C-04 | Mount cart icon with count 3 and activate it                             | Count is shown and navigation callback targets `/cart`                                          | `tests/component/CartIcon.spec.tsx`       |
| C-05 | Mount order breakdown with mixed quantities                              | Subtotal/total are `$68.00`, shipping reads Free, screenshot baseline matches                   | `tests/component/OrderBreakdown.spec.tsx` |
| C-06 | Mount catalog and add Daypack                                            | Six cards/images render, callback receives `daypack`, screenshot matches                        | `tests/component/ProductsPage.spec.tsx`   |

## Manual check record

Date: 2026-11-21. Manual browser checks were not completed. The browser-control layer stopped before navigation because it could not safely determine Chrome’s current URL. No manual observation is claimed.

The same empty-cart and rapid double-click scenarios were checked automatically in functional tests F-04 and F-03.

## Defect log

### D-001 — Empty-cart submit gave no validation feedback (fixed)

- **Steps:** Open a fresh checkout with an empty bag and activate Place order, or add an item and remove it before activating Place order.
- **Expected:** Checkout stays unsubmitted and a clear empty-cart validation message appears.
- **Actual before fix:** Place order was disabled while the bag was empty, so checkout could not be activated and no validation feedback appeared. Functional test F-04 timed out waiting for the alert.
- **Evidence:** Captured first-run assertion output in `evidence/D-001-before-fix.txt`.
- **Fix and retest:** Place order remains available to show the empty-cart message; the handler rejects the cart before calling the service. F-04 now passes and asserts the alert and zero service requests.

## Execution results

Execution results from the current Windows environment. GitHub Actions is configured for Ubuntu Linux; no Linux run was available locally.

| Command                   | Result         |
| ------------------------- | -------------- |
| `npm run format:check`    | Pass           |
| `npm run lint`            | Pass           |
| `npm run build`           | Pass           |
| `npm run test:regression` | Pass — 6 tests |
| `npm run test:functional` | Pass — 5 tests |
| `npm run test:component`  | Pass — 6 tests |

Environment: Windows, Node.js 22.6.0, Playwright 1.49.1, Chromium 131.
