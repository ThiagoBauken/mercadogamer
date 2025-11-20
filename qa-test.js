const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configurações
const BASE_URL = 'http://localhost:4200';
const API_URL = 'http://localhost:3000/api';
const SCREENSHOT_DIR = path.join(__dirname, 'qa-screenshots');
const REPORT_FILE = path.join(__dirname, 'qa-report.json');

// Criar diretório para screenshots
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Estrutura para armazenar resultados
const testResults = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    apiUrl: API_URL,
    pages: [],
    errors: [],
    warnings: [],
    networkErrors: [],
    performanceMetrics: [],
    usabilityIssues: [],
    summary: {
        totalPages: 0,
        totalErrors: 0,
        totalWarnings: 0,
        totalNetworkErrors: 0,
        criticalIssues: 0
    }
};

async function capturePageInfo(page, pageName, url) {
    const pageInfo = {
        name: pageName,
        url: url,
        timestamp: new Date().toISOString(),
        screenshot: `${pageName.replace(/\s+/g, '-').toLowerCase()}.png`,
        consoleErrors: [],
        consoleWarnings: [],
        networkRequests: [],
        loadTime: 0,
        elements: {
            buttons: 0,
            links: 0,
            forms: 0,
            inputs: 0,
            images: 0
        },
        accessibility: {
            missingAltText: 0,
            emptyButtons: 0,
            missingLabels: 0
        }
    };

    try {
        // Capturar tempo de carregamento
        const startTime = Date.now();
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        pageInfo.loadTime = Date.now() - startTime;

        // Aguardar um pouco para o Angular renderizar
        await page.waitForTimeout(2000);

        // Tirar screenshot
        const screenshotPath = path.join(SCREENSHOT_DIR, pageInfo.screenshot);
        await page.screenshot({
            path: screenshotPath,
            fullPage: true
        });

        // Coletar informações sobre elementos
        pageInfo.elements.buttons = await page.locator('button').count();
        pageInfo.elements.links = await page.locator('a').count();
        pageInfo.elements.forms = await page.locator('form').count();
        pageInfo.elements.inputs = await page.locator('input').count();
        pageInfo.elements.images = await page.locator('img').count();

        // Verificar acessibilidade básica
        const imagesWithoutAlt = await page.locator('img:not([alt])').count();
        pageInfo.accessibility.missingAltText = imagesWithoutAlt;

        const emptyButtons = await page.locator('button:not([aria-label]):empty').count();
        pageInfo.accessibility.emptyButtons = emptyButtons;

        const inputsWithoutLabels = await page.locator('input:not([aria-label]):not([placeholder])').count();
        pageInfo.accessibility.missingLabels = inputsWithoutLabels;

        // Verificar título da página
        pageInfo.title = await page.title();

        // Verificar meta description
        const metaDescription = await page.locator('meta[name="description"]').getAttribute('content').catch(() => null);
        pageInfo.metaDescription = metaDescription;

        console.log(`✓ Página "${pageName}" testada com sucesso - ${pageInfo.loadTime}ms`);

    } catch (error) {
        pageInfo.error = error.message;
        testResults.errors.push({
            type: 'Page Load Error',
            page: pageName,
            message: error.message,
            severity: 'CRITICAL'
        });
        console.log(`✗ Erro ao testar página "${pageName}": ${error.message}`);
    }

    return pageInfo;
}

async function testFormInteraction(page, formSelector, testData) {
    const results = {
        found: false,
        filled: false,
        submitted: false,
        errors: []
    };

    try {
        const formExists = await page.locator(formSelector).count() > 0;
        results.found = formExists;

        if (!formExists) {
            results.errors.push('Formulário não encontrado');
            return results;
        }

        // Preencher campos
        for (const [selector, value] of Object.entries(testData)) {
            try {
                await page.fill(selector, value);
                await page.waitForTimeout(500);
            } catch (err) {
                results.errors.push(`Erro ao preencher campo ${selector}: ${err.message}`);
            }
        }
        results.filled = true;

        console.log('  - Formulário preenchido');

    } catch (error) {
        results.errors.push(error.message);
    }

    return results;
}

