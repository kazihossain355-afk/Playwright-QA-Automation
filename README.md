# Playwright QA Automation

Professional QA Automation framework built with Playwright and JavaScript, covering UI, API, database, integration, network failure, and end-to-end testing.

## Tech Stack

- Playwright
- JavaScript
- Node.js
- MySQL
- Git & GitHub
- GitHub Actions
- GitHub Copilot

## Test Coverage

### UI Automation
- Login validation
- Invalid login validation
- Product sorting
- Product details
- Add to cart
- Checkout
- Page Object Model (POM)
- Fixtures
- Authentication with storage state
- Multiple browser contexts
- Multiple windows
- iFrames
- File upload

### API Automation
- GET requests
- POST requests
- PUT requests
- Authentication
- Headers validation
- Response validation
- API CRUD operations
- API chaining
- API mocking
- Network failure testing
- API integration testing

### Database Automation
- MySQL database validation
- SQL queries
- Data verification using Playwright + mysql2
- UI → API → Database validation

### End-to-End Testing

The primary E2E workflow validates:

UI → API → Database → UI

Example:

1. Create a student through the UI
2. Log in through the UI
3. Update student information through the API
4. Verify the API response
5. Verify the database record
6. Verify the updated information in the UI
7. Clean up test data

## Project Structure

```text
Playwright-Automation/
│
├── db/
│   └── db_connection.js
│
├── fixtures/
│   └── test_fixtures.js
│
├── pages/
│   ├── LoginPage.js
│   └── CartCheckoutPage.js
│
├── tests/
│   ├── UI automation
│   ├── API automation
│   ├── Database automation
│   ├── Integration testing
│   ├── Network failure testing
│   └── TalentTek E2E
│
├── auth_setup.js
├── playwright.config.js
├── package.json
└── .gitignore
