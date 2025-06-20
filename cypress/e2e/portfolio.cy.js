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

    cy.get('.portfolio-item').first().within(() => {
      cy.get('.note-display').click();                        
      cy.get('[data-cy="note-input"]').clear().type('Updated note');
      cy.get('[data-cy="mood-select"]').select('bearish');         
      cy.contains('Save').click();                                  
      cy.get('.note-display').should('contain', 'Updated note');
      cy.get('.note-display').should('contain', '🐻');
    });
  });


  it('Persists note and mood after reload', () => {
  cy.visit('/portfolio');

  cy.get('.portfolio-item').first().within(() => {
    cy.get('.note-display').click();
    cy.get('[data-cy="note-input"]').clear().type('Persistence Test');
    cy.get('[data-cy="mood-select"]').select('bullish');
    cy.contains('Save').click();
  });

  cy.reload();

  cy.get('.portfolio-item').first().within(() => {
    cy.get('.note-display').should('contain', 'Persistence Test');
    cy.get('.note-display').should('contain', '🐂');
  });
});

  it('Removes a coin from portfolio', () => {
    cy.visit('/portfolio');

    cy.get('.portfolio-item').then(($itemsBefore) => {
      const beforeCount = $itemsBefore.length;

      cy.get('.portfolio-item').first().within(() => {
        cy.get('button.btn-danger').click();
      });

      cy.get('.portfolio-item', { timeout: 4000 }).should('have.length', beforeCount - 1);
    });
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

  it('Prevents duplicate coin addition (toast shown)', () => {
    cy.visit('/market');
    cy.contains('Fetch Market Data').click();
    cy.contains('Loading market data...').should('not.exist');

    //first add
    cy.get('.card').first().within(() => {
      cy.contains('Add to Portfolio').click();
    });

    cy.get('.Toastify__toast')
      .should('contain', 'added to your portfolio!');

    //duplicate add
    cy.get('.card').first().within(() => {
      cy.contains('Add to Portfolio').click();
    });

    cy.get('.Toastify__toast')
      .should('contain', 'Failed to add to portfolio');
  });

  it('Prevents duplicate coin addition via coindetail page (toast shown)', () => {
    cy.visit('/market');
    cy.contains('Fetch Market Data').click();
    cy.contains('Loading market data...').should('not.exist');

    cy.get('.card').first().within(() => {
      cy.get('a').first().click();
    });

    //duplicate add
    cy.contains('Add to Portfolio').click();
    cy.get('.Toastify__toast--error')
      .should('contain', 'Failed to add coin to your portfolio');
  });

  it('Cancels editing a note and mood without saving', () => {
  cy.visit('/portfolio');

  const initialNote = 'Initial note test';

  cy.get('.portfolio-item').first().within(() => {
    cy.get('.note-display').click();
    cy.get('[data-cy="note-input"]').clear().type(initialNote);
    cy.get('[data-cy="mood-select"]').select('neutral');
    cy.contains('Save').click();
    cy.get('.note-display').should('contain', initialNote);
    cy.get('.note-display').should('contain', '😐');
  });

  //edit but dont save
  cy.get('.portfolio-item').first().within(() => {
    cy.get('.note-display').click();
    cy.get('[data-cy="note-input"]').clear().type('Temporary change');
    cy.get('[data-cy="mood-select"]').select('bearish');
  });

  cy.reload();
  cy.contains('Your Portfolio').should('be.visible');

  cy.get('.portfolio-item').first().within(() => {
    cy.get('.note-display').should('contain', initialNote);
    cy.get('.note-display').should('contain', '😐'); 
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