async function testNavigation(page, linkText) {
    try {
        const link = page.locator(`text=${linkText}`).first();
        const exists = await link.count() > 0;

        if (!exists) {
            return { clicked: false, error: 'Link não encontrado' };
        }

        await link.click();
        await page.waitForTimeout(1500);

        return { clicked: true, currentUrl: page.url() };
    } catch (error) {
        return { clicked: false, error: error.message };
    }
}

async function runTests() {
    console.log('=================================');
    console.log('INICIANDO TESTES QA AUTOMATIZADOS');
    console.log('=================================\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500 // Desacelerar para visualizar
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 QA-Bot'
    });

    const page = await context.newPage();

    // Capturar erros do console
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();

        if (type === 'error') {
            testResults.errors.push({
                type: 'Console Error',
                message: text,
                severity: 'HIGH',
                timestamp: new Date().toISOString()
            });
            console.log(`  [CONSOLE ERROR] ${text}`);
        } else if (type === 'warning') {
            testResults.warnings.push({
                type: 'Console Warning',
                message: text,
                timestamp: new Date().toISOString()
            });
            console.log(`  [CONSOLE WARNING] ${text}`);
        }
    });

    // Capturar erros de página
    page.on('pageerror', error => {
        testResults.errors.push({
            type: 'Page Error',
            message: error.message,
            stack: error.stack,
            severity: 'CRITICAL'
        });
        console.log(`  [PAGE ERROR] ${error.message}`);
    });

    // Capturar requisições de rede falhadas
    page.on('requestfailed', request => {
        testResults.networkErrors.push({
            url: request.url(),
            method: request.method(),
            failure: request.failure().errorText,
            timestamp: new Date().toISOString()
        });
        console.log(`  [NETWORK ERROR] ${request.url()} - ${request.failure().errorText}`);
    });

    // Capturar respostas HTTP com erro
    page.on('response', response => {
        if (response.status() >= 400) {
            testResults.networkErrors.push({
                url: response.url(),
                status: response.status(),
                statusText: response.statusText(),
                timestamp: new Date().toISOString()
            });
            console.log(`  [HTTP ERROR] ${response.status()} - ${response.url()}`);
        }
    });

    try {
        // ==================== TESTE 1: Página Inicial ====================
        console.log('\n[1/10] Testando Página Inicial...');
        const homePage = await capturePageInfo(page, 'Home', BASE_URL);
        testResults.pages.push(homePage);

        // Verificar elementos esperados na home
        await page.waitForTimeout(2000);

        // ==================== TESTE 2: Navegação - Catálogo ====================
        console.log('\n[2/10] Testando Página de Catálogo/Produtos...');

        // Tentar várias formas de acessar o catálogo
        let catalogAccessed = false;
        const catalogAttempts = [
            { method: 'link', selector: 'text=Catálogo' },
            { method: 'link', selector: 'text=Produtos' },
            { method: 'link', selector: 'text=Games' },
            { method: 'link', selector: 'text=Jogos' },
            { method: 'url', url: `${BASE_URL}/products` },
            { method: 'url', url: `${BASE_URL}/catalogo` },
            { method: 'url', url: `${BASE_URL}/games` }
        ];

        for (const attempt of catalogAttempts) {
            try {
                if (attempt.method === 'link') {
                    const link = page.locator(attempt.selector).first();
                    if (await link.count() > 0) {
                        await link.click();
                        await page.waitForTimeout(2000);
                        catalogAccessed = true;
                        break;
                    }
                } else if (attempt.method === 'url') {
                    await page.goto(attempt.url, { waitUntil: 'networkidle', timeout: 10000 });
                    catalogAccessed = true;
                    break;
                }
            } catch (err) {
                // Tentar próxima opção
            }
        }

        if (catalogAccessed) {
            const catalogPage = await capturePageInfo(page, 'Catalog', page.url());
            testResults.pages.push(catalogPage);
        } else {
            testResults.usabilityIssues.push({
                severity: 'HIGH',
                issue: 'Não foi possível acessar a página de catálogo/produtos',
                recommendation: 'Adicionar link visível para catálogo na navegação principal'
            });
        }

        // ==================== TESTE 3: Login ====================
        console.log('\n[3/10] Testando Página de Login...');

        const loginAttempts = [
            { method: 'link', selector: 'text=Login' },
            { method: 'link', selector: 'text=Entrar' },
            { method: 'link', selector: 'text=Sign In' },
            { method: 'url', url: `${BASE_URL}/login` },
            { method: 'url', url: `${BASE_URL}/auth/login` }
        ];

        let loginAccessed = false;
        for (const attempt of loginAttempts) {
            try {
                if (attempt.method === 'link') {
                    await page.goto(BASE_URL);
                    await page.waitForTimeout(1000);
                    const link = page.locator(attempt.selector).first();
                    if (await link.count() > 0) {
                        await link.click();
                        await page.waitForTimeout(2000);
                        loginAccessed = true;
                        break;
                    }
                } else if (attempt.method === 'url') {
                    await page.goto(attempt.url, { waitUntil: 'networkidle', timeout: 10000 });
                    loginAccessed = true;
                    break;
                }
            } catch (err) {
                // Tentar próxima opção
            }
        }

        if (loginAccessed) {
            const loginPage = await capturePageInfo(page, 'Login', page.url());
            testResults.pages.push(loginPage);

            // Testar formulário de login
            console.log('  Testando formulário de login...');
            const loginFormTests = [
                { selector: 'input[type="email"]', value: 'teste@example.com' },
                { selector: 'input[name="email"]', value: 'teste@example.com' },
                { selector: 'input[type="password"]', value: 'senha123' },
                { selector: 'input[name="password"]', value: 'senha123' }
            ];

            for (const test of loginFormTests) {
                try {
                    if (await page.locator(test.selector).count() > 0) {
                        await page.fill(test.selector, test.value);
                        console.log(`  - Preenchido: ${test.selector}`);
                    }
                } catch (err) {
                    // Tentar próximo
                }
            }

            await page.waitForTimeout(1000);
        } else {
            testResults.usabilityIssues.push({
                severity: 'CRITICAL',
                issue: 'Não foi possível acessar a página de login',
                recommendation: 'Adicionar link de login visível no header'
            });
        }

        // ==================== TESTE 4: Registro ====================
        console.log('\n[4/10] Testando Página de Registro...');

        const registerAttempts = [
            { method: 'link', selector: 'text=Registrar' },
            { method: 'link', selector: 'text=Criar conta' },
            { method: 'link', selector: 'text=Sign Up' },
            { method: 'link', selector: 'text=Cadastro' },
            { method: 'url', url: `${BASE_URL}/register` },
            { method: 'url', url: `${BASE_URL}/signup` },
            { method: 'url', url: `${BASE_URL}/auth/register` }
        ];

        let registerAccessed = false;
        for (const attempt of registerAttempts) {
            try {
                if (attempt.method === 'link') {
                    await page.goto(BASE_URL);
                    await page.waitForTimeout(1000);
                    const link = page.locator(attempt.selector).first();
                    if (await link.count() > 0) {
                        await link.click();
                        await page.waitForTimeout(2000);
                        registerAccessed = true;
                        break;
                    }
                } else if (attempt.method === 'url') {
                    await page.goto(attempt.url, { waitUntil: 'networkidle', timeout: 10000 });
                    registerAccessed = true;
                    break;
                }
            } catch (err) {
                // Tentar próxima opção
            }
        }

        if (registerAccessed) {
            const registerPage = await capturePageInfo(page, 'Register', page.url());
            testResults.pages.push(registerPage);
        }

        // ==================== TESTE 5: Perfil do Usuário ====================
        console.log('\n[5/10] Testando Página de Perfil...');
        const profileUrls = [
            `${BASE_URL}/profile`,
            `${BASE_URL}/perfil`,
            `${BASE_URL}/user/profile`,
            `${BASE_URL}/account`
        ];

        for (const url of profileUrls) {
            try {
                await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
                const profilePage = await capturePageInfo(page, 'Profile', url);
                testResults.pages.push(profilePage);
                break;
            } catch (err) {
                // Tentar próxima URL
            }
        }

        // ==================== TESTE 6: Carrinho ====================
        console.log('\n[6/10] Testando Página de Carrinho...');
        const cartUrls = [
            `${BASE_URL}/cart`,
            `${BASE_URL}/carrinho`,
            `${BASE_URL}/shopping-cart`
        ];

        for (const url of cartUrls) {
            try {
                await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
                const cartPage = await capturePageInfo(page, 'Cart', url);
                testResults.pages.push(cartPage);
                break;
            } catch (err) {
                // Tentar próxima URL
            }
        }

        // ==================== TESTE 7: Sobre ====================
        console.log('\n[7/10] Testando Página Sobre...');
        const aboutUrls = [
            `${BASE_URL}/about`,
            `${BASE_URL}/sobre`,
            `${BASE_URL}/about-us`
        ];

        for (const url of aboutUrls) {
            try {
                await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
                const aboutPage = await capturePageInfo(page, 'About', url);
                testResults.pages.push(aboutPage);
                break;
            } catch (err) {
                // Tentar próxima URL
            }
        }

        // ==================== TESTE 8: Contato ====================
        console.log('\n[8/10] Testando Página de Contato...');
        const contactUrls = [
            `${BASE_URL}/contact`,
            `${BASE_URL}/contato`,
            `${BASE_URL}/fale-conosco`
        ];

        for (const url of contactUrls) {
            try {
                await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
                const contactPage = await capturePageInfo(page, 'Contact', url);
                testResults.pages.push(contactPage);
                break;
            } catch (err) {
                // Tentar próxima URL
            }
        }

        // ==================== TESTE 9: FAQ ====================
        console.log('\n[9/10] Testando Página FAQ...');
        const faqUrls = [
            `${BASE_URL}/faq`,
            `${BASE_URL}/ajuda`,
            `${BASE_URL}/help`
        ];

        for (const url of faqUrls) {
            try {
                await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
                const faqPage = await capturePageInfo(page, 'FAQ', url);
                testResults.pages.push(faqPage);
                break;
            } catch (err) {
                // Tentar próxima URL
            }
        }

        // ==================== TESTE 10: Página 404 ====================
        console.log('\n[10/10] Testando Página 404...');
        try {
            await page.goto(`${BASE_URL}/pagina-que-nao-existe-teste-404`, {
                waitUntil: 'networkidle',
                timeout: 10000
            });
            const notFoundPage = await capturePageInfo(page, '404-NotFound', page.url());
            testResults.pages.push(notFoundPage);
        } catch (err) {
            // Erro esperado
        }

        // ==================== TESTE DE API ====================
        console.log('\n[API] Testando endpoints da API...');

        const apiEndpoints = [
            '/health',
            '/products',
            '/categories',
            '/users'
        ];

        for (const endpoint of apiEndpoints) {
            try {
                const response = await page.request.get(`${API_URL}${endpoint}`);
                console.log(`  ${endpoint}: ${response.status()} ${response.statusText()}`);

                if (response.status() >= 400) {
                    testResults.networkErrors.push({
                        type: 'API Error',
                        endpoint: endpoint,
                        status: response.status(),
                        statusText: response.statusText()
                    });
                }
            } catch (err) {
                console.log(`  ${endpoint}: ERRO - ${err.message}`);
                testResults.networkErrors.push({
                    type: 'API Error',
                    endpoint: endpoint,
                    error: err.message
                });
            }
        }

    } catch (error) {
        console.error('\n[ERRO CRÍTICO]', error);
        testResults.errors.push({
            type: 'Critical Test Error',
            message: error.message,
            stack: error.stack,
            severity: 'CRITICAL'
        });
    } finally {
        await browser.close();
    }

    // ==================== ANÁLISE FINAL ====================
    console.log('\n=================================');
    console.log('ANÁLISE FINAL');
    console.log('=================================\n');

    // Compilar resumo
    testResults.summary.totalPages = testResults.pages.length;
    testResults.summary.totalErrors = testResults.errors.length;
    testResults.summary.totalWarnings = testResults.warnings.length;
    testResults.summary.totalNetworkErrors = testResults.networkErrors.length;
    testResults.summary.criticalIssues = testResults.errors.filter(e => e.severity === 'CRITICAL').length;

    // Análise de usabilidade
    for (const page of testResults.pages) {
        // Verificar tempo de carregamento
        if (page.loadTime > 3000) {
            testResults.usabilityIssues.push({
                severity: 'MEDIUM',
                page: page.name,
                issue: `Tempo de carregamento alto: ${page.loadTime}ms`,
                recommendation: 'Otimizar carregamento da página e recursos'
            });
        }

        // Verificar acessibilidade
        if (page.accessibility.missingAltText > 0) {
            testResults.usabilityIssues.push({
                severity: 'LOW',
                page: page.name,
                issue: `${page.accessibility.missingAltText} imagens sem texto alternativo`,
                recommendation: 'Adicionar atributo alt em todas as imagens'
            });
        }

        // Verificar título
        if (!page.title || page.title === '') {
            testResults.usabilityIssues.push({
                severity: 'MEDIUM',
                page: page.name,
                issue: 'Página sem título',
                recommendation: 'Adicionar título descritivo na página'
            });
        }
    }

    // Salvar relatório
    fs.writeFileSync(REPORT_FILE, JSON.stringify(testResults, null, 2));

    // Gerar relatório em texto
    const textReport = generateTextReport(testResults);
    fs.writeFileSync(path.join(__dirname, 'qa-report.txt'), textReport);

    console.log(`\n✓ Relatório salvo em: ${REPORT_FILE}`);
    console.log(`✓ Relatório texto salvo em: qa-report.txt`);
    console.log(`✓ Screenshots salvos em: ${SCREENSHOT_DIR}`);

    console.log(`\nRESUMO:`);
    console.log(`  - Páginas testadas: ${testResults.summary.totalPages}`);
    console.log(`  - Erros encontrados: ${testResults.summary.totalErrors}`);
    console.log(`  - Avisos: ${testResults.summary.totalWarnings}`);
    console.log(`  - Erros de rede: ${testResults.summary.totalNetworkErrors}`);
    console.log(`  - Problemas críticos: ${testResults.summary.criticalIssues}`);
    console.log(`  - Problemas de usabilidade: ${testResults.usabilityIssues.length}`);
}

