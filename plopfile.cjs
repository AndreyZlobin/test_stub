/* removeCode */
/* eslint-disable no-control-regex */
/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');

const PACKAGE_JSON_PATH = './package.json';

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
    './src/pages/WelcomePage/WelcomePage.tsx',
    './plopfile.cjs',
];

const REPLACEMENT_FILES = [
    PACKAGE_JSON_PATH,
    './src/pages/WelcomePage/WelcomePage.tsx',
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

        console.log('#######################################');
        console.log(
            `\nУра! Готово 🎉 Репозиторий ${repositoryName} готов к использованию! ✨👩🏼\n`,
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
                message: '1/7 Описание проекта. К примеру, "Казино админ"',
                validate,
            },
            {
                type: 'input',
                name: 'projectName',
                message: '2/7 Название проекта в гите. У стаба, к примеру, это ui-stub-example',
                validate,
            },
            {
                type: 'input',
                name: 'repositoryName',
                message: '3/7 Название репозитория. К примеру, ui-stub-example',
                validate,
            },
            {
                type: 'input',
                name: 'jiraLink',
                message:
                    '4/7 Ссылка на доску проекта в жире. К примеру, https://jira/projects/SOME',
                validate,
            },
            {
                type: 'input',
                name: 'confluenceLink',
                message: '5/7 Почти закончили... Ссылка на проект в confluence',
                validate,
            }
        ],
        actions: ({ projectName, repositoryName, projectDescription, auth }) => {
            const removeStubCodeActions = createCodeRemoveActions();
            const replaceCodeActions = createCodeReplaceActions();
            const updateRepositoryNameActions = createModifyActions(
                'ui-stub-example',
                repositoryName,
            );
            const updateProjectNameActions = createModifyActions('ui-stub-example', projectName);
            const updateRepositoryDescriptionActions = createModifyActions(
                'Стаб проекта',
                projectDescription,
            );

            console.log('Отлично! Запускаю настройку 🚀');

            return [
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
