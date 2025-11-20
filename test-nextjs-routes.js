const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:4200';
const API_URL = 'http://localhost:3000/api';
const SCREENSHOTS_DIR = path.join(__dirname, 'test-screenshots-nextjs');
const REPORT_FILE = path.join(__dirname, 'test-report-nextjs.json');

// Create screenshots directory
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    blocked: 0,
    requiresAuth: 0
  },
  authentication: {
    attempted: false,
    success: false,
    method: null,
    errors: []
  },
  pages: [],
  errors: [],
  consoleErrors: []
};

// Next.js Routes (correct ones based on pages directory)
const PUBLIC_ROUTES = [
  { path: '/', name: 'Home', requiresAuth: false },
  { path: '/catalogo', name: 'Catalogo', requiresAuth: false },
  { path: '/cart', name: 'Carrinho', requiresAuth: false },
  { path: '/help-center', name: 'Central de Ajuda', requiresAuth: false },
  { path: '/vendedores', name: 'Vendedores', requiresAuth: false },
  { path: '/regalos', name: 'Presentes/Regalos', requiresAuth: false },
  { path: '/info-venta', name: 'Info Venda', requiresAuth: false },
];

const AUTHENTICATED_ROUTES = [
  { path: '/dashboard/profile', name: 'Dashboard - Perfil', requiresAuth: true },
  { path: '/dashboard/order', name: 'Dashboard - Pedidos', requiresAuth: true },
  { path: '/dashboard/sale', name: 'Dashboard - Vendas', requiresAuth: true },
  { path: '/dashboard/inventory', name: 'Dashboard - Inventario', requiresAuth: true },
  { path: '/dashboard/balance', name: 'Dashboard - Saldo', requiresAuth: true },
  { path: '/dashboard/qas', name: 'Dashboard - Perguntas', requiresAuth: true },
  { path: '/dashboard/question', name: 'Dashboard - Questoes', requiresAuth: true },
  { path: '/dashboard/store', name: 'Dashboard - Loja', requiresAuth: true },
  { path: '/dashboard/support', name: 'Dashboard - Suporte', requiresAuth: true },
  { path: '/checkout', name: 'Checkout', requiresAuth: true },
  { path: '/purchase', name: 'Compra', requiresAuth: true },
];

const ADMIN_ROUTES = [
  { path: '/admin', name: 'Admin - Dashboard', requiresAuth: true, admin: true },
  { path: '/admin/users', name: 'Admin - Usuarios', requiresAuth: true, admin: true },
  { path: '/admin/earnings', name: 'Admin - Ganhos', requiresAuth: true, admin: true },
  { path: '/admin/loads', name: 'Admin - Cargas', requiresAuth: true, admin: true },
  { path: '/admin/ventas', name: 'Admin - Vendas', requiresAuth: true, admin: true },
  { path: '/admin/roullet', name: 'Admin - Roleta', requiresAuth: true, admin: true },
  { path: '/admin/login', name: 'Admin - Login', requiresAuth: false, admin: true },
];