function generateTextReport(results) {
    let report = '';

    report += '='.repeat(80) + '\n';
    report += 'RELATÓRIO DE TESTES QA - MERCADOGAMER\n';
    report += '='.repeat(80) + '\n\n';

    report += `Data/Hora: ${results.timestamp}\n`;
    report += `URL Base: ${results.baseUrl}\n`;
    report += `API URL: ${results.apiUrl}\n\n`;

    report += '='.repeat(80) + '\n';
    report += 'RESUMO EXECUTIVO\n';
    report += '='.repeat(80) + '\n\n';

    report += `Páginas Testadas: ${results.summary.totalPages}\n`;
    report += `Total de Erros: ${results.summary.totalErrors}\n`;
    report += `Total de Avisos: ${results.summary.totalWarnings}\n`;
    report += `Erros de Rede: ${results.summary.totalNetworkErrors}\n`;
    report += `Problemas Críticos: ${results.summary.criticalIssues}\n`;
    report += `Problemas de Usabilidade: ${results.usabilityIssues.length}\n\n`;

    if (results.pages.length > 0) {
        report += '='.repeat(80) + '\n';
        report += 'PÁGINAS TESTADAS\n';
        report += '='.repeat(80) + '\n\n';

        results.pages.forEach((page, index) => {
            report += `${index + 1}. ${page.name}\n`;
            report += `   URL: ${page.url}\n`;
            report += `   Tempo de carregamento: ${page.loadTime}ms\n`;
            report += `   Título: ${page.title || 'N/A'}\n`;
            report += `   Screenshot: ${page.screenshot}\n`;
            report += `   Elementos:\n`;
            report += `     - Botões: ${page.elements.buttons}\n`;
            report += `     - Links: ${page.elements.links}\n`;
            report += `     - Formulários: ${page.elements.forms}\n`;
            report += `     - Inputs: ${page.elements.inputs}\n`;
            report += `     - Imagens: ${page.elements.images}\n`;
            if (page.error) {
                report += `   ERRO: ${page.error}\n`;
            }
            report += '\n';
        });
    }

    if (results.errors.length > 0) {
        report += '='.repeat(80) + '\n';
        report += 'ERROS ENCONTRADOS\n';
        report += '='.repeat(80) + '\n\n';

        results.errors.forEach((error, index) => {
            report += `${index + 1}. [${error.severity || 'UNKNOWN'}] ${error.type}\n`;
            if (error.page) report += `   Página: ${error.page}\n`;
            report += `   Mensagem: ${error.message}\n`;
            if (error.stack) report += `   Stack: ${error.stack.substring(0, 200)}...\n`;
            report += '\n';
        });
    }

    if (results.networkErrors.length > 0) {
        report += '='.repeat(80) + '\n';
        report += 'ERROS DE REDE\n';
        report += '='.repeat(80) + '\n\n';

        results.networkErrors.forEach((error, index) => {
            report += `${index + 1}. ${error.url || error.endpoint}\n`;
            if (error.method) report += `   Método: ${error.method}\n`;
            if (error.status) report += `   Status: ${error.status} ${error.statusText}\n`;
            if (error.failure) report += `   Falha: ${error.failure}\n`;
            if (error.error) report += `   Erro: ${error.error}\n`;
            report += '\n';
        });
    }

    if (results.warnings.length > 0) {
        report += '='.repeat(80) + '\n';
        report += 'AVISOS\n';
        report += '='.repeat(80) + '\n\n';

        results.warnings.slice(0, 20).forEach((warning, index) => {
            report += `${index + 1}. ${warning.message}\n`;
        });

        if (results.warnings.length > 20) {
            report += `\n... e mais ${results.warnings.length - 20} avisos\n`;
        }
        report += '\n';
    }

    if (results.usabilityIssues.length > 0) {
        report += '='.repeat(80) + '\n';
        report += 'PROBLEMAS DE USABILIDADE\n';
        report += '='.repeat(80) + '\n\n';

        // Agrupar por severidade
        const critical = results.usabilityIssues.filter(i => i.severity === 'CRITICAL');
        const high = results.usabilityIssues.filter(i => i.severity === 'HIGH');
        const medium = results.usabilityIssues.filter(i => i.severity === 'MEDIUM');
        const low = results.usabilityIssues.filter(i => i.severity === 'LOW');

        if (critical.length > 0) {
            report += 'CRÍTICOS:\n';
            critical.forEach((issue, index) => {
                report += `${index + 1}. ${issue.issue}\n`;
                if (issue.page) report += `   Página: ${issue.page}\n`;
                report += `   Recomendação: ${issue.recommendation}\n\n`;
            });
        }

        if (high.length > 0) {
            report += 'ALTOS:\n';
            high.forEach((issue, index) => {
                report += `${index + 1}. ${issue.issue}\n`;
                if (issue.page) report += `   Página: ${issue.page}\n`;
                report += `   Recomendação: ${issue.recommendation}\n\n`;
            });
        }

        if (medium.length > 0) {
            report += 'MÉDIOS:\n';
            medium.forEach((issue, index) => {
                report += `${index + 1}. ${issue.issue}\n`;
                if (issue.page) report += `   Página: ${issue.page}\n`;
                report += `   Recomendação: ${issue.recommendation}\n\n`;
            });
        }

        if (low.length > 0) {
            report += 'BAIXOS:\n';
            low.forEach((issue, index) => {
                report += `${index + 1}. ${issue.issue}\n`;
                if (issue.page) report += `   Página: ${issue.page}\n`;
                report += `   Recomendação: ${issue.recommendation}\n\n`;
            });
        }
    }

    report += '='.repeat(80) + '\n';
    report += 'RECOMENDAÇÕES PRIORITÁRIAS\n';
    report += '='.repeat(80) + '\n\n';

    if (results.summary.criticalIssues > 0) {
        report += '1. URGENTE: Corrigir erros críticos que impedem o funcionamento da aplicação\n';
    }

    if (results.networkErrors.length > 0) {
        report += '2. ALTA: Resolver erros de requisições HTTP e API\n';
    }

    if (results.errors.filter(e => e.type === 'Console Error').length > 0) {
        report += '3. ALTA: Corrigir erros JavaScript no console\n';
    }

    const criticalUsability = results.usabilityIssues.filter(i =>
        i.severity === 'CRITICAL' || i.severity === 'HIGH'
    );
    if (criticalUsability.length > 0) {
        report += '4. MÉDIA-ALTA: Resolver problemas críticos de usabilidade\n';
    }

    const slowPages = results.pages.filter(p => p.loadTime > 3000);
    if (slowPages.length > 0) {
        report += '5. MÉDIA: Otimizar performance das páginas lentas\n';
    }

    report += '\n' + '='.repeat(80) + '\n';
    report += 'FIM DO RELATÓRIO\n';
    report += '='.repeat(80) + '\n';

    return report;
}

// Executar testes
runTests().catch(console.error);
