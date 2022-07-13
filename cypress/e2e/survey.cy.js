let addExampleEntry = () => {
  cy.get("#name").type("Admin User 1");
  cy.get("#email").type("admin1@example.com");
  cy.get("#password").type("Test@123");
  cy.get("#dob").click().type("2000-01-01");
  cy.get("input[type=checkbox]").check();
  cy.get("button[type=submit]").click();
};

let validateExampleEntry = () => {
  [
    "Admin User 1",
    "admin1@example.com",
    "Test@123",
    "2000-01-01",
    "true",
  ].forEach((item) => {
    cy.get("table").contains(item);
  });
};

describe("survey form", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("STUDENT_SUBMISSION_URL"));
  });

  it("displays the headings for the entries table", () => {
    ["Email", "Password", "Dob", "Accepted terms?"].forEach((item) => {
      cy.get("table").contains(item);
    });
  });

  it("displays the entries in the right order", () => {
    addExampleEntry();
    validateExampleEntry();
  });

  it("can persist data on refresh", () => {
    addExampleEntry();
    validateExampleEntry();
    cy.reload();
    validateExampleEntry();
  });

  it("can handle more than one entry", () => {
    addExampleEntry();

    cy.get("#name").type("Admin User 2");
    cy.get("#email").type("admin2@example.com");
    cy.get("#password").type("Test@321");
    cy.get("#dob").click().type("1990-02-02");
    cy.get("input[type=checkbox]").check();
    cy.get("button[type=submit]").click();

    validateExampleEntry();

    [
      "Admin User 2",
      "admin2@example.com",
      "Test@321",
      "1990-02-02",
      "true",
    ].forEach((item) => {
      cy.get("table").contains(item);
    });
  });
});
