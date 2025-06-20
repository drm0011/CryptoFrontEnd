describe('Updated Portfolio Tests', () => {
  const testUser = {
    username: 'testinguser1',
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

  it('Adds a coin to portfolio from market page', () => {
    cy.visit('/market');
    cy.contains('Fetch Market Data').click();
    cy.contains('Loading market data...').should('not.exist');
    cy.get('.card').first().within(() => {
      cy.contains('Add to Portfolio').click();
    });
    cy.visit('/portfolio');
    cy.get('h4').should('exist');
  });

  it('Edits note and mood, and saves', () => {
    cy.visit('/portfolio');
    cy.get('h4').should('exist');

    cy.get('.note-display').first().click();
    cy.get('input.form-control').clear().type('Updated note');
    cy.get('select').select('bearish');
    cy.get('button').contains('Save').click();

    cy.get('.note-display').first().should('contain', 'Updated note');
    cy.get('.note-display').first().should('contain', '🐻');
  });

  it('Persists note and mood after reload', () => {
    cy.visit('/portfolio');
    cy.get('.note-display').first().click();
    cy.get('input.form-control').clear().type('Persistence Test');
    cy.get('select').select('bullish');
    cy.get('button').contains('Save').click();
    cy.reload();

    cy.get('.note-display').first().should(($el) => {
      expect($el.text()).to.include('Persistence Test');
      expect($el.text()).to.include('🐂');
    });
  });

  it('Removes a coin from portfolio', () => {
    cy.visit('/portfolio');
    cy.get('button.btn-danger').first().click();
    cy.get('h4').should('not.exist');
  });

  it('Shows empty state when portfolio is cleared', () => {
    cy.visit('/portfolio');
    cy.get('body').then(($body) => {
      if ($body.find('button.btn-danger').length > 0) {
        cy.get('button.btn-danger').each(($btn) => {
          cy.wrap($btn).click();
        });
      }
    });
    cy.contains('Your portfolio is empty.').should('exist');
  });

  it('Market data loads with different currency', () => {
    cy.visit('/market');
    cy.get('select.form-control').select('eur');
    cy.contains('Fetch Market Data').click();
    cy.contains('Loading market data...').should('not.exist');
    cy.get('.card').should('have.length.greaterThan', 0);
    cy.get('.card').first().should('contain', '€');
  });

  it('Prevents duplicate coin addition (alert shown)', () => {
    cy.visit('/market');
    cy.contains('Fetch Market Data').click();
    cy.get('.card').first().within(() => {
      cy.contains('Add to Portfolio').click();
    });

    cy.on('window:alert', (txt) => {
      expect(txt).to.include('added to your portfolio');
    });

    cy.get('.card').first().within(() => {
      cy.contains('Add to Portfolio').click();
    });
  });

  it('Cancels editing a note and mood without saving', () => {
    cy.visit('/portfolio');
    cy.get('.note-display').first().invoke('text').then((originalText) => {
      cy.get('.note-display').first().click();
      cy.get('input.form-control').clear().type('Temporary change');
      cy.get('select').select('bearish');
  
      // Click outside to cancel (simulate blur/cancel by reload)
      cy.reload();
  
      cy.get('.note-display').first().invoke('text').should((currentText) => {
        expect(currentText).to.eq(originalText); // it should not have changed
      });
    });
  });
  

  it('Applies flash effect after editing note', () => {
    cy.visit('/portfolio');
    cy.get('.note-display').first().click();
    cy.get('input.form-control').clear().type('Flash test');
    cy.get('button').contains('Save').click();
    cy.get('.note-display').first().should('have.class', 'note-flash');
  });

  it('Mood emoji defaults to neutral if not set', () => {
    cy.visit('/portfolio');
    cy.get('.note-display').first().should('contain', '😐');
  });
});
