# QA Automation Project Skills

## Project Role

This repository is a professional QA Automation framework using Playwright and JavaScript.

Maintain the project as a QA Automation Engineer/SDET framework. Do not introduce unnecessary complexity or advanced patterns unless they provide clear professional value.

## Technology

- Playwright
- JavaScript
- Node.js
- MySQL
- mysql2
- Git
- GitHub
- GitHub Actions
- GitHub Copilot

## Test Architecture

Use the appropriate layer for each validation:

- UI testing → Playwright browser automation
- API testing → Playwright APIRequestContext
- Database testing → mysql2
- Integration testing → service-to-service validation
- E2E testing → UI → API → Database → UI

## Locator Strategy

Prefer stable, user-facing locators:

1. `getByRole()`
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByText()`
5. `getByTestId()`
6. CSS/XPath only when appropriate

Avoid brittle selectors based on dynamic classes or DOM structure when a better locator exists.

## Assertions

Every important test action must have meaningful validation.

Prefer Playwright web-first assertions such as:

```javascript
await expect(locator).toBeVisible();
await expect(locator).toHaveText('expected text');
await expect(locator).toHaveValue('expected value');