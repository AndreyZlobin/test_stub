describe('Пример «запросы»', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('GET-запрос проходит успешно если id пользователя равен 12', () => {
        cy.intercept('GET', '/api/examples/*').as('getRequest');

        cy.findByTestId('request-example-input-get-by-id').clear().type('12');
        cy.findByTestId('request-example-button-fetch-get-by-id').click();
        cy.wait('@getRequest');

        cy.get('@sp').should(
            'be.calledWithMatch',
            'trackStructEvent:mainApp',
            'UFR.03',
            'Click > Main page > Button',
            undefined,
            undefined,
            undefined,
            [
                {
                    schema: 'iglu:com.alfabank/custom_dimension/jsonschema/1-0-0',
                    data: {
                        1: '12',
                        13: 'success',
                    },
                },
            ],
        );
    });

    it('Ошибка при GET-запросе если id пользователя не равен 12', () => {
        const ids = ['13', '9', '-12', '120'];

        cy.intercept('GET', '/api/examples/*').as('getRequest');

        ids.forEach((id) => {
            cy.findByTestId('request-example-input-get-by-id').clear().type(id);
            cy.findByTestId('request-example-button-fetch-get-by-id').click();
            cy.wait('@getRequest');
        });
    });

    it('POST-запрос отдает в ответе id пользователя, введенный в текстовом поле', () => {
        cy.intercept('POST', '/api/examples').as('postRequest');

        cy.findByTestId('request-example-input-create').clear().type('12');
        cy.findByTestId('request-example-button-fetch-create').click();
        cy.wait('@postRequest');
        cy.findByTestId('request-example-response-create').contains(
            new RegExp(/.*?id"\s?:\s?"(12)/),
        );
    });
});
