import { expect, test } from '@playwright/test';

test('lands on the login screen', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'SST-Inspector Móvil' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Inicia sesión' })).toBeVisible();
  await expect(page.getByRole('button', { name: /ingresar/i })).toBeVisible();
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

test('adds a photo on the evidence screen and keeps it in the summary', async ({ page }) => {
  await page.goto('/evidencias');

  await page.locator('input[type="file"]').last().setInputFiles('public/img/inspeccion1.jpg');

  await expect(page.getByText('Foto capturada #4')).toBeVisible();

  await page.getByRole('button', { name: /guardar evidencia/i }).click();
  await page.locator('ion-button', { hasText: 'Continuar al resumen' }).click();

  await expect(page.getByText('Ver todas (4)')).toBeVisible();
  await expect(page.getByText('E-04')).toBeVisible();
});

test('signs in and reaches the dashboard', async ({ page }) => {
  await page.goto('/login');

  await page.getByRole('button', { name: /ingresar/i }).click();

  await expect(page.getByRole('heading', { name: 'Resumen de inspecciones' })).toBeVisible();
  await expect(page.getByText('¡Hola, Inspector!')).toBeVisible();
});

test('opens the registration screen from the login', async ({ page }) => {
  await page.goto('/login');

  await page.getByRole('button', { name: /crear cuenta/i }).click();

  await expect(page.getByRole('heading', { name: 'Registro de usuario' })).toBeVisible();
  await expect(page.getByLabel('Empresa')).toBeVisible();
});

test('moves from the dashboard to a checklist and its form', async ({ page }) => {
  await page.goto('/inicio');

  await page.getByRole('button', { name: /nueva inspección/i }).click();
  await expect(page.getByRole('heading', { name: 'Listas de chequeo SST' })).toBeVisible();

  await page.getByRole('button', { name: 'Seleccionar' }).first().click();
  await expect(page.getByRole('heading', { name: 'Formulario de inspección' })).toBeVisible();

  await page.getByRole('button', { name: /siguiente/i }).click();
  await expect(page.getByRole('heading', { name: 'Captura de evidencias' })).toBeVisible();
});

test('opens the side menu and navigates with it', async ({ page }) => {
  await page.goto('/listas');

  await page.getByRole('button', { name: 'Abrir menú' }).click();
  const menu = page.getByRole('dialog', { name: 'Menú lateral' });
  await expect(menu).toBeVisible();

  await menu.getByRole('button', { name: 'Inicio' }).click();
  await expect(page.getByRole('heading', { name: 'Resumen de inspecciones' })).toBeVisible();
});

test('restores the draft after a reload', async ({ page }) => {
  await page.goto('/firma');
  await page.fill('#responsable-nombre', 'Persistencia E2E');
  await page.fill('#responsable-cargo', 'QA');

  await page.waitForFunction(() =>
    Object.keys(localStorage).some(
      (key) => key.includes('sst-inspection-draft') && localStorage.getItem(key)?.includes('Persistencia E2E'),
    ),
  );

  await page.reload();

  await expect(page.locator('#responsable-nombre')).toHaveValue('Persistencia E2E');
  await expect(page.locator('#responsable-cargo')).toHaveValue('QA');
});

test('restores an uploaded photo after a reload', async ({ page }) => {
  await page.goto('/evidencias');
  await page.locator('input[type="file"]').setInputFiles('public/img/inspeccion1.jpg');

  await expect(page.getByText('Foto capturada #4')).toBeVisible();
  await page.waitForFunction(() =>
    Object.keys(localStorage).some(
      (key) => key.includes('sst-inspection-draft') && localStorage.getItem(key)?.includes('evidencias/E-04'),
    ),
  );

  await page.reload();

  await expect(page.getByText('Foto capturada #4')).toBeVisible();
  await expect(page.locator('.evidencias__preview img')).toHaveAttribute('src', /^data:image\/jpeg;base64/);
});

test('shows the summary indicators and the app shell', async ({ page }) => {
  await page.goto('/resumen');

  await expect(page.getByText('90% completado')).toBeVisible();
  await expect(page.getByText('No conformidades')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible();
});
