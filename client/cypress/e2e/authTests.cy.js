/// <reference types="cypress" />
describe('Validate sign up and sign in worksflows', () => {

// used to showcase common command reusability and fixture use

    beforeEach(() => {
        cy.task('db:seed');
        cy.intercept('POST', '/api/auth/register').as('signup');
        cy.intercept('POST', '/api/auth/login').as('login');
      });


      it('should not allow sign-up without valid email address', () => {
        cy.visit('/');
        cy.signUp('userInvalidEmail.json');
        cy.get('[type="email"]').then(($error) => {
          expect($error[0].validationMessage).contain('email')
        })
      });

      it('should not allow sign-up using a password less than 8 chars', () => {
        cy.visit('/');
        cy.signUp('userInvalidPassword.json');
        cy.contains('password must be at least 8 characters');
      });

      it('should not allow sign-up with mismatched passwords', () => {
        cy.visit('/');
        cy.signUp('userPasswordMismatch.json');
        cy.contains('password must match');
      });

      it('should not allow sign-up with existing username', () => {
        cy.visit('/');
        cy.signUp('existingUsername.json');
        cy.contains('Username already taken');
      });

      it('should not allow sign-up with existing email', () => {
        cy.visit('/');
        cy.signUp('existingUserEmail.json');
        cy.contains('Email already taken');
      });

      it('should allow creation of a new user and be able to sign in/out ', () => {
        cy.visit('/');
        cy.signUp('newUser.json');
        cy.wait('@signup');
        cy.location('pathname').should('equal', '/');
        cy.logout();
        cy.loginByUI('newUser.json',false);
        cy.wait('@login');
        cy.location('pathname').should('equal', '/');
        cy.logout();
        cy.loginByUI('newUser.json',true);
        cy.wait('@login');
        cy.location('pathname').should('equal', '/');
      });


      it('should have a link to sign up from sign in page',() => {
        cy.visit('/signin');
        cy.contains('Sign up now');
        cy.get('p').within(() => {
          cy.get('[href*="signup"]').click()
        })
        cy.location('pathname').should('equal', '/signup');
        });

      it('should not allow  sign in without password',() => {
        cy.visit('/');
        cy.loginByUI('existingUserNoPassword.json',false);
        cy.contains('password is required');
      });

      it('should not allow  sign in with incorrect password',() => {
        cy.visit('/');
        cy.loginByUI('existingUserIncorrectPassword.json',false);
        cy.contains('Invalid login credentials');
      });

      it('should not allow  sign without a username',() => {
        cy.visit('/');
        cy.loginByUI('existingUserNoUsernameEmail.json',false);
        cy.contains('username is required');
      });

      it('should not allow  sign without an email',() => {
        cy.visit('/');
        cy.loginByUI('existingUserNoUsernameEmail.json',true);
        cy.contains('username is required');
      });

    });