import { Page, Locator } from '@playwright/test';
import { selectRandomOptionValue } from '../utils/random';

export class CheckoutPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    
    get emailInput(): Locator {
        return this.page.locator('input[type="email"]');
    }

    get phoneInput(): Locator {
        return this.page.locator('input[id="accountPhone"]');
    }

    get addressInput(): Locator {
        return this.page.locator('input[id="shipAddress"]');
    }

    get cityInput(): Locator {
        return this.page.locator('input[id="shipCity"]');
    }

    get stateInput(): Locator {
        return this.page.locator('input[id="shipState"]');
    }

    get postalCodeInput(): Locator {
        return this.page.locator('input[id="shipZip"]');
    }

    get countrySelect(): Locator {
        return this.page.locator('select[id="shipCountry"]');
    }

    get cardholderNameInput(): Locator {
        return this.page.locator('input[id="ccName"]');
    }

    get cardNumberInput(): Locator {
        return this.page.locator('input[id="ccNumber"]');
    }

    get selectExpirationMounth(): Locator {
        return this.page.locator('select[id="ccExpMonth"]');
    }

    get selectExpirationYear(): Locator {
        return this.page.locator('select[id="ccExpYear"]');
    }

    get CVVInput(): Locator {
        return this.page.locator('input[id="ccCVV"]');
    }

    get submitBtn(): Locator {
        return this.page.locator('input[value="Place Order"]');
    }

    get successMessage(): Locator {
        return this.page.locator('text=Thank you');
    }

    get error(): Locator {
        return this.page.locator('.error');
    }

    get errorEmail(): Locator {
        return this.page.locator('shop-md-decorator[error-message="Invalid Email"]');
    }
    
    get finishBtn(): Locator {
        return this.page.locator('header[state="success"] > shop-button > a');
    }


    async fillForm(data?: {
        email?: string,
        phone?: string,
        address?: string,
        city?: string,
        state?: string,
        zip?: string,
        name?: string,
        cardNumber?: string,
        cvv?: string
        }) {
        const filledData = {
            email: data?.email || 'test@test.com',
            phone: data?.phone || '1234567890',
            address: data?.address || 'Test Street 123',
            city: data?.city || 'New York',
            state: data?.state || 'NY',
            zip: data?.zip || '10001',
            name: data?.name || 'John Doe',
            cardNumber: data?.cardNumber || '4242424242424242',
            cvv: data?.cvv || '123',
            country: '',
            expMonth: '',
            expYear: ''
        };

        
        await this.emailInput.fill(filledData.email);
        await this.phoneInput.fill(filledData.phone);
        await this.addressInput.fill(filledData.address);
        await this.cityInput.fill(filledData.city);
        await this.stateInput.fill(filledData.state);
        await this.postalCodeInput.fill(filledData.zip);
        await this.cardholderNameInput.fill(filledData.name);
        await this.cardNumberInput.fill(filledData.cardNumber);
        await this.CVVInput.fill(filledData.cvv);

        filledData.country = await selectRandomOptionValue(this.countrySelect);
        filledData.expMonth = await selectRandomOptionValue(this.selectExpirationMounth);
        filledData.expYear = await selectRandomOptionValue(this.selectExpirationYear);

        return filledData;
    }

    async fillFormAndSubmit() {
        await this.fillForm();
        await this.submitBtn.click();
    }

    async submitEmpty() {
        await this.submitBtn.click();
    }

    async clickFinishBtn() {
        await this.finishBtn.click();
    }
}