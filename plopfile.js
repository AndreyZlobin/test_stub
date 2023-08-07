/* removeCode */
/* eslint-disable no-control-regex */
/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');

const PACKAGE_JSON_PATH = './package.json';

const AUTH_PATHS = [
    './config/default.ts',
    './src/redux/modules/app.ts',
    './src/types/services.ts',
    './src/server/plugins/page-plugin.tsx',
    './src/server/plugins/plugins.ts',
    './src/server/lib/prepare-state.ts',
];

const PATHS_TO_EXAMPLES = [
    './src/examples',
    './src/redux/modules/counter.ts',
    './src/redux/modules/routing.ts',
    './src/redux/services/example.ts',
    './src/pages/secret-page',
    './src/types/api/example-api.ts',
    './cypress/integration/examples',
    './cypress/snapshots',
    './src/server/mocks/example-api',
    './template/README.hbs',
    './CONTRIBUTING.md',
    './CHANGELOG.md',
];

const TRANSFORM_CODE_PATHS = [
    './src/routes.tsx',
    './src/redux/root-reducer.ts',
    './src/server/mocks/mocks.ts',
    './src/pages/welcome-page/welcome-page.tsx',
    './src/types/declarations/client-api-fetcher.d.ts',
    './src/pages/welcome-page/welcome-page.module.css',
    './src/utils/alfa-metrics.ts',
    './plopfile.js',
];

const REPLACEMENT_FILES = [
    PACKAGE_JSON_PATH,
    './config/default.ts',
    './src/pages/welcome-page/welcome-page.tsx',
    './sonar-project.properties',
];

const filePatterns = {
    remove: /\/\*\s?removeCode\s?\*\/([\s\S]*?)\/\*\s?endRemoveCode\s?\*\//gm,
    replace: /\/\*\s?replaceCode([\s\S]*?)\*\/([\s\S]*?)\/\*\s?endReplaceCode\s?\*\//gm,
};

const trasformGenerator =
    (pattern = 'replace') =>
    (file) => ({
        type: 'modify',
        path: file,
        transform: (oldFile) => {
            const match = oldFile.matchAll(filePatterns[pattern]);
            const tokens = Array.from(match);

            let newFileContent = oldFile;

            tokens.forEach(([oldValue, newValue]) => {
                newFileContent = newFileContent.replace(oldValue, newValue);
            });

            return newFileContent;
        },
    });

const removeGenerator =
    (pattern = 'remove') =>
    (file) => ({
        type: 'modify',
        path: file,
        pattern: filePatterns[pattern],
        template: '',
    });

const createCodeRemoveActions = () => {
    const actions = TRANSFORM_CODE_PATHS.map(removeGenerator());

    return actions;
};

const createCodeReplaceActions = () => {
    const actions = TRANSFORM_CODE_PATHS.map(trasformGenerator());

    return actions;
};

const createModifyActions = (pattern, template) => {
    const actions = REPLACEMENT_FILES.map((file) => ({
        type: 'modify',
        path: file,
        pattern: new RegExp(pattern, 'g'),
        template,
    }));

    return actions;
};

const addAuth = (auth) => {
    if (!auth) return AUTH_PATHS.map(removeGenerator('replace'));
    console.log('Добавляю adAuthPlugin. ⏳‍');
    execSync('yarn add @alfa-bank/ufr-hapi-ad-auth-plugin');

    return [
        ...AUTH_PATHS.map(trasformGenerator()),
        {
            type: 'add',
            path: './src/server/lib/get-valid-credentials.ts',
            force: true,
            templateFile: 'template/get-valid-credentials.hbs',
        },
        {
            type: 'add',
            path: './src/types/api/ad.ts',
            force: true,
            templateFile: 'template/ad.hbs',
        },
    ];
};
/* endRemoveCode */

