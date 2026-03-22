#  Playwright E2E Test Framework — Polymer Shop

End-to-end тестовый фреймворк для демо приложения  
 https://shop.polymer-project.org/

Проект демонстрирует полный цикл обеспечения качества: от тест-планирования и разработки тест-кейсов до автоматизации и CI/CD.

---

##  Project Overview

Данный проект реализует комплексный подход к тестированию frontend-приложения и включает:

- разработку **тест-плана**
- подготовку **детализированных тест-кейсов**
- реализацию **E2E автотестов**
- настройку **CI/CD пайплайна**

Основная цель — обеспечить качество критического пользовательского пути (critical user flow) и продемонстрировать best practices автоматизации тестирования.

---

##  Test Design & QA Artifacts

###  Test Plan

В рамках проекта разработан полноценный тест-план, включающий:

- определение **scope тестирования (in scope / out of scope)**
- приоритизацию функциональности (High / Medium / Low)
- описание **уровней тестирования**:
  - Smoke testing
  - Functional testing (positive / negative)
  - UI/UX testing
  - Integration testing (frontend)
  - Cross-browser testing
  - Exploratory testing
- анализ рисков и стратегии их митигации
- определение **entry / exit criteria**
- описание метрик качества

 Подробный тест-план: `test-plan.md`

---

###  Test Cases

Создан набор тест-кейсов, покрывающих ключевые пользовательские сценарии:

- полный **user journey (от каталога до оформления заказа)**
- позитивные сценарии (happy path)
- негативные сценарии (валидации, ошибки ввода)
- UI и адаптивность
- синхронизация состояния приложения

Каждый тест-кейс содержит:
- предусловия
- шаги выполнения
- ожидаемый результат
- приоритет

 Полный набор тест-кейсов: `test-cases.md`

---

##  Test Automation Architecture

Автотесты реализованы с использованием:

- **Playwright**
- **TypeScript**
- **Page Object Model (POM)**

###  Page Object структура

- `BasePage` — базовые методы взаимодействия со страницей
- `ProductPage` — работа с карточкой товара
- `CartPage` — управление корзиной
- `CheckoutPage` — оформление заказа

###  Особенности реализации

- изоляция UI-логики в Page Object слое
- переиспользуемые методы и селекторы
- работа с **Shadow DOM**
- использование стабильных локаторов
- минимизация flaky-тестов

---

##  Test Coverage

Автотесты покрывают:

- основной пользовательский путь (E2E)
- добавление и управление товарами в корзине
- checkout (positive / negative сценарии)
- адаптивность UI (mobile / tablet)
- проверку консольных ошибок
- синхронизацию состояния интерфейса

---

##  CI/CD

Проект использует **GitHub Actions** для автоматического запуска тестов.

###  Триггеры
- push в `main` / `master`
- pull request

###  Кроссбраузерное тестирование
- Chromium
- Firefox
- WebKit

###  Особенности
- параллельный запуск (matrix strategy)
- `fail-fast: false`
- установка только необходимого браузера
- headless режим в CI
- сохранение HTML-отчётов как артефактов

---

##  Requirements

- Node.js (>= 18 LTS)
- npm

Проверка:
```bash
node -v
npm -v
```

---

##  Installation

```bash
git clone <repository_url>
cd <project_folder>
npm install
npx playwright install --with-deps
```

---

##  Running Tests

 **Headless** (по умолчанию)  
```bash
npm test
```

 **Headed mode**  
```bash
npm run test:headed
```

 **Debug mode**  
```bash
npm run test:debug
```

 **Запуск конкретного теста**  
```bash
npx playwright test tests/polymer-shop.spec.ts
npx playwright test -g "TC-010"
```

 **Reporting**  
```bash
npm run report
```

---

##  Reporting

После выполнения тестов генерируется HTML-отчёт Playwright.

---

##  Key Testing Challenges

**Shadow DOM**  
Приложение использует Web Components, что требует специальных подходов к локаторам (Playwright полностью поддерживает работу с Shadow DOM).

**Frontend-only приложение**  
- отсутствует backend
- нет сохранения состояния между сессиями

**Адаптивность**  
Проверка на различных разрешениях:
- mobile (320px)
- tablet (768px)
- desktop (1280px+)

---

##  License

Проект создан в учебных целях и демонстрирует практические навыки QA и автоматизации тестирования.