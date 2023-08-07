describe('Главная страница', () => {
    it('Страница отрисована реактом', () => {
        cy.visit('/');
        cy.get('#react-app').should('not.be.empty');
        cy.get('@sp').should(
            'be.calledWithMatch',
            'trackStructEvent:mainApp',
            'UFR.01',
            'Enter > Main page',
            undefined,
            undefined,
            undefined,
            [
                {
                    schema: 'iglu:com.alfabank/custom_dimension/jsonschema/1-0-0',
                    data: {
                        13: 'success',
                    },
                },
            ],
        );
    });
});
