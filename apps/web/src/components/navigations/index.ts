export const navigations: NavItem[] = [
  {
    label: 'Catálogo',
    url: '/catalogo',
    icon: 'shopping-bag',
    role: 'default',
  },
  {
    label: 'Regalos',
    url: '/regalos',
    icon: 'christmas-mobile-gift', // Christmas header icon
    role: 'default',
  },
  {
    label: 'Vender',
    url: '/dashboard/inventory/add',
    icon: 'dollar-circle',
    role: 'default',
  },
  // {
  //   label: 'Favoritos',
  //   url: '/cart',
  //   icon: 'heart',
  //   role: 'loggedin',
  // },

  {
    label: 'Balance',
    url: '/dashboard/balance',
    icon: 'account-balance-wallet',
    role: 'loggedin',
  },
  {
    label: 'Compras',
    url: '/dashboard/order',
    icon: 'shopping-basket',
    role: 'loggedin',
  },
  {
    label: 'Mis preguntas',
    url: '/dashboard/qas',
    icon: 'help-circle',
    role: 'loggedin',
  },
  {
    label: 'Ventas',
    url: '/dashboard/sale',
    icon: 'nav-tag',
    role: 'loggedin',
  },
  {
    label: 'Productos',
    url: '/dashboard/inventory',
    icon: 'archive',
    role: 'loggedin',
  },
  {
    label: 'Consultas',
    url: '/dashboard/question',
    icon: 'help-circle',
    role: 'loggedin',
  },
  {
    label: 'Tienda',
    url: '/dashboard/store',
    icon: 'store',
    role: 'loggedin',
  },
  {
    label: 'Mi perfil',
    url: '/dashboard/profile',
    icon: 'user',
    role: 'loggedin',
  },
  {
    label: 'Soporte',
    url: '/dashboard/support',
    icon: 'message-sequare',
    role: 'loggedin',
  },
];
// VENTAS: [
//   { label: 'Ventas'; icon: 'heart'; url: '/ventas' },
//   { label: 'Productos'; icon: 'archive'; url: '/inventory' },
//   { label: 'Preguntas'; icon: 'help-circle'; url: '/question' },
//   { label: 'Tienda'; icon: 'store'; url: '/store' }
// ];
