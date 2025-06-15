describe('Portfolio Tests', () => {
  const testUser = {
    username: 'testinguser1', //make sure user exists
    password: 'testinguser1' 
  };

  beforeEach(() => {
    cy.visit('/login');

    cy.get('input[name="username"]').type(testUser.username);
    cy.get('input[name="password"]').type(testUser.password);

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/portfolio');
    cy.contains('Your Portfolio', { timeout: 10000 }).should('be.visible');
  });

  it('Adds a coin to portfolio', () => {
    cy.visit('/market');

    cy.get('button').contains('Fetch Market Data').click();

    cy.contains('Loading market data...').should('not.exist');

    cy.get('.card').should('have.length.greaterThan', 0);

    cy.get('.card').first().within(() => {
      cy.get('button').contains('Add to Portfolio').click();
    });

    cy.visit('/portfolio');

    cy.contains('Your Portfolio');
    cy.get('h4').should('exist'); 
  });

  it('Edits a note for a coin', () => {
    cy.visit('/portfolio');

    //coin exists because of previous test
    cy.get('h4').should('exist');

    cy.get('textarea').first().clear().type('Test note from Cypress');

    cy.get('textarea').first().should('have.value', 'Test note from Cypress');
  });

  it('Removes a coin from portfolio', () => {
    cy.visit('/portfolio');

    cy.get('button.btn-danger').contains('Remove').first().click();

    cy.get('h4').should('not.exist'); 
  });
});
