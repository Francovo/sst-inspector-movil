import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const DEMO_USER = {
  id: 'u-demo',
  fullName: 'Johan Sebastián Montealegre',
  email: 'demo@sst.co',
  password: 'demo1234',
  company: 'Industrias del Café S.A.S.',
};

const DEMO_INSPECTION = {
  id: 'insp-e2e',
  codigoReporte: 'SST-2026-001',
  empresa: 'Industrias del Café S.A.S.',
  sedeArea: 'Planta Principal',
  listaChequeoId: 'decreto-1072',
  listaChequeoTitulo: 'Decreto 1072',
  inspectorNombre: 'Johan Sebastián Montealegre',
  fechaInspeccion: '2026-11-23',
  items: [
    {
      id: 'item-1',
      codigo: 'SST-01',
      categoria: 'Elementos de Protección Personal',
      pregunta: '¿El personal utiliza casco y calzado de seguridad?',
      guiaVerificacion: 'Verificar uso correcto.',
      respuesta: 'cumple',
      observacion: '',
    },
    {
      id: 'item-2',
      codigo: 'SST-02',
      categoria: 'Señalización',
      pregunta: '¿Las rutas de evacuación están libres?',
      guiaVerificacion: 'Comprobar acceso libre.',
      respuesta: 'cumple',
      observacion: 'Pasillo B despejado.',
    },
    {
      id: 'item-3',
      codigo: 'SST-03',
      categoria: 'Orden y Aseo',
      pregunta: '¿Las superficies están libres de derrames?',
      guiaVerificacion: 'Revisar pisos y pasillos.',
      respuesta: 'no_cumple',
      observacion: '',
    },
  ],
  evidencias: [],
  firma: {
    nombre: 'Johan Sebastián Montealegre',
    cargo: 'Inspector SST Líder',
    firmaBase64: 'data:image/png;base64,abc',
    fechaFirma: '2026-11-23T10:00:00.000Z',
  },
  estado: 'pendiente_sincronizar',
  porcentajeCumplimiento: 67,
  hallazgosCriticos: 1,
};

/**
 * The dashboard and main's protected screens read the local session, so every
 * test that needs the app shell seeds the same demo account first.
 */
const seedUser = async (page: Page, withSession = false): Promise<void> => {
  await page.addInitScript(
    ({ user, authenticated }) => {
      localStorage.setItem('sst_users', JSON.stringify([user]));

      if (authenticated) {
        localStorage.setItem('sst_session', JSON.stringify({ userId: user.id, email: user.email }));
      }
    },
    { user: DEMO_USER, authenticated: withSession },
  );
};

const DEMO_DRAFT = {
  ...DEMO_INSPECTION,
  id: 'insp-draft',
  codigoReporte: 'SST-2026-002',
  estado: 'borrador',
  firma: undefined,
  items: DEMO_INSPECTION.items.map((item) => ({
    ...item,
    respuesta: null,
    observacion: '',
  })),
  porcentajeCumplimiento: 0,
  hallazgosCriticos: 0,
};

const seedInspection = async (page: Page): Promise<void> => {
  await page.addInitScript((inspection) => {
    localStorage.setItem('sst_inspecciones_locales', JSON.stringify([inspection]));
  }, DEMO_INSPECTION);
};

const seedDraft = async (page: Page): Promise<void> => {
  await page.addInitScript((inspection) => {
    localStorage.setItem('sst_inspecciones_locales', JSON.stringify([inspection]));
  }, DEMO_DRAFT);
};

test('lands on the login screen', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'SST-Inspector Móvil' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Inicia sesión' })).toBeVisible();
  await expect(page.getByRole('button', { name: /ingresar/i })).toBeVisible();
});

test('opens the registration screen from the login', async ({ page }) => {
  await page.goto('/login');

  await page.getByRole('link', { name: /crear cuenta/i }).click();

  await expect(page.getByRole('heading', { name: 'Registro de usuario' })).toBeVisible();
  await expect(page.getByText('Empresa')).toBeVisible();
});

test('signs in and reaches the dashboard', async ({ page }) => {
  await seedUser(page);
  await page.goto('/login');

  await page.locator('#login-email').fill(DEMO_USER.email);
  await page.locator('#login-password').fill(DEMO_USER.password);
  await page.getByRole('button', { name: /ingresar/i }).click();

  await expect(page.locator('.dashboard-container')).toBeVisible();
  await expect(page.getByText('¡Hola, Inspector!')).toBeVisible();
  await expect(page.getByText('Resumen de inspecciones')).toBeVisible();
});

