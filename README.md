# в
в

**Ссылка на доску**: <в>
**Ссылка на документацию**: <в>
**Ссылка на CI**: <>

## Начало разработки:
При первом запуске проекта на локальной машине необходимо проверить совместимость версии Node.js:
```sh
nvm use
```
Дальше устанавливаем зависимости и запускаем проект:
```sh
yarn
yarn start
```

## Сборка в production режиме:
```sh
yarn build
yarn build:istanbul // Сборка для e2e-coverage
yarn build:run // Запуск собранного билда
```

### Доступность на средах:
Ссылка на проект в versions-ui: <https://ufrtest/ufr-sandbox-versions-ui/в>

### Генерация docker-контейнера:
Чтобы сгенерировать docker-контейнер, достаточно выполнить команду:
```sh
yarn docker-build
```
Список доступных контейнеров можно найти по ссылке: <https://eco.binary.alfabank.ru/v2/в/tags/list>

## Проверка кода:
В проекте настроены прекоммитные проверки, проверяющие качество кода с помощью `eslint`, `stylelint` и `jest`. Помимо качества кода, проверяется и коммит-месседж на соответствие [стандартам направления](https://git.moscow.alfaintra.net/projects/DAE/repos/js-standarts/browse/standarts/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%20%D1%81%20git/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%20%D1%81%20git%20-%20%D0%95%D0%A4.md).

### Команды проверки качества кода:

#### Запуск линтеров:
```sh
yarn lint
yarn lint:fix // autofix
```

#### Запуск юнит-тестов:
```sh
yarn test
open coverage/html-jest/index.html // Посмотреть coverage
```

#### Запуск проверки размера бандлов:
```sh
yarn size
```
После сборки будет запущен скрипт <code>yarn size</code> для проверки лимитов размера бандлов. Так можно контролировать размер сборки или отдельных файлов. При привышении заданных лимитов билд будет падать с соответствующим сообщением.
Настройки и лимиты прописываются в .size-limits.json.

### Использование политики безопасности контента (CSP)
#### Директивы:

- default-src
- script-src
- object-src
- style-src
- img-src
- media-src
- frame-src
- font-src
- connect-src

В default-src перечисляются разрешённые источники по умолчанию для остальных директив через пробел.
Так, если какая-то директива не указана, то политика применяется по default-src списку.
Для ссылки на текущий домен используется <code>'self'</code>, для запрета загрузки любого контента в рамках директивы указывается <code>'none'</code>

Простейший пример политики, разрешающей загрузку ресурсов только указанного домена:

<code>Content-Security-Policy: default-src 'self';</code>

:warning: Проверь, что в продуктовой версии все источники добавлены в белые листы, например: GA, отчёты, аналитики, логирование и прочие запросы.

#### Запуск e2e-тестов:
Локально тесты запускаются в docker-контейнере в идентичном для Jenkins окружении.
```sh
yarn test:e2e
yarn test:e2e:update // Запуск e2e:тестов с обновлением снапшотов
open coverage/lcov-report/index.html // Посмотреть coverage
```

#### Автоматическое форматирование кода:
macOS:
```sh
yarn format
```

Windows
```sh
yarn format:windows
```

#### Запуск анализа размера бандла:
```sh
yarn analyzer
```

#### Сбор общего покрытия тестами (отчёт по юнитам мержится с отчётом по e2e):
```sh
yarn coverage
open coverage/full/index.html // Посмотреть coverage
```

#### Запуск сканирования sonarqube:
```sh
yarn sonarqube
```

### Cписок служебных скриптов и переменных окружения:
```sh
integration-test // Используется ci для запуска интеграционных тестов на актуальной продакшн-сборке

/* env */
USE_MOCK=enabled // Запуск проекта с ипользованием мок
USE_ISTANBUL=enabled // Запуск/сборка проекта с использованием istanbul для сбора coverage
LOCAL_RUNNING=enabled // Запуск билда на локальной машине
USE_METRICS=disabled // Запуск проекта без использования метрик, для их отладки (например, через [Snowplow Inspector](https://chrome.google.com/webstore/detail/snowplow-inspector/maplkdomeamdlngconidoefjpogkmljm)) необходимо переключить флаг в enabled
```

### Настройки команд сборки
Для запуска режима разработки и сборки используется [arui-scripts](https://github.com/alfa-laboratory/arui-scripts). Подробнее о его настройке и использовании можно узнать в [документации](https://github.com/alfa-laboratory/arui-scripts/blob/master/README.md).

### Метрики производительности

Посмотреть метрики производительности из Prometheus-плагина можно по ссылкам:
1. `/actuator/prometheus` - в виде текста.
2. `/actuator/prometheus/json` - в формате json.

<br />

## Полезные ссылки
#### :exclamation: Прежде чем начать:
- [Старт нового проекта "Единый Фронт"](http://confluence.moscow.alfaintra.net/pages/viewpage.action?pageId=159261146)
#### :fire: Стандарты:
- [Стандарты разработки фронтовых приложений ЦК JS](https://git.moscow.alfaintra.net/projects/DAE/repos/js-standarts/browse)
- [Работа с GIT](https://git.moscow.alfaintra.net/projects/DAE/repos/js-standarts/browse/standarts/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%20%D1%81%20git/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%20%D1%81%20git%20-%20%D0%95%D0%A4.md)
- [Правила именования и организация файлов в проекте](https://git.moscow.alfaintra.net/projects/DAE/repos/js-standarts/browse/standarts/%D0%A1%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B0%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0/%D0%A1%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B0%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0%20-%20%D0%95%D0%A4.md)
#### :sparkles: Инфраструктура ЕФ
- [Общие библиотеки](https://git.moscow.alfaintra.net/projects/UFR-UI/repos/ufr-packages/browse)
- [Стаб для библиотек](https://git.moscow.alfaintra.net/projects/UFR-UI/repos/ufr-package-template/browse)
- [Докер-образы, используемые в проектах](https://git.moscow.alfaintra.net/projects/UFR-UI/repos/ufr-docker-images/browse)
- [Как создать базовый докер образ alpine-node-nginx нужной версии](http://confluence.moscow.alfaintra.net/pages/viewpage.action?pageId=628810519)
#### :zap: Настройка пайплайна:
- [Репозиторий с Jenkinsfile ЕФ](https://git.moscow.alfaintra.net/projects/UFRSANDBOX/repos/ufr-front-jenkinsfile/browse)
- [Документация по Альфа-Платформе](http://confluence.moscow.alfaintra.net/pages/viewpage.action?pageId=447527746)
- [Настройка sonarqube](http://confluence.moscow.alfaintra.net/pages/viewpage.action?pageId=627017270)

<br />

#### :v: Проект был развернут на стабе: [ufr-sandbox-example-ui](https://git.moscow.alfaintra.net/projects/UFRSANDBOX/repos/ufr-sandbox-example-ui/browse)
