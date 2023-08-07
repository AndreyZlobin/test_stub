import codeCoverage from '@cypress/code-coverage/task';
import webpackPreprocessor from '@cypress/webpack-preprocessor';

export const addPlugins = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
    const webpackOptions = {
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    loader: 'ts-loader',
                },
            ],
        },
    };

    on('file:preprocessor', webpackPreprocessor({ webpackOptions }));
    codeCoverage(on, config);

    return config;
};
