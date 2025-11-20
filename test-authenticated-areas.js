const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:4200';
const API_URL = 'http://localhost:3000/api';
const SCREENSHOTS_DIR = path.join(__dirname, 'test-screenshots');
const REPORT_FILE = path.join(__dirname, 'test-report.json');

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
    errors: 0
  },
  pages: [],
  errors: [],
  consoleErrors: []
};

// Routes to test (from Settings.routes)
const USER_ROUTES = [
  { path: '/home', name: 'Home', requiresAuth: false },
  { path: '/catalogue', name: 'Catalogue', requiresAuth: false },
  { path: '/my-account/profile', name: 'My Account - Profile', requiresAuth: true },
  { path: '/my-account/purchases', name: 'My Account - Purchases', requiresAuth: true },
  { path: '/my-account/sales', name: 'My Account - Sales', requiresAuth: true },
  { path: '/my-account/favorites', name: 'My Account - Favorites', requiresAuth: true },
  { path: '/my-account/notifications', name: 'My Account - Notifications', requiresAuth: true },
  { path: '/my-account/settings', name: 'My Account - Settings', requiresAuth: true },
  { path: '/sale', name: 'Sale', requiresAuth: true },
  { path: '/product-type', name: 'Product Type', requiresAuth: true },
  { path: '/help/orders', name: 'Help - Orders', requiresAuth: false },
];

async function createTestUser(page) {
  console.log('\n=== Creating/Login Test User ===');

  try {
    // Try to register a new user
    const timestamp = Date.now();
    const testUser = {
      email: `testuser${timestamp}@mercadogamer.test`,
      password: 'Test123456!',
      name: 'Test User',
      username: `testuser${timestamp}`
    };

    console.log('Attempting to register user:', testUser.email);

    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-register-page.png'), fullPage: true });

    // Fill registration form
    const emailInput = await page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = await page.locator('input[type="password"]').first();

    if (await emailInput.count() > 0) {
      await emailInput.fill(testUser.email);
      await passwordInput.fill(testUser.password);

      // Look for name/username fields
      const nameInput = await page.locator('input[name="name"], input[placeholder*="nombre" i]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill(testUser.name);
      }

      const usernameInput = await page.locator('input[name="username"], input[placeholder*="usuario" i]').first();
      if (await usernameInput.count() > 0) {
        await usernameInput.fill(testUser.username);
      }

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-register-filled.png'), fullPage: true });

      // Submit form
      const submitButton = await page.locator('button[type="submit"], button:has-text("Registrar"), button:has-text("Register")').first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-after-register.png'), fullPage: true });
      }
    }

    // Check if we're logged in by looking for token in localStorage
    const token = await page.evaluate(() => {
      return localStorage.getItem('mercadoGamer.token') ||
             localStorage.getItem('token') ||
             sessionStorage.getItem('mercadoGamer.token') ||
             sessionStorage.getItem('token');
    });

    if (token) {
      console.log('Successfully registered and logged in!');
      console.log('Token found:', token.substring(0, 20) + '...');
      return { success: true, user: testUser, token };
    }

    // If registration failed, try to login with existing credentials
    console.log('Registration might have failed, trying to login...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-login-page.png'), fullPage: true });

    // Try common test credentials
    const testCredentials = [
      { email: 'test@test.com', password: 'test123' },
      { email: 'admin@admin.com', password: 'admin123' },
      { email: 'user@test.com', password: 'user123' }
    ];

    for (const cred of testCredentials) {
      console.log(`Trying login with: ${cred.email}`);
      const emailInput = await page.locator('input[type="email"], input[name="email"]').first();
      const passwordInput = await page.locator('input[type="password"]').first();

      if (await emailInput.count() > 0) {
        await emailInput.fill(cred.email);
        await passwordInput.fill(cred.password);

        const submitButton = await page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")').first();
        if (await submitButton.count() > 0) {
          await submitButton.click();
          await page.waitForTimeout(2000);

          const token = await page.evaluate(() => {
            return localStorage.getItem('mercadoGamer.token') || localStorage.getItem('token');
          });

          if (token) {
            console.log('Successfully logged in with:', cred.email);
            return { success: true, user: cred, token };
          }
        }
      }
    }

    return { success: false, error: 'Could not register or login' };

  } catch (error) {
    console.error('Error in createTestUser:', error.message);
    return { success: false, error: error.message };
  }
}

