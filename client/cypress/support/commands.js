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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add(
  'loginByApi',
  (username, password = Cypress.env('defaultPassword')) => {
     return cy.request('POST', `${Cypress.env('apiUrl')}/api/auth/login`, {
      username,
      password,
    })
  }
);


//login step defintiion
Cypress.Commands.add(
  "signUp",
  (file) => {
    cy.fixture(file).then(data =>{
      const name = data.name;
      const username = data.username; 
      const email = data.email;
      const password = data.password;
      const password2 = data.password2;
   

    cy.get('[data-cy=nav-signup-link]').click();

    cy.get('[data-cy=signup-title]')
      .should('be.visible')
      .and('contain', 'Sign Up');

    cy.get('[data-cy=signup-name-input]')
      .type(name)
      .should('have.value',name);

    cy.get('[data-cy=signup-username-input]')
      .type(username)
      .should('have.value', username);

    cy.get('[data-cy=signup-email-input]')
      .type(email)
      .should('have.value', email);

    cy.get('[data-cy=signup-password-input]')
      .type(password)
      .should('have.value', password);

    cy.get('[data-cy=signup-password2-input]')
      .type(password2)
      .should('have.value', password2);

    cy.get('[data-cy=signup-submit]').click();
    });
  });



  Cypress.Commands.add(
    "loginByUI",
    (file,useEmail) => {
      cy.fixture(file).then(data =>{

        const signInName  = useEmail ?  data.email : data.username;
        const password = data.password;

        cy.get('[data-cy=nav-signin-link]').click();
        if(signInName !== ""){
        cy.get('[data-cy=signin-username-input]')
          .type(signInName)
          .should('have.value', signInName);
        }
        if(password !== ""){
        cy.get('[data-cy=signin-password-input]')
          .type(password)
          .should('have.value', password);
        }

        cy.get('[data-cy=signin-button]').click();
      });
    });


    Cypress.Commands.add(
      "logout",
      () => {
        cy.get('[data-cy=auth-nav-dropdown-button]').click();
        cy.get('[data-cy=auth-nav-logout-button]').click();
        cy.get('[data-cy=nav-signin-link]').should('exist');
      });