test('fills the guided inspection form question by question', async ({ page }) => {
  await seedUser(page, true);
  await page.goto('/dashboard');

  await page.getByRole('button', { name: /nueva inspección/i }).click();
  await expect(page.getByRole('heading', { name: 'Listas de chequeo SST' })).toBeVisible();

  await page.getByRole('button', { name: 'Seleccionar' }).first().click();

  await expect(page.getByRole('heading', { name: 'Formulario de inspección' })).toBeVisible();
  await expect(page.getByText('Pregunta 1 de 10')).toBeVisible();
  await expect(page.getByText('10% completado')).toBeVisible();

  await page.getByRole('button', { name: 'Cumple' }).click();
  await page.getByRole('button', { name: /siguiente/i }).click();

  await expect(page.getByText('Pregunta 2 de 10')).toBeVisible();
  await expect(page.getByText('20% completado')).toBeVisible();
});

test('opens the shared side menu and returns to the dashboard', async ({ page }) => {
  await seedUser(page, true);
  await page.goto('/listas');

  await page.getByRole('button', { name: 'Abrir menú' }).click();
  const menu = page.getByRole('dialog', { name: 'Menú lateral' });
  await expect(menu).toBeVisible();

  await menu.getByRole('button', { name: 'Inicio' }).click();
  await expect(page.locator('.dashboard-container')).toBeVisible();
});

test('navigates with the shared bottom bar', async ({ page }) => {
  await seedUser(page, true);
  await page.goto('/listas');

  await page
    .getByRole('navigation', { name: 'Navegación principal' })
    .getByRole('button', { name: 'Evidencias' })
    .click();

  await expect(page.getByText('Captura de evidencias').first()).toBeVisible();
});

test('captures a photo from the web fallback', async ({ page }) => {
  await page.goto('/evidencias');

  await page.locator('input[type="file"]').setInputFiles('public/img/inspeccion1.jpg');

  await expect(page.locator('.evidencias-imagen')).toBeVisible();
  await expect(page.getByText('No hay fotografía seleccionada')).toHaveCount(0);
});

test('shows an empty state when there are no saved inspections', async ({ page }) => {
  await page.goto('/resumen');

  await expect(page.getByText('Aún no hay inspecciones guardadas')).toBeVisible();
  await expect(page.getByRole('button', { name: /nueva inspección/i })).toBeVisible();
});

test('shows the saved inspection in the summary', async ({ page }) => {
  await seedInspection(page);
  await page.goto('/resumen');

  await expect(page.getByText('# SST-2026-001')).toBeVisible();
  await expect(page.getByText('Decreto 1072')).toBeVisible();
  await expect(page.getByText('Firma registrada correctamente')).toBeVisible();
  await expect(page.getByText('67%')).toBeVisible();
  await expect(page.getByText('1 No conformidad')).toBeVisible();
});

test('signs a draft and reaches the summary', async ({ page }) => {
  await seedDraft(page);
  await page.goto('/firma');

  await expect(page.getByRole('heading', { name: 'Firma digital' })).toBeVisible();

  const canvas = page.locator('.sst-signature__canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  if (!box) throw new Error('No se encontró el área de firma');

  await page.mouse.move(box.x + 24, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 24, box.y + box.height / 2, { steps: 12 });
  await page.mouse.up();

  await page.getByRole('button', { name: /guardar firma/i }).click();
  await expect(page.getByText('Firma capturada correctamente.')).toBeVisible();

  await page.getByRole('button', { name: /continuar al resumen/i }).click();

  await expect(page.getByRole('heading', { name: 'Resumen de inspección' })).toBeVisible();
  await expect(page.getByText('Firma registrada correctamente')).toBeVisible();
});

test('lists and synchronizes a pending inspection', async ({ page }) => {
  await seedInspection(page);
  await page.goto('/sincronizacion');

  await expect(page.getByText('SST-2026-001')).toBeVisible();
  await page.getByRole('button', { name: /sincronizar ahora/i }).click();

  await expect(page.getByText('Sincronización completada correctamente')).toBeVisible();
});

test('signs out from the shared side menu', async ({ page }) => {
  await seedUser(page, true);
  await page.goto('/listas');

  await page.getByRole('button', { name: 'Abrir menú' }).click();
  const menu = page.getByRole('dialog', { name: 'Menú lateral' });
  await menu.getByRole('button', { name: 'Cerrar sesión' }).click();

  await expect(page.getByRole('heading', { name: 'Inicia sesión' })).toBeVisible();
});
