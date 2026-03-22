import { Page, Locator } from '@playwright/test';
import { getRandomItem } from '../utils/random';
import { getRandomInt } from '../utils/random';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

 
  get logo(): Locator {
    return this.page.locator('.logo > a');
  }

  get navMensOuterwear(): Locator {
    return this.page.locator('shop-tab > a[href*="mens_outerwear"]');
  }

  get navLadiesOuterwear(): Locator {
    return this.page.locator('shop-tab > a[href*="/list/ladies_outerwear"]');
  }

  get navMensTshirts(): Locator {
    return this.page.locator('shop-tab > a[href*="/list/mens_tshirts"]');
  }

  get navLadiesTshirts(): Locator {
    return this.page.locator('shop-tab > a[href*="/list/ladies_tshirts"]');
  }

  get countOfProducts(): Locator {
    return this.page.locator('ul.grid > li');
  }

  get cart(): Locator {
    return this.page.locator('.cart-btn-container>a[href*="/cart"]');
  }

  get cartBadge(): Locator {
    return this.page.locator('.cart-badge');
  }



  async open() {
    await this.page.goto('https://shop.polymer-project.org/');
  }

  async clickLogo() {
    await this.logo.click();
  }

  async clickRandomCategory() {
    const categories = [
      this.navMensOuterwear,
      this.navLadiesOuterwear,
      this.navMensTshirts,
      this.navLadiesTshirts,
    ];
    const randomCategory = getRandomItem(categories);
    await randomCategory.click();
  }


  async openCart() {
    await this.page.waitForLoadState('networkidle');
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.cart.click();
  }

  async getProductCardsCount(): Promise<number> {
    await this.countOfProducts.first().waitFor({ state: 'visible' });
    const count = await this.countOfProducts.count();
    return count;
  }

  async clickOnRandomProduct(): Promise<void> {
    const count = await this.getProductCardsCount();
    if (count === 0) throw new Error("Товары не найдены, не на что кликать");
    const randomIndex = getRandomInt(count);
    const randomCardLink = this.countOfProducts.nth(randomIndex).locator('a');
    await this.page.waitForLoadState('networkidle');
    await randomCardLink.click();
  }
}