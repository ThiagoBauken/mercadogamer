export class Settings {
  // Global Settings
  public static APP_NAME = 'Mercado Gamer';
  public static APP_VERSION = '0.0.1';

  // EndPoints
  public static endPoints = {
    administrators: '/administrators',
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
    searchfilters: '/searchfilters',
  };

  public static endPointsMethods = {
    administrators: {
      login: '/login',
    },
    orders: {
      chat: '/chats',
      complain: '/complain',
      finish: '/finish',
      userRecord: '/userRecord',
      pay: '/pay',
    },
    products: {
      approve: '/approve',
      reject: '/reject',
    },
    tickets: {
      finish: '/finish',
    },
    withdrawals: {
      pay: '/pay',
    },
    users: {
      profile: '/profile',
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
    orderCancelled: 'order-cancelled',
    updateUser: 'update-user',
    resetCode: 'reset-code',
  };

  public static discountCodes = {
    type: {
      percentage: {
        code: 'percentage',
        label: 'Porcentaje %',
      },
      cash: {
        code: 'cash',
        label: 'Pesos $',
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
        label: 'Pagada',
        class: 'btn-success',
      },
    },
  };

  public static paymentMethods = {
    type: {
      mercadoPago: {
        code: 'mercadoPago',
        label: 'Mercado Pago',
        img: 'assets/imgs/mp_2.png',
      },
      bankTransfer: {
        code: 'bankTransfer',
        label: 'Transferencia Bancaria',
        img: 'assets/imgs/cbu.png',
      },
    },
  };

  public static orders = {
    status: {
      pending: {
        code: 'pending',
        label: 'Pendientes de Pago',
        img: 'assets/imgs/sells.svg',
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
        img: 'assets/imgs/claim.png',
      },
    },
    statusArr: [
      {
        code: 'pending',
        label: 'Pendientes de Pago',
        img: 'assets/imgs/process.png',
      },
      {
        code: 'paid',
        label: 'En Proceso',
        img: 'assets/imgs/process.png',
      },
      {
        code: 'cancelled',
        label: 'Canceladas',
        img: 'assets/imgs/reject.png',
      },
      {
        code: 'finished',
        label: 'Completadas',
        img: 'assets/imgs/check.png',
      },
      {
        code: 'returned',
        label: 'Devueltas',
        img: 'assets/imgs/reject.png',
      },
      {
        code: 'complaint',
        label: 'Con Reclamo',
        img: 'assets/imgs/claim.png',
      },
    ],
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
        label: 'Juegos',
      },
      {
        code: 'giftCard',
        label: 'Gift Cards',
      },
      {
        code: 'item',
        label: 'Items',
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
  };

  public static storage = {
    country: 'adminMercadoGamer.country',
    user: 'adminMercadoGamer.user',
  };

  public static routes: any = {
    tickets: { path: 'tickets' },
    login: { path: 'login' },
    products: { path: 'products' },
    sells: { path: 'sells' },
    retreats: { path: 'retreats' },
    personalize: { path: 'personalize' },
    feedback: { path: 'feedback' },
    statistics: { path: 'statistics' },
    discount: { path: 'discount' },
    profits: { path: 'profits' },
    filters: { path: 'filters' },
    profile: { path: 'profile/:id' },
    productDetail: { path: 'product-detail/:id' },
    purchase: { path: 'purchase/:id' },
    users: { path: 'users' },
    userView: { path: 'users/:id' },
    searchKey: { path: 'searchkeywords' },
    root: { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  };
}
