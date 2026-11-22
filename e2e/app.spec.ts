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

test('shows the summary indicators and the app shell', async ({ page }) => {
  await page.goto('/resumen');

  await expect(page.getByText('90% completado')).toBeVisible();
  await expect(page.getByText('No conformidades')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible();
});
