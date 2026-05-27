// =====================================================
// AWS SNS SMS - DESATIVADO (migrado para Docker)
// =====================================================
// Para reativar SMS, considere usar Twilio ou outro provedor

const sendSmsToPhone = (mobileNo, message) => {
  console.log('[SMS] Função desativada - SMS enviado para:', mobileNo);
  console.log('[SMS] Mensagem:', message);
  console.warn('[AVISO] Funcionalidade de SMS está desativada. Configure Twilio ou outro provedor se necessário.');

  // Mock de sucesso para não quebrar o código
  return Promise.resolve({
    MessageId: 'mock-message-id',
    message: 'SMS mock (funcionalidade desativada)',
  });
};

module.exports = { sendSmsToPhone };
