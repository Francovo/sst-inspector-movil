import { expect, test } from '@playwright/test';

test('lands on the digital signature screen', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'SST-Inspector Móvil' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Firma digital' })).toBeVisible();
});

test('continues from the signature to the inspection summary', async ({ page }) => {
  await page.goto('/firma');

  await page.locator('ion-button', { hasText: 'Continuar al resumen' }).click();

  await expect(page.getByRole('heading', { name: 'Resumen de inspección' })).toBeVisible();
  await expect(page.getByText('INS-2026-001')).toBeVisible();
});

test('carries the signature data into the summary', async ({ page }) => {
  await page.goto('/firma');

  await page.fill('#responsable-nombre', 'Ana María Ríos');
  await page.fill('#responsable-cargo', 'Coordinadora SST');
  await page.locator('ion-button', { hasText: 'Continuar al resumen' }).click();

  await expect(page.getByText('Ana María Ríos').first()).toBeVisible();
  await expect(page.getByText('Coordinadora SST').first()).toBeVisible();
});

test('opens the evidence gallery and adds a photo', async ({ page }) => {
  await page.goto('/resumen');

  await page
    .getByRole('button', { name: /ver todas/i })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: /evidencias/i })).toBeVisible();
  await expect(page.locator('.gallery__item')).toHaveCount(3);

  await page.setInputFiles('input[type="file"]', 'public/img/inspeccion1.jpg');

  await expect(page.locator('.gallery__item')).toHaveCount(4);
  await expect(page.getByText('E-04')).toBeVisible();
});

test('shows the summary indicators and the app shell', async ({ page }) => {
  await page.goto('/resumen');

  await expect(page.getByText('90% completado')).toBeVisible();
  await expect(page.getByText('No conformidades')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible();
});
