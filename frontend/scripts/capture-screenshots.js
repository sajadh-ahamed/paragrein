import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FRONTEND_URL = process.env.SCREENSHOT_FRONTEND_URL || 'http://localhost:5173';
const BACKEND_HEALTH_URL = process.env.SCREENSHOT_BACKEND_HEALTH_URL || 'http://localhost:8080/api/health';
const DEFAULT_PASSWORD = process.env.SCREENSHOT_DEMO_PASSWORD || 'Password@123';
const VIEWPORT = { width: 1440, height: 900 };
const NAVIGATION_TIMEOUT_MS = 20_000;
const LOGIN_TIMEOUT_MS = 30_000;
const SETTLE_TIMEOUT_MS = 6_000;
const AUTH_TOKEN_KEY = 'paragrein_auth_token';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendDirectory = path.resolve(scriptDirectory, '..');
const outputRoot = path.resolve(frontendDirectory, '..', 'screenshots', 'dissertation');

const folders = {
  public: '01-public-auth',
  customer: '02-customer',
  finance: '03-finance',
  admin: '04-admin',
  pickup: '05-pickup',
  warehouse: '06-warehouse',
  driver: '07-driver',
  reports: '08-reports',
  viva: '09-viva-evidence',
};

const roleRoutes = {
  admin: '/admin',
  finance: '/finance',
  pickup: '/pickup',
  warehouse: '/warehouse',
  driver: '/driver',
  customer: '/customer',
};

const credentials = {
  admin: {
    usernames: [process.env.SCREENSHOT_ADMIN_USERNAME || 'admin'],
    password: process.env.SCREENSHOT_ADMIN_PASSWORD || DEFAULT_PASSWORD,
  },
  finance: {
    usernames: [process.env.SCREENSHOT_FINANCE_USERNAME || 'finance'],
    password: process.env.SCREENSHOT_FINANCE_PASSWORD || DEFAULT_PASSWORD,
  },
  pickup: {
    usernames: process.env.SCREENSHOT_PICKUP_USERNAME
      ? [process.env.SCREENSHOT_PICKUP_USERNAME]
      : ['pickup', 'pickup.agent'],
    password: process.env.SCREENSHOT_PICKUP_PASSWORD || DEFAULT_PASSWORD,
  },
  warehouse: {
    usernames: process.env.SCREENSHOT_WAREHOUSE_USERNAME
      ? [process.env.SCREENSHOT_WAREHOUSE_USERNAME]
      : ['warehouse', 'warehouse.staff'],
    password: process.env.SCREENSHOT_WAREHOUSE_PASSWORD || DEFAULT_PASSWORD,
  },
  driver: {
    usernames: [process.env.SCREENSHOT_DRIVER_USERNAME || 'driver'],
    password: process.env.SCREENSHOT_DRIVER_PASSWORD || DEFAULT_PASSWORD,
  },
  customer: {
    usernames: [process.env.SCREENSHOT_CUSTOMER_USERNAME || 'customer'],
    password: process.env.SCREENSHOT_CUSTOMER_PASSWORD || DEFAULT_PASSWORD,
  },
};

const successfulScreenshots = [];
const failedScreenshots = [];
const skippedDetails = [];
const modes = new Set(process.argv.slice(2));
const dryRun = modes.has('--dry-run');
const smokeOnly = modes.has('--smoke');
const failedOnly = modes.has('--failed-only');

function screenshotPath(folderKey, fileName) {
  return path.join(outputRoot, folders[folderKey], fileName);
}

async function createOutputFolders() {
  await Promise.all(Object.values(folders).map((folder) => mkdir(path.join(outputRoot, folder), { recursive: true })));
  await mkdir(path.join(outputRoot, folders.viva, 'debug'), { recursive: true });
}

async function checkService(name, url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    throw new Error(`${name} is unavailable at ${url} (${error.message}).`);
  }
}

