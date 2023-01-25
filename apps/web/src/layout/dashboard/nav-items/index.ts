export const navigations: { [key: string]: NavItem[] } = {
  BALANCE: [{ label: 'Balance', icon: 'account-balance-wallet', url: '/dashboard/balance' }],
  COMPRAS: [
    { label: 'Compras', icon: 'account-shopping', url: '/dashboard/order' },
    { label: 'Mis preguntas', icon: 'help-circle', url: '/dashboard/qas' },
    // { label: 'Cupones', icon: 'cupon', url: '/ticket' },
  ],
  VENTAS: [
    { label: 'Ventas', icon: 'nav-tag', url: '/dashboard/sale' },
    { label: 'Productos', icon: 'archive', url: '/dashboard/inventory' },
    { label: 'Consultas', icon: 'help-circle', url: '/dashboard/question' },
    { label: 'Tienda', icon: 'store', url: '/dashboard/store' },
  ],
  CONFIGURACIÓN: [
    { label: 'Mi perfil', icon: 'user', url: '/dashboard/profile' },
    { label: 'Soporte', icon: 'message-sequare', url: '/dashboard/support' },
    // { label: 'Seguridad', icon: 'shield-check', url: '/security' },
    // { label: 'Notificaciones', icon: 'bell', url: '/notification' },
  ],
};
