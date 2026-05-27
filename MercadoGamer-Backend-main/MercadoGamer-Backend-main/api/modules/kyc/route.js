'use strict';

const crypto = require('crypto');

/**
 * Módulo KYC — Know Your Customer nível 1.
 *
 * Endpoints:
 *   GET  /api/kyc/status                      — retorna nível atual + checklist
 *   POST /api/kyc/send-email-verification     — gera token e (mock) envia email
 *   POST /api/kyc/verify-email                — confirma email via token
 *   POST /api/kyc/send-phone-verification     — gera código SMS
 *   POST /api/kyc/verify-phone                — confirma código SMS
 *   POST /api/kyc/submit-cpf                  — submete CPF/nome/dataNasc e valida via Serpro
 *
 * Promoção automática para kycLevel = 1 quando os 3 (email + phone + CPF) estão verificados.
 */
module.exports = (module) => {
  const Users = () => global.modules.users.model;
  const KycLog = () => global.modules.kyc.model;
  const serpro = () => global.helpers.kyc.serpro;
  const auth = () => global.helpers.security.auth;
  const lib = () => module.lib;

  // ──────────────────────────────────────────────────────────
  // Helpers internos
  // ──────────────────────────────────────────────────────────
  function randomToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }
  function random6DigitCode() {
    return String(crypto.randomInt(100000, 1000000));
  }
  function plusMinutes(min) {
    return new Date(Date.now() + min * 60 * 1000);
  }

  /**
   * Recalcula kycLevel baseado nas flags. Chame após qualquer verificação positiva.
   */
  async function recomputeKycLevel(userDoc) {
    let level = 0;
    if (userDoc.verifiedEmail && userDoc.verifiedPhone && userDoc.verifiedCPF) {
      level = 1;
    }
    // futuramente: nível 2 = + documento, nível 3 = + endereço
    if (level !== userDoc.kycLevel) {
      userDoc.kycLevel = level;
      if (level === 1 && !userDoc.kycVerifiedAt) {
        userDoc.kycVerifiedAt = new Date();
      }
    }
    await userDoc.save();
    return userDoc;
  }

  async function logAttempt(userId, type, status, data = {}, providerResponse = null, failureReason = null, req = null) {
    try {
      await KycLog().create({
        user: userId,
        type,
        status,
        data,
        providerResponse,
        failureReason,
        ipAddress: req && (req.ip || req.connection?.remoteAddress),
        userAgent: req && req.headers && req.headers['user-agent'],
        verifiedAt: status === 'verified' ? new Date() : undefined,
      });
    } catch (e) {
      console.error('Falha ao gravar log KYC:', e.message);
    }
  }

  // ──────────────────────────────────────────────────────────
  // GET /api/kyc/status
  // ──────────────────────────────────────────────────────────
  module.router.get('/status', global.helpers.security.auth(['user']), async (req, res, next) => {
    try {
      const user = await Users().findById(req.user._id);
      if (!user) return next(lib().httpError(404, 'Usuário não encontrado'));

      res.json({
        kycLevel: user.kycLevel || 0,
        checklist: {
          email: user.verifiedEmail || false,
          phone: user.verifiedPhone || false,
          cpf: user.verifiedCPF || false,
        },
        canSell: (user.kycLevel || 0) >= 1,
        canWithdraw: (user.kycLevel || 0) >= 1,
        submittedAt: user.kycSubmittedAt,
        verifiedAt: user.kycVerifiedAt,
      });
    } catch (e) {
      next(e);
    }
  });

  // ──────────────────────────────────────────────────────────
  // POST /api/kyc/send-email-verification
  // ──────────────────────────────────────────────────────────
  module.router.post('/send-email-verification', global.helpers.security.auth(['user']), async (req, res, next) => {
    try {
      const user = await Users().findById(req.user._id);
      if (!user) return next(lib().httpError(404, 'Usuário não encontrado'));
      if (user.verifiedEmail) {
        return res.json({ message: 'Email já verificado', verifiedEmail: true });
      }

      const token = randomToken(32);
      user.emailVerificationToken = token;
      user.emailVerificationExpiresAt = plusMinutes(60 * 24); // 24h
      await user.save();

      await logAttempt(user._id, 'email', 'pending', { emailAddress: user.emailAddress }, null, null, req);

      // Email real via nodemailer (se configurado em settings.nodemailer)
      // Por ora apenas log do link. Em produção, envia com helper.mail.send se disponível.
      const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/verify-email?token=${token}`;
      console.log(`[KYC] Link de verificação de email para ${user.emailAddress}: ${verificationLink}`);

      try {
        if (global.helpers.mail && global.helpers.mail.send) {
          await global.helpers.mail.send({
            to: user.emailAddress,
            subject: 'MercadoGamer — Confirme seu email',
            html: `<p>Olá ${user.firstName || user.username},</p>
                   <p>Clique no link para confirmar seu email:</p>
                   <p><a href="${verificationLink}">${verificationLink}</a></p>
                   <p>O link expira em 24h.</p>`,
          });
        }
      } catch (mailErr) {
        console.warn('[KYC] Falha ao enviar email (não-bloqueante):', mailErr.message);
      }

      res.json({
        message: 'Email de verificação enviado',
        // DEV ONLY: devolve link pra facilitar testes. Em produção, REMOVER.
        ...(process.env.NODE_ENV !== 'production' && { devVerificationLink: verificationLink }),
      });
    } catch (e) {
      next(e);
    }
  });

  // ──────────────────────────────────────────────────────────
  // POST /api/kyc/verify-email   { token }
  // ──────────────────────────────────────────────────────────
  module.router.post('/verify-email', global.helpers.security.auth(['user']), async (req, res, next) => {
    try {
      // IMPORTANTE: auth middleware lê `req.body.token` como JWT — usar nome diferente
      const { verificationToken } = req.body || {};
      if (!verificationToken) return next(lib().httpError(400, 'verificationToken requerido'));
      const token = verificationToken;

      const user = await Users()
        .findById(req.user._id)
        .select('+emailVerificationToken +emailVerificationExpiresAt');
      if (!user) return next(lib().httpError(404, 'Usuário não encontrado'));
      if (user.verifiedEmail) {
        return res.json({ message: 'Email já verificado', verifiedEmail: true });
      }
      if (!user.emailVerificationToken || user.emailVerificationToken !== token) {
        await logAttempt(user._id, 'email', 'failed', { tokenReceived: token }, null, 'token inválido', req);
        return next(lib().httpError(400, 'Token inválido'));
      }
      if (user.emailVerificationExpiresAt && user.emailVerificationExpiresAt < new Date()) {
        await logAttempt(user._id, 'email', 'failed', {}, null, 'token expirado', req);
        return next(lib().httpError(400, 'Token expirado — solicite novo'));
      }

      user.verifiedEmail = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpiresAt = undefined;
      await user.save();

      await logAttempt(user._id, 'email', 'verified', {}, null, null, req);
      await recomputeKycLevel(user);

      res.json({ message: 'Email verificado com sucesso', verifiedEmail: true, kycLevel: user.kycLevel });
    } catch (e) {
      next(e);
    }
  });

  // ──────────────────────────────────────────────────────────
  // POST /api/kyc/send-phone-verification
  // ──────────────────────────────────────────────────────────
  module.router.post('/send-phone-verification', global.helpers.security.auth(['user']), async (req, res, next) => {
    try {
      const user = await Users().findById(req.user._id);
      if (!user) return next(lib().httpError(404, 'Usuário não encontrado'));
      if (!user.phoneNumber) {
        return next(lib().httpError(400, 'Cadastre um telefone antes de verificar'));
      }
      if (user.verifiedPhone) {
        return res.json({ message: 'Telefone já verificado', verifiedPhone: true });
      }

      const code = random6DigitCode();
      user.phoneVerificationCode = code;
      user.phoneVerificationExpiresAt = plusMinutes(10);
      user.phoneVerificationAttempts = 0;
      await user.save();

      await logAttempt(user._id, 'phone', 'pending', { phoneNumber: user.phoneNumber }, null, null, req);

      // Tentar Twilio se configurado, senão MOCK
      const message = `MercadoGamer: seu código é ${code}. Válido por 10min.`;
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
          const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
          await twilio.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: user.phoneNumber,
          });
        } catch (twilioErr) {
          console.warn('[KYC] Falha Twilio (não-bloqueante):', twilioErr.message);
        }
      } else {
        console.log(`[KYC] (MOCK) SMS para ${user.phoneNumber}: ${message}`);
      }

      res.json({
        message: 'Código SMS enviado',
        ...(process.env.NODE_ENV !== 'production' && { devCode: code }),
      });
    } catch (e) {
      next(e);
    }
  });

  // ──────────────────────────────────────────────────────────
  // POST /api/kyc/verify-phone   { code }
  // ──────────────────────────────────────────────────────────
  module.router.post('/verify-phone', global.helpers.security.auth(['user']), async (req, res, next) => {
    try {
      const { code } = req.body || {};
      if (!code) return next(lib().httpError(400, 'Código requerido'));

      const user = await Users()
        .findById(req.user._id)
        .select('+phoneVerificationCode +phoneVerificationExpiresAt +phoneVerificationAttempts');
      if (!user) return next(lib().httpError(404, 'Usuário não encontrado'));
      if (user.verifiedPhone) {
        return res.json({ message: 'Telefone já verificado', verifiedPhone: true });
      }
      if (!user.phoneVerificationCode) {
        return next(lib().httpError(400, 'Solicite um código primeiro'));
      }
      if (user.phoneVerificationExpiresAt && user.phoneVerificationExpiresAt < new Date()) {
        await logAttempt(user._id, 'phone', 'failed', {}, null, 'código expirado', req);
        return next(lib().httpError(400, 'Código expirado — solicite novo'));
      }
      if ((user.phoneVerificationAttempts || 0) >= 5) {
        await logAttempt(user._id, 'phone', 'failed', {}, null, 'tentativas excedidas', req);
        return next(lib().httpError(429, 'Muitas tentativas — solicite novo código'));
      }
      if (String(code).trim() !== user.phoneVerificationCode) {
        user.phoneVerificationAttempts = (user.phoneVerificationAttempts || 0) + 1;
        await user.save();
        await logAttempt(user._id, 'phone', 'failed', {}, null, 'código incorreto', req);
        return next(lib().httpError(400, 'Código incorreto'));
      }

      user.verifiedPhone = true;
      user.verificationSms = true; // compat com flag legada
      user.phoneVerificationCode = undefined;
      user.phoneVerificationExpiresAt = undefined;
      user.phoneVerificationAttempts = 0;
      await user.save();

      await logAttempt(user._id, 'phone', 'verified', {}, null, null, req);
      await recomputeKycLevel(user);

      res.json({ message: 'Telefone verificado', verifiedPhone: true, kycLevel: user.kycLevel });
    } catch (e) {
      next(e);
    }
  });

  // ──────────────────────────────────────────────────────────
  // POST /api/kyc/submit-cpf  { cpf, fullName, birthDate }
  // ──────────────────────────────────────────────────────────
  module.router.post('/submit-cpf', global.helpers.security.auth(['user']), async (req, res, next) => {
    try {
      const { cpf, fullName, birthDate } = req.body || {};
      if (!cpf || !fullName || !birthDate) {
        return next(lib().httpError(400, 'cpf, fullName e birthDate são obrigatórios'));
      }

      const user = await Users().findById(req.user._id);
      if (!user) return next(lib().httpError(404, 'Usuário não encontrado'));
      if (user.verifiedCPF) {
        return res.json({ message: 'CPF já verificado', verifiedCPF: true });
      }

      const cpfClean = String(cpf).replace(/\D/g, '');

      // Verificar duplicidade (outro user já com esse CPF?)
      const existing = await Users().findOne({ cpf: cpfClean, _id: { $ne: user._id } });
      if (existing) {
        await logAttempt(user._id, 'cpf', 'failed', { cpf: cpfClean }, null, 'cpf duplicado', req);
        return next(lib().httpError(400, 'CPF já cadastrado em outra conta'));
      }

      // Chamar Serpro (ou mock)
      const result = await serpro().validateCPF(cpfClean, fullName, birthDate);
      if (!result.valid) {
        await logAttempt(user._id, 'cpf', 'failed', { cpf: cpfClean }, result, result.error, req);
        return next(lib().httpError(400, result.error || 'CPF inválido'));
      }

      // Se provedor real e nome não bate, rejeita. Mock retorna sempre true.
      if (result.provider === 'serpro' && result.nameMatches === false) {
        await logAttempt(user._id, 'cpf', 'failed', { cpf: cpfClean }, result, 'nome não confere com CPF', req);
        return next(lib().httpError(400, 'Nome informado não confere com o registrado na Receita Federal'));
      }

      user.cpf = cpfClean;
      user.fullName = fullName;
      user.birthDate = new Date(birthDate);
      user.verifiedCPF = true;
      user.kycSubmittedAt = user.kycSubmittedAt || new Date();
      await user.save();

      await logAttempt(user._id, 'cpf', 'verified', { cpf: cpfClean, provider: result.provider }, result, null, req);
      await recomputeKycLevel(user);

      res.json({
        message: 'CPF verificado com sucesso',
        verifiedCPF: true,
        kycLevel: user.kycLevel,
        provider: result.provider,
      });
    } catch (e) {
      next(e);
    }
  });
};