async function testPage(page, route, index, totalRoutes) {
  const result = {
    name: route.name,
    path: route.path,
    url: `${BASE_URL}${route.path}`,
    requiresAuth: route.requiresAuth || false,
    isAdmin: route.admin || false,
    status: 'unknown',
    httpStatus: null,
    consoleErrors: [],
    consoleWarnings: [],
    errors: [],
    screenshot: '',
    timestamp: new Date().toISOString(),
    pageInfo: {}
  };

  testResults.summary.total++;

  console.log(`\n[${index}/${totalRoutes}] Testing: ${route.name}`);
  console.log(`    URL: ${route.path}`);

  try {
    // Setup console listeners
    const consoleMessages = [];
    page.on('console', msg => {
      const msgType = msg.type();
      const text = msg.text();
      consoleMessages.push({ type: msgType, text });

      if (msgType === 'error') {
        const error = {
          page: route.name,
          text: text,
          location: msg.location()
        };
        result.consoleErrors.push(error);
        testResults.consoleErrors.push(error);
      } else if (msgType === 'warning') {
        result.consoleWarnings.push({
          text: text,
          location: msg.location()
        });
      }
    });

    // Setup error listeners
    page.on('pageerror', error => {
      const err = {
        page: route.name,
        message: error.message,
        stack: error.stack
      };
      result.errors.push(err);
      testResults.errors.push(err);
    });

    // Navigate to page
    console.log(`    Navigating...`);
    const response = await page.goto(`${BASE_URL}${route.path}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    }).catch(err => {
      console.log(`    Navigation error: ${err.message}`);
      return null;
    });

    if (response) {
      result.httpStatus = response.status();
      console.log(`    HTTP Status: ${result.httpStatus}`);
    }

    // Wait for page to settle
    await page.waitForTimeout(3000);

    // Get current URL (check for redirects)
    const currentUrl = page.url();
    const wasRedirected = currentUrl !== `${BASE_URL}${route.path}`;

    if (wasRedirected) {
      result.redirectedTo = currentUrl;
      console.log(`    Redirected to: ${currentUrl}`);

      // Check if redirected to login
      if (currentUrl.includes('/login') || currentUrl.includes('/ingresar')) {
        result.status = 'requires_auth';
        testResults.summary.requiresAuth++;
        console.log(`    Status: REQUIRES AUTHENTICATION`);
      } else {
        result.status = 'redirected';
        console.log(`    Status: REDIRECTED`);
      }
    } else if (result.httpStatus === 404) {
      result.status = 'not_found';
      testResults.summary.failed++;
      console.log(`    Status: NOT FOUND (404)`);
    } else if (result.httpStatus >= 200 && result.httpStatus < 300) {
      result.status = 'loaded';
      testResults.summary.passed++;
      console.log(`    Status: LOADED SUCCESSFULLY`);
    } else {
      result.status = 'error';
      testResults.summary.failed++;
      console.log(`    Status: ERROR (HTTP ${result.httpStatus})`);
    }

    // Get page title
    result.pageInfo.title = await page.title().catch(() => 'N/A');
    console.log(`    Page Title: ${result.pageInfo.title}`);

    // Check for common elements
    const bodyText = await page.textContent('body').catch(() => '');

    // Check if it's showing 404 page
    const is404Page = bodyText.includes('404') ||
                      bodyText.includes('not found') ||
                      bodyText.includes('não encontrado') ||
                      result.pageInfo.title.toLowerCase().includes('404');

    if (is404Page && result.status !== 'not_found') {
      result.status = 'not_found';
      result.pageInfo.showing404 = true;
      console.log(`    Detected: 404 Page Content`);
    }

    // Count elements
    result.pageInfo.forms = await page.locator('form').count();
    result.pageInfo.buttons = await page.locator('button').count();
    result.pageInfo.links = await page.locator('a').count();
    result.pageInfo.inputs = await page.locator('input').count();

    console.log(`    Elements: ${result.pageInfo.forms} forms, ${result.pageInfo.buttons} buttons, ${result.pageInfo.links} links`);

    // Take screenshot
    const screenshotName = `${String(index).padStart(3, '0')}-${route.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    result.screenshot = screenshotPath;
    console.log(`    Screenshot: ${screenshotName}`);

    // Summary of console messages
    const errorCount = result.consoleErrors.length;
    const warningCount = result.consoleWarnings.length;
    if (errorCount > 0 || warningCount > 0) {
      console.log(`    Console: ${errorCount} errors, ${warningCount} warnings`);
    }

  } catch (error) {
    console.error(`    FATAL ERROR: ${error.message}`);
    result.status = 'error';
    result.errors.push({ message: error.message, stack: error.stack });
    testResults.summary.failed++;

    // Try to take error screenshot
    try {
      const screenshotName = `${String(index).padStart(3, '0')}-${route.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-ERROR.png`;
      const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = screenshotPath;
    } catch (e) {
      console.error(`    Could not capture error screenshot: ${e.message}`);
    }
  }

  testResults.pages.push(result);
  return result;
}

async function attemptLogin(page) {
  console.log('\n=== ATTEMPTING USER AUTHENTICATION ===\n');
  testResults.authentication.attempted = true;

  try {
    // Try to navigate to home first
    console.log('Navigating to homepage...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '000-homepage.png'), fullPage: true });

    // Look for login button/link
    console.log('Looking for login button...');
    const loginButton = await page.locator('button:has-text("Ingresar"), a:has-text("Ingresar"), button:has-text("Login"), a:has-text("Login")').first();

    if (await loginButton.count() > 0) {
      console.log('Found login button, clicking...');
      await loginButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '000-login-page.png'), fullPage: true });

      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);

      // Try to fill login form
      const emailInput = await page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
      const passwordInput = await page.locator('input[type="password"]').first();

      if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
        console.log('Found login form...');

        // Try some test credentials
        const testCredentials = [
          { email: 'test@test.com', password: 'test123' },
          { email: 'admin@admin.com', password: 'admin123' },
          { email: 'user@user.com', password: 'user123' },
        ];

        for (const cred of testCredentials) {
          console.log(`Trying credentials: ${cred.email}`);

          await emailInput.fill(cred.email);
          await passwordInput.fill(cred.password);

          const submitButton = await page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")').first();
          if (await submitButton.count() > 0) {
            await submitButton.click();
            await page.waitForTimeout(3000);

            // Check if logged in
            const newUrl = page.url();
            const hasToken = await page.evaluate(() => {
              return !!( localStorage.getItem('token') ||
                        localStorage.getItem('mercadoGamer.token') ||
                        localStorage.getItem('authToken') ||
                        sessionStorage.getItem('token') );
            });

            if (hasToken || (!newUrl.includes('login') && !newUrl.includes('ingresar'))) {
              console.log('LOGIN SUCCESS!');
              testResults.authentication.success = true;
              testResults.authentication.method = 'form_login';
              testResults.authentication.credentials = { email: cred.email, password: '[REDACTED]' };
              await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '000-logged-in.png'), fullPage: true });
              return true;
            }
          }

          // Reset form for next attempt
          await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
          await loginButton.click();
          await page.waitForTimeout(1000);
        }

        console.log('All login attempts failed');
        testResults.authentication.errors.push('All credential combinations failed');
      } else {
        console.log('Login form not found or incomplete');
        testResults.authentication.errors.push('Login form not found');
      }
    } else {
      console.log('Login button not found');
      testResults.authentication.errors.push('Login button not found');
    }

    return false;

  } catch (error) {
    console.error(`Authentication error: ${error.message}`);
    testResults.authentication.errors.push(error.message);
    return false;
  }
}

