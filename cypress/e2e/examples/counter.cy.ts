describe('Пример «счетчик»', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Счетчик увеличивается на единицу', () => {
        cy.findByTestId('counter-plus-one').click();
        cy.findByTestId('counter-paragraph').should('contain', 'Counter: 1');
    });
    it('Счетчик уменьшается на единицу', () => {
        cy.findByTestId('counter-minus-one').click();
        cy.findByTestId('counter-paragraph').should('contain', 'Counter: -1');
    });
    it('Счетчик увеличивается на две единицы', () => {
        cy.findByTestId('counter-plus-two').click();
        cy.findByTestId('counter-paragraph').should('contain', 'Counter: 2');
    });
    it('Счетчик уменьшается на две единицы', () => {
        cy.findByTestId('counter-minus-two').click();
        cy.findByTestId('counter-paragraph').should('contain', 'Counter: -2');
    });
});
