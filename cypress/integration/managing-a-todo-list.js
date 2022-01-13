describe("The user can manage a todo list", () => {
  beforeEach(() => {
    cy.exec("yarn e2e:clean && yarn e2e:prepare");
  });

  it("creates a new todo list and navigates to its page", () => {
    cy.visit("/");

    givenALoggedInUser();
    theyCanCreateANewTodoList();
    theyCanAddATodo("Beer");
    theyCanAddATodo("Pizza");
    theyCanAddATodo("Chocolate");
    theyCanCompleteTheTodo(/Pizza/);
    theyCanUncompleteTheTodo(/Pizza/);
  });
});

function givenALoggedInUser() {
  cy.findByLabelText("Email address").click().type("chan");
  cy.findByLabelText("Password").click().type("azerty");
  cy.findByRole("button", { name: "Login" }).click();
}

function theyCanCreateANewTodoList() {
  cy.findByLabelText("Add a new todo list").click().type("Things to buy");
  cy.findByRole("button", { name: "Done" }).click();
}

function theyCanAddATodo(todo) {
  cy.intercept("GET", "/l/**").as("todosLoaded");
  cy.findByLabelText("What needs to be done?").click().type(todo);
  cy.findByRole("button", { name: "Done" }).click();
  cy.wait("@todosLoaded");
}

function theyCanCompleteTheTodo(todo) {
  cy.findByText(/^Things to do/)
    .parent()
    .within(() => {
      cy.findByText(todo).click();
    });
}

function theyCanUncompleteTheTodo(todo) {
  cy.findByText(/^Things done/)
    .parent()
    .within(() => {
      cy.findByText(todo).click();
    });
  cy.wait(100);
  cy.findByText(/^Things to do/)
    .parent()
    .within(() => {
      cy.findByText(todo).should("exist");
    });
}
