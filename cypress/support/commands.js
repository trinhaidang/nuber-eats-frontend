// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";


Cypress.Commands.add("assertLoggedIn", () => {
    cy.window().its("localStorage.nuber-token").should("be.a", "string");
});

Cypress.Commands.add("assertLoggedOut", () => {
    cy.window().its("localStorage.nuber-token").should("be.undefined");
});

Cypress.Commands.add("login", (email, password) => {
    cy.assertLoggedOut();
    cy.visit("/")
        .get('[name="email"]').type(email)
        .get('[name="password"]').type(password)
        .get(".text-lg").should("not.have.class", "pointer-events-none")
        .click();
    cy.wait(1000);
    cy.title().should("eq", "Home | Nuber Eats");
    cy.assertLoggedIn();
})