let addExampleEntry = () => {
  cy.get("#name").type("Admin User 1");
  cy.get("#email").type("admin1@example.com");
  cy.get("#password").type("Test@123");
  cy.get("#dob").click().type("2000-01-01");
  cy.get("input[type=checkbox]").check();
  cy.get("[type='submit']").click();
};

let validateExampleEntry = () => {
  [
    "Admin User 1",
    "admin1@example.com",
    "Test@123",
    "2000-01-01",
    "true",
  ].forEach((item) => {
    cy.get("table").contains(item).should("exist");
  });
};

describe("", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("STUDENT_SUBMISSION_URL"));
  });

  it("When loaded, the webpage should show these headings at the top of the table - Name, Email, Password, Dob, Accepted terms?", () => {
    ["Name", "Email", "Password", "Dob", "Accepted terms?"].forEach((item) => {
      cy.get("table").contains(item, { matchCase: false }).should("exist");
    });
  });

  it("After the registration form is submitted, it should show an entry in the table immediately", () => {
    addExampleEntry();
    validateExampleEntry();
  });

  it("After the registration form is submitted, it should show the entry added previously, even if the page is refreshed", () => {
    addExampleEntry();
    validateExampleEntry();
    cy.reload();
    validateExampleEntry();
  });

  it("It should be possible to use the registration form multiple times to see many entries in the table", () => {
    addExampleEntry();
    cy.reload();
    cy.get("#name").type("Admin User 2");
    cy.get("#email").type("admin2@example.com");
    cy.get("#password").type("Test@321");
    cy.get("#dob").click().type("1990-02-02");
    cy.get("input[type=checkbox]").check();
    cy.get("[type='submit']").click();

    validateExampleEntry();

    [
      "Admin User 2",
      "admin2@example.com",
      "Test@321",
      "1990-02-02",
      "true",
    ].forEach((item) => {
      cy.get("table").contains(item).should("exist");
    });
  });

  it("The registration form should not accept invalid email addresses", () => {
    cy.get("#name").type("Admin User 4");
    cy.get("#password").type("TestPass");
    cy.get("#dob").click().type("1970-02-02");
    cy.get("input[type=checkbox]").check();
    // Should have correct email validation
    cy.get("#email").type("admin2");
    cy.get("[type='submit']").click();
    cy.get("table").find("tr").contains("admin2").should("not.exist");
    // Should save when the error is resolved
    cy.get("#email").type("@example.com");
    cy.get("[type='submit']").click();
    cy.get("table").find("tr").contains("admin2@example.com").should("exist");
  });

  it("The registration form should only accept users between 18 and 55 years old", () => {
    cy.get("#name").type("Admin User 4");
    cy.get("#password").type("TestPass");
    cy.get("#email").type("admin@example.com");
    cy.get("input[type=checkbox]").check();
    // Should validate min age
    cy.get("#dob").click().type("2007-02-02");
    cy.get("[type='submit']").click();
    cy.get("table").find("tr").contains("Admin User 4").should("not.exist");
    // Should validate max age
    cy.get("#dob").click().type("1960-02-02");
    cy.get("[type='submit']").click();
    cy.get("table").find("tr").contains("Admin User 4").should("not.exist");
    // Should save when the error is resolved
    cy.get("#dob").click().type("1998-02-02");
    cy.get("[type='submit']").click();
    cy.get("table").find("tr").contains("Admin User 4").should("exist");
  });
});
