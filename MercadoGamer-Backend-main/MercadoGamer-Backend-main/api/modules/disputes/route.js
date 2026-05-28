'use strict';

/**
 * Endpoints de disputas (P0.3).
 *
 *   POST   /api/disputes                 buyer abre disputa
 *   GET    /api/disputes/mine            lista disputas do user logado (como buyer ou seller)
 *   GET    /api/disputes/:id             detalhes de uma disputa (buyer, seller ou admin)
 *   POST   /api/disputes/:id/respond     seller responde
 *   POST   /api/disputes/:id/escalate    buyer escala pra admin
 *   POST   /api/disputes/:id/message     buyer/seller/admin manda mensagem
 *   POST   /api/disputes/:id/cancel      buyer cancela própria disputa
 *   POST   /api/disputes/:id/resolve     admin decide (refund_buyer | release_seller)
 *   GET    /api/disputes/admin/pending   admin lista todas em admin_review
 *
 * Side effects ao abrir disputa:
 *   - order.releaseBlocked = true → cron de escrow ignora a order até resolução
 *   - order.status = 'complaint' (compat com código legado)
 */
module.exports = (module) => {
  const Disputes = () => global.modules.disputes.model;
  const Orders = () => global.modules.orders.model;
  const Users = () => global.modules.users.model;
  const Notifications = () => global.modules.notifications && global.modules.notifications.model;
  const lib = () => module.lib;
  const auth = global.helpers.security.auth;

  // ─── helpers internos ────────────────────────────────────────────────
  function isParticipant(dispute, userId) {
    const uid = String(userId);
    return String(dispute.buyer) === uid || String(dispute.seller) === uid;
  }

  function isAdmin(req) {
    return req.user && req.user.roles && req.user.roles.includes('administrator');
  }

  async function notify(userId, title, description, action, payload) {
    const Model = Notifications();
    if (!Model) return;
    try {
      await Model.create({ user: userId, title, description, action, payload });
    } catch (e) {
      console.warn('[disputes] falha notificação:', e.message);
    }
  }

  function plusHours(h) {
    return new Date(Date.now() + h * 60 * 60 * 1000);
  }

  // ─── POST /api/disputes ──────────────────────────────────────────────
  // body: { orderId, reason, description, evidence?: string[] }
  module.router.post('/', auth(['user']), async (req, res, next) => {
    try {
      const { orderId, reason, description, evidence } = req.body || {};
      if (!orderId || !reason || !description) {
        return next(lib().httpError(400, 'orderId, reason e description são obrigatórios'));
      }

      const order = await Orders().findById(orderId);
      if (!order) return next(lib().httpError(404, 'Pedido não encontrado'));

      // Só o comprador pode abrir
      if (String(order.buyer) !== String(req.user._id)) {
        return next(lib().httpError(403, 'Apenas o comprador pode abrir disputa'));
      }

      // Não dá pra disputar order já liberada/cancelada/devolvida
      if (['released', 'cancelled', 'returned'].includes(order.status)) {
        return next(lib().httpError(400, `Não é possível disputar pedido com status "${order.status}"`));
      }

      // Não permitir duplicata: 1 disputa aberta por order
      const existing = await Disputes().findOne({
        order: order._id,
        status: { $in: ['open', 'awaiting_seller', 'awaiting_buyer', 'admin_review'] },
      });
      if (existing) {
        return next(lib().httpError(400, 'Já existe disputa aberta para este pedido'));
      }

      const dispute = await Disputes().create({
        order: order._id,
        buyer: order.buyer,
        seller: order.seller,
        reason,
        description,
        evidence: Array.isArray(evidence) ? evidence : [],
        status: 'awaiting_seller',
        sellerResponseDeadline: plusHours(48),
        messages: [
          {
            from: 'buyer',
            authorUser: req.user._id,
            content: description,
          },
        ],
      });

      // Bloquear release do escrow
      order.releaseBlocked = true;
      order.status = 'complaint'; // compat com código legado
      await order.save();

      await notify(order.seller, 'Nova disputa', `O comprador abriu disputa no pedido #${order.number || order._id}. Você tem 48h pra responder.`, 'disputeOpened', { disputeId: dispute._id, orderId: order._id });

      res.status(201).json({ data: dispute });
    } catch (e) { next(e); }
  });

  // ─── GET /api/disputes/mine ──────────────────────────────────────────
  module.router.get('/mine', auth(['user']), async (req, res, next) => {
    try {
      const uid = req.user._id;
      const list = await Disputes()
        .find({ $or: [{ buyer: uid }, { seller: uid }] })
        .sort({ createdAt: -1 })
        .limit(200)
        .populate('order', 'number status productPrice')
        .lean();
      res.json({ data: list, count: list.length });
    } catch (e) { next(e); }
  });

  // ─── GET /api/disputes/admin/pending ─────────────────────────────────
  module.router.get('/admin/pending', auth(['administrator']), async (req, res, next) => {
    try {
      const list = await Disputes()
        .find({ status: 'admin_review' })
        .sort({ createdAt: 1 })
        .limit(100)
        .populate('order', 'number status pricePaid sellerProfit')
        .populate('buyer', 'username emailAddress')
        .populate('seller', 'username emailAddress')
        .lean();
      res.json({ data: list, count: list.length });
    } catch (e) { next(e); }
  });

  // ─── GET /api/disputes/:id ───────────────────────────────────────────
  module.router.get('/:id', auth(['user', 'administrator']), async (req, res, next) => {
    try {
      const dispute = await Disputes()
        .findById(req.params.id)
        .populate('order', 'number status pricePaid sellerProfit productPrice releaseScheduledAt')
        .populate('buyer', 'username emailAddress')
        .populate('seller', 'username emailAddress');
      if (!dispute) return next(lib().httpError(404, 'Disputa não encontrada'));

      if (!isAdmin(req) && !isParticipant(dispute, req.user._id)) {
        return next(lib().httpError(403, 'Acesso negado'));
      }

      res.json({ data: dispute });
    } catch (e) { next(e); }
  });

  // ─── POST /api/disputes/:id/respond (seller) ────────────────────────
  // body: { response: string, evidence?: string[] }
  module.router.post('/:id/respond', auth(['user']), async (req, res, next) => {
    try {
      const { response, evidence } = req.body || {};
      if (!response) return next(lib().httpError(400, 'Campo "response" obrigatório'));

      const dispute = await Disputes().findById(req.params.id);
      if (!dispute) return next(lib().httpError(404, 'Disputa não encontrada'));
      if (String(dispute.seller) !== String(req.user._id)) {
        return next(lib().httpError(403, 'Apenas o vendedor pode responder'));
      }
      if (!['open', 'awaiting_seller'].includes(dispute.status)) {
        return next(lib().httpError(400, 'Disputa não está aguardando resposta do vendedor'));
      }

      dispute.messages.push({
        from: 'seller',
        authorUser: req.user._id,
        content: response,
      });
      if (Array.isArray(evidence)) {
        dispute.evidence = [...(dispute.evidence || []), ...evidence];
      }
      dispute.status = 'awaiting_buyer';
      await dispute.save();

      await notify(dispute.buyer, 'Vendedor respondeu', `O vendedor respondeu sua disputa.`, 'disputeResponded', { disputeId: dispute._id });

      res.json({ data: dispute });
    } catch (e) { next(e); }
  });

  // ─── POST /api/disputes/:id/escalate (buyer) ────────────────────────
  module.router.post('/:id/escalate', auth(['user']), async (req, res, next) => {
    try {
      const dispute = await Disputes().findById(req.params.id);
      if (!dispute) return next(lib().httpError(404, 'Disputa não encontrada'));
      if (String(dispute.buyer) !== String(req.user._id)) {
        return next(lib().httpError(403, 'Apenas o comprador pode escalar'));
      }
      if (!['awaiting_buyer', 'awaiting_seller'].includes(dispute.status)) {
        return next(lib().httpError(400, 'Disputa não pode ser escalada nesta fase'));
      }

      const reason = (req.body && req.body.reason) || 'Não aceito a resposta do vendedor';
      dispute.messages.push({
        from: 'buyer',
        authorUser: req.user._id,
        content: `[escalada] ${reason}`,
      });
      dispute.status = 'admin_review';
      await dispute.save();

      // Notificar admins via console (TODO: notification real quando tiver dashboard)
      console.log(`[disputes] ESCALADA dispute=${dispute._id} order=${dispute.order}`);

      res.json({ data: dispute });
    } catch (e) { next(e); }
  });

  // ─── POST /api/disputes/:id/message ──────────────────────────────────
  // body: { content: string }
  module.router.post('/:id/message', auth(['user', 'administrator']), async (req, res, next) => {
    try {
      const { content } = req.body || {};
      if (!content) return next(lib().httpError(400, 'content obrigatório'));

      const dispute = await Disputes().findById(req.params.id);
      if (!dispute) return next(lib().httpError(404, 'Disputa não encontrada'));

      let from;
      if (isAdmin(req)) {
        from = 'admin';
      } else if (String(dispute.buyer) === String(req.user._id)) {
        from = 'buyer';
      } else if (String(dispute.seller) === String(req.user._id)) {
        from = 'seller';
      } else {
        return next(lib().httpError(403, 'Acesso negado'));
      }

      if (['resolved_buyer', 'resolved_seller', 'cancelled'].includes(dispute.status)) {
        return next(lib().httpError(400, 'Disputa encerrada — não é mais possível enviar mensagem'));
      }

      dispute.messages.push({
        from,
        authorUser: req.user._id,
        content,
      });
      await dispute.save();
      res.json({ data: dispute });
    } catch (e) { next(e); }
  });

  // ─── POST /api/disputes/:id/cancel (buyer) ──────────────────────────
  module.router.post('/:id/cancel', auth(['user']), async (req, res, next) => {
    try {
      const dispute = await Disputes().findById(req.params.id);
      if (!dispute) return next(lib().httpError(404, 'Disputa não encontrada'));
      if (String(dispute.buyer) !== String(req.user._id)) {
        return next(lib().httpError(403, 'Apenas o comprador pode cancelar'));
      }
      // Buyer pode cancelar enquanto a disputa ainda não foi resolvida
      if (!['open', 'awaiting_seller', 'awaiting_buyer', 'admin_review'].includes(dispute.status)) {
        return next(lib().httpError(400, 'Disputa já encerrada — não pode ser cancelada'));
      }

      dispute.status = 'cancelled';
      dispute.resolvedAt = new Date();
      await dispute.save();

      // Desbloquear escrow — order volta pro fluxo normal
      const order = await Orders().findById(dispute.order);
      if (order) {
        order.releaseBlocked = false;
        if (order.status === 'complaint') {
          order.status = 'held'; // volta pro escrow normal
        }
        await order.save();
      }

      await notify(dispute.seller, 'Disputa cancelada', `Comprador cancelou a disputa #${dispute._id}`, 'disputeResolved', { disputeId: dispute._id });

      res.json({ data: dispute });
    } catch (e) { next(e); }
  });

  // ─── POST /api/disputes/:id/resolve (admin only) ────────────────────
  // body: { decision: 'refund_buyer' | 'release_seller', reason, refundAmount? }
  module.router.post('/:id/resolve', auth(['administrator']), async (req, res, next) => {
    try {
      const { decision, reason, refundAmount } = req.body || {};
      if (!['refund_buyer', 'release_seller'].includes(decision)) {
        return next(lib().httpError(400, 'decision deve ser refund_buyer ou release_seller'));
      }
      if (!reason) return next(lib().httpError(400, 'reason obrigatório'));

      const dispute = await Disputes().findById(req.params.id);
      if (!dispute) return next(lib().httpError(404, 'Disputa não encontrada'));
      if (['resolved_buyer', 'resolved_seller', 'cancelled'].includes(dispute.status)) {
        return next(lib().httpError(400, 'Disputa já resolvida'));
      }

      const order = await Orders().findById(dispute.order);
      if (!order) return next(lib().httpError(404, 'Pedido associado não encontrado'));

      const amount = order.escrowAmount || order.sellerProfit || 0;

      if (decision === 'release_seller') {
        // Libera escrow pro vendedor (mesmo fluxo do cron)
        await Users().updateOne(
          { _id: order.seller },
          { $inc: { balance: amount } }
        );
        order.status = 'released';
        order.releasedAt = new Date();
        order.releaseBlocked = false;
        await order.save();

        dispute.status = 'resolved_seller';
        await notify(dispute.seller, 'Disputa resolvida ao seu favor', `R$ ${amount.toFixed(2)} liberado no seu saldo`, 'disputeResolved', { disputeId: dispute._id });
        await notify(dispute.buyer, 'Disputa decidida', `Admin decidiu a favor do vendedor. Motivo: ${reason}`, 'disputeResolved', { disputeId: dispute._id });
      } else {
        // refund_buyer — devolve pricePaid (ou refundAmount) pro buyer
        const refund = typeof refundAmount === 'number' ? refundAmount : (order.pricePaid || amount);
        await Users().updateOne(
          { _id: order.buyer },
          { $inc: { balance: refund } }
        );
        order.status = 'cancelled';
        order.cancelDate = new Date();
        order.reimbursed = true;
        order.releaseBlocked = false;
        await order.save();

        dispute.status = 'resolved_buyer';
        dispute.resolution = dispute.resolution || {};
        dispute.resolution.refundAmount = refund;
        await notify(dispute.buyer, 'Reembolso aprovado', `R$ ${refund.toFixed(2)} devolvido ao seu saldo`, 'disputeResolved', { disputeId: dispute._id });
        await notify(dispute.seller, 'Disputa decidida', `Admin decidiu pelo reembolso. Motivo: ${reason}`, 'disputeResolved', { disputeId: dispute._id });
      }

      dispute.resolution = {
        ...(dispute.resolution || {}),
        decision,
        decidedBy: req.user._id,
        reason,
        decidedAt: new Date(),
      };
      dispute.resolvedAt = new Date();
      await dispute.save();

      res.json({ data: dispute });
    } catch (e) { next(e); }
  });
};
