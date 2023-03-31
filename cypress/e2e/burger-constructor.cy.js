const { SELECTORS } = require('../support/constants');

describe('burger constructor functional tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', `${Cypress.env('BASE_URL')}/ingredients`, {
      fixture: 'ingredients.json',
    });
    cy.get('[data-test-id="burger-constructor"]').as('constructor');
    cy.get('[data-test-id="burger-ingredient"]').as('ingredient');
    cy.get('[data-test-id="total-wrapper"]').as('totalWrapper');
  });

  it('has burger ingredients container', () => {
    cy.get('[data-test-id="burger-ingredients"]').should('have.length', 1);
  });

  it('has burger ingredients', () => {
    cy.get('@ingredient').should('have.length.above', 0);
  });

  it('has burger constructor', () => {
    cy.get('@constructor').should('have.length', 1);
  });

  it('can drag and drop a bun', () => {
    cy.get('@ingredient').eq(0).as('first');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      0
    );
    cy.get('@first').trigger('dragstart');
    cy.get('@constructor').trigger('drop');
    cy.get('@first').find('p').should('have.text', 2);
    cy.get('@totalWrapper').should('contain.text', '2510');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      2
    );
  });

  it('can drag and drop another bun', () => {
    cy.get('@ingredient').eq(0).as('first');
    cy.get('@ingredient').eq(1).as('second');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      0
    );
    cy.get('@first').trigger('dragstart');
    cy.get('@constructor').trigger('drop');
    cy.get('@first').find('p').should('have.text', 2);
    cy.get('@totalWrapper').should('contain.text', '2510');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      2
    );
    cy.get('@second').trigger('dragstart');
    cy.get('@constructor').trigger('drop');
    cy.get('@first').find('p').should('not.exist');
    cy.get('@second').find('p').should('have.text', 2);
    cy.get('@totalWrapper').should('contain.text', '1976');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      2
    );
  });

  it('can add more ingredients', () => {
    cy.get('@ingredient').eq(0).as('first');
    cy.get('@ingredient').eq(2).as('third');
    cy.get('@ingredient').eq(8).as('ninth');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      0
    );
    cy.get('@first').trigger('dragstart');
    cy.get('@constructor').trigger('drop');
    cy.get('@first').find('p').should('have.text', 2);
    cy.get('@totalWrapper').should('contain.text', '2510');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      2
    );
    cy.get('@third').trigger('dragstart');
    cy.get('@constructor').trigger('drop');
    cy.get('@third').find('p').should('have.text', 1);
    cy.get('@totalWrapper').should('contain.text', '2600');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      3
    );
    cy.get('@ninth').trigger('dragstart');
    cy.get('@constructor').trigger('drop');
    cy.get('@ninth').find('p').should('have.text', 1);
    cy.get('@totalWrapper').should('contain.text', '5600');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      4
    );
  });

  it('can remove ingredients', () => {
    cy.get('@ingredient').eq(0).as('first');
    cy.get('@ingredient').eq(2).as('third');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      0
    );
    cy.get('@first').trigger('dragstart');
    cy.get('@constructor').trigger('drop');
    cy.get('@first').find('p').should('have.text', 2);
    cy.get('@totalWrapper').should('contain.text', '2510');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      2
    );
    cy.get('@third').trigger('dragstart');
    cy.get('@constructor').trigger('drop');
    cy.get('@third').find('p').should('have.text', 1);
    cy.get('@totalWrapper').should('contain.text', '2600');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      3
    );
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT)
      .eq(1)
      .find('.constructor-element__action')
      .click();
    cy.get('@totalWrapper').should('contain.text', '2510');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      2
    );
  });

  it('can reorder ingredients in the constructor', () => {
    cy.get('@ingredient').eq(0).as('first');
    cy.get('@ingredient').eq(2).as('third');
    cy.get('@ingredient').eq(8).as('ninth');
    cy.get('@first').trigger('dragstart');
    cy.get('@constructor').trigger('drop');
    cy.get('@third').trigger('dragstart');
    cy.get('@constructor').trigger('drop');
    cy.get('@ninth').trigger('dragstart');
    cy.get('@constructor').trigger('drop');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      4
    );
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT)
      .eq(1)
      .should('contain.text', 'Spicy');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT)
      .eq(2)
      .should('contain.text', 'Говяжий');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT)
      .eq(1)
      .find('div[draggable]')
      .trigger('dragstart');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT)
      .eq(2)
      .trigger('drop', { force: true });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200).should(() => {
      const $ingredients = Cypress.$(
        SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT
      );
      cy.wrap($ingredients).eq(1).should('contain.text', 'Говяжий');
      cy.wrap($ingredients).eq(2).should('contain.text', 'Spicy');
    });
  });
});
