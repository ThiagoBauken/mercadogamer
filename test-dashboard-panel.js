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
  consoleErrors: [],
  functionalityTests: []
};

// Dashboard routes to test (from nav-items)
const DASHBOARD_ROUTES = [
  // Balance
  {
    path: '/dashboard/balance',
    name: 'Balance',
    category: 'BALANCE',
    tests: ['check balance display', 'withdrawal button', 'payment methods']
  },

  // Compras (Purchases)
  {
    path: '/dashboard/order',
    name: 'Compras',
    category: 'COMPRAS',
    tests: ['order list', 'order details', 'order status']
  },
  {
    path: '/dashboard/qas',
    name: 'Mis preguntas',
    category: 'COMPRAS',
    tests: ['questions list', 'question details']
  },

  // Ventas (Sales)
  {
    path: '/dashboard/sale',
    name: 'Ventas',
    category: 'VENTAS',
    tests: ['sales list', 'sale details', 'sale status']
  },
  {
    path: '/dashboard/inventory',
    name: 'Productos',
    category: 'VENTAS',
    tests: ['product list', 'add product button', 'edit product', 'delete product']
  },
  {
    path: '/dashboard/question',
    name: 'Consultas',
    category: 'VENTAS',
    tests: ['customer questions', 'answer functionality']
  },
  {
    path: '/dashboard/store',
    name: 'Tienda',
    category: 'VENTAS',
    tests: ['store information', 'store settings']
  },

  // Configuración (Configuration)
  {
    path: '/dashboard/profile',
    name: 'Mi perfil',
    category: 'CONFIGURACIÓN',
    tests: ['profile information', 'edit profile', 'avatar upload']
  },
  {
    path: '/dashboard/support',
    name: 'Soporte',
    category: 'CONFIGURACIÓN',
    tests: ['support tickets', 'create ticket button']
  }
];

async function login(page) {
  console.log('\n=== Login Process ===');

  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000); // Wait for page to load
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '00-login-page.png'), fullPage: true });

    // Try common test credentials
    const testCredentials = [
      { email: 'test@test.com', password: 'test123' },
      { email: 'admin@admin.com', password: 'admin123' },
      { email: 'user@test.com', password: 'user123' },
      { email: 'teste@teste.com', password: 'teste123' }
    ];

    for (const cred of testCredentials) {
      console.log(`Trying login with: ${cred.email}`);

      // Clear and fill email
      const emailInput = await page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
      const passwordInput = await page.locator('input[type="password"], input[name="password"]').first();

      if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
        await emailInput.clear();
        await emailInput.fill(cred.email);
        await passwordInput.clear();
        await passwordInput.fill(cred.password);

        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `00-login-filled-${cred.email}.png`), fullPage: true });

        const submitButton = await page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Login"), button:has-text("Iniciar")').first();
        if (await submitButton.count() > 0) {
          await submitButton.click();
          await page.waitForTimeout(3000);

          // Check if logged in by looking for token or dashboard redirect
          const currentUrl = page.url();
          const token = await page.evaluate(() => {
            return localStorage.getItem('mercadoGamer.token') ||
                   localStorage.getItem('token') ||
                   sessionStorage.getItem('mercadoGamer.token') ||
                   sessionStorage.getItem('token');
          });

          if (token || currentUrl.includes('/dashboard') || currentUrl.includes('/home')) {
            console.log('Successfully logged in!');
            console.log('Current URL:', currentUrl);
            if (token) console.log('Token found:', token.substring(0, 20) + '...');

            await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '00-login-success.png'), fullPage: true });
            return { success: true, user: cred, token };
          }
        }
      }

      // Go back to login page for next attempt
      if (testCredentials.indexOf(cred) < testCredentials.length - 1) {
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000);
      }
    }

    console.log('Could not login with any test credentials');
    return { success: false, error: 'Authentication failed' };

  } catch (error) {
    console.error('Login error:', error.message);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '00-login-error.png'), fullPage: true });
    return { success: false, error: error.message };
  }
}

