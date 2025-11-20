const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:4200';
const API_URL = 'http://localhost:3000/api';
const SCREENSHOTS_DIR = path.join(__dirname, 'test-screenshots-dashboard');
const REPORT_FILE = path.join(__dirname, 'test-dashboard-report.json');

// Create screenshots directory
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Test results
const testResults = {
  timestamp: new Date().toISOString(),
  authMethod: 'api',
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  },
  pages: [],
  errors: []
};

// Dashboard pages to test
const DASHBOARD_PAGES = [
  { path: '/dashboard/balance', name: 'Balance', category: 'BALANCE' },
  { path: '/dashboard/order', name: 'Compras', category: 'COMPRAS' },
  { path: '/dashboard/qas', name: 'Mis preguntas', category: 'COMPRAS' },
  { path: '/dashboard/sale', name: 'Ventas', category: 'VENTAS' },
  { path: '/dashboard/inventory', name: 'Productos', category: 'VENTAS' },
  { path: '/dashboard/question', name: 'Consultas', category: 'VENTAS' },
  { path: '/dashboard/store', name: 'Tienda', category: 'VENTAS' },
  { path: '/dashboard/profile', name: 'Mi perfil', category: 'CONFIGURACIÓN' },
  { path: '/dashboard/support', name: 'Soporte', category: 'CONFIGURACIÓN' }
];

