import { test, expect } from '@playwright/test';

async function openControlledApp(page) {
  await page.addInitScript(() => {
    localStorage.setItem('wasbinichwert-onboarding-v1', 'done');
    localStorage.setItem('wasbinichwert-pro-test-access-v1', '1');
  });
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.locator('#openSalaryGrowth')).toBeAttached();

  // Fixed navigation would otherwise overlap tall component screenshots.
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
      nav { display: none !important; }
    `,
  });
  await expect(page.locator('nav')).toBeHidden();
}

async function openMore(page) {
  // The fixed navigation is hidden only after the relevant tab was selected.
  await page.evaluate(() => {
    const button = document.querySelector('nav button[data-tab="mehr"]');
    button?.click();
  });
  await expect(page.locator('#tab-mehr')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await openControlledApp(page);
});

test('Rechner bleibt visuell stabil', async ({ page }) => {
  await page.locator('#salary').fill('5000');
  await page.locator('#hours').fill('38');
  await page.locator('#calcRechner').click();
  await expect(page.locator('#rechnerResult')).toBeVisible();

  await expect(page.locator('#tab-rechner')).toHaveScreenshot('rechner.png');
});

test('Gehaltsentwicklung bleibt visuell stabil', async ({ page }) => {
  await page.locator('#salary').fill('4800');
  await page.locator('#hours').fill('38');
  await openMore(page);
  await page.locator('#openSalaryGrowth').click();
  await page.locator('#sgRate').fill('3');
  await page.locator('#sgYears').selectOption('3');
  await page.locator('#sgFirstRaise').fill('200');
  await page.locator('#sgCalc').click();
  await expect(page.locator('#sgResult')).toBeVisible();

  await expect(page.locator('#tab-gehalt')).toHaveScreenshot('gehaltsentwicklung.png');
});

test('Gehaltsverhandlung bleibt visuell stabil', async ({ page }) => {
  await page.locator('#salary').fill('5000');
  await page.locator('#hours').fill('40');
  await openMore(page);
  await page.locator('#openNegotiation').click();
  await page.locator('#negNetPlus').fill('300');
  await page.locator('#negAsk').fill('5600');
  await page.locator('#negGoal').selectOption('ask');
  await page.locator('#negCalc').click();
  await expect(page.locator('#negResult')).toBeVisible();

  await expect(page.locator('#tab-verhandlung')).toHaveScreenshot('gehaltsverhandlung.png');
});
