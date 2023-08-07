import { add, format } from 'date-fns';

describe('Пример «Игра с датами»', () => {
    it('Игра не Dark Souls, но выиграть так же не получится', () => {
        cy.visit('/');

        const periods = [
            { days: 30 },
            { days: -30 },
            { months: 2, years: 2 },
            { days: 30, months: 2, years: 1 },
            {},
        ];

        periods.forEach((period) => {
            const inputSelector = '[data-test-id="dates-game-input"] input';

            cy.get(inputSelector).trigger('click');
            cy.get(inputSelector).type(format(add(new Date(), period), 'dd.MM.yyyy'));
            cy.findByTestId('dates-game-input').find('span[role="alert"]').not('empty');
        });
    });
});