async function testPage(page, route, index) {
  const result = {
    name: route.name,
    path: route.path,
    url: `${BASE_URL}${route.path}`,
    status: 'unknown',
    consoleErrors: [],
    errors: [],
    screenshot: '',
    timestamp: new Date().toISOString()
  };

  testResults.summary.total++;

  console.log(`\n[${index}/${USER_ROUTES.length}] Testing: ${route.name} (${route.path})`);

  try {
    // Collect console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const error = {
          page: route.name,
          text: msg.text(),
          location: msg.location()
        };
        result.consoleErrors.push(error);
        testResults.consoleErrors.push(error);
      }
    });

    // Collect page errors
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
    const response = await page.goto(`${BASE_URL}${route.path}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait a bit for dynamic content
    await page.waitForTimeout(2000);

    // Check if redirected to login
    const currentUrl = page.url();
    if (currentUrl.includes('/login') && route.requiresAuth) {
      result.status = 'requires_auth_redirected';
      result.errors.push({ message: 'Redirected to login (expected for authenticated route)' });
    } else if (currentUrl.includes('/login') && !route.requiresAuth) {
      result.status = 'unexpected_redirect';
      result.errors.push({ message: 'Unexpectedly redirected to login' });
    } else {
      result.status = response.ok() ? 'passed' : 'failed';
    }

    // Take screenshot
    const screenshotName = `${String(index).padStart(2, '0')}-${route.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    result.screenshot = screenshotPath;

    console.log(`  Status: ${result.status}`);
    console.log(`  Screenshot: ${screenshotName}`);

    // Check for common elements
    const bodyText = await page.textContent('body').catch(() => '');
    if (bodyText.toLowerCase().includes('error') || bodyText.toLowerCase().includes('erro')) {
      result.errors.push({ message: 'Page contains error text' });
    }

    // Test forms if present
    const forms = await page.locator('form').count();
    if (forms > 0) {
      console.log(`  Found ${forms} form(s)`);
      result.forms = forms;

      // Test buttons
      const buttons = await page.locator('button').count();
      console.log(`  Found ${buttons} button(s)`);
      result.buttons = buttons;
    }

    // Test navigation links
    const links = await page.locator('a').count();
    console.log(`  Found ${links} link(s)`);
    result.links = links;

    if (result.status === 'passed' && result.errors.length === 0 && result.consoleErrors.length === 0) {
      testResults.summary.passed++;
    } else if (result.errors.length > 0 || result.consoleErrors.length > 0) {
      testResults.summary.errors++;
    } else {
      testResults.summary.failed++;
    }

  } catch (error) {
    console.error(`  ERROR: ${error.message}`);
    result.status = 'error';
    result.errors.push({ message: error.message, stack: error.stack });
    testResults.summary.failed++;

    // Try to take screenshot even on error
    try {
      const screenshotName = `${String(index).padStart(2, '0')}-${route.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-ERROR.png`;
      const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = screenshotPath;
    } catch (e) {
      console.error('  Could not take error screenshot:', e.message);
    }
  }

  testResults.pages.push(result);
  return result;
}

async function checkDatabase(page) {
  console.log('\n=== Checking Database ===');

  try {
    // Use page.evaluate to make API calls from browser context
    const healthData = await page.evaluate(async (apiUrl) => {
      try {
        const response = await fetch(`${apiUrl}/health`);
        return await response.json();
      } catch (e) {
        return { error: e.message };
      }
    }, API_URL);

    console.log('Health endpoint:', JSON.stringify(healthData, null, 2));

  } catch (error) {
    console.error('Database check error:', error.message);
  }
}

async function testAdminArea(page) {
  console.log('\n=== Testing Admin Area ===');

  const adminRoutes = [
    '/admin',
    '/admin/dashboard',
    '/admin/users',
    '/admin/products',
    '/admin/orders'
  ];

  for (let i = 0; i < adminRoutes.length; i++) {
    const route = {
      path: adminRoutes[i],
      name: `Admin - ${adminRoutes[i].split('/').pop() || 'Dashboard'}`,
      requiresAuth: true
    };

    await testPage(page, route, USER_ROUTES.length + i + 1);
  }
}

