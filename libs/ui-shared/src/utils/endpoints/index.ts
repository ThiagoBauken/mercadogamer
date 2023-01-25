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

