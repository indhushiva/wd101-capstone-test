let baseActions = () => {
  cy.get("#name").type("Admin User 1");
  cy.get("#email").type("admin1@example.com");
  cy.get("#password").type("Test@123");
  cy.get("#dob").click().type("2000-01-01");
  cy.contains("Accept Terms & Conditions")
    .parent()
    .find("input[type=checkbox]")
    .check();

  cy.contains("Submit").click();
};

let validateBaseActionResults = () => {
  cy.get("tbody > :nth-child(2) > :nth-child(1)").should(
    "have.text",
    "Admin User 1"
  );
  cy.get("tbody > :nth-child(2) > :nth-child(2)").should(
    "have.text",
    "admin1@example.com"
  );
  cy.get("tbody > :nth-child(2) > :nth-child(3)").should(
    "have.text",
    "Test@123"
  );
  cy.get("tbody > :nth-child(2) > :nth-child(4)").should(
    "have.text",
    "2000-01-01"
  );
  cy.get("tbody > :nth-child(2) > :nth-child(5)").should("have.text", "true");
};

describe("survey form", () => {
  beforeEach(() => {
    console.log(Cypress.env("STUDENT_SUBMISSION_URL"));
    cy.visit(Cypress.env("STUDENT_SUBMISSION_URL"));
  });

  it("displays the entries table in right order", () => {
    cy.get("tbody > :nth-child(1) > :nth-child(1)").should("have.text", "Name");
    cy.get("tbody > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "Email"
    );
    cy.get("tbody > :nth-child(1) > :nth-child(3)").should(
      "have.text",
      "Password"
    );
    cy.get("tbody > :nth-child(1) > :nth-child(4)").should("have.text", "Dob");
    cy.get("tbody > :nth-child(1) > :nth-child(5)").should(
      "have.text",
      "Accepted terms?"
    );
  });

  it("displays the entries in the right order", () => {
    baseActions();
    validateBaseActionResults();
  });

  it("can persist data on refresh", () => {
    baseActions();
    validateBaseActionResults();
    cy.reload();
    validateBaseActionResults();
  });

  it("can handle more than one entry", () => {
    baseActions();
    cy.reload();
    cy.get("#name").type("Admin User 1");
    cy.get("#email").type("admin2@example.com");
    cy.get("#password").type("Test@321");
    cy.get("#dob").click().type("1990-02-02");
    cy.contains("Accept Terms & Conditions")
      .parent()
      .find("input[type=checkbox]")
      .check();

    cy.contains("Submit").click();

    validateBaseActionResults();

    cy.get("tbody > :nth-child(3) > :nth-child(1)").should(
      "have.text",
      "Admin User 1"
    );
    cy.get("tbody > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "admin2@example.com"
    );
    cy.get("tbody > :nth-child(3) > :nth-child(3)").should(
      "have.text",
      "Test@321"
    );
    cy.get("tbody > :nth-child(3) > :nth-child(4)").should(
      "have.text",
      "1990-02-02"
    );
    cy.get("tbody > :nth-child(3) > :nth-child(5)").should("have.text", "true");
  });
});
