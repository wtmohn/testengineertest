/// <reference types="cypress" />
import {faker} from '@faker-js/faker';

describe("Validate workflows on user's own profile", () => {
  let registerBody, profileSettings,userID;

  beforeEach(() => {
    cy.task("db:seed");
    cy.intercept("POST", "/api/auth/register").as("signup");
    cy.intercept("POST", "/api/auth/login").as("login");

    cy.fixture("newUser.json").then((data) => {
      registerBody = data;
      cy.request("POST", `${Cypress.env("apiUrl")}/api/auth/register`, {
        name: registerBody.name,
        username: registerBody.username,
        email: registerBody.email,
        password: registerBody.password,
        avatar: registerBody.avatar,
      }).its('body').then(({user}) => {
        userID = user._id
      });
    });

    cy.fixture("newProfile.json").then((data) => {
      profileSettings = data;
    });
    cy.visit("/");
    cy.loginByUI("newUser.json", false);
    cy.wait("@login");
  });


  it("should allow a user to access their profile and edit it", () => {
    cy.get("[data-cy=auth-nav-dropdown-button]").as("acctDropdown");
    cy.get("[data-cy=auth-nav-name]").invoke("text").as("name");
    cy.get("[data-cy=auth-nav-username]").invoke("text").as("username");
    cy.get("[data-cy=auth-nav-profile]").as("profile");
    cy.get("[data-cy=auth-nav-settings]").as("settings");

      cy.get("@acctDropdown").click();
    cy.get("@name").should("equal", registerBody.name);
    cy.get("@username").should("equal", "@" + registerBody.username);
    cy.get("@profile").click();
    cy.location("pathname").should("contain", "/profile");

    cy.contains('[href*="/edit-profile"]', "Edit Profile").click();

    cy.get("[data-cy=edit-profile-avatar-url]").as("avatar");
    cy.get("[data-cy=edit-profile-background-url]").as("background");
    cy.get("[data-cy=profile-bio]").as("bio");
    cy.get("[data-cy=edit-profile-website]").as("website");
    cy.get("[data-cy=edit-profile-location]").as("location");

    cy.get("@avatar").invoke("val").should("equal", registerBody.avatar);
    cy.get("@background").invoke("val").should("be.empty");
    cy.get("@bio").invoke("val").should("be.empty");
    cy.get("@website").invoke("val").should("be.empty");
    cy.get("@location").invoke("val").should("be.empty");
    // click update without making changes
    cy.contains("button", "Update Profile").click();
    cy.get("[data-cy=profile-update-success").should("not.exist");

    //test url validation
    cy.get("@avatar").clear();
    cy.get("@avatar").type("htttps://fake");
    cy.contains("button", "Update Profile").click();
    cy.get("[data-cy=profile-update-error").should("exist");

    cy.get("@avatar").clear();
    cy.get("@avatar").type(profileSettings.avatar);
    cy.get("@website").type(profileSettings.website);
    cy.get("@bio").type(profileSettings.bio);
    cy.get("@location").type(profileSettings.location);
    cy.contains("button", "Update Profile").click();
    cy.get("[data-cy=profile-update-success").should("exist");
    cy.get("[data-cy=edit-profile-back-btn]").click();
    cy.get("[data-cy=profile-location]")
      .invoke("text")
      .should("equal", " " + profileSettings.location);
    cy.get("[data-cy=profile-bio]")
      .invoke("text")
      .should("equal", profileSettings.bio);
    cy.get("[data-cy=profile-website]")
      .invoke("text")
      .should("equal", " " + profileSettings.website);
  });

  it("should allow a user to post tweet and validate replies and likes on it.", () => {

    //demonstate stubbing 

    cy.contains('button','Tweet').click();
    cy.get('[data-cy=submit-tweet]').should('be.disabled')
    cy.get('[data-cy=create-tweet-overlay]').within(() => {
      cy.get('textarea')
        .type('Test Tweet 123!!')
        .should('have.value','Test Tweet 123!!')
    })
    cy.get('[data-cy=submit-tweet]').click();
    cy.get('[data-cy=create-tweet-overlay]').should('not.exist')

    cy.intercept("GET","/api/tweets/*",
    {
      "tweet": {
        "repliesCount": 0,
        "edited": false,
        "likes": ["6081aacc7ece982d7c0b9411",
                  "6081aacc7ece982d7c0b9412"],
        "retweets": [],
        "_id": "64ee05e381398818eae1f437",
        "text": "Test Tweet 123!!",
        "author": {
          "_id": "64ee05e181398818eae1f429",
          "name": "John Doe",
          "username": "johndoe",
          "avatar": "https://en.wikipedia.org/wiki/Hippopotamus#/media/File:Portrait_Hippopotamus_in_the_water.jpg"
        },
        "createdAt": "2023-08-29T14:51:15.268Z",
        "updatedAt": "2023-08-29T14:56:13.510Z",
        "__v": 2
      }
    }).as("viewTweet");
  cy.visit('/profile/'+userID);
  cy.get('[data-cy=tweet-text]').click();
  cy.wait('@viewTweet')
  cy.get('[data-cy=like-count').invoke('text').should('equal', '2')
})
  });