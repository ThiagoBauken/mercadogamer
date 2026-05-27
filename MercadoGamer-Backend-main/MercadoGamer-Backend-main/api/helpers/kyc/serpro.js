'use strict';

/**
 * Helper de integração com Serpro (Receita Federal) para validação de CPF.
 *
 * Comportamento:
 *   - Se SERPRO_API_TOKEN não estiver no env → modo MOCK (valida só o checksum local)
 *   - Se SERPRO_API_TOKEN estiver setado → faz chamada HTTP real à API CPF Serpro
 *
 * Doc oficial: https://servicos.serpro.gov.br/sandbox/api/consulta-cpf/
 *
 * Custo: ~R$ 0,05 por consulta (produção). Sandbox é gratuito.
 *
 * Use via: const serpro = require('../helpers/kyc/serpro')
 *          await serpro.validateCPF('12345678909', 'João Silva', new Date('1990-01-15'))
 */

const axios = require('axios');

/**
 * Valida o dígito verificador do CPF (algoritmo padrão Brasil).
 * Aceita CPF formatado (123.456.789-09) ou só dígitos.
 */
function isValidCPFChecksum(cpfInput) {
  const cpf = String(cpfInput || '').replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  // Rejeita CPFs com todos dígitos iguais (000.000.000-00 etc — válidos no algoritmo mas inválidos na RF)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i], 10) * (10 - i);
  let d1 = 11 - (sum % 11);
  if (d1 >= 10) d1 = 0;
  if (d1 !== parseInt(cpf[9], 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i], 10) * (11 - i);
  let d2 = 11 - (sum % 11);
  if (d2 >= 10) d2 = 0;
  if (d2 !== parseInt(cpf[10], 10)) return false;

  return true;
}

/**
 * Normaliza nome para comparação fuzzy (remove acentos, case, espaços extras).
 */
function normalizeName(n) {
  return String(n || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validação MOCK — usada quando não temos credencial Serpro.
 * Só checa o checksum do CPF. Em dev/staging isso é suficiente.
 */
async function validateCPFMock(cpf, fullName, birthDate) {
  const cpfClean = String(cpf || '').replace(/\D/g, '');
  if (!isValidCPFChecksum(cpfClean)) {
    return {
      valid: false,
      error: 'CPF inválido (checksum)',
      provider: 'mock',
    };
  }
  // Em mock, sempre considera nome/data como "match"
  return {
    valid: true,
    nameMatches: true,
    birthDateMatches: true,
    provider: 'mock',
    note: 'SERPRO_API_TOKEN não configurado — validação apenas de checksum',
  };
}

/**
 * Validação REAL contra API Serpro Receita Federal.
 * Documentação: https://servicos.serpro.gov.br/sandbox/api/consulta-cpf/
 */
async function validateCPFSerpro(cpf, fullName, birthDate) {
  const cpfClean = String(cpf || '').replace(/\D/g, '');

  // Checksum local antes de gastar consulta na Serpro
  if (!isValidCPFChecksum(cpfClean)) {
    return {
      valid: false,
      error: 'CPF inválido (checksum)',
      provider: 'serpro',
    };
  }

  const token = process.env.SERPRO_API_TOKEN;
  const baseUrl = process.env.SERPRO_BASE_URL || 'https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v1';

  try {
    const response = await axios.get(`${baseUrl}/cpf/${cpfClean}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 8000,
    });

    const data = response.data;
    // Resposta padrão Serpro: { ni, nome, situacao: { codigo: '0' = regular } }
    if (!data || !data.nome) {
      return {
        valid: false,
        error: 'CPF não encontrado na Receita Federal',
        provider: 'serpro',
        raw: data,
      };
    }

    const regularSituation = data.situacao && String(data.situacao.codigo) === '0';
    const nameMatches = normalizeName(data.nome) === normalizeName(fullName);
    const birthDateMatches = birthDate && data.nascimento
      ? new Date(data.nascimento).toISOString().slice(0, 10) === new Date(birthDate).toISOString().slice(0, 10)
      : null;

    return {
      valid: regularSituation,
      nameMatches,
      birthDateMatches,
      provider: 'serpro',
      situation: data.situacao && data.situacao.descricao,
      raw: data,
    };
  } catch (err) {
    // Erros típicos: 404 (CPF não existe), 401 (token), 429 (rate limit), 500 (Serpro fora)
    const status = err.response && err.response.status;
    return {
      valid: false,
      error:
        status === 404
          ? 'CPF não encontrado'
          : status === 401
          ? 'Token Serpro inválido — verifique SERPRO_API_TOKEN'
          : status === 429
          ? 'Rate limit Serpro atingido — tente novamente em 1min'
          : `Falha ao consultar Serpro (status ${status || 'sem resposta'})`,
      provider: 'serpro',
      status,
    };
  }
}

/**
 * Entry point — escolhe mock ou real baseado no env.
 */
async function validateCPF(cpf, fullName, birthDate) {
  if (process.env.SERPRO_API_TOKEN) {
    return validateCPFSerpro(cpf, fullName, birthDate);
  }
  return validateCPFMock(cpf, fullName, birthDate);
}

// Loader do app espera factory: module.exports = (helper) => functionOrObject
module.exports = (helper) => ({
  validateCPF,
  isValidCPFChecksum,
  normalizeName,
  // Exportados pra teste:
  _validateCPFMock: validateCPFMock,
  _validateCPFSerpro: validateCPFSerpro,
});