async function generateReport() {
  console.log('\n=== Generating Report ===');

  // Save JSON report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(testResults, null, 2));
  console.log(`JSON Report saved to: ${REPORT_FILE}`);

  // Generate HTML report
  const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <title>MercadoGamer Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    .summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .summary-item { display: inline-block; margin: 10px 20px; }
    .summary-item .label { font-weight: bold; display: block; }
    .summary-item .value { font-size: 24px; }
    .passed { color: #4caf50; }
    .failed { color: #f44336; }
    .errors { color: #ff9800; }
    .page-result { background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #ccc; }
    .page-result.passed { border-left-color: #4caf50; }
    .page-result.failed { border-left-color: #f44336; }
    .page-result.errors { border-left-color: #ff9800; }
    .error-list { background: #ffebee; padding: 10px; margin: 10px 0; border-radius: 4px; }
    .console-error { background: #fff3e0; padding: 10px; margin: 10px 0; border-radius: 4px; }
    .screenshot { max-width: 100%; margin: 10px 0; }
    .metadata { font-size: 12px; color: #666; }
    pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>MercadoGamer - Test Report</h1>
  <div class="metadata">Generated: ${testResults.timestamp}</div>

  <div class="summary">
    <h2>Summary</h2>
    <div class="summary-item">
      <span class="label">Total Tests</span>
      <span class="value">${testResults.summary.total}</span>
    </div>
    <div class="summary-item passed">
      <span class="label">Passed</span>
      <span class="value">${testResults.summary.passed}</span>
    </div>
    <div class="summary-item failed">
      <span class="label">Failed</span>
      <span class="value">${testResults.summary.failed}</span>
    </div>
    <div class="summary-item errors">
      <span class="label">With Errors</span>
      <span class="value">${testResults.summary.errors}</span>
    </div>
  </div>

  <h2>Page Results</h2>
  ${testResults.pages.map(page => `
    <div class="page-result ${page.status === 'passed' && page.errors.length === 0 && page.consoleErrors.length === 0 ? 'passed' : page.errors.length > 0 || page.consoleErrors.length > 0 ? 'errors' : 'failed'}">
      <h3>${page.name}</h3>
      <div><strong>URL:</strong> ${page.url}</div>
      <div><strong>Status:</strong> ${page.status}</div>
      ${page.forms ? `<div><strong>Forms:</strong> ${page.forms}</div>` : ''}
      ${page.buttons ? `<div><strong>Buttons:</strong> ${page.buttons}</div>` : ''}
      ${page.links ? `<div><strong>Links:</strong> ${page.links}</div>` : ''}

      ${page.errors.length > 0 ? `
        <div class="error-list">
          <strong>Errors (${page.errors.length}):</strong>
          ${page.errors.map(err => `
            <div>
              <strong>Message:</strong> ${err.message || err.text}<br>
              ${err.stack ? `<pre>${err.stack}</pre>` : ''}
              ${err.location ? `<strong>Location:</strong> ${JSON.stringify(err.location)}` : ''}
            </div>
          `).join('<hr>')}
        </div>
      ` : ''}

      ${page.consoleErrors.length > 0 ? `
        <div class="console-error">
          <strong>Console Errors (${page.consoleErrors.length}):</strong>
          ${page.consoleErrors.map(err => `
            <div>
              ${err.text}<br>
              ${err.location ? `<strong>Location:</strong> ${JSON.stringify(err.location)}` : ''}
            </div>
          `).join('<hr>')}
        </div>
      ` : ''}

      ${page.screenshot ? `
        <div>
          <strong>Screenshot:</strong><br>
          <img src="${path.relative(path.dirname(REPORT_FILE), page.screenshot)}" class="screenshot">
        </div>
      ` : ''}
    </div>
  `).join('')}

  ${testResults.consoleErrors.length > 0 ? `
    <h2>All Console Errors (${testResults.consoleErrors.length})</h2>
    <div class="console-error">
      ${testResults.consoleErrors.map(err => `
        <div>
          <strong>Page:</strong> ${err.page}<br>
          <strong>Error:</strong> ${err.text}<br>
          ${err.location ? `<strong>Location:</strong> ${JSON.stringify(err.location)}` : ''}
        </div>
      `).join('<hr>')}
    </div>
  ` : ''}

  ${testResults.errors.length > 0 ? `
    <h2>All Page Errors (${testResults.errors.length})</h2>
    <div class="error-list">
      ${testResults.errors.map(err => `
        <div>
          <strong>Page:</strong> ${err.page}<br>
          <strong>Error:</strong> ${err.message}<br>
          ${err.stack ? `<pre>${err.stack}</pre>` : ''}
        </div>
      `).join('<hr>')}
    </div>
  ` : ''}
</body>
</html>
  `;

  const htmlReportFile = path.join(__dirname, 'test-report.html');
  fs.writeFileSync(htmlReportFile, htmlReport);
  console.log(`HTML Report saved to: ${htmlReportFile}`);

  // Print summary to console
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
  console.log(`With Errors: ${testResults.summary.errors}`);
  console.log(`Console Errors: ${testResults.consoleErrors.length}`);
  console.log(`Page Errors: ${testResults.errors.length}`);
}

async function main() {
  console.log('=== MercadoGamer Authenticated Areas Test ===');
  console.log(`Frontend: ${BASE_URL}`);
  console.log(`Backend: ${API_URL}`);
  console.log(`Screenshots: ${SCREENSHOTS_DIR}`);

  let browser;
  try {
    // Launch browser
    console.log('\nLaunching browser...');
    browser = await chromium.launch({
      headless: false,
      slowMo: 100
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: {
        dir: path.join(__dirname, 'test-videos'),
        size: { width: 1920, height: 1080 }
      }
    });

    const page = await context.newPage();

    // Check database
    await checkDatabase(page);

    // Try to create/login user
    const authResult = await createTestUser(page);

    if (authResult.success) {
      console.log('\n=== Authentication successful! Testing authenticated pages... ===');
    } else {
      console.log('\n=== Could not authenticate. Testing public pages only... ===');
    }

    // Test all user routes
    for (let i = 0; i < USER_ROUTES.length; i++) {
      await testPage(page, USER_ROUTES[i], i + 1);
    }

    // Try to test admin area
    if (authResult.success) {
      await testAdminArea(page);
    }

    // Generate report
    await generateReport();

    console.log('\n=== Test Complete ===');
    console.log(`Open ${path.join(__dirname, 'test-report.html')} in your browser to view the full report.`);

    // Keep browser open for manual inspection
    console.log('\nBrowser will remain open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

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
