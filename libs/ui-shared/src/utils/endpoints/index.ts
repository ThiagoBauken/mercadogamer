// @ts-nocheck - TypeScript compatibility fix
const serverUrl = process.env['NEXT_PUBLIC_SERVER_URL'];

export const categoriesUrl = `${serverUrl}/categories`;

export const productsUrl = `${serverUrl}/products`;

export const platformsUrl = `${serverUrl}/platforms`;

export const countriesUrl = `${serverUrl}/countries`;

export const gamesUrl = `${serverUrl}/games`;

export const productQAsUrl = `${serverUrl}/productsQAs`;

export const homeproductsUrl = `${serverUrl}/homeProducts`;

export const bannersUrl = `${serverUrl}/banners`;

export const aministratorUrl = `${serverUrl}/administrators`;

export const userUrl = `${serverUrl}/users`;

export const cartUrl = `${serverUrl}/carts`;

export const orderUrl = `${serverUrl}/orders`;

export const orderIdUrl = `${serverUrl}/orderids`;

export const rouletteUrl = `${serverUrl}/roulettes`;

export const rouletteTransactionUrl = `${serverUrl}/rouletteTransaction`;

export const fileUrl = `${serverUrl}/files`;

export const paymentMethodUrl = `${serverUrl}/paymentMethods`;

export const withdrawalUrl = `${serverUrl}/withdrawals`;

export const discountCodesUrl = `${serverUrl}/discountCodes`;

export const ticketUrl = `${serverUrl}/tickets`;

export const feedbackUrl = `${serverUrl}/feedbacks`;

export const notificationUrl = `${serverUrl}/notifications`;

export const reviewUrl = `${serverUrl}/reviews`;

export const resetPassword = (username: string) =>
  `${serverUrl}/users/recoveryPassword/${username || ''}`;

export const changePasswordUrl = `${serverUrl}/users/changePassword`;

// KYC nível 1 (Lei 14.790/2023 + LGPD)
export const kycStatusUrl = `${serverUrl}/kyc/status`;
export const kycSendEmailUrl = `${serverUrl}/kyc/send-email-verification`;
export const kycVerifyEmailUrl = `${serverUrl}/kyc/verify-email`;
export const kycSendPhoneUrl = `${serverUrl}/kyc/send-phone-verification`;
export const kycVerifyPhoneUrl = `${serverUrl}/kyc/verify-phone`;
export const kycSubmitCpfUrl = `${serverUrl}/kyc/submit-cpf`;

// KYC nível 2 (P1.10) — foto documento + selfie + biometria facial
export const kycLevel2StatusUrl = `${serverUrl}/kyc/level2-status`;
export const kycSubmitDocumentPhotosUrl = `${serverUrl}/kyc/submit-document-photos`;
export const kycAdminLevel2PendingUrl = `${serverUrl}/kyc/admin/level2-pending`;
export const kycAdminLevel2DecideUrl = `${serverUrl}/kyc/admin/level2-decide`;

// Planos pagos (P1.6) — Stripe Subscriptions
export const subscriptionsPlansUrl = `${serverUrl}/subscriptions/plans`;
export const subscriptionsCurrentUrl = `${serverUrl}/subscriptions/current`;
export const subscriptionsCreateCheckoutUrl = `${serverUrl}/subscriptions/create-checkout`;
export const subscriptionsCancelUrl = `${serverUrl}/subscriptions/cancel`;

// Disputas (P0.3) — escrow + dispute resolution
export const disputesUrl = `${serverUrl}/disputes`;
export const disputeMineUrl = `${serverUrl}/disputes/mine`;
export const disputeAdminPendingUrl = `${serverUrl}/disputes/admin/pending`;
export const disputeByIdUrl = (id: string) => `${serverUrl}/disputes/${id}`;
export const disputeRespondUrl = (id: string) => `${serverUrl}/disputes/${id}/respond`;
export const disputeEscalateUrl = (id: string) => `${serverUrl}/disputes/${id}/escalate`;
export const disputeMessageUrl = (id: string) => `${serverUrl}/disputes/${id}/message`;
export const disputeCancelUrl = (id: string) => `${serverUrl}/disputes/${id}/cancel`;
export const disputeResolveUrl = (id: string) => `${serverUrl}/disputes/${id}/resolve`;
