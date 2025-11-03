// =====================================================
// AWS SNS SMS - DESATIVADO (migrado para Docker)
// =====================================================
// Para reativar SMS, considere usar Twilio ou outro provedor
// const AWS = require('aws-sdk');

export const sendSmsToPhone = (mobileNo, message) => {
  console.log('[SMS] Função desativada - SMS enviado para:', mobileNo);
  console.log('[SMS] Mensagem:', message);
  console.warn('[AVISO] Funcionalidade de SMS está desativada. Configure Twilio ou outro provedor se necessário.');

  // Mock de sucesso para não quebrar o código
  return Promise.resolve({
    MessageId: 'mock-message-id',
    message: 'SMS mock (funcionalidade desativada)',
  });

  /*
  // ===== CÓDIGO ORIGINAL AWS SNS (comentado) =====
  var params = {
    Message: message,
    PhoneNumber: mobileNo,
  };

  return new AWS.SNS({ apiVersion: '2010–03–31' })
    .publish(params)
    .promise()
    .then((message) => {
      console.log('message=>', { message });
      console.log('OTP SEND SUCCESS', { message });
    })
    .catch((err) => {
      console.log('Error ' + err);
      return err;
    });
  */
};