async function settlePage(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: SETTLE_TIMEOUT_MS }).catch(() => {});
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
      html { scroll-behavior: auto !important; }
    `,
  }).catch(() => {});
  await page.waitForTimeout(350);
}

async function navigate(page, route) {
  await page.goto(new URL(route, FRONTEND_URL).toString(), {
    waitUntil: 'domcontentloaded',
    timeout: NAVIGATION_TIMEOUT_MS,
  });
  await settlePage(page);
}

async function capture(page, definition) {
  let fileName = definition.file;
  let label = `${folders[definition.folder]}/${fileName}`;
  try {
    const outcome = await definition.open(page);
    fileName = outcome?.file || fileName;
    label = `${folders[definition.folder]}/${fileName}`;
    await settlePage(page);
    await page.screenshot({
      path: screenshotPath(definition.folder, fileName),
      fullPage: definition.fullPage !== false,
    });
    successfulScreenshots.push(label);
    console.log(`[OK] ${label}`);
    if (outcome?.skippedMessage) {
      skippedDetails.push(outcome.skippedMessage);
      console.warn(`[SKIPPED DETAIL] ${outcome.skippedMessage}`);
    }
  } catch (error) {
    failedScreenshots.push({ label, reason: error.message });
    console.error(`[FAILED] ${label}: ${error.message}`);
  }
}

async function captureDefinitions(page, definitions) {
  for (const definition of definitions) {
    await capture(page, definition);
  }
}

async function login(page, roleKey) {
  const account = credentials[roleKey];
  const dashboardPath = roleRoutes[roleKey];
  const attemptErrors = [];

  for (const username of account.usernames) {
    try {
      await logout(page);
      await navigate(page, '/login');
      await page.locator('input[name="usernameOrEmail"]').fill(username);
      await page.locator('input[name="password"]').fill(account.password);

      const loginResponsePromise = page.waitForResponse(
        (response) => {
          const url = new URL(response.url());
          return url.pathname.endsWith('/api/auth/login') && response.request().method() === 'POST';
        },
        { timeout: LOGIN_TIMEOUT_MS },
      );

      await page.getByRole('button', { name: /^login$/i }).click();
      const loginResponse = await loginResponsePromise;
      if (!loginResponse.ok()) {
        throw new Error(`login API returned HTTP ${loginResponse.status()}`);
      }

      await page.waitForFunction(
        (tokenKey) => Boolean(localStorage.getItem(tokenKey)),
        AUTH_TOKEN_KEY,
        { timeout: LOGIN_TIMEOUT_MS },
      );

      // UI note: React Router navigation is not treated as a full page load; open the verified role route explicitly.
      await navigate(page, dashboardPath);
      return;
    } catch (error) {
      attemptErrors.push(`${username}: ${error.message}`);
    }
  }

  throw new Error(`all verified username attempts failed (${attemptErrors.join('; ')})`);
}

async function logout(page) {
  // Security note: clearing browser-only state avoids mutating server data between role captures.
  if (!page.url().startsWith('about:')) {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    }).catch(() => {});
  }
  await page.context().clearCookies();
}

async function firstExistingHref(page, listingRoute, hrefPrefix) {
  await navigate(page, listingRoute);
  const links = page.locator(`a[href^="${hrefPrefix}"]`);
  const hrefs = await links.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')).filter(Boolean));
  const href = hrefs.find((candidate) => candidate !== listingRoute && !candidate.endsWith('/history'));
  if (!href) {
    throw new Error(`No existing record is available on ${listingRoute}.`);
  }
  return href;
}

async function openFirstExistingDetail(page, listingRoute, hrefPrefix) {
  const href = await firstExistingHref(page, listingRoute, hrefPrefix);
  if (!href) {
    throw new Error(`The first record on ${listingRoute} has no detail link.`);
  }
  await navigate(page, href);
}

async function openFirstExistingDetailFromListings(page, listingRoutes, hrefPrefix) {
  for (const listingRoute of listingRoutes) {
    try {
      await openFirstExistingDetail(page, listingRoute, hrefPrefix);
      return;
    } catch (error) {
      if (!error.message.startsWith('No existing record')) {
        throw error;
      }
    }
  }
  throw new Error(`No existing detail record is available in: ${listingRoutes.join(', ')}.`);
}

async function openDetailOrFallback(page, options) {
  try {
    await openFirstExistingDetailFromListings(page, options.listingRoutes, options.hrefPrefix);
    return null;
  } catch (error) {
    if (!error.message.startsWith('No existing detail record')) {
      throw error;
    }
    await navigate(page, options.fallbackRoute);
    return {
      file: options.unavailableFile,
      skippedMessage: options.skippedMessage,
    };
  }
}

async function saveLoginDebugEvidence(page, roleKey) {
  const currentUrl = page.url();
  const visibleTitle = await page.locator('h1, h2, [role="heading"]').first().innerText().catch(() => 'No visible heading');
  const debugPath = path.join(outputRoot, folders.viva, 'debug', `${roleKey}-login-failed-debug.png`);
  console.error(`[LOGIN DEBUG] ${roleKey}: URL=${currentUrl}; page title=${visibleTitle}`);
  try {
    await page.screenshot({ path: debugPath, fullPage: true });
    console.error(`[LOGIN DEBUG] Saved ${debugPath}`);
  } catch (error) {
    console.error(`[LOGIN DEBUG] Could not save debug screenshot: ${error.message}`);
  }
}

async function scrollToHeading(page, heading) {
  const target = page.getByRole('heading', { name: heading }).first();
  await target.waitFor();
  await target.scrollIntoViewIfNeeded();
}

async function selectAdminReport(page, reportType) {
  await navigate(page, '/admin/reports');
  await page.locator('select').first().selectOption(reportType);
  await settlePage(page);
}

async function openCreateWorkerModal(page) {
  await navigate(page, '/admin/workers');
  await page.getByRole('button', { name: 'Create Worker' }).click();
  await page.getByRole('heading', { name: 'Create Worker Account' }).waitFor();
}

const publicScreenshots = [
  { folder: 'public', file: '01-landing-page.png', open: (page) => navigate(page, '/') },
  { folder: 'public', file: '02-public-tracking.png', open: (page) => navigate(page, '/track') },
  { folder: 'public', file: '03-login-page.png', open: (page) => navigate(page, '/login') },
  { folder: 'public', file: '04-register-page.png', open: (page) => navigate(page, '/register') },
  { folder: 'public', file: '05-forgot-password-page.png', open: (page) => navigate(page, '/forgot-password') },
  { folder: 'public', file: '06-reset-password-page.png', open: (page) => navigate(page, '/reset-password') },
];

const roleScreenshots = {
  customer: [
    { folder: 'customer', file: '01-customer-overview.png', open: (page) => navigate(page, '/customer') },
    { folder: 'customer', file: '02-create-order-page.png', open: (page) => navigate(page, '/customer/create-order') },
    {
      folder: 'customer',
      file: '03-cost-preview-section.png',
      fullPage: false,
      open: async (page) => {
        await navigate(page, '/customer/create-order');
        await scrollToHeading(page, 'Cost Preview');
      },
    },
    { folder: 'customer', file: '04-my-orders.png', open: (page) => navigate(page, '/customer/orders') },
    { folder: 'customer', file: '05-order-detail.png', open: (page) => openFirstExistingDetail(page, '/customer/orders', '/customer/orders/') },
    {
      folder: 'customer',
      file: '06-order-timeline-status-history.png',
      fullPage: false,
      open: async (page) => {
        await openFirstExistingDetail(page, '/customer/orders', '/customer/orders/');
        await scrollToHeading(page, 'Status Timeline');
      },
    },
    { folder: 'customer', file: '07-customer-tracking.png', open: (page) => navigate(page, '/customer/track') },
    { folder: 'customer', file: '08-my-issues.png', open: (page) => navigate(page, '/issues/my') },
    { folder: 'customer', file: '09-notifications.png', open: (page) => navigate(page, '/notifications') },
  ],
  finance: [
    { folder: 'finance', file: '01-finance-overview.png', open: (page) => navigate(page, '/finance') },
    { folder: 'finance', file: '02-payment-verification.png', open: (page) => navigate(page, '/finance/payment-verification') },
    {
      folder: 'finance',
      file: '03-payment-detail.png',
      open: (page) => openFirstExistingDetailFromListings(
        page,
        ['/finance/payment-verification', '/finance/payment-history', '/finance/outstanding-balances'],
        '/finance/payments/',
      ),
    },
    { folder: 'finance', file: '04-payment-history.png', open: (page) => navigate(page, '/finance/payment-history') },
    { folder: 'finance', file: '05-outstanding-balances.png', open: (page) => navigate(page, '/finance/outstanding-balances') },
    { folder: 'finance', file: '06-finance-reports.png', open: (page) => navigate(page, '/finance/reports') },
  ],
  admin: [
    { folder: 'admin', file: '01-admin-dashboard-overview.png', open: (page) => navigate(page, '/admin') },
    { folder: 'admin', file: '02-orders-management.png', open: (page) => navigate(page, '/admin/orders') },
    { folder: 'admin', file: '03-ready-for-pickup-assignment.png', open: (page) => navigate(page, '/admin/orders/ready-for-pickup') },
    { folder: 'admin', file: '04-ready-for-driver-assignment.png', open: (page) => navigate(page, '/admin/orders/ready-for-driver') },
    { folder: 'admin', file: '05-workers.png', open: (page) => navigate(page, '/admin/workers') },
    { folder: 'admin', file: '06-create-worker-modal.png', open: openCreateWorkerModal },
    { folder: 'admin', file: '07-service-areas.png', open: (page) => navigate(page, '/admin/service-areas') },
    { folder: 'admin', file: '08-pricing-settings.png', open: (page) => navigate(page, '/admin/pricing-settings') },
    { folder: 'admin', file: '09-reports.png', open: (page) => navigate(page, '/admin/reports') },
    { folder: 'admin', file: '10-issue-reports.png', open: (page) => navigate(page, '/admin/issues') },
    { folder: 'admin', file: '11-audit-logs.png', open: (page) => navigate(page, '/admin/audit-logs') },
    { folder: 'admin', file: '12-assignment-history.png', open: (page) => navigate(page, '/admin/assignments') },
  ],
  pickup: [
    { folder: 'pickup', file: '01-pickup-overview.png', open: (page) => navigate(page, '/pickup') },
    { folder: 'pickup', file: '02-assigned-pickups.png', open: (page) => navigate(page, '/pickup/tasks') },
    {
      folder: 'pickup',
      file: '03-pickup-task-detail.png',
      open: (page) => openDetailOrFallback(page, {
        listingRoutes: ['/pickup/tasks', '/pickup/tasks/history'],
        hrefPrefix: '/pickup/tasks/',
        fallbackRoute: '/pickup/tasks',
        skippedMessage: 'Pickup detail skipped because no existing pickup task detail was available.',
      }),
    },
    { folder: 'pickup', file: '04-pickup-history.png', open: (page) => navigate(page, '/pickup/tasks/history') },
  ],
  warehouse: [
    { folder: 'warehouse', file: '01-warehouse-overview.png', open: (page) => navigate(page, '/warehouse') },
    { folder: 'warehouse', file: '02-arrival-queue.png', open: (page) => navigate(page, '/warehouse/arrival-queue') },
    { folder: 'warehouse', file: '03-warehouse-records.png', open: (page) => navigate(page, '/warehouse/records') },
    { folder: 'warehouse', file: '04-ready-for-dispatch.png', open: (page) => navigate(page, '/warehouse/ready-for-dispatch') },
    { folder: 'warehouse', file: '05-warehouse-history.png', open: (page) => navigate(page, '/warehouse/history') },
    {
      folder: 'warehouse',
      file: '06-warehouse-order-detail.png',
      open: (page) => openDetailOrFallback(page, {
        listingRoutes: ['/warehouse/arrival-queue', '/warehouse/records', '/warehouse/ready-for-dispatch', '/warehouse/history'],
        hrefPrefix: '/warehouse/orders/',
        fallbackRoute: '/warehouse/history',
        skippedMessage: 'Warehouse detail skipped because no existing warehouse order detail was available.',
      }),
    },
  ],
  driver: [
    { folder: 'driver', file: '01-driver-overview.png', open: (page) => navigate(page, '/driver') },
    { folder: 'driver', file: '02-assigned-deliveries.png', open: (page) => navigate(page, '/driver/deliveries') },
    {
      folder: 'driver',
      file: '03-delivery-task-detail.png',
      open: (page) => openDetailOrFallback(page, {
        listingRoutes: ['/driver/deliveries', '/driver/deliveries/history'],
        hrefPrefix: '/driver/deliveries/',
        fallbackRoute: '/driver/deliveries',
        unavailableFile: '03-delivery-task-detail-unavailable.png',
        skippedMessage: 'Driver delivery detail unavailable because no existing delivery record was available.',
      }),
    },
    { folder: 'driver', file: '04-delivery-history.png', open: (page) => navigate(page, '/driver/deliveries/history') },
  ],
};

const reportScreenshots = [
  { folder: 'reports', file: '01-admin-daily-summary.png', role: 'admin', open: (page) => selectAdminReport(page, 'daily') },
  { folder: 'reports', file: '02-admin-monthly-summary.png', role: 'admin', open: (page) => selectAdminReport(page, 'monthly') },
  { folder: 'reports', file: '03-completed-deliveries-report.png', role: 'admin', open: (page) => selectAdminReport(page, 'completed') },
  { folder: 'reports', file: '04-warehouse-report.png', role: 'admin', open: (page) => selectAdminReport(page, 'warehouse') },
  { folder: 'reports', file: '05-employee-workload-report.png', role: 'admin', open: (page) => selectAdminReport(page, 'workload') },
  { folder: 'reports', file: '06-rejected-orders-report.png', role: 'admin', open: (page) => selectAdminReport(page, 'rejected') },
  { folder: 'reports', file: '07-finance-revenue-report.png', role: 'finance', open: (page) => navigate(page, '/finance/reports') },
  { folder: 'reports', file: '08-outstanding-balances-report.png', role: 'finance', open: (page) => navigate(page, '/finance/outstanding-balances') },
  { folder: 'reports', file: '09-csv-export-evidence.png', role: 'admin', open: (page) => selectAdminReport(page, 'completed') },
];

const vivaScreenshots = [
  { folder: 'viva', file: '01-public-tracking-evidence.png', role: null, open: (page) => navigate(page, '/track') },
  { folder: 'viva', file: '02-notification-center-evidence.png', role: 'admin', open: (page) => navigate(page, '/notifications') },
  { folder: 'viva', file: '03-audit-log-evidence.png', role: 'admin', open: (page) => navigate(page, '/admin/audit-logs') },
  { folder: 'viva', file: '04-assignment-history-evidence.png', role: 'admin', open: (page) => navigate(page, '/admin/assignments') },
  { folder: 'viva', file: '05-report-export-controls-evidence.png', role: 'admin', open: (page) => selectAdminReport(page, 'completed') },
];

const allDefinitions = [
  ...publicScreenshots,
  ...Object.values(roleScreenshots).flat(),
  ...reportScreenshots,
  ...vivaScreenshots,
];

const failedOnlyRoleScreenshots = {
  pickup: roleScreenshots.pickup,
  warehouse: roleScreenshots.warehouse,
  driver: roleScreenshots.driver.filter((definition) => definition.file === '03-delivery-task-detail.png'),
};

const failedOnlyDefinitions = Object.values(failedOnlyRoleScreenshots).flat();

async function captureRole(page, roleKey, definitions) {
  try {
    await login(page, roleKey);
  } catch (error) {
    await saveLoginDebugEvidence(page, roleKey);
    for (const definition of definitions) {
      const label = `${folders[definition.folder]}/${definition.file}`;
      failedScreenshots.push({ label, reason: `${roleKey} login failed: ${error.message}` });
      console.error(`[FAILED] ${label}: ${roleKey} login failed: ${error.message}`);
    }
    return;
  }
  await captureDefinitions(page, definitions);
}

async function captureGroupedByRole(page, definitions) {
  const publicDefinitions = definitions.filter((definition) => !definition.role);
  if (publicDefinitions.length > 0) {
    await logout(page);
  }
  await captureDefinitions(page, publicDefinitions);

  for (const roleKey of Object.keys(credentials)) {
    const definitionsForRole = definitions.filter((definition) => definition.role === roleKey);
    if (definitionsForRole.length > 0) {
      await captureRole(page, roleKey, definitionsForRole);
    }
  }
}

// Extension point: intentionally isolated because a full lifecycle capture would create and update real records.
export async function captureFullWorkflowEvidence() {
  throw new Error(
    'Full workflow capture is disabled to protect existing dissertation data. Enable it only after implementing it against dedicated disposable records.',
  );
}

function printSummary() {
  console.log('\nScreenshot capture completed.');
  console.log(`Successful count: ${successfulScreenshots.length}`);
  console.log(`Failed count: ${failedScreenshots.length}`);
  if (failedScreenshots.length > 0) {
    console.log('Failed screenshot list:');
    for (const failure of failedScreenshots) {
      console.log(`- ${failure.label}: ${failure.reason}`);
    }
  }
  console.log('Skipped detail list:');
  if (skippedDetails.length === 0) {
    console.log('- None');
  } else {
    for (const skippedDetail of skippedDetails) {
      console.log(`- ${skippedDetail}`);
    }
  }
}

async function main() {
  await createOutputFolders();

  if (dryRun) {
    const plannedDefinitions = failedOnly ? failedOnlyDefinitions : allDefinitions;
    console.log(`Screenshot output: ${outputRoot}`);
    console.log(`Planned screenshots: ${plannedDefinitions.length}`);
    for (const definition of plannedDefinitions) {
      console.log(`- ${folders[definition.folder]}/${definition.file}`);
    }
    console.log('\nDry run completed. No browser was launched and no application data was changed.');
    return;
  }

  let browser;
  try {
    await checkService('Frontend', FRONTEND_URL);
    await checkService('Backend health endpoint', BACKEND_HEALTH_URL);

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: VIEWPORT,
      colorScheme: 'dark',
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(NAVIGATION_TIMEOUT_MS);

    if (failedOnly) {
      for (const [roleKey, definitions] of Object.entries(failedOnlyRoleScreenshots)) {
        await captureRole(page, roleKey, definitions);
      }
    } else if (smokeOnly) {
      await captureDefinitions(page, publicScreenshots);
    } else {
      await captureDefinitions(page, publicScreenshots);

      for (const [roleKey, definitions] of Object.entries(roleScreenshots)) {
        await captureRole(page, roleKey, definitions);
      }

      await captureGroupedByRole(page, reportScreenshots);
      await captureGroupedByRole(page, vivaScreenshots);
    }

    await context.close();
  } catch (error) {
    failedScreenshots.push({ label: 'capture setup', reason: error.message });
    console.error(`[FAILED] capture setup: ${error.message}`);
    if (/executable|browser/i.test(error.message)) {
      console.error('Install Chromium with: npx playwright install chromium');
    }
  } finally {
    await browser?.close().catch(() => {});
    printSummary();
    if (failedScreenshots.length > 0) {
      process.exitCode = 1;
    }
  }
}

await main();
