import { Page, Locator } from '@playwright/test';
import { selectRandomOptionValue } from '../utils/random';

export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    
    get items(): Locator {
        return this.page.locator('shop-cart-item');
    }

    get quantitySelectInCart(): Locator {
        return this.page.locator('select[aria-label="Change quantity"]');
    }

    get delBtn(): Locator {
        return this.page.locator('.detail .delete-button');
    }

    get checkoutBtn(): Locator {
        return this.page.locator('.checkout-box shop-button > a');
    }

    get emptyState(): Locator {
        return this.page.locator('.main-frame > .subsection > .empty-cart');
    }

    get total(): Locator {
        return this.page.locator('.checkout-box .subtotal');
    }

    async selectRandomQuantity() {
        await selectRandomOptionValue(this.quantitySelectInCart);
    }

    
    async deleteItemFromCart() {
        await this.delBtn.click();
    }


    async checkout() {
        await this.checkoutBtn.click();
    }

    async getItemCount(): Promise<number> {
        return await this.items.count();
    }
}