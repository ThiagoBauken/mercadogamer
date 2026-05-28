'use strict';

/**
 * Platform Funds endpoints (P1.7).
 *
 *   GET  /api/platformFunds/balance              public — saldo atual + total históricos
 *   GET  /api/platformFunds/transactions         admin — lista paginada de movimentações
 *   POST /api/platformFunds/refund               admin — usa fundo pra reembolsar buyer numa disputa
 *
 * Fee de 2% por release de escrow vai ser aplicado pelo cron de escrow
 * (modules/crons/escrow/release_escrow.js — quando libera para seller, cria
 * automaticamente um credit no platformFunds com reason='escrow_release_fee').
 */
module.exports = (module) => {
  const Funds = () => global.modules.platformFunds.model;
  const Users = () => global.modules.users.model;
  const Disputes = () => global.modules.disputes.model;
  const auth = global.helpers.security.auth;
  const lib = () => module.lib;

  /**
   * GET /api/platformFunds/balance — público
   * Transparência: comprador vê quanto a plataforma tem em fundo de reembolso.
   * Aumenta confiança (GGMax e Desapego não mostram isso).
   */
  module.router.get('/balance', async (req, res, next) => {
    try {
      const agg = await Funds().aggregate([
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]);
      const credits = agg.find((a) => a._id === 'credit') || { total: 0, count: 0 };
      const debits = agg.find((a) => a._id === 'debit') || { total: 0, count: 0 };
      const balance = credits.total - debits.total;

      res.json({
        balance: Math.round(balance * 100) / 100,
        totalCredits: credits.total,
        totalDebits: debits.total,
        creditTransactions: credits.count,
        debitTransactions: debits.count,
        explanation:
          'O fundo é alimentado por 2% de cada venda liberada. Usado para garantir reembolsos quando o vendedor não tem saldo suficiente.',
      });
    } catch (e) {
      next(e);
    }
  });

  /**
   * GET /api/platformFunds/transactions — admin only
   * Query params: ?type=credit|debit, ?page=0, ?perPage=50
   */
  module.router.get('/transactions', auth(['administrator']), async (req, res, next) => {
    try {
      const { type } = req.query;
      const page = Math.max(0, parseInt(req.query.page) || 0);
      const perPage = Math.min(200, Math.max(1, parseInt(req.query.perPage) || 50));

      const query = {};
      if (type) query.type = type;

      const [data, count] = await Promise.all([
        Funds()
          .find(query)
          .populate('user', 'username emailAddress')
          .populate('order', 'number pricePaid')
          .sort({ createdAt: -1 })
          .skip(page * perPage)
          .limit(perPage)
          .lean(),
        Funds().countDocuments(query),
      ]);

      res.json({ data, count, page, perPage });
    } catch (e) {
      next(e);
    }
  });

  /**
   * POST /api/platformFunds/refund — admin
   * Body: { disputeId, amount, notes? }
   * Cria debit no fundo + credita o balance do comprador.
   * Usado quando dispute resolveu favor buyer mas vendedor já sacou.
   */
  module.router.post('/refund', auth(['administrator']), async (req, res, next) => {
    try {
      const { disputeId, amount, notes } = req.body || {};
      if (!disputeId || !amount || amount <= 0) {
        return next(lib().httpError(400, 'disputeId e amount (>0) são obrigatórios'));
      }

      const dispute = await Disputes().findById(disputeId);
      if (!dispute) return next(lib().httpError(404, 'Disputa não encontrada'));

      // Verificar saldo atual do fundo
      const agg = await Funds().aggregate([
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]);
      const credits = agg.find((a) => a._id === 'credit')?.total || 0;
      const debits = agg.find((a) => a._id === 'debit')?.total || 0;
      const balance = credits - debits;

      if (balance < amount) {
        return next(
          lib().httpError(
            400,
            `Fundo insuficiente. Disponível: R$ ${balance.toFixed(2)}. Solicitado: R$ ${amount.toFixed(2)}`
          )
        );
      }

      // Criar debit no fundo
      await Funds().create({
        type: 'debit',
        amount,
        reason: 'dispute_refund',
        dispute: dispute._id,
        order: dispute.order,
        user: dispute.buyer,
        authorAdmin: req.user._id,
        notes: notes || `Reembolso da disputa ${dispute._id}`,
      });

      // Creditar buyer
      await Users().updateOne(
        { _id: dispute.buyer },
        { $inc: { balance: amount } }
      );

      res.json({
        message: 'Reembolso pago do fundo da plataforma',
        amount,
        newFundBalance: balance - amount,
      });
    } catch (e) {
      next(e);
    }
  });

  /**
   * POST /api/platformFunds/manual-adjustment — admin (raro, mas útil)
   * Body: { type: 'credit'|'debit', amount, notes }
   */
  module.router.post('/manual-adjustment', auth(['administrator']), async (req, res, next) => {
    try {
      const { type, amount, notes } = req.body || {};
      if (!['credit', 'debit'].includes(type) || !amount || amount <= 0) {
        return next(lib().httpError(400, 'type (credit|debit), amount (>0) e notes são obrigatórios'));
      }
      if (!notes) return next(lib().httpError(400, 'notes obrigatório para auditoria'));

      const tx = await Funds().create({
        type,
        amount,
        reason: 'manual_adjustment',
        authorAdmin: req.user._id,
        notes,
      });

      res.json({ message: 'Ajuste registrado', transaction: tx });
    } catch (e) {
      next(e);
    }
  });
};
