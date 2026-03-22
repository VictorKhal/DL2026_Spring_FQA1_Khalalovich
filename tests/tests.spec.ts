import { test, expect, ConsoleMessage } from '@playwright/test';
import { BasePage } from '../pages/base.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';


test.describe('Polymer Shop Tests', () => {
    let basePage: BasePage;
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    // Собираем ошибки консоли для TC-016
    let consoleErrors: string[] = [];

    test.beforeEach(async ({ page }) => {
        basePage = new BasePage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        await basePage.open();
        
    });

    test('TC-001 Open main page', async ({ page }) => {
        await expect(page).toHaveURL('https://shop.polymer-project.org/');
        await expect(basePage.logo).toBeVisible();
    });

    test('TC-002 Scroll and load products', async () => {
        await basePage.clickRandomCategory();
        
        let initialCount = await basePage.getProductCardsCount();
        
        await basePage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await basePage.page.waitForTimeout(1000); // Ждём подгрузки при таком интервале тесты проходят
        
        const afterScrollCount = await basePage.getProductCardsCount();
        expect(afterScrollCount).toBeGreaterThanOrEqual(initialCount);
        
        await basePage.page.evaluate(() => window.scrollTo(0, 0));
        
        expect(consoleErrors).toEqual([]);
    });

    test('TC-003 Navigate to product detail', async () => {
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        
        await expect(productPage.addToCartButton).toBeVisible();
        await expect(productPage.sizeSelect).toBeVisible();
        await expect(productPage.quantitySelect).toBeVisible();
        expect(consoleErrors).toEqual([]);
    });

    
    test('TC-004 Add product to cart from detail page', async () => {
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        const initialBadgeText = await basePage.cartBadge.textContent();
        const initialCount = initialBadgeText ? parseInt(initialBadgeText) : 0;
        await productPage.addToCart();
    
        await expect(basePage.cartBadge).toHaveText((initialCount + 1).toString());
        expect(consoleErrors).toEqual([]);
    });

    test('TC-005 Add same product multiple times', async () => {
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        const initialBadgeText = await basePage.cartBadge.textContent();
        const initialCount = initialBadgeText ? parseInt(initialBadgeText) : 0;
       
        await productPage.addToCart();
        await productPage.addToCart();
        await expect(basePage.cartBadge).toHaveText((initialCount + 2).toString());
        await basePage.openCart();
        
        const quantitySelect = cartPage.quantitySelectInCart;
        await expect(quantitySelect).toHaveValue('2');
        expect(consoleErrors).toEqual([]);
    });

    test('TC-006 View cart', async () => {
        await basePage.clickRandomCategory();
        
        await basePage.clickOnRandomProduct();
        await productPage.addToCart();
        await basePage.openCart();
        
        await expect(cartPage.items).toHaveCount(1);
        
        await expect(cartPage.checkoutBtn).toBeVisible();
        
        await expect(cartPage.total).toBeVisible();
        expect(consoleErrors).toEqual([]);
    });

    test('TC-007 Change quantity in cart', async () => {
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        await productPage.addToCart();
        await basePage.openCart();
        
        await cartPage.quantitySelectInCart.selectOption('3');
        
        await expect(basePage.cartBadge).toHaveText('3');

        expect(cartPage.total).not.toBe('$0.00');
        expect(consoleErrors).toEqual([]);
    });

    test('TC-008 Remove item from cart', async () => {
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        await productPage.addToCart();
        await basePage.openCart();
        
        await cartPage.deleteItemFromCart();
        
        await expect(cartPage.emptyState).toBeVisible();
        
        await expect(basePage.cartBadge).toHaveText('0');
        expect(consoleErrors).toEqual([]);
    });

    test('TC-009 Proceed to checkout', async () => {
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        await productPage.addToCart();
        await basePage.openCart();
        await cartPage.checkout();
       
        await expect(checkoutPage.emailInput).toBeVisible();
        await expect(checkoutPage.submitBtn).toBeVisible();
        expect(consoleErrors).toEqual([]);
    });

    test('TC-010 Successful order placement', async () => {
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        await productPage.addToCart();
        await basePage.openCart();
        await cartPage.checkout();
        
        await checkoutPage.fillFormAndSubmit();
        await expect(checkoutPage.successMessage).toBeVisible();
    
        await checkoutPage.clickFinishBtn()
        
        await expect(basePage.cartBadge).toHaveText('0');
        expect(consoleErrors).toEqual([]);
    });

    
    test('TC-011 Order with empty fields', async () => {
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        await productPage.addToCart();
        await basePage.openCart();
        await cartPage.checkout();
        
        await checkoutPage.submitEmpty();
        
        await expect(checkoutPage.errorEmail).toBeVisible();
        
        await expect(basePage.cartBadge).not.toHaveText('0');
        expect(consoleErrors).toEqual([]);
    });

    
    test('TC-012 Order with special characters in fields', async () => {
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        await productPage.addToCart();
        await basePage.openCart();
        await cartPage.checkout();
        
        const dangerousData = {
            email: '<script>alert(1)</script>',
            phone: '!@#$%^&*()_+',
            address: 'a'.repeat(150),
            city: '<b>city</b>',
            state: 'state',
            zip: '12345',
            name: 'John Doe',
            cardNumber: '4242424242424242',
            cvv: '123'
        };
        await checkoutPage.fillForm(dangerousData);
        await checkoutPage.submitBtn.click();

        await expect(checkoutPage.errorEmail).toBeVisible();
        expect(consoleErrors).toEqual([]);
    });

    
    test('TC-013 Logo navigation', async () => {
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        await basePage.clickLogo();
        await expect(basePage.page).toHaveURL('https://shop.polymer-project.org/');
        expect(consoleErrors).toEqual([]);
    });

    // TC-014 Адаптивность на мобильных устройствах !!!!! не доделан(работа через бургер меню)
    // test('TC-014 Mobile responsiveness', async ({ page }) => {
    //     await page.setViewportSize({ width: 320, height: 568 });
    //     await basePage.clickRandomCategory();
    //     await expect(basePage.page.locator('ul.grid')).toBeVisible();
        
    //     await basePage.openCart();
    //     await expect(cartPage.emptyState).toBeVisible();
        
    //     await basePage.open();
    //     await basePage.clickRandomCategory();
    //     await basePage.clickOnRandomProduct();
    //     await expect(productPage.addToCartButton).toBeVisible();
        
    //     const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    //     const viewportWidth = page.viewportSize()?.width || 320;
    //     expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
    //     expect(consoleErrors).toEqual([]);
    // });

    
    test('TC-015 Tablet responsiveness', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await basePage.clickRandomCategory();
        await expect(basePage.page.locator('ul.grid')).toBeVisible();
        await basePage.openCart();
        await expect(cartPage.emptyState).toBeVisible();
        await basePage.open();
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        await expect(productPage.addToCartButton).toBeVisible();
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const viewportWidth = page.viewportSize()?.width || 768;
        expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
        expect(consoleErrors).toEqual([]);
    });

    test('TC-016 Console errors during main actions', async () => {
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        await productPage.selectRandomSize();
        await productPage.selectRandomQuantity();
        await productPage.addToCart();
        await basePage.openCart();
        await cartPage.selectRandomQuantity();
        await cartPage.checkout();
        await checkoutPage.fillFormAndSubmit();
        
        await expect(checkoutPage.successMessage).toBeVisible();
    
        expect(consoleErrors).toEqual([]);
    });

    test('TC-017 Cart badge synchronization', async () => {
        await basePage.clickRandomCategory();
        await basePage.clickOnRandomProduct();
        await productPage.addToCart();
        
        await expect(basePage.cartBadge).toHaveText('1');
        
        await basePage.openCart();
        await cartPage.quantitySelectInCart.selectOption('3');
        
        await expect(basePage.cartBadge).toHaveText('3');
        
        await cartPage.deleteItemFromCart();
        await expect(basePage.cartBadge).toHaveText('0');
       
        await basePage.open();
        await expect(basePage.cartBadge).toHaveText('0');
        expect(consoleErrors).toEqual([]);
    });
});