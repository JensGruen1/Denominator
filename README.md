# Bank Account Denomination Calculator

A web application for calculating and comparing banknote and coin denominations of monetary amounts. The app allows calculations either **on the frontend** using Angular or **on the backend** using Spring Boot.

---

## Features

- Calculate banknote and coin denominations for a given amount.
- Compare current and previous amounts to see the difference in denominations.
- Supports frontend (Angular) and backend (Spring Boot) calculation modes. You can choose between the two.
- Handles invalid inputs and displays meaningful error messages.
- CORS enabled for Angular frontend integration.

---

## Technologies

**Frontend:**
- Angular 19+
- TypeScript
- Angular Standalone Components

**Backend:**
- Java 21
- Spring Boot 3
- Spring Security (CORS enabled)

**Testing:**
- Frontend: Jasmine/Karma
- Backend: JUnit 5, Mockito

**Editors:**
- Frontend: Visual Studio Code
- Backend: IntelliJ Community Edition

---

## API Endpoints

### Calculate Denomination
GET /api/calculateDenomination/{amount}

**Parameters:**
- `amount` (string/number): Monetary amount to calculate denominations for.

**Responses:**
- `200 OK` → Returns a JSON object with `amount` and `denomination` map.
- `400 Bad Request` → Invalid or non-numeric amount.

### Compare Denominations
POST /api/calculateComparison

## Further Features

1. Complete backend testing (unit and integration tests) and partial frontend testing.
2. Using `EventEmitter` to pass the selected programming language from the navbar to the component where the calculations take place.
3. Error handling in backend and frontend.
4. Input control of the amount (only inputs like `0.00` are allowed). Other invalid values are ignored.
5. Denomination and comparison tables are only shown if a calculation exists. No empty tables displayed.
6. Angular takes endpoints from Spring Boot via `@RestController` with CORS configuration.
7. Possible error messages are cleared automatically after a few seconds.

---

## Upcoming Features

1. Change currency or input values; allow selection of different currencies like USD or similar.
2. Info tab with descriptions and explanations.
3. Complete frontend testing.  
