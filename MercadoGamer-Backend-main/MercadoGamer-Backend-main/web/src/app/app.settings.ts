export class Settings {
  // Global Settings
  public static APP_NAME = 'Mercado Gamer';
  public static APP_VERSION = '0.0.4';

  // EndPoints
  public static endPoints = {
    analytics: '/analytics',
    banners: '/banners',
    categories: '/categories',
    conversations: '/conversations',
    countries: '/countries',
    discountCodes: '/discountCodes',
    feedbacks: '/feedbacks',
    files: '/files',
    games: '/games',
    issues: '/issues',
    messages: '/messages',
    mp: '/mp',
    notifications: '/notifications',
    orders: '/orders',
    paymentMethods: '/paymentMethods',
    platforms: '/platforms',
    products: '/products',
    homeProducts: '/homeProducts',
    productsQAs: '/productsQAs',
    reviews: '/reviews',
    tickets: '/tickets',
    users: '/users',
    withdrawals: '/withdrawals',
  };

  public static endPointsMethods = {
    orders: {
      chat: '/chats',
      complain: '/complain',
      finish: '/finish',
      userRecord: '/userRecord',
      pay: '/pay',
      save: '/save',
    },
    discountCodes: {
      check: '/check',
      // getgift: '/getgift',
    },
    mp: {
      initPoint: '/initPoint',
    },
    users: {
      login: '/login',
      profile: '/profile',
      recoveryPassword: '/recoveryPassword',
    },
    products: {
      loadProductContents: '/loadProductContents',
      createNewProduct: '/createNewProduct',
    },
    productsQAs: {
      answer: '/answer',
    },
    withdrawals: {
      create: '/create',
      paymentMethods: '/paymentMethods',
    },
  };

  public static socket = {
    login: 'user-login',
    notification: 'user-notification',
    newMessage: 'new-message',
    enterConversation: 'enter-conversation',
    leaveConversation: 'leave-conversation',
    refreshMessages: 'refresh-messages',
    finishOrder: 'finish-order',
    orderFinished: 'order-finished',
    cancelOrder: 'cancel-order',
    claimOrder: 'claim-order',
    orderClaimed: 'order-claimed',
    orderCancelled: 'order-cancelled',
    updateUser: 'update-user',
  };

  public static actions = {
    productPaid: 'productPaid',
    productRejected: 'productRejected',
    newMessage: 'newMessage',
  };

  public static paymentMethods = {
    type: {
      mercadoPago: {
        code: 'mercadoPago',
        label: 'Mercado Pago',
        img: 'assets/imgs/mp.png',
      },
      bankTransfer: {
        code: 'bankTransfer',
        label: 'CVU/CBU',
        img: 'assets/imgs/cbu.png',
      },
    },
  };

  public static withdrawals = {
    status: {
      pending: {
        code: 'pending',
        label: 'Pendiente',
        class: 'btn-primary',
      },
      paid: {
        code: 'paid',
        label: 'Enviado',
        class: 'btn-success',
      },
    },
  };

  public static products = {
    status: {
      pending: {
        code: 'pending',
        label: 'Pendiente',
      },
      approved: {
        code: 'approved',
        label: 'Aprobado',
      },
      rejected: {
        code: 'rejected',
        label: 'Rechazado',
      },
    },
    type: {
      game: {
        code: 'game',
        label: 'Juego',
      },
      giftCard: {
        code: 'giftCard',
        label: 'Gift Card',
      },
      item: {
        code: 'item',
        label: 'Item',
      },
      coin: {
        code: 'coin',
        label: 'Moneda',
      },
      pack: {
        code: 'pack',
        label: 'Pack',
      },
    },
    types: [
      {
        code: 'game',
        label: 'Juego',
      },
      {
        code: 'giftCard',
        label: 'Gift Card',
      },
      {
        code: 'item',
        label: 'Item',
      },
      {
        code: 'coin',
        label: 'Monedas',
      },
      {
        code: 'pack',
        label: 'Packs',
      },
    ],
    publicationType: {
      normal: { iva: 21, commission: 7 },
      pro: { iva: 21, commission: 10 },
      free: { iva: 0, commission: 0 },
    },
  };

  public static orders = {
    status: {
      pending: {
        code: 'pending',
        label: 'Pendientes de Pago',
        img: 'assets/imgs/claim.png',
      },
      paid: {
        code: 'paid',
        label: 'En Proceso',
        img: 'assets/imgs/process.png',
      },
      cancelled: {
        code: 'cancelled',
        label: 'Canceladas',
        img: 'assets/imgs/reject.png',
      },
      finished: {
        code: 'finished',
        label: 'Completadas',
        img: 'assets/imgs/check.png',
      },
      returned: {
        code: 'returned',
        label: 'Devueltas',
        img: 'assets/imgs/reject.png',
      },
      complaint: {
        code: 'complaint',
        label: 'Con Reclamo',
        img: 'assets/imgs/process.png',
      },
    },
    statusArr: [
      {
        code: 'finished',
        label: 'Finalizadas',
      },
      {
        code: 'cancelled',
        label: 'Reembolsadas',
      },
      {
        code: 'complaint',
        label: 'Reclamos abiertos',
      },
      {
        code: 'paid',
        label: 'En proceso',
      },
    ],
  };

  public static storage = {
    country: 'mercadoGamer.country',
    notifications: 'mercadoGamer.notifications',
    user: 'mercadoGamer.user',
    phoneNumber: 'mercadoGamer.phoneNumber',
    token: 'mercadoGamer.token',
    app_version: 'mercadoGamer.app_version',
  };

  public static routes: any = {
    // root: { path: '', redirectTo: '', pathMatch: 'full' },
    root: { path: '', redirectTo: 'home', pathMatch: 'full' },
    home: { path: 'home' }, // Change this please...
    login: { path: 'login' },
    register: { path: 'register' },
    selectCountry: { path: 'select-country' },
    checkout: { path: 'checkout/:id' },
    catalogue: { path: 'catalogue' },
    catalogueFiltered: { path: 'catalogue/:type/:id' },
    purchase: { path: 'purchase/:id' },
    profile: { path: 'profile/:role/:id' },
    productDetail: { path: 'product-detail/:id' },
    help: { path: 'help/:id' },
    sale: { path: 'sale' },
    myAccount: { path: 'my-account/:screen' },
    productType: { path: 'product-type' },
    productAdd: { path: 'product-add/:type' },
    productEdit: { path: 'product-edit/:id' },
    terms: { path: 'terms' },
    privacy: { path: 'privacy' },
    mobile: { path: 'mobile' },
    recoverPassword: { path: 'recover-password' },
    'verification-code': { path: 'verification-code' },
    'add-phone': { path: 'add-phone' },
  };
}
