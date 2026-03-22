import { Page, Locator } from '@playwright/test';
import { selectRandomOptionLabel } from '../utils/random';
import { selectRandomOptionValue } from '../utils/random';

export class ProductPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }


    get addToCartButton(): Locator {
        return this.page.locator('button:has-text("Add to Cart")');
    }

    get sizeSelect(): Locator {
        return this.page.locator('#sizeSelect');
    }
    get quantitySelect(): Locator {
        return this.page.locator('select[aria-labelledby="quantityLabel"]');
    }
  

    async selectRandomSize(): Promise<string> {
        return selectRandomOptionLabel(this.sizeSelect);
    }

    async selectRandomQuantity(): Promise<string> {
        return selectRandomOptionValue(this.quantitySelect);
    }

    async addToCart() {
        await this.addToCartButton.click();
    }
}