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
  await expect(page.locator('#openNegotiation')).toBeAttached();
}

async function openMore(page) {
  await page.locator('nav button[data-tab="mehr"]').click();
  await expect(page.locator('#tab-mehr')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await openControlledApp(page);
});

test('Rechner zeigt für Gehalt und Arbeitszeit ein vollständiges Ergebnis', async ({ page }) => {
  await page.locator('#salary').fill('5000');
  await page.locator('#hours').fill('38');
  await page.locator('#calcRechner').click();

  await expect(page.locator('#rechnerResult')).toBeVisible();
  await expect(page.locator('#rGross')).toContainText('5.000');
  await expect(page.locator('#rNet')).toContainText('€');
  await expect(page.locator('#rNetHour')).toContainText('€');
});

test('Gehaltsentwicklung übernimmt Rechnerwerte und rendert drei Jahre', async ({ page }) => {
  await page.locator('#salary').fill('4800');
  await page.locator('#hours').fill('38');
  await openMore(page);
  await page.locator('#openSalaryGrowth').click();

  await expect(page.locator('#tab-gehalt')).toBeVisible();
  await expect(page.locator('#sgGross')).toHaveValue('4800');
  await expect(page.locator('#sgHours')).toHaveValue('38');
  await page.locator('#sgRate').fill('3');
  await page.locator('#sgYears').selectOption('3');
  await page.locator('#sgFirstRaise').fill('200');
  await page.locator('#sgCalc').click();

  await expect(page.locator('#sgResult')).toBeVisible();
  await expect(page.locator('#sgTable .salary-row')).toHaveCount(4);
  await expect(page.locator('#sgBars .salary-bar')).toHaveCount(4);
  await expect(page.locator('#sgEndGross')).toContainText('€');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('wasbinichwert-salary-growth-v1')).years)).toBe(3);
});

test('Gehaltsverhandlung prüft eine eigene Forderung und zeigt Szenarien', async ({ page }) => {
  await page.locator('#salary').fill('5000');
  await page.locator('#hours').fill('40');
  await openMore(page);
  await page.locator('#openNegotiation').click();

  await expect(page.locator('#tab-verhandlung')).toBeVisible();
  await expect(page.locator('#negGross')).toHaveValue('5000');
  await page.locator('#negNetPlus').fill('300');
  await page.locator('#negAsk').fill('5600');
  await page.locator('#negGoal').selectOption('ask');
  await page.locator('#negCalc').click();

  await expect(page.locator('#negResult')).toBeVisible();
  await expect(page.locator('#negAskOut')).toContainText('5.600');
  await expect(page.locator('#negScenarios .neg-row')).toHaveCount(4);
  await expect(page.locator('#negSummary')).toContainText('Deine eingegebene Forderung');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('wasbinichwert-negotiation-v1')).ask)).toBe(5600);
});
