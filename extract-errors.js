const fs = require('fs');
const data = JSON.parse(fs.readFileSync('qa-report.json'));

console.log('=== ERROS DE REDE (TOP 20) ===\n');
const uniques = new Map();
data.networkErrors.forEach(err => {
    const key = err.url || err.endpoint || err.failure || 'unknown';
    if (!uniques.has(key)) {
        uniques.set(key, err);
    }
});

Array.from(uniques.values()).slice(0, 20).forEach((err, i) => {
    const status = err.status || '';
    const url = (err.url || err.endpoint || err.failure || '').substring(0, 100);
    console.log(`${i+1}. ${status} - ${url}`);
});

console.log('\n=== ERROS REACT PROPS (Detalhados) ===\n');
const reactPropErrors = data.errors.filter(e =>
    e.message && e.message.includes('React does not recognize')
);

const propTypes = new Map();
reactPropErrors.forEach(err => {
    const match = err.message.match(/`([^`]+)` prop/);
    if (match) {
        const prop = match[1];
        if (!propTypes.has(prop)) {
            propTypes.set(prop, 1);
        } else {
            propTypes.set(prop, propTypes.get(prop) + 1);
        }
    }
});

console.log('Props inválidas enviadas ao DOM:');
Array.from(propTypes.entries()).sort((a, b) => b[1] - a[1]).forEach(([prop, count]) => {
    console.log(`  - "${prop}": ${count} ocorrências`);
});

console.log('\n=== WARNINGS STYLED-COMPONENTS ===\n');
const styledWarnings = data.warnings.filter(w =>
    w.message && w.message.includes('styled-components')
);

const styledProps = new Map();
styledWarnings.forEach(warn => {
    const match = warn.message.match(/unknown prop "([^"]+)"/);
    if (match) {
        const prop = match[1];
        if (!styledProps.has(prop)) {
            styledProps.set(prop, 1);
        } else {
            styledProps.set(prop, styledProps.get(prop) + 1);
        }
    }
});

console.log('Props desconhecidas no styled-components:');
Array.from(styledProps.entries()).sort((a, b) => b[1] - a[1]).forEach(([prop, count]) => {
    console.log(`  - "${prop}": ${count} ocorrências`);
});

console.log('\n=== ERROS DE API 404 ===\n');
const api404 = data.networkErrors.filter(e =>
    e.status === 404 && (e.url || '').includes('/api/')
);
api404.forEach((err, i) => {
    console.log(`${i+1}. ${err.url}`);
});
