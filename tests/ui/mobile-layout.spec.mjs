import { test, expect } from '@playwright/test';

async function openControlledApp(page) {
  await page.addInitScript(() => {
    localStorage.setItem('wasbinichwert-onboarding-v1', 'done');
    localStorage.setItem('wasbinichwert-pro-test-access-v1', '1');
  });
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.locator('#wiwUiConsistencyStyles')).toBeAttached();
}

async function openMore(page) {
  await page.locator('nav button[data-tab="mehr"]').click();
  await expect(page.locator('#tab-mehr')).toBeVisible();
}

async function metrics(locator) {
  return locator.evaluate(element => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      height: box.height,
      fontSize: Number.parseFloat(style.fontSize),
      left: box.left,
      right: box.right,
      viewportWidth: document.documentElement.clientWidth,
    };
  });
}

async function expectMatchingControls(first, second) {
  const [a, b] = await Promise.all([metrics(first), metrics(second)]);
  expect(a.height).toBeCloseTo(b.height, 1);
  expect(a.fontSize).toBeCloseTo(b.fontSize, 1);
  for (const control of [a, b]) {
    expect(control.left).toBeGreaterThanOrEqual(0);
    expect(control.right).toBeLessThanOrEqual(control.viewportWidth + 1);
  }
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile-'), 'Nur für mobile Viewports');
  await openControlledApp(page);
});

test('mobile Aktionspaare bleiben gleich hoch und ohne Überlauf', async ({ page }) => {
  await openMore(page);

  await expectMatchingControls(page.locator('#resultPdfBtn'), page.locator('#resultShareBtn'));
  await expectMatchingControls(page.locator('#offPrepare'), page.locator('#offRefresh'));
  await expectNoHorizontalOverflow(page);
});

test('mobile Gehaltsentwicklung harmonisiert Buttons, Felder und Dropdown', async ({ page }) => {
  await openMore(page);
  await page.locator('#openSalaryGrowth').click();
  await expect(page.locator('#tab-gehalt')).toBeVisible();

  await expectMatchingControls(page.locator('#sgSync'), page.locator('#sgCalc'));
  await expectMatchingControls(
    page.locator('#sgHours').locator('xpath=..'),
    page.locator('#sgYears').locator('xpath=..'),
  );
  await expect(page.locator('.salary-actions')).toHaveCSS('margin-top', '16px');
  await expectNoHorizontalOverflow(page);
});

test('mobile Gehaltsverhandlung harmonisiert Buttons, Felder und Dropdown', async ({ page }) => {
  await openMore(page);
  await page.locator('#openNegotiation').click();
  await expect(page.locator('#tab-verhandlung')).toBeVisible();

  await expectMatchingControls(page.locator('#negSync'), page.locator('#negCalc'));
  await expectMatchingControls(
    page.locator('#negHours').locator('xpath=..'),
    page.locator('#negGoal').locator('xpath=..'),
  );
  await expect(page.locator('.neg-actions')).toHaveCSS('margin-top', '16px');
  await expectNoHorizontalOverflow(page);
});