module.exports = (plop) => {
    const validateComponentName = (value) => {
        if (!value) return 'Не может быть пустым';
        if (!/^([a-z]+-?)+$/.test(value)) return 'Недопустимое название компонента';

        return true;
    };
    /* removeCode */
    const validate = (value) => {
        if (value) return true;

        return 'Не может быть пустым';
    };

    plop.setActionType('removeStubFiles', () => {
        console.log('Приступаю к очистке файлов стаба 🧞‍');

        PATHS_TO_EXAMPLES.forEach((file) => {
            execSync(`rm -rf ${file}`);
        });
    });

    plop.setActionType('prepareProject', ({ repositoryName, auth }) => {
        console.log('Удаляю лишний код. Это займет пару минут. ⏳');

        execSync('yarn');
        execSync('yarn format');
        execSync('yarn lint:fix');
        execSync('yarn remove date-fns');

        console.log('#######################################');
        console.log(
            `\nУра! Готово 🎉 Репозиторий ${repositoryName} готов к использованию! ✨\n ${
                auth && 'Не забудь добавить авторизационные моки 👩🏼‍💻\n'
            }`,
        );
    });

    plop.setActionType('printInstruction', () => {
        console.log('---------------------------------------\n');
        console.log('Что дальше? 🤔');
        console.log('1. Поменять версию в package.json на 1.0.0');
        console.log('2. Необходимо проиндексировать файлы проекта: git add --all');
        console.log(
            '3. Заменить первый коммит, созданный Альфа-Платформой: git commit --amend -m "feat(*): init project"',
        );
        console.log('4. Запушить изменения в ветку: git push -f origin template');
        console.log('---------------------------------------\n');
    });

    console.log('Привет!👋 Я помогу тебе настроить новый проект. Давай же скорее начнем! 🚀');

    plop.setGenerator('Создание проекта', {
        description: '',
        prompts: [
            {
                type: 'input',
                name: 'projectDescription',
                message: '1/7 Описание проекта. К примеру, "Стаб Единого Фронта"',
                validate,
            },
            {
                type: 'input',
                name: 'projectName',
                message: '2/7 Название проекта в гите. У стаба, к примеру, это ufr-sandbox',
                validate,
            },
            {
                type: 'input',
                name: 'repositoryName',
                message: '3/7 Название репозитория. К примеру, ufr-sandbox-example-ui',
                validate,
            },
            {
                type: 'input',
                name: 'jiraLink',
                message:
                    '4/7 Ссылка на доску проекта в жире. К примеру, https://jira.moscow.alfaintra.net/projects/UFRSBXUI',
                validate,
            },
            {
                type: 'input',
                name: 'confluenceLink',
                message: '5/7 Почти закончили... Ссылка на проект в confluence',
                validate,
            },
            {
                type: 'input',
                name: 'jenkinsLink',
                message: '6/7 Ссылка на jenkins. К примеру, https://dojenkins/ufrsandbox/',
                validate,
            },
            {
                type: 'confirm',
                name: 'auth',
                message: '7/7 И последнее: аутентификация в проекте происходит по ad-api?',
            },
        ],
        actions: ({ projectName, repositoryName, projectDescription, auth }) => {
            const removeStubCodeActions = createCodeRemoveActions();
            const replaceCodeActions = createCodeReplaceActions();
            const updateRepositoryNameActions = createModifyActions(
                'ufr-sandbox-example-ui',
                repositoryName,
            );
            const updateProjectNameActions = createModifyActions('ufr-sandbox', projectName);
            const updateRepositoryDescriptionActions = createModifyActions(
                'Стаб Единого Фронта',
                projectDescription,
            );

            console.log('Отлично! Запускаю настройку 🚀');

            return [
                ...addAuth(auth),
                ...removeStubCodeActions,
                ...replaceCodeActions,
                ...updateRepositoryNameActions,
                ...updateProjectNameActions,
                ...updateRepositoryDescriptionActions,
                {
                    type: 'add',
                    path: './README.md',
                    force: true,
                    templateFile: 'template/README.hbs',
                },
                {
                    type: 'removeStubFiles',
                },
                {
                    type: 'prepareProject',
                },
                {
                    type: 'printInstruction',
                },
            ];
        },
    });
    /* endRemoveCode */
    plop.setGenerator('Создание компонента', {
        description: '',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Имя компонента (например, my-lovely-component)',
                validateComponentName,
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/components/{{name}}/index.ts',
                templateFile: 'template/index.hbs',
            },
            {
                type: 'add',
                path: 'src/components/{{name}}/{{name}}.tsx',
                templateFile: 'template/component.hbs',
            },
            {
                type: 'add',
                path: 'src/components/{{name}}/{{name}}.module.css',
                templateFile: 'template/css.module.hbs',
            },
        ],
    });
};
