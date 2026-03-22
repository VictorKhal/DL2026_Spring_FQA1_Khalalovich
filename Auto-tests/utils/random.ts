import { Locator } from '@playwright/test';

// Выбор случайного элемента из массива
export function getRandomItem<T>(items: T[]): T {
    if (!items.length) throw new Error('Массив пуст');
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}





export async function selectRandomOptionLabel(
    selectLocator: Locator,
    filterEmpty = true
): Promise<string> {
    await selectLocator.waitFor({ state: 'attached' });
    const options = await selectLocator.locator('option').allInnerTexts();
    const validOptions = options.filter(text => filterEmpty ? text.trim().length > 0 : true);
    if (validOptions.length === 0) throw new Error('Нет доступных опций');
    const selectedLabel = getRandomItem(validOptions);
    await selectLocator.selectOption({ label: selectedLabel });
    return selectedLabel;
}


export function getRandomInt(max: number): number {
    if (max <= 0) throw new Error('max должно быть больше 0');
    return Math.floor(Math.random() * max);
}

export async function selectRandomOptionValue(
    selectLocator: Locator,
    filterEmpty = true
    ): Promise<string> {
    await selectLocator.waitFor({ state: 'attached' });
    
    // Передаем filterEmpty вторым аргументом в evaluateAll
    const options = await selectLocator.locator('option').evaluateAll(
        (elements, argFilterEmpty) => // Аргумент попадает сюда
            elements
                .map(el => (el as HTMLOptionElement).value)
                .filter(val => argFilterEmpty ? val.trim() !== '' : true),
        filterEmpty // Вот здесь мы передаем переменную в браузер
    );

    if (options.length === 0) throw new Error('Нет доступных опций');
    
    const selectedValue = getRandomItem(options);
    await selectLocator.selectOption(selectedValue);
    return selectedValue;
}
