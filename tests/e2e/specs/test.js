// https://docs.cypress.io/api/introduction/api.html

describe("E2E Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("div", "TO DO");
  });

  it("Opens new task modal", () => {
    cy.get('#new-task-button').click();
    cy.contains("h5", "Create a task");
  });

  it("Submits task", () => {
    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const testname = `testname${id}`
    cy.get('#name-input').type(testname)
    cy.get('#description-input').type('e2e test')
    cy.get('#submit-button').click();
    cy.contains("div", testname);
  });

  it("Marks task as done", () => {
    cy.get('.todo-item').first().click()
    cy.get('#checkmark').click()
    cy.get('.close').click()
  });

  it("Deletes task from done list", () => {
    cy.get('.done-item').first().click()
    cy.get('#trashbin').click()
  });
});