async function testDashboardPage(page, route, index) {
  const result = {
    name: route.name,
    path: route.path,
    category: route.category,
    url: `${BASE_URL}${route.path}`,
    status: 'unknown',
    consoleErrors: [],
    errors: [],
    warnings: [],
    screenshot: '',
    timestamp: new Date().toISOString(),
    functionalityTests: []
  };

  testResults.summary.total++;

  console.log(`\n[${index}/${DASHBOARD_ROUTES.length}] Testing: ${route.name} (${route.path})`);
  console.log(`Category: ${route.category}`);

  try {
    // Setup error listeners
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
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

    page.on('pageerror', error => {
      const err = {
        page: route.name,
        message: error.message,
        stack: error.stack
      };
      result.errors.push(err);
      testResults.errors.push(err);
    });

    // Navigate to dashboard page
    console.log(`Navigating to ${route.path}...`);
    const response = await page.goto(`${BASE_URL}${route.path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // Wait for dynamic content
    await page.waitForTimeout(3000);

    // Check current URL
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);

    // Check if redirected to login (bad - should be authenticated)
    if (currentUrl.includes('/login')) {
      result.status = 'failed';
      result.errors.push({ message: 'Redirected to login - authentication may have expired' });
      testResults.summary.failed++;
    } else {
      result.status = response.ok() ? 'passed' : 'failed';
    }

    // Take screenshot
    const screenshotName = `${String(index).padStart(2, '0')}-${route.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    result.screenshot = screenshotPath;

    console.log(`Status: ${result.status}`);
    console.log(`Screenshot: ${screenshotName}`);

    // Test page-specific functionality
    await testPageFunctionality(page, route, result);

    // Check for error messages on page
    const bodyText = await page.textContent('body').catch(() => '');
    const hasError = bodyText.toLowerCase().includes('error') ||
                     bodyText.toLowerCase().includes('erro') ||
                     bodyText.toLowerCase().includes('404') ||
                     bodyText.toLowerCase().includes('500');

    if (hasError) {
      result.warnings.push({ message: 'Page contains error text in body' });
    }

    // Count elements
    result.forms = await page.locator('form').count();
    result.buttons = await page.locator('button').count();
    result.links = await page.locator('a').count();
    result.inputs = await page.locator('input').count();

    console.log(`Forms: ${result.forms}, Buttons: ${result.buttons}, Links: ${result.links}, Inputs: ${result.inputs}`);

    // Determine final status
    if (result.status === 'passed' && result.errors.length === 0 && result.consoleErrors.length === 0) {
      testResults.summary.passed++;
    } else if (result.errors.length > 0 || result.consoleErrors.length > 0) {
      testResults.summary.errors++;
    } else {
      testResults.summary.failed++;
    }

  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    result.status = 'error';
    result.errors.push({ message: error.message, stack: error.stack });
    testResults.summary.failed++;

    try {
      const screenshotName = `${String(index).padStart(2, '0')}-${route.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-ERROR.png`;
      const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = screenshotPath;
    } catch (e) {
      console.error('Could not take error screenshot:', e.message);
    }
  }

  testResults.pages.push(result);
  return result;
}

async function testPageFunctionality(page, route, result) {
  console.log(`Testing functionality for ${route.name}...`);

  try {
    switch (route.path) {
      case '/dashboard/balance':
        await testBalancePage(page, result);
        break;
      case '/dashboard/order':
        await testOrdersPage(page, result);
        break;
      case '/dashboard/sale':
        await testSalesPage(page, result);
        break;
      case '/dashboard/inventory':
        await testInventoryPage(page, result);
        break;
      case '/dashboard/profile':
        await testProfilePage(page, result);
        break;
      case '/dashboard/store':
        await testStorePage(page, result);
        break;
      case '/dashboard/support':
        await testSupportPage(page, result);
        break;
      case '/dashboard/question':
      case '/dashboard/qas':
        await testQuestionsPage(page, result);
        break;
      default:
        console.log('No specific functionality tests for this page');
    }
  } catch (error) {
    console.error(`Functionality test error: ${error.message}`);
    result.functionalityTests.push({
      test: 'general',
      status: 'error',
      error: error.message
    });
  }
}

async function testBalancePage(page, result) {
  console.log('  Testing Balance page...');

  // Check for balance display
  const balanceElements = await page.locator('text=/saldo|balance|R\\$|\\$/i').count();
  result.functionalityTests.push({
    test: 'Balance display',
    status: balanceElements > 0 ? 'passed' : 'failed',
    found: balanceElements
  });

  // Check for withdrawal/saque button
  const withdrawButton = await page.locator('button:has-text("Sacar"), button:has-text("Retirar"), button:has-text("Withdraw")').count();
  result.functionalityTests.push({
    test: 'Withdrawal button',
    status: withdrawButton > 0 ? 'passed' : 'warning',
    found: withdrawButton
  });
}

async function testOrdersPage(page, result) {
  console.log('  Testing Orders page...');

  // Check for orders list or empty state
  const hasOrders = await page.locator('text=/pedido|order|compra/i').count();
  result.functionalityTests.push({
    test: 'Orders display',
    status: hasOrders > 0 ? 'passed' : 'warning',
    found: hasOrders,
    note: 'May be empty if no orders exist'
  });
}

async function testSalesPage(page, result) {
  console.log('  Testing Sales page...');

  // Check for sales list or empty state
  const hasSales = await page.locator('text=/venda|sale|venta/i').count();
  result.functionalityTests.push({
    test: 'Sales display',
    status: hasSales > 0 ? 'passed' : 'warning',
    found: hasSales,
    note: 'May be empty if no sales exist'
  });
}

async function testInventoryPage(page, result) {
  console.log('  Testing Inventory page...');

  // Check for add product button
  const addButton = await page.locator('button:has-text("Adicionar"), button:has-text("Add"), button:has-text("Novo"), a[href*="/add"]').count();
  result.functionalityTests.push({
    test: 'Add product button',
    status: addButton > 0 ? 'passed' : 'failed',
    found: addButton
  });

  // Check for product list
  const hasProducts = await page.locator('text=/produto|product/i').count();
  result.functionalityTests.push({
    test: 'Product list display',
    status: hasProducts > 0 ? 'passed' : 'warning',
    found: hasProducts,
    note: 'May be empty if no products exist'
  });
}

async function testProfilePage(page, result) {
  console.log('  Testing Profile page...');

  // Check for profile form fields
  const nameInput = await page.locator('input[name="name"], input[placeholder*="nome" i]').count();
  const emailInput = await page.locator('input[type="email"]').count();

  result.functionalityTests.push({
    test: 'Profile form fields',
    status: (nameInput > 0 || emailInput > 0) ? 'passed' : 'failed',
    found: { name: nameInput, email: emailInput }
  });

  // Check for save/update button
  const saveButton = await page.locator('button[type="submit"], button:has-text("Salvar"), button:has-text("Actualizar")').count();
  result.functionalityTests.push({
    test: 'Save button',
    status: saveButton > 0 ? 'passed' : 'failed',
    found: saveButton
  });
}

async function testStorePage(page, result) {
  console.log('  Testing Store page...');

  // Check for store information
  const storeInfo = await page.locator('text=/tienda|loja|store/i').count();
  result.functionalityTests.push({
    test: 'Store information display',
    status: storeInfo > 0 ? 'passed' : 'warning',
    found: storeInfo
  });
}

async function testSupportPage(page, result) {
  console.log('  Testing Support page...');

  // Check for create ticket button
  const createTicket = await page.locator('button:has-text("Criar"), button:has-text("Novo"), button:has-text("Create")').count();
  result.functionalityTests.push({
    test: 'Create ticket button',
    status: createTicket > 0 ? 'passed' : 'warning',
    found: createTicket
  });

  // Check for tickets list
  const hasTickets = await page.locator('text=/ticket|chamado|suporte/i').count();
  result.functionalityTests.push({
    test: 'Support tickets display',
    status: hasTickets > 0 ? 'passed' : 'warning',
    found: hasTickets,
    note: 'May be empty if no tickets exist'
  });
}

async function testQuestionsPage(page, result) {
  console.log('  Testing Questions page...');

  // Check for questions list
  const hasQuestions = await page.locator('text=/pergunta|question|consulta/i').count();
  result.functionalityTests.push({
    test: 'Questions display',
    status: hasQuestions > 0 ? 'passed' : 'warning',
    found: hasQuestions,
    note: 'May be empty if no questions exist'
  });
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
  <title>MercadoGamer Dashboard Test Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f7fa; }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 { color: #2c3e50; margin-bottom: 10px; }
    .timestamp { color: #7f8c8d; font-size: 14px; margin-bottom: 30px; }

    .summary {
      background: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    .summary-item { text-align: center; }
    .summary-item .label {
      font-weight: 600;
      display: block;
      color: #7f8c8d;
      text-transform: uppercase;
      font-size: 12px;
      margin-bottom: 8px;
    }
    .summary-item .value {
      font-size: 36px;
      font-weight: bold;
    }
    .passed { color: #27ae60; }
    .failed { color: #e74c3c; }
    .errors { color: #f39c12; }

    .category-section { margin-bottom: 40px; }
    .category-title {
      font-size: 24px;
      color: #2c3e50;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #3498db;
    }

    .page-result {
      background: white;
      padding: 25px;
      margin-bottom: 20px;
      border-radius: 8px;
      border-left: 5px solid #bdc3c7;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .page-result.passed { border-left-color: #27ae60; }
    .page-result.failed { border-left-color: #e74c3c; }
    .page-result.errors { border-left-color: #f39c12; }

    .page-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; }
    .page-title { font-size: 20px; font-weight: 600; color: #2c3e50; margin: 0; }
    .page-status {
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .page-status.passed { background: #d4edda; color: #155724; }
    .page-status.failed { background: #f8d7da; color: #721c24; }
    .page-status.error { background: #fff3cd; color: #856404; }

    .page-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin: 15px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
    }
    .meta-item { font-size: 14px; }
    .meta-label { font-weight: 600; color: #495057; }
    .meta-value { color: #6c757d; }

    .functionality-tests {
      margin: 20px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
    }
    .functionality-tests h4 { margin-top: 0; color: #495057; }
    .test-item {
      padding: 10px;
      margin: 8px 0;
      background: white;
      border-radius: 4px;
      border-left: 3px solid #bdc3c7;
    }
    .test-item.passed { border-left-color: #27ae60; }
    .test-item.failed { border-left-color: #e74c3c; }
    .test-item.warning { border-left-color: #f39c12; }

    .error-list {
      background: #fee;
      padding: 15px;
      margin: 15px 0;
      border-radius: 6px;
      border-left: 4px solid #e74c3c;
    }
    .console-error {
      background: #fff3e0;
      padding: 15px;
      margin: 15px 0;
      border-radius: 6px;
      border-left: 4px solid #f39c12;
    }
    .warning-list {
      background: #fffbf0;
      padding: 15px;
      margin: 15px 0;
      border-radius: 6px;
      border-left: 4px solid #f39c12;
    }

    .screenshot {
      max-width: 100%;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s;
    }
    .screenshot:hover { transform: scale(1.02); }

    pre {
      background: #f8f9fa;
      padding: 15px;
      overflow-x: auto;
      border-radius: 6px;
      font-size: 12px;
    }

    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-left: 8px;
    }
    .badge.success { background: #d4edda; color: #155724; }
    .badge.danger { background: #f8d7da; color: #721c24; }
    .badge.warning { background: #fff3cd; color: #856404; }
  </style>
</head>
<body>
  <div class="container">
    <h1>MercadoGamer - Dashboard Panel Test Report</h1>
    <div class="timestamp">Generated: ${testResults.timestamp}</div>

    <div class="summary">
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

    ${Object.entries(
      testResults.pages.reduce((acc, page) => {
        if (!acc[page.category]) acc[page.category] = [];
        acc[page.category].push(page);
        return acc;
      }, {})
    ).map(([category, pages]) => `
      <div class="category-section">
        <h2 class="category-title">${category}</h2>
        ${pages.map(page => `
          <div class="page-result ${
            page.status === 'passed' && page.errors.length === 0 && page.consoleErrors.length === 0
              ? 'passed'
              : page.errors.length > 0 || page.consoleErrors.length > 0
                ? 'errors'
                : 'failed'
          }">
            <div class="page-header">
              <h3 class="page-title">${page.name}</h3>
              <span class="page-status ${page.status}">${page.status}</span>
            </div>

            <div class="page-meta">
              <div class="meta-item">
                <div class="meta-label">URL</div>
                <div class="meta-value">${page.path}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Forms</div>
                <div class="meta-value">${page.forms || 0}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Buttons</div>
                <div class="meta-value">${page.buttons || 0}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Links</div>
                <div class="meta-value">${page.links || 0}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Inputs</div>
                <div class="meta-value">${page.inputs || 0}</div>
              </div>
            </div>

            ${page.functionalityTests && page.functionalityTests.length > 0 ? `
              <div class="functionality-tests">
                <h4>Functionality Tests</h4>
                ${page.functionalityTests.map(test => `
                  <div class="test-item ${test.status}">
                    <strong>${test.test}</strong>
                    <span class="badge ${test.status === 'passed' ? 'success' : test.status === 'failed' ? 'danger' : 'warning'}">${test.status}</span>
                    ${test.found !== undefined ? `<div>Found: ${typeof test.found === 'object' ? JSON.stringify(test.found) : test.found}</div>` : ''}
                    ${test.note ? `<div style="font-size: 12px; color: #6c757d; margin-top: 5px;">${test.note}</div>` : ''}
                    ${test.error ? `<div style="color: #e74c3c; margin-top: 5px;">${test.error}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${page.warnings && page.warnings.length > 0 ? `
              <div class="warning-list">
                <strong>Warnings (${page.warnings.length}):</strong>
                ${page.warnings.map(warn => `<div>⚠️ ${warn.message}</div>`).join('')}
              </div>
            ` : ''}

            ${page.errors.length > 0 ? `
              <div class="error-list">
                <strong>Errors (${page.errors.length}):</strong>
                ${page.errors.map(err => `
                  <div style="margin: 10px 0;">
                    <strong>Message:</strong> ${err.message || err.text}<br>
                    ${err.stack ? `<pre>${err.stack}</pre>` : ''}
                  </div>
                `).join('<hr>')}
              </div>
            ` : ''}

            ${page.consoleErrors.length > 0 ? `
              <div class="console-error">
                <strong>Console Errors (${page.consoleErrors.length}):</strong>
                ${page.consoleErrors.map(err => `
                  <div style="margin: 10px 0;">
                    ${err.text}<br>
                    ${err.location ? `<small>Location: ${JSON.stringify(err.location)}</small>` : ''}
                  </div>
                `).join('<hr>')}
              </div>
            ` : ''}

            ${page.screenshot ? `
              <div>
                <strong>Screenshot:</strong><br>
                <img src="${path.relative(path.dirname(REPORT_FILE), page.screenshot)}"
                     class="screenshot"
                     onclick="window.open(this.src, '_blank')"
                     title="Click to open in new tab">
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `).join('')}

    ${testResults.consoleErrors.length > 0 ? `
      <div class="category-section">
        <h2 class="category-title">All Console Errors (${testResults.consoleErrors.length})</h2>
        <div class="console-error">
          ${testResults.consoleErrors.map(err => `
            <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px;">
              <strong>Page:</strong> ${err.page}<br>
              <strong>Error:</strong> ${err.text}<br>
              ${err.location ? `<strong>Location:</strong> ${JSON.stringify(err.location)}` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${testResults.errors.length > 0 ? `
      <div class="category-section">
        <h2 class="category-title">All Page Errors (${testResults.errors.length})</h2>
        <div class="error-list">
          ${testResults.errors.map(err => `
            <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px;">
              <strong>Page:</strong> ${err.page}<br>
              <strong>Error:</strong> ${err.message}<br>
              ${err.stack ? `<pre>${err.stack}</pre>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  </div>
</body>
</html>
  `;

  const htmlReportFile = path.join(__dirname, 'test-dashboard-report.html');
  fs.writeFileSync(htmlReportFile, htmlReport);
  console.log(`HTML Report saved to: ${htmlReportFile}`);

  // Print summary to console
  console.log('\n=== DASHBOARD TEST SUMMARY ===');
  console.log(`Total Pages Tested: ${testResults.summary.total}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
  console.log(`With Errors: ${testResults.summary.errors}`);
  console.log(`Console Errors: ${testResults.consoleErrors.length}`);
  console.log(`Page Errors: ${testResults.errors.length}`);

  console.log('\n=== By Category ===');
  const byCategory = testResults.pages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = { total: 0, passed: 0, failed: 0, errors: 0 };
    }
    acc[page.category].total++;
    if (page.status === 'passed' && page.errors.length === 0 && page.consoleErrors.length === 0) {
      acc[page.category].passed++;
    } else if (page.errors.length > 0 || page.consoleErrors.length > 0) {
      acc[page.category].errors++;
    } else {
      acc[page.category].failed++;
    }
    return acc;
  }, {});

  Object.entries(byCategory).forEach(([category, stats]) => {
    console.log(`\n${category}:`);
    console.log(`  Total: ${stats.total}`);
    console.log(`  Passed: ${stats.passed}`);
    console.log(`  Failed: ${stats.failed}`);
    console.log(`  Errors: ${stats.errors}`);
  });
}

async function main() {
  console.log('==============================================');
  console.log('  MercadoGamer Dashboard Panel Test Suite');
  console.log('==============================================');
  console.log(`Frontend: ${BASE_URL}`);
  console.log(`Backend: ${API_URL}`);
  console.log(`Screenshots: ${SCREENSHOTS_DIR}`);
  console.log(`Report: ${REPORT_FILE}`);

  let browser;
  try {
    console.log('\nLaunching browser...');
    browser = await chromium.launch({
      headless: false,
      slowMo: 50
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: {
        dir: path.join(__dirname, 'test-videos-dashboard'),
        size: { width: 1920, height: 1080 }
      }
    });

    const page = await context.newPage();

    // Login first
    const authResult = await login(page);

    if (!authResult.success) {
      console.error('\n❌ Login failed! Cannot test dashboard pages.');
      console.error('Error:', authResult.error);
      console.log('\nPlease ensure:');
      console.log('1. The frontend is running on', BASE_URL);
      console.log('2. The backend is running on', API_URL);
      console.log('3. Test user credentials are configured');

      await generateReport();
      return;
    }

    console.log('\n✅ Login successful! Starting dashboard tests...');

    // Test all dashboard pages
    for (let i = 0; i < DASHBOARD_ROUTES.length; i++) {
      await testDashboardPage(page, DASHBOARD_ROUTES[i], i + 1);

      // Small delay between pages
      await page.waitForTimeout(1000);
    }

    // Generate report
    await generateReport();

    console.log('\n==============================================');
    console.log('  Test Complete!');
    console.log('==============================================');
    console.log(`\nOpen the following file in your browser:`);
    console.log(`${path.join(__dirname, 'test-dashboard-report.html')}`);
    console.log(`\nScreenshots directory:`);
    console.log(`${SCREENSHOTS_DIR}`);

    // Keep browser open for manual inspection
    console.log('\nBrowser will remain open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    testResults.errors.push({
      page: 'main',
      message: error.message,
      stack: error.stack
    });
    await generateReport();
  } finally {
    if (browser) {
      console.log('\nClosing browser...');
      await browser.close();
    }
  }
}

main().catch(console.error);
