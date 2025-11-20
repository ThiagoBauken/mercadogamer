const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const SCREENSHOTS_DIR = path.join(__dirname, 'test-screenshots-dashboard');

// Create screenshots directory
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function main() {
  console.log('==============================================');
  console.log('  MercadoGamer Dashboard - Manual Test');
  console.log('==============================================');

  let browser;
  try {
    console.log('\nLaunching browser...');
    browser = await chromium.launch({
      headless: false,
      slowMo: 500
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    console.log('\n=== INSTRUÇÕES ===');
    console.log('1. O navegador irá abrir');
    console.log('2. Por favor, faça login manualmente');
    console.log('3. Após o login, navegue para o dashboard');
    console.log('4. O script irá automaticamente testar as páginas do dashboard');
    console.log('\nAguardando...\n');

    // Navigate to login page
    console.log('Navegando para a página inicial...');
    try {
      await page.goto('http://localhost:4200', { timeout: 60000 });
    } catch (e) {
      console.log('Erro ao navegar:', e.message);
      console.log('Tentando novamente sem aguardar...');
      await page.goto('http://localhost:4200', { waitUntil: 'commit' });
    }

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '00-initial-page.png'), fullPage: true });

    // Wait for user to login (check for token or dashboard URL)
    console.log('\nAguardando login... (pressione Ctrl+C para cancelar)');

    let loggedIn = false;
    let attempts = 0;
    const maxAttempts = 120; // 2 minutes

    while (!loggedIn && attempts < maxAttempts) {
      await page.waitForTimeout(1000);
      attempts++;

      const currentUrl = page.url();
      const token = await page.evaluate(() => {
        return localStorage.getItem('mercadoGamer.token') ||
               localStorage.getItem('token') ||
               sessionStorage.getItem('mercadoGamer.token') ||
               sessionStorage.getItem('token');
      }).catch(() => null);

      if (token || currentUrl.includes('/dashboard')) {
        loggedIn = true;
        console.log('\n✅ Login detectado!');
        console.log('URL atual:', currentUrl);
        if (token) console.log('Token encontrado:', token.substring(0, 20) + '...');
      }

      if (attempts % 10 === 0) {
        console.log(`Aguardando... (${attempts}s / ${maxAttempts}s)`);
      }
    }

    if (!loggedIn) {
      console.log('\n⏱️ Timeout - Login não detectado');
      console.log('Continuando mesmo assim...\n');
    }

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-after-login.png'), fullPage: true });

    // Test dashboard pages
    const dashboardPages = [
      { path: '/dashboard/balance', name: 'Balance' },
      { path: '/dashboard/order', name: 'Compras' },
      { path: '/dashboard/qas', name: 'Mis preguntas' },
      { path: '/dashboard/sale', name: 'Ventas' },
      { path: '/dashboard/inventory', name: 'Productos' },
      { path: '/dashboard/question', name: 'Consultas' },
      { path: '/dashboard/store', name: 'Tienda' },
      { path: '/dashboard/profile', name: 'Mi perfil' },
      { path: '/dashboard/support', name: 'Soporte' }
    ];

    console.log('\n=== Testando páginas do dashboard ===\n');

    for (let i = 0; i < dashboardPages.length; i++) {
      const dashPage = dashboardPages[i];
      console.log(`[${i + 1}/${dashboardPages.length}] Testando: ${dashPage.name} (${dashPage.path})`);

      try {
        await page.goto(`http://localhost:4200${dashPage.path}`, {
          waitUntil: 'commit',
          timeout: 10000
        });

        await page.waitForTimeout(2000);

        const screenshotName = `${String(i + 2).padStart(2, '0')}-${dashPage.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, screenshotName),
          fullPage: true
        });

        console.log(`  ✓ Screenshot: ${screenshotName}`);

        // Check for errors on page
        const bodyText = await page.textContent('body').catch(() => '');
        if (bodyText.toLowerCase().includes('404') || bodyText.toLowerCase().includes('not found')) {
          console.log(`  ⚠️ Página pode não existir (404)`);
        }

      } catch (error) {
        console.log(`  ✗ Erro: ${error.message}`);
      }

      await page.waitForTimeout(1000);
    }

    console.log('\n=== Teste Concluído ===');
    console.log(`Screenshots salvos em: ${SCREENSHOTS_DIR}`);
    console.log('\nO navegador ficará aberto por 30 segundos para inspeção manual...');

    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('\n❌ Erro fatal:', error);
  } finally {
    if (browser) {
      console.log('\nFechando navegador...');
      await browser.close();
    }
  }
}

main().catch(console.error);
