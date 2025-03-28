describe('Portfolio Tests', () => {
    const testUser = {
      username: 'string',
      password: 'string' 
    };
  
    beforeEach(() => {
      cy.visit('/');
      
      cy.get('input[name="username"]').type(testUser.username);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('button[type="submit"]').click();
    
      cy.contains('Crypto Portfolio Tracker', { timeout: 10000 }).should('be.visible');
    });
  
    it('Adds a coin to portfolio', () => {
      cy.get('button').contains('Fetch Market Data').click();
      cy.contains('Loading...', { timeout: 10000 }).should('not.exist');
  
      //load market data
      cy.get('.crypto-item', { timeout: 10000 }).should('have.length.greaterThan', 0);
  
      //add coin
      cy.get('.crypto-item').first().within(() => {
        cy.get('button').contains('Add to Portfolio').click();
      });
  
      //verify coin appears in portfolio
      cy.get('.portfolio-item', { timeout: 5000 }).should('have.length.at.least', 1);
    });
  
  });