async function createUserViaAPI() {
  console.log('\n=== Creating User via API ===');

  const timestamp = Date.now();
  const testUser = {
    email: `testuser${timestamp}@test.com`,
    password: 'Test123456!',
    name: 'Test User Dashboard',
    username: `testuser${timestamp}`
  };

  try {
    // Try to register
    console.log('Attempting to register:', testUser.email);

    const registerData = {
      username: testUser.username,
      emailAddress: testUser.email,
      password: testUser.password,
      role: 'user',
      enabled: true
    };

    const registerResponse = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });

    if (!registerResponse.ok) {
      console.log('Registration failed:', registerResponse.status, registerResponse.statusText);
      const errorText = await registerResponse.text();
      console.log('Error details:', errorText);
    } else {
      const registerData = await registerResponse.json();
      console.log('Registration response:', registerData);
    }

    // Try to login
    console.log('Attempting to login...');

    const loginResponse = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUser.email,
        password: testUser.password
      })
    });

    if (!loginResponse.ok) {
      console.log('Login failed:', loginResponse.status, loginResponse.statusText);

      // Try with common test credentials
      const testCredentials = [
        { email: 'test@test.com', password: 'test123' },
        { email: 'admin@admin.com', password: 'admin123' },
        { email: 'user@test.com', password: 'user123' }
      ];

      for (const cred of testCredentials) {
        console.log(`Trying to login with: ${cred.email}`);
        const tryLoginResponse = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: cred.email,
            password: cred.password
          })
        });

        if (tryLoginResponse.ok) {
          const loginData = await tryLoginResponse.json();
          console.log('✅ Login successful with test credential');
          return { success: true, user: cred, token: loginData.token || loginData.accessToken || loginData.data?.token };
        }
      }

      return { success: false, error: 'Could not login with any credentials' };
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful!');

    const token = loginData.token || loginData.accessToken || loginData.data?.token;

    return { success: true, user: testUser, token };

  } catch (error) {
    console.error('API Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testDashboardPage(page, dashPage, index) {
  const result = {
    name: dashPage.name,
    path: dashPage.path,
    category: dashPage.category,
    status: 'unknown',
    screenshot: '',
    errors: [],
    warnings: [],
    elements: {}
  };

  testResults.summary.total++;

  console.log(`\n[${index}/${DASHBOARD_PAGES.length}] Testing: ${dashPage.name}`);
  console.log(`  Path: ${dashPage.path}`);

  try {
    // Navigate
    await page.goto(`${BASE_URL}${dashPage.path}`, {
      waitUntil: 'commit',
      timeout: 15000
    });

    await page.waitForTimeout(3000);

    // Check if redirected to login
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      result.status = 'failed';
      result.errors.push('Redirected to login - authentication may have failed');
      testResults.summary.failed++;
    } else {
      result.status = 'passed';
      testResults.summary.passed++;
    }

    // Take screenshot
    const screenshotName = `${String(index).padStart(2, '0')}-${dashPage.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    result.screenshot = screenshotName;

    // Count elements
    result.elements = {
      forms: await page.locator('form').count(),
      buttons: await page.locator('button').count(),
      links: await page.locator('a').count(),
      inputs: await page.locator('input').count(),
      tables: await page.locator('table').count()
    };

    console.log(`  Status: ${result.status}`);
    console.log(`  Elements: ${result.elements.forms} forms, ${result.elements.buttons} buttons, ${result.elements.links} links`);

    // Check for error messages
    const bodyText = await page.textContent('body').catch(() => '');
    if (bodyText.includes('404') || bodyText.includes('Not Found') || bodyText.includes('Não encontrado')) {
      result.warnings.push('Page may not exist (404)');
      testResults.summary.warnings++;
    }
    if (bodyText.includes('Error') || bodyText.includes('Erro')) {
      result.warnings.push('Page contains error text');
      testResults.summary.warnings++;
    }

  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
    result.status = 'error';
    result.errors.push(error.message);
    testResults.summary.failed++;

    // Try to take error screenshot
    try {
      const screenshotName = `${String(index).padStart(2, '0')}-${dashPage.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-ERROR.png`;
      const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = screenshotName;
    } catch (e) {
      console.log(`  Could not take error screenshot`);
    }
  }

  testResults.pages.push(result);
  return result;
}

async function generateReport() {
  console.log('\n=== Generating Report ===');

  // Save JSON
  fs.writeFileSync(REPORT_FILE, JSON.stringify(testResults, null, 2));
  console.log(`JSON Report: ${REPORT_FILE}`);

  // Generate HTML
  const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Dashboard Test Report - ${testResults.timestamp}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f7fa;
      color: #2c3e50;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 { margin-bottom: 5px; color: #2c3e50; }
    .timestamp { color: #7f8c8d; font-size: 14px; margin-bottom: 30px; }

    .summary {
      background: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
    }
    .summary-item { text-align: center; padding: 15px; border-radius: 8px; background: #f8f9fa; }
    .summary-item .label {
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #7f8c8d;
      margin-bottom: 8px;
    }
    .summary-item .value { font-size: 36px; font-weight: 700; }
    .summary-item.total .value { color: #3498db; }
    .summary-item.passed .value { color: #27ae60; }
    .summary-item.failed .value { color: #e74c3c; }
    .summary-item.warnings .value { color: #f39c12; }

    .category-section { margin-bottom: 40px; }
    .category-title {
      font-size: 22px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 3px solid #3498db;
    }

    .page-card {
      background: white;
      padding: 25px;
      margin-bottom: 20px;
      border-radius: 8px;
      border-left: 5px solid #bdc3c7;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .page-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .page-card.passed { border-left-color: #27ae60; }
    .page-card.failed { border-left-color: #e74c3c; }
    .page-card.error { border-left-color: #f39c12; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .page-title { font-size: 20px; font-weight: 600; margin: 0; }
    .page-path { font-size: 13px; color: #7f8c8d; font-family: monospace; }

    .status-badge {
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-badge.passed { background: #d4edda; color: #155724; }
    .status-badge.failed { background: #f8d7da; color: #721c24; }
    .status-badge.error { background: #fff3cd; color: #856404; }

    .elements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 10px;
      margin: 15px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
    }
    .element-count {
      text-align: center;
      padding: 10px;
      background: white;
      border-radius: 4px;
    }
    .element-count .num { font-size: 24px; font-weight: 700; color: #3498db; display: block; }
    .element-count .label { font-size: 11px; color: #7f8c8d; text-transform: uppercase; }

    .warnings, .errors {
      padding: 15px;
      margin: 15px 0;
      border-radius: 6px;
    }
    .warnings {
      background: #fff3cd;
      border-left: 4px solid #f39c12;
    }
    .errors {
      background: #f8d7da;
      border-left: 4px solid #e74c3c;
    }
    .warnings strong, .errors strong { display: block; margin-bottom: 8px; }
    .warnings li, .errors li { margin: 5px 0; }

    .screenshot {
      max-width: 100%;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      transition: transform 0.2s;
    }
    .screenshot:hover { transform: scale(1.02); }

    pre {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎮 MercadoGamer - Dashboard Test Report</h1>
    <div class="timestamp">Generated: ${new Date(testResults.timestamp).toLocaleString()}</div>

    <div class="summary">
      <div class="summary-item total">
        <div class="label">Total Tests</div>
        <div class="value">${testResults.summary.total}</div>
      </div>
      <div class="summary-item passed">
        <div class="label">Passed</div>
        <div class="value">${testResults.summary.passed}</div>
      </div>
      <div class="summary-item failed">
        <div class="label">Failed</div>
        <div class="value">${testResults.summary.failed}</div>
      </div>
      <div class="summary-item warnings">
        <div class="label">Warnings</div>
        <div class="value">${testResults.summary.warnings}</div>
      </div>
    </div>

    ${Object.entries(
      testResults.pages.reduce((acc, page) => {
        if (!acc[page.category]) acc[page.category] = [];
        acc[page.category].push(page);
        return acc;
      }, {})
    ).map(([category, pages]) => `
      <div class="category-section">
        <div class="category-title">${category}</div>
        ${pages.map(page => `
          <div class="page-card ${page.status}">
            <div class="page-header">
              <div>
                <div class="page-title">${page.name}</div>
                <div class="page-path">${page.path}</div>
              </div>
              <div class="status-badge ${page.status}">${page.status}</div>
            </div>

            ${page.elements && Object.keys(page.elements).length > 0 ? `
              <div class="elements-grid">
                ${Object.entries(page.elements).map(([key, value]) => `
                  <div class="element-count">
                    <span class="num">${value}</span>
                    <span class="label">${key}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${page.warnings && page.warnings.length > 0 ? `
              <div class="warnings">
                <strong>⚠️ Warnings (${page.warnings.length})</strong>
                <ul>
                  ${page.warnings.map(w => `<li>${w}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${page.errors && page.errors.length > 0 ? `
              <div class="errors">
                <strong>❌ Errors (${page.errors.length})</strong>
                <ul>
                  ${page.errors.map(e => `<li>${e}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${page.screenshot ? `
              <div>
                <strong>Screenshot:</strong><br>
                <img src="${path.relative(path.dirname(REPORT_FILE), path.join(SCREENSHOTS_DIR, page.screenshot))}"
                     class="screenshot"
                     onclick="window.open(this.src, '_blank')"
                     title="Click to open in new tab">
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `).join('')}
  </div>
</body>
</html>
  `;

  const htmlFile = path.join(__dirname, 'test-dashboard-report.html');
  fs.writeFileSync(htmlFile, htmlReport);
  console.log(`HTML Report: ${htmlFile}`);

  // Console summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total: ${testResults.summary.total}`);
  console.log(`✅ Passed: ${testResults.summary.passed}`);
  console.log(`❌ Failed: ${testResults.summary.failed}`);
  console.log(`⚠️  Warnings: ${testResults.summary.warnings}`);
}

async function main() {
  console.log('==============================================');
  console.log('  MercadoGamer Dashboard Test (Automated)');
  console.log('==============================================');
  console.log(`Frontend: ${BASE_URL}`);
  console.log(`Backend API: ${API_URL}`);
  console.log(`Screenshots: ${SCREENSHOTS_DIR}`);

  let browser;
  try {
    // Step 1: Create/login user via API
    const authResult = await createUserViaAPI();

    if (!authResult.success) {
      console.error('\n❌ Authentication failed!');
      console.error('Error:', authResult.error);
      console.log('\nNote: The test will continue but may fail on protected pages.');
    }

    // Step 2: Launch browser
    console.log('\n=== Launching Browser ===');
    browser = await chromium.launch({
      headless: false,
      slowMo: 50
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Step 3: Navigate to home and inject token
    if (authResult.success && authResult.token) {
      console.log('\n=== Injecting Auth Token ===');

      await page.goto(BASE_URL, { waitUntil: 'commit', timeout: 15000 });
      await page.waitForTimeout(2000);

      await page.evaluate((token) => {
        localStorage.setItem('mercadoGamer.token', token);
        localStorage.setItem('token', token);
      }, authResult.token);

      console.log('✅ Token injected successfully');

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '00-authenticated.png'), fullPage: true });
    }

    // Step 4: Test all dashboard pages
    console.log('\n=== Testing Dashboard Pages ===');

    for (let i = 0; i < DASHBOARD_PAGES.length; i++) {
      await testDashboardPage(page, DASHBOARD_PAGES[i], i + 1);
      await page.waitForTimeout(1000);
    }

    // Step 5: Generate report
    await generateReport();

    console.log('\n==============================================');
    console.log('  ✅ Test Complete!');
    console.log('==============================================');
    console.log(`\nOpen: test-dashboard-report.html`);
    console.log(`Screenshots: ${SCREENSHOTS_DIR}`);

    // Keep browser open
    console.log('\nBrowser will remain open for 20 seconds...');
    await page.waitForTimeout(20000);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    testResults.errors.push({ message: error.message, stack: error.stack });
    await generateReport();
  } finally {
    if (browser) {
      console.log('\nClosing browser...');
      await browser.close();
    }
  }
}

main().catch(console.error);
