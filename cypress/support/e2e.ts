import { configure } from '@testing-library/cypress';

import './commands';

configure({ testIdAttribute: 'data-test-id' });

Cypress.on('window:before:load', (window: Cypress.AUTWindow & { sp: () => void }) => {
    // eslint-disable-next-line no-param-reassign
    window.sp = cy.stub().as('sp');
});
