import { expect, Page, test } from '@playwright/test';

const openIngredientModal = async (page: Page) => {
  await page.goto('/');
  await expect(page.locator('#modals')).toBeEmpty();
  await page.getByText('Моковая космическая булка').click();
};

const expectEmptyConstructor = async (page: Page) => {
  const constructor = page.locator('main section').nth(1);

  await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
  await expect(constructor.getByText('Выберите начинку')).toBeVisible();
  await expect(constructor.getByText('Моковая космическая булка')).toHaveCount(
    0
  );
  await expect(
    constructor.getByText('Моковая метеоритная котлета')
  ).toHaveCount(0);
};

const setMockAuthTokens = async (page: Page) => {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer mock-access-token',
      domain: '127.0.0.1',
      path: '/'
    }
  ]);
  await page.addInitScript(() => {
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
};

const clearMockAuthTokens = async (page: Page) => {
  await page.evaluate(() => {
    window.localStorage.removeItem('refreshToken');
  });
  await page.context().clearCookies();
};

const collectBurger = async (page: Page) => {
  await page
    .locator('li')
    .filter({ hasText: 'Моковая космическая булка' })
    .getByRole('button')
    .click();
  await page
    .locator('li')
    .filter({ hasText: 'Моковая метеоритная котлета' })
    .getByRole('button')
    .click();
};

const submitOrder = async (page: Page) => {
  await page.locator('main section').nth(1).getByRole('button').last().click();
};

test.describe('страница конструктора', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
      notFound: 'abort'
    });
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
      notFound: 'abort'
    });
    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders',
      update: false,
      notFound: 'abort'
    });
  });

  test.describe('список ингредиентов', () => {
    test('загружает моковые ингредиенты из HAR', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByText('Моковая космическая булка')).toBeVisible();
      await expect(page.getByText('Моковая метеоритная котлета')).toBeVisible();
      await expect(page.getByText('Моковый лунный соус')).toBeVisible();
    });

    test('добавляет булку и начинку из списка в конструктор', async ({
      page
    }) => {
      await page.goto('/');
      await expectEmptyConstructor(page);

      await collectBurger(page);

      const constructor = page.locator('main section').nth(1);

      await expect(
        constructor.getByText('Моковая космическая булка')
      ).toHaveCount(2);
      await expect(
        constructor.getByText('Моковая метеоритная котлета')
      ).toHaveCount(1);
    });
  });

  test.describe('модальное окно ингредиента', () => {
    test('открывает данные кликнутого ингредиента и закрывает окно по крестику', async ({
      page
    }) => {
      await openIngredientModal(page);

      await expect(
        page.locator('#modals').getByText('Моковая космическая булка')
      ).toBeVisible();
      await expect(page.locator('#modals').getByText('420')).toBeVisible();
      await expect(
        page.locator('#modals').getByText('Моковая метеоритная котлета')
      ).toBeHidden();

      await page.locator('#modals button').click();

      await expect(
        page.locator('#modals').getByText('Моковая космическая булка')
      ).toBeHidden();
    });

    test('закрывает модальное окно ингредиента по клику на оверлей', async ({
      page
    }) => {
      await openIngredientModal(page);

      await expect(
        page.locator('#modals').getByText('Моковая космическая булка')
      ).toBeVisible();

      await page
        .locator('#modals > div')
        .last()
        .click({ position: { x: 10, y: 10 } });

      await expect(
        page.locator('#modals').getByText('Моковая космическая булка')
      ).toBeHidden();
    });
  });

  test.describe('создание заказа', () => {
    test.afterEach(async ({ page }) => {
      await clearMockAuthTokens(page);
    });

    test('создает заказ и показывает верный номер в модальном окне', async ({
      page
    }) => {
      await setMockAuthTokens(page);
      await page.goto('/');

      await collectBurger(page);

      const constructor = page.locator('main section').nth(1);

      await expect(
        constructor.getByText('Моковая космическая булка')
      ).toHaveCount(2);
      await expect(
        constructor.getByText('Моковая метеоритная котлета')
      ).toHaveCount(1);

      await submitOrder(page);

      await expect(page.locator('#modals').getByText('12345')).toBeVisible();
      await expect(
        constructor.getByText('Моковая космическая булка')
      ).toHaveCount(0);
      await expect(
        constructor.getByText('Моковая метеоритная котлета')
      ).toHaveCount(0);

      await page.locator('#modals button').click();

      await expect(page.locator('#modals').getByText('12345')).toBeHidden();
    });
  });
});
