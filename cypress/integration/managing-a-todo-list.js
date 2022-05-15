describe("The user can manage a todo list", () => {
  beforeEach(() => {
    cy.exec("yarn e2e:clean");
    cy.exec("yarn e2e:seed");
  });

  it("creates a new todo list and allows adding todos", () => {
    cy.visit("/");

    givenALoggedInUser();
    theyCanCreateANewTodoList();
    theyCanAddATodo("Beer");
    theyCanAddATodo("Pizza");
    theyCanAddATodo("Chocolate");
    theyCanCompleteTheTodo("Pizza");
    theyCanUncompleteTheTodo("Pizza");
  });
});

function givenALoggedInUser() {
  cy.findByLabelText("Email address").click().type("john.doe@example.com");
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
  cy.findByText(`${todo} (click to toggle)`).should("be.visible");
}

function theyCanCompleteTheTodo(todo) {
  cy.findByText(/^Things to do/)
    .parent()
    .within(() => {
      cy.findByText(`${todo} (click to toggle)`).click({ force: true });
    });
}

function theyCanUncompleteTheTodo(todo) {
  cy.findByText(/^Things done/)
    .parent()
    .within(() => {
      cy.findByText(`${todo} (click to toggle)`).click({ force: true });
    });
  cy.wait(500);
  cy.findByText(/^Things to do/)
    .parent()
    .within(() => {
      cy.findByText(`${todo} (click to toggle)`).should("exist");
    });
}
