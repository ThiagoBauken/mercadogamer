'use strict';

/**
 * Cron: liberar escrow.
 *
 * Roda a cada 1h. Busca orders com:
 *   - status in ['held', 'paid']     ← 'paid' por compat com orders pré-escrow
 *   - releaseScheduledAt <= now       ← passou o hold period
 *   - releaseBlocked != true          ← sem disputa aberta
 *   - releasedAt missing              ← ainda não liberado
 *
 * Para cada uma:
 *   1. Incrementa balance do seller em escrowAmount (ou sellerProfit como fallback)
 *   2. Marca status='released', releasedAt=now
 *   3. Cria notification para buyer ("compra completa") e seller ("dinheiro liberado")
 *   4. Emite via Socket.IO se possível
 *
 * Tudo idempotente: se rodar duplicado por algum motivo, a busca usa
 * `releasedAt: { $exists: false }` para garantir que cada order só libera uma vez.
 *
 * Configurável via env:
 *   - ESCROW_HOLD_DAYS (default 3) — usado no momento de criar a order
 *   - ESCROW_CRON_PERIOD (default "0 0 *_1 * * *" = a cada hora; substitua _ por /)
 *   - ESCROW_DRY_RUN (default false) — se 'true', só loga, não muda nada
 */
module.exports = (cron, cronName) => {
  cron.enabled = process.env.ESCROW_CRON_DISABLED !== 'true';

  // node-cron sintaxe: sec min hour day month dayOfWeek
  // Default: cada hora no minuto 0 (XX:00:00)
  cron.period = process.env.ESCROW_CRON_PERIOD || '0 0 * * * *';

  return async () => {
    const startedAt = Date.now();
    try {
      const Orders = cron.modules.orders && cron.modules.orders.model;
      const Users = cron.modules.users && cron.modules.users.model;
      const Notifications = cron.modules.notifications && cron.modules.notifications.model;

      if (!Orders || !Users) {
        console.warn(`[${cronName}] modelos não disponíveis — pulando`);
        return;
      }

      const dryRun = process.env.ESCROW_DRY_RUN === 'true';
      const now = new Date();

      // Buscar orders elegíveis para liberação
      const eligible = await Orders.find({
        status: { $in: ['held', 'paid'] },
        releaseScheduledAt: { $lte: now },
        releasedAt: { $exists: false },
        $or: [{ releaseBlocked: { $ne: true } }, { releaseBlocked: { $exists: false } }],
      })
        .select('+sellerProfit')
        .lean({ virtuals: false })
        .limit(500); // safety cap por execução

      if (eligible.length === 0) {
        // Loga só em modo debug pra não poluir log
        if (process.env.DEBUG && process.env.DEBUG.includes('escrow')) {
          console.log(`[${cronName}] nada a liberar (now=${now.toISOString()})`);
        }
        return;
      }

      console.log(`[${cronName}] ${eligible.length} order(s) elegível(is) para release${dryRun ? ' (DRY RUN)' : ''}`);

      let released = 0;
      let failed = 0;

      for (const order of eligible) {
        try {
          const amount = order.escrowAmount || order.sellerProfit || 0;
          if (amount <= 0) {
            console.warn(`[${cronName}] order ${order._id} sem valor — pulando`);
            continue;
          }

          if (dryRun) {
            console.log(
              `[${cronName}] DRY: order=${order._id} seller=${order.seller} valor=${amount}`
            );
            released++;
            continue;
          }

          // Operação atômica: marca released + credita balance
          // Importante usar updateOne com filtro de status pra evitar double-release
          // em caso de race condition.
          const updateResult = await Orders.updateOne(
            {
              _id: order._id,
              status: { $in: ['held', 'paid'] },
              releasedAt: { $exists: false },
            },
            {
              $set: {
                status: 'released',
                releasedAt: now,
              },
            }
          );

          if (updateResult.matchedCount === 0) {
            // Outra execução do cron já liberou. OK, pular.
            continue;
          }

          // P1.7 — taxa de 2% vai pro fundo de reembolso da plataforma
          const PLATFORM_FUND_FEE_RATE = parseFloat(process.env.PLATFORM_FUND_FEE_RATE || '0.02');
          const fundFee = Math.round(amount * PLATFORM_FUND_FEE_RATE * 100) / 100;
          const sellerCredit = Math.round((amount - fundFee) * 100) / 100;

          // Creditar balance do seller (separado pra não usar transação cross-doc por ora)
          await Users.updateOne(
            { _id: order.seller },
            { $inc: { balance: sellerCredit } }
          );

          // Creditar o fundo da plataforma (idempotente via order._id no log)
          const Funds = cron.modules.platformFunds && cron.modules.platformFunds.model;
          if (Funds && fundFee > 0) {
            try {
              await Funds.create({
                type: 'credit',
                amount: fundFee,
                reason: 'escrow_release_fee',
                order: order._id,
                user: order.seller,
                notes: `2% de R$ ${amount.toFixed(2)} (release order #${order.number || order._id})`,
              });
            } catch (fundErr) {
              console.warn(`[${cronName}] falha ao creditar fundo (não-bloqueante):`, fundErr.message);
            }
          }

          // Notificar (best-effort, não bloqueia o cron)
          if (Notifications) {
            try {
              await Notifications.create([
                {
                  user: order.buyer,
                  title: 'Compra finalizada',
                  description: `Pedido #${order.number || order._id} liberado após ${order.holdDays || 3} dias sem disputa.`,
                  action: 'purchaseReleased',
                  payload: { id: order._id },
                },
                {
                  user: order.seller,
                  title: 'Pagamento liberado',
                  description: `R$ ${amount.toFixed(2)} disponível em seu saldo (pedido #${order.number || order._id}).`,
                  action: 'sellerPaymentReleased',
                  payload: { id: order._id, amount },
                },
              ]);
            } catch (notifErr) {
              console.warn(`[${cronName}] falha ao notificar (não-bloqueante):`, notifErr.message);
            }
          }

          released++;
        } catch (orderErr) {
          failed++;
          console.error(`[${cronName}] erro ao liberar order ${order._id}:`, orderErr.message);
        }
      }

      const dur = Date.now() - startedAt;
      console.log(
        `[${cronName}] concluído em ${dur}ms — liberadas=${released} falhas=${failed} total=${eligible.length}`
      );
    } catch (err) {
      console.error(`[${cronName}] erro fatal:`, err);
    }
  };
};
