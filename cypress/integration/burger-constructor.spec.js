const { SELECTORS, TESTKEY } = require('../support/constants');

describe('burger constructor functional tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', `${Cypress.env('BASE_URL')}/ingredients`, {
      fixture: 'ingredients.json',
    });
    cy.get(`[${TESTKEY.DATA_TEST_ID}="burger-constructor"]`).as('constructor');
    cy.get(`[${TESTKEY.DATA_TEST_ID}="burger-ingredient"]`).as('ingredient');
    cy.get(`[${TESTKEY.DATA_TEST_ID}="total-wrapper"]`).as('totalWrapper');
  });

  it('has burger ingredients container', () => {
    cy.get(`[${TESTKEY.DATA_TEST_ID}="burger-ingredients"]`).should('have.length', 1);
  });

  it('has burger ingredients', () => {
    cy.get(SELECTORS.INGREDIENT).should('have.length.above', 0);
  });

  it('has burger constructor', () => {
    cy.get(SELECTORS.CONSTRUCTOR).should('have.length', 1);
  });

  it('can drag and drop a bun', () => {
    cy.get(SELECTORS.INGREDIENT).eq(0).as('first');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      0
    );
    cy.get(SELECTORS.FIRST).trigger('dragstart');
    cy.get(SELECTORS.CONSTRUCTOR).trigger('drop');
    cy.get(SELECTORS.FIRST).find('p').should('have.text', 2);
    cy.get(SELECTORS.TOTALWRAPPER).should('contain.text', '2510');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      2
    );
  });

  it('can drag and drop another bun', () => {
    cy.get(SELECTORS.INGREDIENT).eq(0).as('first');
    cy.get(SELECTORS.INGREDIENT).eq(1).as('second');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      0
    );
    cy.get(SELECTORS.FIRST).trigger('dragstart');
    cy.get(SELECTORS.CONSTRUCTOR).trigger('drop');
    cy.get(SELECTORS.FIRST).find('p').should('have.text', 2);
    cy.get(SELECTORS.TOTALWRAPPER).should('contain.text', '2510');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      2
    );
    cy.get(SELECTORS.SECOND).trigger('dragstart');
    cy.get(SELECTORS.CONSTRUCTOR).trigger('drop');
    cy.get(SELECTORS.FIRST).find('p').should('not.exist');
    cy.get(SELECTORS.SECOND).find('p').should('have.text', 2);
    cy.get(SELECTORS.TOTALWRAPPER).should('contain.text', '1976');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      2
    );
  });

  it('can add more ingredients', () => {
    cy.get(SELECTORS.INGREDIENT).eq(0).as('first');
    cy.get(SELECTORS.INGREDIENT).eq(2).as('third');
    cy.get(SELECTORS.INGREDIENT).eq(8).as('ninth');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      0
    );
    cy.get(SELECTORS.FIRST).trigger('dragstart');
    cy.get(SELECTORS.CONSTRUCTOR).trigger('drop');
    cy.get(SELECTORS.FIRST).find('p').should('have.text', 2);
    cy.get(SELECTORS.TOTALWRAPPER).should('contain.text', '2510');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      2
    );
    cy.get(SELECTORS.THIRD).trigger('dragstart');
    cy.get(SELECTORS.CONSTRUCTOR).trigger('drop');
    cy.get(SELECTORS.THIRD).find('p').should('have.text', 1);
    cy.get(SELECTORS.TOTALWRAPPER).should('contain.text', '2600');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      3
    );
    cy.get(SELECTORS.NINTH).trigger('dragstart');
    cy.get(SELECTORS.CONSTRUCTOR).trigger('drop');
    cy.get(SELECTORS.NINTH).find('p').should('have.text', 1);
    cy.get(SELECTORS.TOTALWRAPPER).should('contain.text', '5600');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      4
    );
  });

  it('can remove ingredients', () => {
    cy.get(SELECTORS.INGREDIENT).eq(0).as('first');
    cy.get(SELECTORS.INGREDIENT).eq(2).as('third');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      0
    );
    cy.get(SELECTORS.FIRST).trigger('dragstart');
    cy.get(SELECTORS.CONSTRUCTOR).trigger('drop');
    cy.get(SELECTORS.FIRST).find('p').should('have.text', 2);
    cy.get(SELECTORS.TOTALWRAPPER).should('contain.text', '2510');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      2
    );
    cy.get(SELECTORS.THIRD).trigger('dragstart');
    cy.get(SELECTORS.CONSTRUCTOR).trigger('drop');
    cy.get(SELECTORS.THIRD).find('p').should('have.text', 1);
    cy.get(SELECTORS.TOTALWRAPPER).should('contain.text', '2600');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      3
    );
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT)
      .eq(1)
      .find('.constructor-element__action')
      .click();
    cy.get(SELECTORS.TOTALWRAPPER).should('contain.text', '2510');
    cy.get(SELECTORS.BURGER_CONSTRUCTOR_INGREDIENT).should(
      'have.length',
      2
    );
  });

  it('can reorder ingredients in the constructor', () => {
    cy.get(SELECTORS.INGREDIENT).eq(0).as('first');
    cy.get(SELECTORS.INGREDIENT).eq(2).as('third');
    cy.get(SELECTORS.INGREDIENT).eq(8).as('ninth');
    cy.get(SELECTORS.FIRST).trigger('dragstart');
    cy.get(SELECTORS.CONSTRUCTOR).trigger('drop');
    cy.get(SELECTORS.THIRD).trigger('dragstart');
    cy.get(SELECTORS.CONSTRUCTOR).trigger('drop');
    cy.get(SELECTORS.NINTH).trigger('dragstart');
    cy.get(SELECTORS.CONSTRUCTOR).trigger('drop');
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
