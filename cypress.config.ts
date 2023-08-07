// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress';

import { addPlugins } from './cypress/plugins';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    video: false,
    fixturesFolder: 'cypress/fixtures',
    pageLoadTimeout: 60000,
    retries: {
        runMode: 2,
    },
    env: {
        codeCoverage: {
            url: 'http://localhost:3000/__coverage__',
        },
    },
    e2e: {
        setupNodeEvents(on, config) {
            addPlugins(on, config);
        },
        // baseUrl: 'http://localhost:3000',
    },
});
