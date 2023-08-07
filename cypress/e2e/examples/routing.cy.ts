describe('Секретная страница', () => {
    const path = 'secret';

    it('Отображаются ошибки при вводе неверного адреса', () => {
        cy.visit('/');
        cy.findByTestId('secret-input').type('some-path');
        cy.findByTestId('secret-button').click();
        cy.findByTestId('secret-input').get('span[role="alert"]').should('exist');
    });

    it('Происходит редирект на новую страницу при вводе верного адреса', () => {
        cy.visit('/');
        cy.findByTestId('secret-input').type(path);
        cy.findByTestId('secret-button').click();
        cy.url().should('contain', path);
        cy.findByTestId('secret-go-back-button').should('exist');
    });

    it('Происходит редирект назад на главную страницу', () => {
        cy.visit('/');
        cy.findByTestId('secret-input').type(path);
        cy.findByTestId('secret-button').click();
        cy.findByTestId('secret-go-back-button').click();
        cy.url().should('not.contain', path);
        cy.findByTestId('secret-input').should('exist');
    });

    it('Происходит отправка метрики при заходе на секретную страницу', () => {
        cy.visit('/secret');
        cy.get('@sp').should(
            'be.calledWithMatch',
            'trackStructEvent:mainApp',
            'UFR.02',
            'Enter > Secret page',
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