async function generateReport() {
  console.log('\n=== GENERATING REPORT ===\n');

  // Calculate statistics
  const stats = {
    total: testResults.summary.total,
    passed: testResults.summary.passed,
    failed: testResults.summary.failed,
    requiresAuth: testResults.summary.requiresAuth,
    passRate: testResults.summary.total > 0
      ? ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(2)
      : 0
  };

  // Save JSON report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(testResults, null, 2));
  console.log(`JSON Report: ${REPORT_FILE}`);

  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Pages Tested: ${stats.total}`);
  console.log(`Loaded Successfully: ${stats.passed} (${stats.passRate}%)`);
  console.log(`Failed/Not Found: ${stats.failed}`);
  console.log(`Requires Authentication: ${stats.requiresAuth}`);
  console.log(`Console Errors: ${testResults.consoleErrors.length}`);
  console.log(`Page Errors: ${testResults.errors.length}`);
  console.log(`Authentication: ${testResults.authentication.success ? 'SUCCESS' : 'FAILED'}`);

  // Detailed breakdown
  console.log('\n=== PAGE STATUS BREAKDOWN ===');
  const statusCounts = {};
  testResults.pages.forEach(page => {
    statusCounts[page.status] = (statusCounts[page.status] || 0) + 1;
  });
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`${status}: ${count}`);
  });

  // List pages by status
  console.log('\n=== PAGES BY STATUS ===');
  console.log('\nLOADED SUCCESSFULLY:');
  testResults.pages.filter(p => p.status === 'loaded').forEach(p => {
    console.log(`  - ${p.name} (${p.path})`);
  });

  console.log('\nNOT FOUND (404):');
  testResults.pages.filter(p => p.status === 'not_found').forEach(p => {
    console.log(`  - ${p.name} (${p.path})`);
  });

  console.log('\nREQUIRES AUTHENTICATION:');
  testResults.pages.filter(p => p.status === 'requires_auth').forEach(p => {
    console.log(`  - ${p.name} (${p.path})`);
  });

  console.log('\nERRORS:');
  testResults.pages.filter(p => p.status === 'error').forEach(p => {
    console.log(`  - ${p.name} (${p.path})`);
    p.errors.forEach(err => console.log(`    * ${err.message}`));
  });

  // Common errors
  if (testResults.consoleErrors.length > 0) {
    console.log('\n=== COMMON CONSOLE ERRORS ===');
    const errorTexts = {};
    testResults.consoleErrors.forEach(err => {
      const key = err.text.substring(0, 100);
      errorTexts[key] = (errorTexts[key] || 0) + 1;
    });
    Object.entries(errorTexts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([text, count]) => {
        console.log(`  [${count}x] ${text}...`);
      });
  }
}

async function main() {
  console.log('=== MERCADOGAMER NEXT.JS ROUTES TEST ===');
  console.log(`Frontend: ${BASE_URL}`);
  console.log(`Backend: ${API_URL}`);
  console.log(`Screenshots: ${SCREENSHOTS_DIR}\n`);

  let browser;
  try {
    // Launch browser
    console.log('Launching browser...');
    browser = await chromium.launch({
      headless: false,
      slowMo: 50
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Test public routes first
    console.log('\n=== TESTING PUBLIC ROUTES ===');
    let index = 1;
    const allRoutes = [...PUBLIC_ROUTES];

    for (const route of PUBLIC_ROUTES) {
      await testPage(page, route, index++, allRoutes.length);
    }

    // Attempt to authenticate
    const isAuthenticated = await attemptLogin(page);

    // Test authenticated routes
    console.log('\n=== TESTING AUTHENTICATED ROUTES ===');
    const authRoutes = [...AUTHENTICATED_ROUTES];
    for (let i = 0; i < authRoutes.length; i++) {
      await testPage(page, authRoutes[i], index++, allRoutes.length + authRoutes.length);
    }

    // Test admin routes if authenticated
    console.log('\n=== TESTING ADMIN ROUTES ===');
    for (let i = 0; i < ADMIN_ROUTES.length; i++) {
      await testPage(page, ADMIN_ROUTES[i], index++, allRoutes.length + authRoutes.length + ADMIN_ROUTES.length);
    }

    // Generate report
    await generateReport();

    console.log('\n=== TEST COMPLETE ===');
    console.log(`\nView results:`);
    console.log(`- JSON: ${REPORT_FILE}`);
    console.log(`- Screenshots: ${SCREENSHOTS_DIR}`);

    // Keep browser open
    console.log('\nBrowser will remain open for 20 seconds for inspection...');
    await page.waitForTimeout(20000);

  } catch (error) {
    console.error('Fatal error:', error);
    testResults.errors.push({
      page: 'main',
      message: error.message,
      stack: error.stack
    });
    await generateReport();
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
