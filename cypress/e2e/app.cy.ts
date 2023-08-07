describe('Главная страница', () => {
    it('Страница отрисована реактом', () => {
        cy.visit('/');
        cy.get('#react-app').should('not.be.empty');
    });
});
